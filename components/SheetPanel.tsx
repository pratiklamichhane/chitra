import type { Orientation } from "@/composables/useLayoutEngine";
import { sheetPresets } from "@/utils/presets";

type SheetPanelProps = {
  sheetId: string;
  orientation: Orientation;
  customWidthMm: number;
  customHeightMm: number;
  marginMm: number;
  gapMm: number;
  onChange: (next: Partial<{ sheetId: string; orientation: Orientation; customWidthMm: number; customHeightMm: number; marginMm: number; gapMm: number }>) => void;
};

export function SheetPanel({ sheetId, orientation, customWidthMm, customHeightMm, marginMm, gapMm, onChange }: SheetPanelProps) {
  return (
    <section className="fluent-card">
      <div className="section-title"><span><span className="step-number">7.</span> Sheet</span></div>
      <div className="preset-row">
        {sheetPresets.slice(0, 4).map((preset) => (
          <button key={preset.id} className={sheetId === preset.id ? "selected" : ""} onClick={() => onChange({ sheetId: preset.id })}>
            {preset.label}
          </button>
        ))}
        <button className={sheetId === "custom" ? "selected" : ""} onClick={() => onChange({ sheetId: "custom" })}>Custom</button>
      </div>
      <div className="segmented mt-2">
        <button className={orientation === "portrait" ? "selected" : ""} onClick={() => onChange({ orientation: "portrait" })}>Portrait</button>
        <button className={orientation === "landscape" ? "selected" : ""} onClick={() => onChange({ orientation: "landscape" })}>Landscape</button>
      </div>
      {sheetId === "custom" ? (
        <div className="input-grid two">
          <label>
            <span>Width mm</span>
            <input type="number" min={1} value={customWidthMm} onChange={(event) => onChange({ customWidthMm: Number(event.target.value) })} />
          </label>
          <label>
            <span>Height mm</span>
            <input type="number" min={1} value={customHeightMm} onChange={(event) => onChange({ customHeightMm: Number(event.target.value) })} />
          </label>
        </div>
      ) : null}
      <label className="control-row"><span>Margin</span><strong>{marginMm} mm</strong></label>
      <input className="range" type="range" min={0} max={25} value={marginMm} onChange={(event) => onChange({ marginMm: Number(event.target.value) })} />
      <label className="control-row"><span>Gap</span><strong>{gapMm} mm</strong></label>
      <input className="range" type="range" min={0} max={12} value={gapMm} onChange={(event) => onChange({ gapMm: Number(event.target.value) })} />
    </section>
  );
}
