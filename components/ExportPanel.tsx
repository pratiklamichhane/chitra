import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  const disabledTitle = "Upload an image to enable export";

  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <button
          className="primary-action"
          disabled={!canExport}
          onClick={onExportPng}
          title={canExport ? "Export as PNG" : disabledTitle}
        >
          <Download size={16} />PNG
        </button>
        <button
          disabled={!canExport}
          onClick={onExportPdf}
          title={canExport ? "Export as PDF" : disabledTitle}
        >
          <FileDown size={16} />PDF
        </button>
        <button
          disabled={!canExport}
          onClick={onPrint}
          title={canExport ? "Print sheet" : disabledTitle}
        >
          <Printer size={16} />Print
        </button>
      </div>
    </section>
  );
}
