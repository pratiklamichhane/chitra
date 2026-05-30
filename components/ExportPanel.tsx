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
        <button className="primary-action" title={canExport ? "Export as PNG" : "Process a photo to enable PNG export"} disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        <button title={canExport ? "Export as PDF" : "Process a photo to enable PDF export"} disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        <button title={canExport ? "Print layout" : "Process a photo to enable printing"} disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
      </div>
    </section>
  );
}
