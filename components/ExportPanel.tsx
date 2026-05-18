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
        <button className="primary-action" disabled={!canExport} onClick={onExportPng} title={!canExport ? "Process an image first" : "Export as PNG"}><Download size={16} />PNG</button>
        <button disabled={!canExport} onClick={onExportPdf} title={!canExport ? "Process an image first" : "Export as PDF"}><FileDown size={16} />PDF</button>
        <button disabled={!canExport} onClick={onPrint} title={!canExport ? "Process an image first" : "Print image"}><Printer size={16} />Print</button>
      </div>
    </section>
  );
}
