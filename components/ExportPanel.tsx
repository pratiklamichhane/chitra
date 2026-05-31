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
        <span title={canExport ? "Export PNG" : "Process photo to export"} style={{ display: "inline-block" }}>
          <button className="primary-action" disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        </span>
        <span title={canExport ? "Export PDF" : "Process photo to export"} style={{ display: "inline-block" }}>
          <button disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        </span>
        <span title={canExport ? "Print" : "Process photo to export"} style={{ display: "inline-block" }}>
          <button disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
