import type { Unit } from "@/utils/sizeConversions";
import { photoPresets } from "@/utils/presets";

type PhotoSizePanelProps = {
  width: number;
  height: number;
  unit: Unit;
  dpi: number;
  widthPx: number;
  heightPx: number;
  onChange: (next: Partial<{ width: number; height: number; unit: Unit; dpi: number }>) => void;
};

export function PhotoSizePanel({ width, height, unit, dpi, widthPx, heightPx, onChange }: PhotoSizePanelProps) {
  return (
    <section className="fluent-card">
      <div className="section-title"><span>5. Photo Size</span></div>
      <div className="preset-row">
        {photoPresets.map((preset) => (
          <button key={preset.id} onClick={() => onChange(preset)}>{preset.label}</button>
        ))}
      </div>
      <div className="input-grid two">
        <label>
          <span>Width</span>
          <input type="number" min={1} value={width} onChange={(event) => onChange({ width: Number(event.target.value) })} />
        </label>
        <label>
          <span>Height</span>
          <input type="number" min={1} value={height} onChange={(event) => onChange({ height: Number(event.target.value) })} />
        </label>
      </div>
      <div className="input-grid two">
        <label>
          <span>Unit</span>
          <select value={unit} onChange={(event) => onChange({ unit: event.target.value as Unit })}>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="inch">inch</option>
            <option value="px">px</option>
          </select>
        </label>
        <label>
          <span>DPI</span>
          <input type="number" min={72} max={1200} value={dpi} onChange={(event) => onChange({ dpi: Number(event.target.value) })} />
        </label>
      </div>
      <div className="computed-box">
        <span>True output</span>
        <strong>{widthPx} x {heightPx}px</strong>
      </div>
    </section>
  );
}
