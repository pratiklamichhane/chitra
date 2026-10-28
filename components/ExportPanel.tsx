import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  const tooltip = !canExport ? "Process an image first to enable export" : undefined;
  const tabIndex = !canExport ? 0 : undefined;
  const wrapperClass = "inline-flex w-full min-w-0";

  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <span title={tooltip} tabIndex={tabIndex} className={wrapperClass}>
          <button className="primary-action w-full" disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        </span>
        <span title={tooltip} tabIndex={tabIndex} className={wrapperClass}>
          <button className="w-full" disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        </span>
        <span title={tooltip} tabIndex={tabIndex} className={wrapperClass}>
          <button className="w-full" disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
