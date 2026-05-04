"use client";

import { Eraser, RotateCcw, X } from "lucide-react";
import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageToCanvas } from "@/composables/useCanvasRenderer";

type ManualCleanupModalProps = {
  isOpen: boolean;
  subjectCanvas: HTMLCanvasElement | null;
  onChange: (canvas: HTMLCanvasElement) => void;
  onReset: () => void;
  onClose: () => void;
};

export function ManualCleanupModal({
  isOpen,
  subjectCanvas,
  onChange,
  onReset,
  onClose,
}: ManualCleanupModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [brushSize, setBrushSize] = useState(36);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
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
      setUndoStack([]);
      const preview = canvasRef.current;
      const ctx = preview?.getContext("2d");
      if (preview && ctx) ctx.clearRect(0, 0, preview.width, preview.height);
      return;
    }

    workingCanvasRef.current = imageToCanvas(subjectCanvas);
    setUndoStack([]);
    drawPreview();
  }, [drawPreview, subjectCanvas, isOpen]);

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

  const saveToUndo = useCallback(() => {
    const working = workingCanvasRef.current;
    if (!working) return;
    const ctx = working.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, working.width, working.height);
    setUndoStack((prev) => [...prev, imageData]);
  }, []);

  const handleUndo = useCallback(() => {
    const working = workingCanvasRef.current;
    if (!working || undoStack.length === 0) return;
    const ctx = working.getContext("2d");
    if (!ctx) return;

    const newStack = [...undoStack];
    const imageData = newStack.pop()!;
    ctx.putImageData(imageData, 0, 0);
    setUndoStack(newStack);
    drawPreview();
  }, [undoStack, drawPreview]);

  const commitCleanup = useCallback(() => {
    drawingRef.current = false;
    if (!workingCanvasRef.current) return;
    onChange(imageToCanvas(workingCanvasRef.current));
  }, [onChange]);

  const handleReset = useCallback(() => {
    onReset();
    setUndoStack([]);
  }, [onReset]);

  const handleClose = useCallback(() => {
    commitCleanup();
    onClose();
  }, [commitCleanup, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content cleanup-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <Eraser size={20} />
            <span className="modal-title">Manual Background Cleanup</span>
          </div>
          <button className="modal-close-button" onClick={handleClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body cleanup-modal-body">
          <div className="cleanup-canvas-container">
            <canvas
              ref={canvasRef}
              className="cleanup-canvas-modal"
              onPointerDown={(event) => {
                if (!hasSubject) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                saveToUndo();
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
              <div className="cleanup-empty-modal">
                <Eraser size={32} />
                <span>Remove background first</span>
                <p>Process your image in the Background section before starting manual cleanup.</p>
              </div>
            ) : null}
          </div>

          <div className="cleanup-controls">
            <div className="control-section">
              <label className="control-label">
                <span className="label-text">Brush Size</span>
                <strong className="brush-size-value">{brushSize}px</strong>
              </label>
              <input
                className="slider"
                type="range"
                min={8}
                max={96}
                value={brushSize}
                disabled={!hasSubject}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                aria-label="Brush size"
                title="Brush size"
                role="slider"
                aria-valuemin={8}
                aria-valuemax={96}
                aria-valuenow={brushSize}
              />
              <div className="size-hints">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            <div className="control-section">
              <label className="control-label">Instructions</label>
              <div className="instructions-text">
                <p>• Drag your mouse over the background to erase it</p>
                <p>• Use smaller brush for precise edges</p>
                <p>• Use larger brush for quick cleanup</p>
                <p>• Click Undo to revert changes</p>
              </div>
            </div>

            <div className="button-group">
              <button
                className="action-button undo-button"
                disabled={!hasSubject || undoStack.length === 0}
                onClick={handleUndo}
              >
                <RotateCcw size={16} />
                <span>Undo</span>
              </button>
              <button
                className="action-button reset-button"
                disabled={!hasSubject}
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="button-secondary" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
