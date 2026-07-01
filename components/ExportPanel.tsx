import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  const disabledTitle = !canExport ? "Upload and process a photo to enable export" : undefined;
  const disabledTabIndex = !canExport ? 0 : undefined;

  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <span className="inline-flex w-full" title={disabledTitle} tabIndex={disabledTabIndex}>
          <button className="primary-action w-full" disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        </span>
        <span className="inline-flex w-full" title={disabledTitle} tabIndex={disabledTabIndex}>
          <button className="w-full" disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        </span>
        <span className="inline-flex w-full" title={disabledTitle} tabIndex={disabledTabIndex}>
          <button className="w-full" disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
