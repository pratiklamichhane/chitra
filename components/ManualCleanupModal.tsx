"use client";

import { Eraser, RotateCcw, X, RefreshCw, CornerUpLeft, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import type { PointerEvent, WheelEvent } from "react";
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
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [brushSize, setBrushSize] = useState(36);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [mode, setMode] = useState<"erase" | "recover">("erase");
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);
  const [viewZoom, setViewZoom] = useState(1);
  const hasSubject = Boolean(subjectCanvas);
  const zoomLabel = viewZoom === 1 ? "Fit" : `${Math.round(viewZoom * 100)}%`;

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

  const updateViewZoom = useCallback((next: number | ((current: number) => number)) => {
    setViewZoom((current) => {
      const value = typeof next === "function" ? next(current) : next;
      return Math.round(Math.min(4, Math.max(0.5, value)) * 100) / 100;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  useEffect(() => {
    let resetTimer: number | null = null;

    if (!subjectCanvas) {
      workingCanvasRef.current = null;
      originalCanvasRef.current = null;
      const preview = canvasRef.current;
      const ctx = preview?.getContext("2d");
      if (preview && ctx) ctx.clearRect(0, 0, preview.width, preview.height);
      resetTimer = window.setTimeout(() => {
        setCanvasSize(null);
        setPointerPos(null);
        setViewZoom(1);
        clearHistory();
      }, 0);
      return () => {
        if (resetTimer !== null) window.clearTimeout(resetTimer);
      };
    }

    // Keep an original copy for recover operations
    originalCanvasRef.current = imageToCanvas(subjectCanvas);
    workingCanvasRef.current = imageToCanvas(subjectCanvas);
    drawPreview();
    resetTimer = window.setTimeout(() => {
      setCanvasSize({ width: subjectCanvas.width, height: subjectCanvas.height });
      setViewZoom(1);
      setPointerPos(null);
      clearHistory();
    }, 0);
    return () => {
      if (resetTimer !== null) window.clearTimeout(resetTimer);
    };
  }, [clearHistory, drawPreview, subjectCanvas, isOpen]);

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
      ctx.lineWidth = radius * 2;
      ctx.lineCap = "round";
      if (lastPointRef.current) {
        const p = lastPointRef.current;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      lastPointRef.current = { x, y };
      drawPreview();
    },
    [brushSize, drawPreview],
  );

  const recoverAt = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const preview = canvasRef.current;
      const working = workingCanvasRef.current;
      const original = originalCanvasRef.current;
      if (!preview || !working || !original) return;

      const rect = preview.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * working.width;
      const y = ((event.clientY - rect.top) / rect.height) * working.height;
      const scale = working.width / rect.width;
      const radius = (brushSize * scale) / 2;
      const ctx = working.getContext("2d");
      if (!ctx) return;

      const stampRecover = (stampX: number, stampY: number) => {
        const size = Math.max(1, Math.floor(radius * 2));
        const sx = Math.max(0, Math.floor(stampX - radius));
        const sy = Math.max(0, Math.floor(stampY - radius));
        const sw = Math.min(original.width - sx, size);
        const sh = Math.min(original.height - sy, size);
        if (sw <= 0 || sh <= 0) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(stampX, stampY, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(original, sx, sy, sw, sh, sx, sy, sw, sh);
        ctx.restore();
      };

      const previous = lastPointRef.current;
      if (previous) {
        const distance = Math.hypot(x - previous.x, y - previous.y);
        const steps = Math.max(1, Math.ceil(distance / Math.max(1, radius * 0.35)));
        for (let index = 1; index <= steps; index += 1) {
          const progress = index / steps;
          stampRecover(previous.x + (x - previous.x) * progress, previous.y + (y - previous.y) * progress);
        }
      } else {
        stampRecover(x, y);
      }

      lastPointRef.current = { x, y };
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
    setUndoStack((prev) => {
      const next = [...prev, imageData];
      if (next.length > 30) next.shift();
      return next;
    });
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    const working = workingCanvasRef.current;
    if (!working || undoStack.length === 0) return;
    const ctx = working.getContext("2d");
    if (!ctx) return;

    // Move current into redo, restore last undo
    const current = ctx.getImageData(0, 0, working.width, working.height);
    setRedoStack((prev) => [...prev, current]);

    const newStack = [...undoStack];
    const imageData = newStack.pop()!;
    ctx.putImageData(imageData, 0, 0);
    setUndoStack(newStack);
    drawPreview();
  }, [undoStack, drawPreview]);

  const handleRedo = useCallback(() => {
    const working = workingCanvasRef.current;
    if (!working || redoStack.length === 0) return;
    const ctx = working.getContext("2d");
    if (!ctx) return;

    const newRedo = [...redoStack];
    const imageData = newRedo.pop()!;
    // push current to undo
    const current = ctx.getImageData(0, 0, working.width, working.height);
    setUndoStack((prev) => [...prev, current]);
    ctx.putImageData(imageData, 0, 0);
    setRedoStack(newRedo);
    drawPreview();
  }, [redoStack, drawPreview]);

  const commitCleanup = useCallback(() => {
    drawingRef.current = false;
    if (!workingCanvasRef.current) return;
    onChange(imageToCanvas(workingCanvasRef.current));
  }, [onChange]);

  const handleReset = useCallback(() => {
    onReset();
    clearHistory();
  }, [clearHistory, onReset]);

  const handlePointerMovePreview = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    const preview = canvasRef.current;
    if (!preview) return;
    const rect = preview.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPointerPos({ x, y });
  }, []);

  const handleWheelZoom = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (!hasSubject) return;
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    updateViewZoom((current) => current + (event.deltaY > 0 ? -0.15 : 0.15));
  }, [hasSubject, updateViewZoom]);

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
          <button className="modal-close-button" aria-label="Close" onClick={handleClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body cleanup-modal-body">
          <div className="cleanup-canvas-container" onWheel={handleWheelZoom}>
            <div
              className="cleanup-canvas-stage"
              style={{
                width: canvasSize ? `min(${canvasSize.width * viewZoom}px, ${viewZoom * 100}%)` : undefined,
                aspectRatio: canvasSize ? `${canvasSize.width} / ${canvasSize.height}` : undefined,
              }}
            >
              <canvas
                ref={canvasRef}
                className="cleanup-canvas-modal"
                onPointerDown={(event) => {
                  if (!hasSubject) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  saveToUndo();
                  drawingRef.current = true;
                  lastPointRef.current = null;
                  if (mode === "erase") eraseAt(event);
                  else recoverAt(event);
                }}
                onPointerMove={(event) => {
                  handlePointerMovePreview(event);
                  if (!drawingRef.current) return;
                  if (mode === "erase") eraseAt(event);
                  else recoverAt(event);
                }}
                onPointerLeave={() => {
                  if (!drawingRef.current) setPointerPos(null);
                }}
                onPointerUp={() => {
                  lastPointRef.current = null;
                  commitCleanup();
                }}
                onPointerCancel={() => {
                  lastPointRef.current = null;
                  commitCleanup();
                }}
              />
              {pointerPos && hasSubject ? (
                <div
                  className="brush-preview"
                  style={{
                    left: pointerPos.x - brushSize / 2,
                    top: pointerPos.y - brushSize / 2,
                    width: brushSize,
                    height: brushSize,
                  }}
                />
              ) : null}
            </div>
            {!hasSubject ? (
              <div className="cleanup-empty-modal">
                <Eraser size={32} />
                <span>Remove background first</span>
                <p>Process your image in the Background section before starting manual cleanup.</p>
              </div>
            ) : null}
          </div>

          <div className="cleanup-controls">
            <div className="cleanup-toolbar">
              <button type="button" className="icon-button" aria-label="Zoom out" disabled={!hasSubject} onClick={() => updateViewZoom((current) => current - 0.2)} title="Zoom out">
                <ZoomOut size={15} />
              </button>
              <button type="button" className="icon-button" aria-label="Fit view" disabled={!hasSubject} onClick={() => updateViewZoom(1)} title="Fit view">
                <Maximize size={15} />
              </button>
              <button type="button" className="icon-button" aria-label="Zoom in" disabled={!hasSubject} onClick={() => updateViewZoom((current) => current + 0.2)} title="Zoom in">
                <ZoomIn size={15} />
              </button>
              <strong>{zoomLabel}</strong>
            </div>
              <div className="mode-toggle">
                <button
                  className={`mode-button ${mode === "erase" ? "active" : ""}`}
                  aria-label="Erase"
                  onClick={() => setMode("erase")}
                  title="Erase"
                >
                  <Eraser size={14} />
                  <span>Erase</span>
                </button>
                <button
                  className={`mode-button ${mode === "recover" ? "active" : ""}`}
                  aria-label="Recover"
                  onClick={() => setMode("recover")}
                  title="Recover"
                >
                  <CornerUpLeft size={14} />
                  <span>Recover</span>
                </button>
              </div>
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
                <p><strong>How to clean:</strong></p>
                <p>Drag to erase remaining background; switch to <em>Recover</em> to restore pixels.</p>
                <p>Use a smaller brush for hair and edges; larger brush for broad areas.</p>
                <p>Use <strong>Undo</strong> / <strong>Redo</strong> to step back or forward. Reset returns to automatic result.</p>
              </div>
            </div>

            <div className="button-group">
              <button
                className="action-button undo-button"
                disabled={!hasSubject || undoStack.length === 0}
                onClick={handleUndo}
              >
                <CornerUpLeft size={16} />
                <span>Undo</span>
              </button>
              <button
                className="action-button redo-button"
                disabled={!hasSubject || redoStack.length === 0}
                onClick={handleRedo}
              >
                <RefreshCw size={16} />
                <span>Redo</span>
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
