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
  "Photos are processed locally in your browser.",
  "Edge feathering helps soften hair and fabric boundaries.",
  "Even lighting usually creates a cleaner subject mask.",
  "Manual cleanup is available after processing.",
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
      {isProcessing ? <ProcessingInsight /> : null}
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

function ProcessingInsight() {
  const [visible, setVisible] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const infoTimer = window.setTimeout(() => setVisible(true), 1800);
    const factTimer = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % processingFacts.length);
    }, 3200);

    return () => {
      window.clearTimeout(infoTimer);
      window.clearInterval(factTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="processing-insight">
      <div className="processing-insight-head">
        <Loader2 className="animate-spin" size={13} />
        <strong>Still working</strong>
      </div>
      <p>{processingFacts[factIndex]}</p>
    </div>
  );
}
