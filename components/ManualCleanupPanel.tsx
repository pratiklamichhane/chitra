import { Eraser, RotateCcw } from "lucide-react";
import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageToCanvas } from "@/composables/useCanvasRenderer";

type ManualCleanupPanelProps = {
  subjectCanvas: HTMLCanvasElement | null;
  onChange: (canvas: HTMLCanvasElement) => void;
  onReset: () => void;
};

export function ManualCleanupPanel({ subjectCanvas, onChange, onReset }: ManualCleanupPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [brushSize, setBrushSize] = useState(36);
  const hasSubject = Boolean(subjectCanvas);

  const drawPreview = useCallback(() => {
    const preview = canvasRef.current;
    const working = workingCanvasRef.current;
    if (!preview || !working) return;

    preview.width = working.width;
    preview.height = working.height;
    const ctx = preview.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, preview.width, preview.height);
    ctx.drawImage(working, 0, 0);
  }, []);

  useEffect(() => {
    if (!subjectCanvas) {
      workingCanvasRef.current = null;
      const preview = canvasRef.current;
      const ctx = preview?.getContext("2d");
      if (preview && ctx) ctx.clearRect(0, 0, preview.width, preview.height);
      return;
    }

    workingCanvasRef.current = imageToCanvas(subjectCanvas);
    drawPreview();
  }, [drawPreview, subjectCanvas]);

  const eraseAt = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const preview = canvasRef.current;
      const working = workingCanvasRef.current;
      if (!preview || !working) return;

      const rect = preview.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * working.width;
      const y = ((event.clientY - rect.top) / rect.height) * working.height;
      const scale = working.width / rect.width;
      const radius = (brushSize * scale) / 2;
      const ctx = working.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawPreview();
    },
    [brushSize, drawPreview],
  );

  const commitCleanup = useCallback(() => {
    drawingRef.current = false;
    if (!workingCanvasRef.current) return;
    onChange(imageToCanvas(workingCanvasRef.current));
  }, [onChange]);

  return (
    <section className="fluent-card">
      <div className="section-title">
        <span>4. Manual Cleanup</span>
        <span title={!hasSubject ? "Process a photo to enable cleanup reset" : "Reset cleanup"} style={{ display: "inline-block" }}>
          <button className="icon-button" aria-label="Reset cleanup" disabled={!hasSubject} onClick={onReset}>
            <RotateCcw size={15} />
          </button>
        </span>
      </div>
      <div className="cleanup-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="cleanup-canvas"
          onPointerDown={(event) => {
            if (!hasSubject) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drawingRef.current = true;
            eraseAt(event);
          }}
          onPointerMove={(event) => {
            if (!drawingRef.current) return;
            eraseAt(event);
          }}
          onPointerUp={commitCleanup}
          onPointerCancel={commitCleanup}
        />
        {!hasSubject ? (
          <div className="cleanup-empty">
            <Eraser size={22} />
            <span>Remove background first</span>
          </div>
        ) : null}
      </div>
      <label className="control-row">
        <span>Brush size</span>
        <strong>{brushSize}px</strong>
      </label>
      <input
        className="range"
        type="range"
        min={8}
        max={96}
        value={brushSize}
        disabled={!hasSubject}
        onChange={(event) => setBrushSize(Number(event.target.value))}
      />
    </section>
  );
}
