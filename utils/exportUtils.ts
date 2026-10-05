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
  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow popups to use the print feature.");
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Sheet - Chitra</title>
        <style>
          @page { margin: 0; }
          html, body { margin: 0; padding: 0; background: white; }
          img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="Print sheet" onload="window.print();" />
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
}
