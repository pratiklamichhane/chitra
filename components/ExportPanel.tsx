import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  const disabledTitle = "Process an image first to export";

  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <button
          className="primary-action"
          disabled={!canExport}
          onClick={onExportPng}
          title={!canExport ? disabledTitle : "Export as PNG"}
        >
          <Download size={16} />PNG
        </button>
        <button
          disabled={!canExport}
          onClick={onExportPdf}
          title={!canExport ? disabledTitle : "Export as PDF"}
        >
          <FileDown size={16} />PDF
        </button>
        <button
          disabled={!canExport}
          onClick={onPrint}
          title={!canExport ? disabledTitle : "Print document"}
        >
          <Printer size={16} />Print
        </button>
      </div>
    </section>
  );
}
