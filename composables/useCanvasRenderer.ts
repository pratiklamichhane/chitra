import type { LayoutResult } from "./useLayoutEngine";

export type CropState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
};

export type BackgroundFill = {
  kind: "color" | "transparent";
  color: string;
};

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function imageToCanvas(source: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  const canvas = createCanvas(source.width, source.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(source, 0, 0);
  return canvas;
}

function skinToneWeight(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const range = max - min;
  const simpleSkin = r > 55 && g > 35 && b > 22 && range > 12 && r > g && r > b && Math.abs(r - g) > 6;
  const normalizedR = r / Math.max(1, r + g + b);
  const normalizedG = g / Math.max(1, r + g + b);
  const normalizedSkin = normalizedR > 0.34 && normalizedR < 0.6 && normalizedG > 0.2 && normalizedG < 0.38;

  if (!simpleSkin && !normalizedSkin) return 0;

  const brightness = max / 255;
  const saturation = range / Math.max(1, max);
  const brightnessWeight = Math.max(0, Math.min(1, (brightness - 0.18) / 0.52));
  const saturationWeight = Math.max(0, Math.min(1, 1 - Math.abs(saturation - 0.34) / 0.42));
  return Math.max(0.15, Math.min(1, brightnessWeight * 0.65 + saturationWeight * 0.35));
}

export function beautifyCanvas(source: HTMLCanvasElement, strength: number) {
  const amount = Math.max(0, Math.min(100, strength)) / 100;
  const output = imageToCanvas(source);
  if (amount <= 0) return output;

  const smooth = createCanvas(source.width, source.height);
  const smoothCtx = smooth.getContext("2d", { willReadFrequently: true });
  const outCtx = output.getContext("2d", { willReadFrequently: true });
  if (!smoothCtx || !outCtx) throw new Error("Canvas is not available in this browser.");

  smoothCtx.imageSmoothingEnabled = true;
  smoothCtx.imageSmoothingQuality = "high";
  smoothCtx.filter = `blur(${0.8 + amount * 2.2}px)`;
  smoothCtx.drawImage(source, 0, 0);

  const originalData = outCtx.getImageData(0, 0, output.width, output.height);
  const smoothData = smoothCtx.getImageData(0, 0, smooth.width, smooth.height);

  for (let i = 0; i < originalData.data.length; i += 4) {
    const alpha = originalData.data[i + 3];
    if (alpha === 0) continue;

    const r = originalData.data[i];
    const g = originalData.data[i + 1];
    const b = originalData.data[i + 2];
    const weight = skinToneWeight(r, g, b);
    if (weight <= 0) continue;

    const blend = amount * weight * 0.42;
    const lift = 1 + amount * weight * 0.045;
    originalData.data[i] = Math.min(255, Math.round((r * (1 - blend) + smoothData.data[i] * blend) * lift));
    originalData.data[i + 1] = Math.min(255, Math.round((g * (1 - blend) + smoothData.data[i + 1] * blend) * lift));
    originalData.data[i + 2] = Math.min(255, Math.round((b * (1 - blend) + smoothData.data[i + 2] * blend) * lift));
  }

  outCtx.putImageData(originalData, 0, 0);
  return output;
}

export function resizeImageForInference(source: HTMLImageElement | HTMLCanvasElement, maxSize = 768) {
  const scale = Math.min(1, maxSize / Math.max(source.width, source.height));
  const width = Math.max(32, Math.round((source.width * scale) / 32) * 32);
  const height = Math.max(32, Math.round((source.height * scale) / 32) * 32);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

function refineMaskAlpha(value: number) {
  const normalized = Math.max(0, Math.min(1, value));
  if (normalized <= 0.035) return 0;
  if (normalized >= 0.965) return 255;

  // Tighten the soft MODNet matte so printed subject edges do not look hazy.
  const low = 0.24;
  const high = 0.76;
  const t = Math.max(0, Math.min(1, (normalized - low) / (high - low)));
  const smooth = t * t * (3 - 2 * t);
  return Math.round(smooth * 255);
}

function removeDetachedAlphaIslands(imageData: ImageData, width: number, height: number) {
  const alphaThreshold = 18;
  const labels = new Int32Array(width * height);
  const queue = new Int32Array(width * height);
  let currentLabel = 0;
  let keepLabel = 0;
  let keepScore = 0;

  for (let start = 0; start < labels.length; start += 1) {
    if (labels[start] !== 0 || imageData.data[start * 4 + 3] <= alphaThreshold) continue;

    currentLabel += 1;
    let head = 0;
    let tail = 0;
    let score = 0;
    labels[start] = currentLabel;
    queue[tail] = start;
    tail += 1;

    while (head < tail) {
      const index = queue[head];
      head += 1;
      score += imageData.data[index * 4 + 3];

      const x = index % width;
      const y = Math.floor(index / width);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1,
      ];

      for (const neighbor of neighbors) {
        if (neighbor < 0 || labels[neighbor] !== 0 || imageData.data[neighbor * 4 + 3] <= alphaThreshold) continue;
        labels[neighbor] = currentLabel;
        queue[tail] = neighbor;
        tail += 1;
      }
    }

    if (score > keepScore) {
      keepScore = score;
      keepLabel = currentLabel;
    }
  }

  if (keepLabel === 0) return;

  for (let index = 0; index < labels.length; index += 1) {
    const p = index * 4;
    if (imageData.data[p + 3] > alphaThreshold && labels[index] !== keepLabel) {
      imageData.data[p + 3] = 0;
    }
  }
}

export function applyAlphaMask(
  source: HTMLCanvasElement,
  mask: Float32Array | Uint8ClampedArray,
  maskWidth: number,
  maskHeight: number,
  feather = 1,
) {
  const workingMask = createCanvas(source.width, source.height);
  const maskCtx = workingMask.getContext("2d");
  const out = createCanvas(source.width, source.height);
  const outCtx = out.getContext("2d", { willReadFrequently: true });

  if (!maskCtx || !outCtx) throw new Error("Canvas is not available in this browser.");

  const maskImage = maskCtx.createImageData(maskWidth, maskHeight);
  for (let i = 0; i < maskWidth * maskHeight; i += 1) {
    const value = mask[i] <= 1 ? mask[i] * 255 : mask[i];
    const alpha = Math.max(0, Math.min(255, value));
    const p = i * 4;
    maskImage.data[p] = alpha;
    maskImage.data[p + 1] = alpha;
    maskImage.data[p + 2] = alpha;
    maskImage.data[p + 3] = alpha;
  }

  const smallMask = createCanvas(maskWidth, maskHeight);
  const smallCtx = smallMask.getContext("2d");
  if (!smallCtx) throw new Error("Canvas is not available in this browser.");
  smallCtx.putImageData(maskImage, 0, 0);

  maskCtx.imageSmoothingEnabled = true;
  maskCtx.imageSmoothingQuality = "high";
  if (feather > 0) {
    maskCtx.filter = `blur(${Math.min(feather, 1.5)}px)`;
  }
  maskCtx.drawImage(smallMask, 0, 0, source.width, source.height);

  outCtx.drawImage(source, 0, 0);
  const sourceData = outCtx.getImageData(0, 0, source.width, source.height);
  const fullMask = maskCtx.getImageData(0, 0, source.width, source.height);
  for (let i = 0; i < sourceData.data.length; i += 4) {
    const maskAlpha = fullMask.data[i + 3] / 255;
    sourceData.data[i + 3] = Math.min(sourceData.data[i + 3], refineMaskAlpha(maskAlpha));
  }
  removeDetachedAlphaIslands(sourceData, source.width, source.height);
  outCtx.putImageData(sourceData, 0, 0);
  return out;
}

export function compositeBackground(source: HTMLCanvasElement, fill: BackgroundFill) {
  if (fill.kind === "transparent") return source;

  const canvas = createCanvas(source.width, source.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.fillStyle = fill.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export function renderPhotoFrame(
  source: HTMLCanvasElement,
  width: number,
  height: number,
  crop: CropState,
  fill: BackgroundFill,
) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");

  if (fill.kind === "color") {
    ctx.fillStyle = fill.color;
    ctx.fillRect(0, 0, width, height);
  }

  const baseScale = Math.max(width / source.width, height / source.height);
  const scale = baseScale * Math.max(0.1, crop.zoom);
  const drawWidth = source.width * scale;
  const drawHeight = source.height * scale;

  ctx.save();
  ctx.translate(width / 2 + crop.offsetX, height / 2 + crop.offsetY);
  ctx.rotate((crop.rotation * Math.PI) / 180);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();

  return canvas;
}

export function renderPrintSheet(
  photo: HTMLCanvasElement | null,
  layout: LayoutResult,
  crop: CropState,
  fill: BackgroundFill,
) {
  const canvas = createCanvas(layout.sheetWidthPx, layout.sheetHeightPx);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#d7dce4";
  ctx.lineWidth = Math.max(1, Math.round(layout.sheetWidthPx / 1800));
  ctx.setLineDash([ctx.lineWidth * 6, ctx.lineWidth * 4]);
  ctx.strokeRect(layout.marginPx, layout.marginPx, canvas.width - layout.marginPx * 2, canvas.height - layout.marginPx * 2);
  ctx.setLineDash([]);

  if (!photo) return canvas;

  const frame = renderPhotoFrame(photo, layout.photoWidthPx, layout.photoHeightPx, crop, fill);
  for (const cell of layout.cells) {
    ctx.drawImage(frame, cell.x, cell.y, cell.width, cell.height);
    ctx.strokeStyle = "#edf0f4";
    ctx.lineWidth = Math.max(1, Math.round(cell.width / 900));
    ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
  }

  return canvas;
}

export function useCanvasRenderer() {
  return {
    applyAlphaMask,
    beautifyCanvas,
    compositeBackground,
    imageToCanvas,
    renderPhotoFrame,
    renderPrintSheet,
    resizeImageForInference,
  };
}
