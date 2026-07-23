import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  const disabledTitle = "Process a photo to enable export";

  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <span
          title={!canExport ? disabledTitle : undefined}
          tabIndex={!canExport ? 0 : undefined}
          className="inline-flex w-full"
        >
          <button className="primary-action w-full" disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        </span>
        <span
          title={!canExport ? disabledTitle : undefined}
          tabIndex={!canExport ? 0 : undefined}
          className="inline-flex w-full"
        >
          <button className="w-full" disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        </span>
        <span
          title={!canExport ? disabledTitle : undefined}
          tabIndex={!canExport ? 0 : undefined}
          className="inline-flex w-full"
        >
          <button className="w-full" disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
