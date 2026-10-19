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
        <span className="inline-flex" title={!canExport ? "Please process an image and select a layout first to enable export" : undefined} tabIndex={!canExport ? 0 : undefined}>
          <button className="primary-action" disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        </span>
        <span className="inline-flex" title={!canExport ? "Please process an image and select a layout first to enable export" : undefined} tabIndex={!canExport ? 0 : undefined}>
          <button disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        </span>
        <span className="inline-flex" title={!canExport ? "Please process an image and select a layout first to enable export" : undefined} tabIndex={!canExport ? 0 : undefined}>
          <button disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
