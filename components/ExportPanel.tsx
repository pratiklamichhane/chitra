import { Download, FileDown, Printer } from "lucide-react";

type ExportPanelProps = {
  canExport: boolean;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
};

export function ExportPanel({ canExport, onExportPng, onExportPdf, onPrint }: ExportPanelProps) {
  const disabledTitle = !canExport ? "Add an image and process it to enable export" : undefined;

  return (
    <section className="fluent-card">
      <div className="section-title"><span>Export</span></div>
      <div className="export-grid">
        <span title={disabledTitle} style={{ display: "inline-block", width: "100%" }}>
          <button className="primary-action" style={{ width: "100%" }} disabled={!canExport} onClick={onExportPng}><Download size={16} />PNG</button>
        </span>
        <span title={disabledTitle} style={{ display: "inline-block", width: "100%" }}>
          <button style={{ width: "100%" }} disabled={!canExport} onClick={onExportPdf}><FileDown size={16} />PDF</button>
        </span>
        <span title={disabledTitle} style={{ display: "inline-block", width: "100%" }}>
          <button style={{ width: "100%" }} disabled={!canExport} onClick={onPrint}><Printer size={16} />Print</button>
        </span>
      </div>
    </section>
  );
}
