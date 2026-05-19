import type { CropState } from "@/composables/useCanvasRenderer";
import { RotateCcw } from "lucide-react";

type CropPanelProps = {
  crop: CropState;
  onChange: (next: Partial<CropState>) => void;
  onReset: () => void;
};

export function CropPanel({ crop, onChange, onReset }: CropPanelProps) {
  return (
    <section className="fluent-card">
      <div className="section-title">
        <span><span className="step-number">6.</span> Crop</span>
        <button className="icon-button" onClick={onReset} aria-label="Reset crop" title="Reset crop"><RotateCcw size={15} /></button>
      </div>
      <label className="control-row">
        <span>Zoom</span>
        <strong>{crop.zoom.toFixed(2)}x</strong>
      </label>
      <input className="range" type="range" min={0.5} max={3} step={0.01} value={crop.zoom} onChange={(event) => onChange({ zoom: Number(event.target.value) })} />
      <div className="input-grid two">
        <label>
          <span>X</span>
          <input type="number" value={Math.round(crop.offsetX)} onChange={(event) => onChange({ offsetX: Number(event.target.value) })} />
        </label>
        <label>
          <span>Y</span>
          <input type="number" value={Math.round(crop.offsetY)} onChange={(event) => onChange({ offsetY: Number(event.target.value) })} />
        </label>
      </div>
      <label>
        <span className="input-label">Rotation</span>
        <input type="number" value={crop.rotation} onChange={(event) => onChange({ rotation: Number(event.target.value) })} />
      </label>
    </section>
  );
}
