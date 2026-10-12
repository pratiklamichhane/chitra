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
        <button className="primary-action" disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        <button disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        <button disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
      </div>
    </section>
  );
}
