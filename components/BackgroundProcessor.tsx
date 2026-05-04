"use client";

import { useEffect, useState } from "react";
import { Eraser, Loader2, Sparkles } from "lucide-react";
import { backgroundOptions } from "@/utils/presets";

type BackgroundProcessorProps = {
  activeBackground: string;
  customColor: string;
  feather: number;
  hasImage: boolean;
  hasProcessedImage: boolean;
  isProcessing: boolean;
  beforeAfter: boolean;
  error?: string | null;
  onBackgroundChange: (value: string) => void;
  onCustomColorChange: (value: string) => void;
  onFeatherChange: (value: number) => void;
  onProcess: () => void;
  onToggleBeforeAfter: () => void;
};

const processingFacts = [
  "Your photo stays in this browser while the model works.",
  "Transparent exports keep the cutout ready for any background.",
  "A small feather value helps soften hair and fabric edges.",
  "Clean, even lighting usually gives the AI a sharper subject mask.",
  "Manual cleanup is available after processing for fine edge fixes.",
];

export function BackgroundProcessor({
  activeBackground,
  customColor,
  feather,
  hasImage,
  hasProcessedImage,
  isProcessing,
  beforeAfter,
  error,
  onBackgroundChange,
  onCustomColorChange,
  onFeatherChange,
  onProcess,
  onToggleBeforeAfter,
}: BackgroundProcessorProps) {
  const [factIndex, setFactIndex] = useState(0);
  const displayFactIndex = isProcessing ? factIndex : 0;

  useEffect(() => {
    if (!isProcessing) return;

    const timer = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % processingFacts.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [isProcessing]);

  return (
    <section className="fluent-card">
      <div className="section-title">
        <span>3. Background</span>
        <Eraser size={15} />
      </div>
      <button className="primary-action w-full" disabled={!hasImage || isProcessing} onClick={onProcess}>
        {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
        {isProcessing ? "Removing background" : "Remove background"}
      </button>
      <div className="segmented mt-3">
        <button className={beforeAfter ? "selected" : ""} disabled={!hasProcessedImage} onClick={onToggleBeforeAfter}>
          Before
        </button>
        <button className={!beforeAfter ? "selected" : ""} disabled={!hasProcessedImage} onClick={onToggleBeforeAfter}>
          After
        </button>
      </div>
      {isProcessing ? (
        <div className="processing-insight">
          <div className="processing-insight-head">
            <span className="processing-pulse" />
            <strong>While background removal runs</strong>
          </div>
          <p>{processingFacts[displayFactIndex]}</p>
          <div className="processing-fact-dots" aria-hidden="true">
            {processingFacts.map((fact, index) => (
              <span key={fact} className={index === displayFactIndex ? "active" : undefined} />
            ))}
          </div>
        </div>
      ) : null}
      <div className="swatch-grid">
        {backgroundOptions.map((option) => (
          <button
            key={option.id}
            className={`color-swatch ${activeBackground === option.id ? "selected" : ""}`}
            onClick={() => onBackgroundChange(option.id)}
            title={option.label}
          >
            <span
              style={{
                background:
                  option.value === "transparent"
                    ? "linear-gradient(45deg,#d8dde5 25%,transparent 25%,transparent 75%,#d8dde5 75%),linear-gradient(45deg,#d8dde5 25%,transparent 25%,transparent 75%,#d8dde5 75%)"
                    : option.value,
                backgroundPosition: "0 0, 6px 6px",
                backgroundSize: "12px 12px",
              }}
            />
          </button>
        ))}
        <label className={`color-swatch custom ${activeBackground === "custom" ? "selected" : ""}`} title="Custom color">
          <input
            type="color"
            value={customColor}
            onChange={(event) => {
              onBackgroundChange("custom");
              onCustomColorChange(event.target.value);
            }}
          />
          <span style={{ background: customColor }} />
        </label>
      </div>
      <label className="control-row">
        <span>Edge feather</span>
        <strong>{feather.toFixed(1)}px</strong>
      </label>
      <input className="range" type="range" min={0} max={2} step={0.1} value={feather} onChange={(event) => onFeatherChange(Number(event.target.value))} />
      {error ? <p className="inline-error">{error}</p> : null}
    </section>
  );
}
