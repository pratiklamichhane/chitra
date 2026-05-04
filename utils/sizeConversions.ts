export type Unit = "mm" | "cm" | "inch" | "px";

export type DimensionInput = {
  width: number;
  height: number;
  unit: Unit;
  dpi: number;
};

export type PixelSize = {
  widthPx: number;
  heightPx: number;
};

export type PhysicalSize = PixelSize & {
  widthMm: number;
  heightMm: number;
};

const MM_PER_INCH = 25.4;

export function toMillimeters(value: number, unit: Unit, dpi: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;

  switch (unit) {
    case "cm":
      return value * 10;
    case "inch":
      return value * MM_PER_INCH;
    case "px":
      return (value / dpi) * MM_PER_INCH;
    case "mm":
    default:
      return value;
  }
}

export function mmToPixels(mm: number, dpi: number): number {
  if (!Number.isFinite(mm) || !Number.isFinite(dpi) || mm <= 0 || dpi <= 0) {
    return 0;
  }
  return Math.round((mm / MM_PER_INCH) * dpi);
}

export function pixelsToMm(px: number, dpi: number): number {
  if (!Number.isFinite(px) || !Number.isFinite(dpi) || px <= 0 || dpi <= 0) {
    return 0;
  }
  return (px / dpi) * MM_PER_INCH;
}

export function toPhysicalSize(input: DimensionInput): PhysicalSize {
  const widthMm = toMillimeters(input.width, input.unit, input.dpi);
  const heightMm = toMillimeters(input.height, input.unit, input.dpi);

  return {
    widthMm,
    heightMm,
    widthPx: mmToPixels(widthMm, input.dpi),
    heightPx: mmToPixels(heightMm, input.dpi),
  };
}

export function formatMm(value: number): string {
  return `${value.toFixed(value >= 100 ? 0 : 1)} mm`;
}
