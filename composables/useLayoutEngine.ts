import { mmToPixels } from "@/utils/sizeConversions";

export type LayoutMode = "auto" | "fixed" | "manual";
export type Orientation = "portrait" | "landscape";

export type LayoutInput = {
  sheetWidthMm: number;
  sheetHeightMm: number;
  photoWidthMm: number;
  photoHeightMm: number;
  dpi: number;
  marginMm: number;
  gapMm: number;
  mode: LayoutMode;
  fixedCount: number;
  manualRows: number;
  manualCols: number;
};

export type LayoutCell = {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
};

export type LayoutResult = {
  sheetWidthPx: number;
  sheetHeightPx: number;
  photoWidthPx: number;
  photoHeightPx: number;
  marginPx: number;
  gapPx: number;
  rows: number;
  cols: number;
  count: number;
  cells: LayoutCell[];
};

function clampPositive(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function calculateLayout(input: LayoutInput): LayoutResult {
  const sheetWidthPx = mmToPixels(clampPositive(input.sheetWidthMm, 210), input.dpi);
  const sheetHeightPx = mmToPixels(clampPositive(input.sheetHeightMm, 297), input.dpi);
  const photoWidthPx = mmToPixels(clampPositive(input.photoWidthMm, 35), input.dpi);
  const photoHeightPx = mmToPixels(clampPositive(input.photoHeightMm, 45), input.dpi);
  const marginPx = mmToPixels(Math.max(0, input.marginMm), input.dpi);
  const gapPx = mmToPixels(Math.max(0, input.gapMm), input.dpi);

  const availableWidth = Math.max(0, sheetWidthPx - marginPx * 2);
  const availableHeight = Math.max(0, sheetHeightPx - marginPx * 2);
  const autoCols = Math.max(0, Math.floor((availableWidth + gapPx) / (photoWidthPx + gapPx)));
  const autoRows = Math.max(0, Math.floor((availableHeight + gapPx) / (photoHeightPx + gapPx)));

  let cols = autoCols;
  let rows = autoRows;

  if (input.mode === "fixed") {
    const target = Math.max(1, Math.floor(input.fixedCount));
    cols = Math.max(1, Math.min(autoCols || 1, Math.ceil(Math.sqrt(target))));
    rows = Math.max(1, Math.min(autoRows || 1, Math.ceil(target / cols)));
    while (rows * cols < target && cols < autoCols) cols += 1;
    while (rows * cols < target && rows < autoRows) rows += 1;
  }

  if (input.mode === "manual") {
    cols = Math.max(1, Math.min(autoCols || 1, Math.floor(input.manualCols)));
    rows = Math.max(1, Math.min(autoRows || 1, Math.floor(input.manualRows)));
  }

  const gridWidth = cols * photoWidthPx + Math.max(0, cols - 1) * gapPx;
  const gridHeight = rows * photoHeightPx + Math.max(0, rows - 1) * gapPx;
  const startX = Math.round((sheetWidthPx - gridWidth) / 2);
  const startY = Math.round((sheetHeightPx - gridHeight) / 2);

  const cells: LayoutCell[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      cells.push({
        x: startX + col * (photoWidthPx + gapPx),
        y: startY + row * (photoHeightPx + gapPx),
        width: photoWidthPx,
        height: photoHeightPx,
        row,
        col,
      });
    }
  }

  return {
    sheetWidthPx,
    sheetHeightPx,
    photoWidthPx,
    photoHeightPx,
    marginPx,
    gapPx,
    rows,
    cols,
    count: cells.length,
    cells,
  };
}

export function useLayoutEngine() {
  return {
    calculateLayout,
  };
}
