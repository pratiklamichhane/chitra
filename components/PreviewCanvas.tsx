import type { CropState, BackgroundFill } from "@/composables/useCanvasRenderer";
import { renderPrintSheet } from "@/composables/useCanvasRenderer";
import type { LayoutResult } from "@/composables/useLayoutEngine";
import { Move } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type PreviewCanvasProps = {
  sourceCanvas: HTMLCanvasElement | null;
  layout: LayoutResult;
  crop: CropState;
  fill: BackgroundFill;
  viewZoom: number;
  onCropChange: (next: Partial<CropState>) => void;
  onRendered: (canvas: HTMLCanvasElement) => void;
  onViewZoomChange: (next: number | ((current: number) => number)) => void;
};

export function PreviewCanvas({ sourceCanvas, layout, crop, fill, viewZoom, onCropChange, onRendered, onViewZoomChange }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const cropRef = useRef(crop);
  const [fitWidth, setFitWidth] = useState(520);
  const sheetAspect = layout.sheetWidthPx / layout.sheetHeightPx;
  const previewWidth = fitWidth * viewZoom;
  const previewHeight = previewWidth / sheetAspect;
  const scaleLabel = viewZoom === 1 ? "Fit" : `${Math.round(viewZoom * 100)}%`;
  const stageStyle = {
    "--sheet-view-width": `${previewWidth}px`,
    "--sheet-view-height": `${previewHeight}px`,
    "--zoom-progress": `${((viewZoom - 0.4) / 2.6) * 100}%`,
  } as CSSProperties;

  useEffect(() => {
    cropRef.current = crop;
  }, [crop]);

  const rulerLabels = useMemo(() => {
    const widthMm = Math.round((layout.sheetWidthPx / 300) * 25.4);
    const heightMm = Math.round((layout.sheetHeightPx / 300) * 25.4);
    const makeLabels = (sizeMm: number) => {
      const labels = [];
      for (let value = 0; value <= sizeMm; value += 50) labels.push(value);
      if (labels[labels.length - 1] !== sizeMm) labels.push(sizeMm);
      return labels;
    };
    return { x: makeLabels(widthMm), y: makeLabels(heightMm) };
  }, [layout.sheetHeightPx, layout.sheetWidthPx]);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const updatePreviewSize = () => {
      const rect = workspace.getBoundingClientRect();
      const rulerWidth = 42;
      const topRulerHeight = 34;
      const gutter = 58;
      const availableWidth = Math.max(260, rect.width - rulerWidth - gutter * 2);
      const availableHeight = Math.max(260, rect.height - topRulerHeight - gutter);
      const widthFromHeight = availableHeight * sheetAspect;
      setFitWidth(Math.floor(Math.max(260, Math.min(availableWidth, widthFromHeight))));
    };

    updatePreviewSize();
    const observer = new ResizeObserver(updatePreviewSize);
    observer.observe(workspace);
    return () => observer.disconnect();
  }, [sheetAspect]);

  useEffect(() => {
    const preview = canvasRef.current;
    if (!preview) return;

    const sheet = renderPrintSheet(sourceCanvas, layout, crop, fill);
    preview.width = sheet.width;
    preview.height = sheet.height;
    const ctx = preview.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, preview.width, preview.height);
    ctx.drawImage(sheet, 0, 0);
    onRendered(sheet);

  }, [crop, fill, layout, onRendered, sourceCanvas]);
  return (
    <section className="preview-shell">
      <div className="preview-toolbar">
        <div>
          <strong>Print Preview</strong>
          <span>{layout.sheetWidthPx} x {layout.sheetHeightPx}px · 300 DPI output</span>
        </div>
        <div className="preview-hint"><Move size={14} />Drag photo · Wheel zooms canvas · {scaleLabel}</div>
      </div>
      <div
        ref={workspaceRef}
        className="canvas-workspace"
        onWheel={(event) => {
          event.preventDefault();
          onViewZoomChange((current) => current + (event.deltaY > 0 ? -0.08 : 0.08));
        }}
      >
        <div className="sheet-stage" style={stageStyle}>
          <div className="ruler-corner" />
          <div className="ruler ruler-top">
            {rulerLabels.x.map((label) => <span key={label}>{label}</span>)}
            <em>mm</em>
          </div>
          <div className="ruler ruler-left">
            {rulerLabels.y.map((label) => <span key={label}>{label}</span>)}
            <em>mm</em>
          </div>
          <div className="sheet-wrap">
            <canvas
              ref={canvasRef}
              className="sheet-canvas"
              onPointerDown={(event) => {
                if (!sourceCanvas) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                dragRef.current = { x: event.clientX, y: event.clientY };
              }}
              onPointerMove={(event) => {
                if (!dragRef.current || !canvasRef.current) return;
                const rect = canvasRef.current.getBoundingClientRect();
                const scale = layout.sheetWidthPx / rect.width;
                const dx = (event.clientX - dragRef.current.x) * scale;
                const dy = (event.clientY - dragRef.current.y) * scale;
                dragRef.current = { x: event.clientX, y: event.clientY };
                const currentCrop = cropRef.current;
                const next = { offsetX: currentCrop.offsetX + dx, offsetY: currentCrop.offsetY + dy };
                cropRef.current = { ...currentCrop, ...next };
                onCropChange(next);
              }}
              onPointerUp={() => {
                dragRef.current = null;
              }}
            />
            {!sourceCanvas ? (
              <div className="preview-empty">
                <strong>Upload a photo to build a sheet</strong>
                <span>The export canvas will render at true physical dimensions.</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
