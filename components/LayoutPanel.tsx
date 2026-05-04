import type { LayoutMode, LayoutResult } from "@/composables/useLayoutEngine";

type LayoutPanelProps = {
  mode: LayoutMode;
  fixedCount: number;
  manualRows: number;
  manualCols: number;
  layout: LayoutResult;
  onChange: (next: Partial<{ mode: LayoutMode; fixedCount: number; manualRows: number; manualCols: number }>) => void;
};

export function LayoutPanel({ mode, fixedCount, manualRows, manualCols, layout, onChange }: LayoutPanelProps) {
  return (
    <section className="fluent-card">
      <div className="section-title"><span>Layout</span></div>
      <div className="segmented">
        <button className={mode === "auto" ? "selected" : ""} onClick={() => onChange({ mode: "auto" })}>Auto-fit</button>
        <button className={mode === "fixed" ? "selected" : ""} onClick={() => onChange({ mode: "fixed" })}>Fixed</button>
        <button className={mode === "manual" ? "selected" : ""} onClick={() => onChange({ mode: "manual" })}>Manual</button>
      </div>
      {mode === "fixed" ? (
        <label className="mt-3 block">
          <span className="input-label">Copies</span>
          <input type="number" min={1} value={fixedCount} onChange={(event) => onChange({ fixedCount: Number(event.target.value) })} />
        </label>
      ) : null}
      {mode === "manual" ? (
        <div className="input-grid two">
          <label>
            <span>Rows</span>
            <input type="number" min={1} value={manualRows} onChange={(event) => onChange({ manualRows: Number(event.target.value) })} />
          </label>
          <label>
            <span>Cols</span>
            <input type="number" min={1} value={manualCols} onChange={(event) => onChange({ manualCols: Number(event.target.value) })} />
          </label>
        </div>
      ) : null}
      <div className="computed-box">
        <span>Fit on sheet</span>
        <strong>{layout.cols} x {layout.rows} · {layout.count} copies</strong>
      </div>
    </section>
  );
}
