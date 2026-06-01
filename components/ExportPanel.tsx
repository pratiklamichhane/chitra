import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <span title="Export PNG" style={{ display: 'inline-block' }}>
          <button className="primary-action" disabled={!canExport} onClick={onExportPng} aria-label="Export PNG"><Download size={16} />PNG</button>
        </span>
        <span title="Export PDF" style={{ display: 'inline-block' }}>
          <button  disabled={!canExport} onClick={onExportPdf} aria-label="Export PDF"><FileDown size={16} />PDF</button>
        </span>
        <span title="Print" style={{ display: 'inline-block' }}>
          <button  disabled={!canExport} onClick={onPrint} aria-label="Print"><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
