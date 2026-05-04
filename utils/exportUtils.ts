export async function canvasToPng(canvas: HTMLCanvasElement, fileName = "studio-print-sheet.png") {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 1);
  });

  if (!blob) throw new Error("Could not create PNG export.");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function canvasToPdf(
  canvas: HTMLCanvasElement,
  widthMm: number,
  heightMm: number,
  fileName = "studio-print-sheet.pdf",
) {
  const { jsPDF } = await import("jspdf");
  const orientation = widthMm > heightMm ? "landscape" : "portrait";
  const pdf = new jsPDF({ unit: "mm", format: [widthMm, heightMm], orientation });
  pdf.addImage(canvas.toDataURL("image/png", 1), "PNG", 0, 0, widthMm, heightMm);
  pdf.save(fileName);
}

export function printCanvas(canvas: HTMLCanvasElement) {
  const dataUrl = canvas.toDataURL("image/png", 1);
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>StudioPrint</title>
        <style>
          @page { margin: 0; }
          html, body { margin: 0; min-height: 100%; background: white; }
          img { width: 100%; height: auto; display: block; }
        </style>
      </head>
      <body><img src="${dataUrl}" alt="Print sheet" /></body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
