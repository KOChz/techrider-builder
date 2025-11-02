// lib/export-to-pdf.ts
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

interface IExportStitchedPDFOptions {
  firstElementId: string;
  secondElementId: string;
  fileName: string;
  backgroundColor?: string;
  spacingPx?: number;
  orientation?: "portrait" | "landscape";
  exportTextColor?: string;
  stripBgSelectors?: string[];
  /** Extra whitespace appended after the second element (before PDF fit). Defaults to 96px. */
  bottomPaddingPx?: number;
  /** Tiny fixed page padding in millimeters (gutters). Set 0 for full-bleed. Default ~4–5px ≈ 1.2mm. */
  pagePaddingMm?: number;
  /** If true, will switch to landscape when it yields a wider content render. */
  autoRotateForWidth?: boolean;
}

export async function exportStitchedPDF(
  options: IExportStitchedPDFOptions
): Promise<void> {
  const {
    firstElementId,
    secondElementId,
    fileName,
    backgroundColor = "#ffffff",
    spacingPx = 32,
    orientation = "portrait",
    exportTextColor = "#059669",
    stripBgSelectors = [
      ".bg-gradient-to-r",
      ".bg-linear-to-r",
      ".bg-gradient",
      "[data-export-strip-bg]",
    ],
    bottomPaddingPx = 96,
    pagePaddingMm = 1.2, // ≈ 4–5px visual gutter
    autoRotateForWidth = true,
  } = options;

  const topEl = document.getElementById(firstElementId);
  const bottomEl = document.getElementById(secondElementId);
  if (!topEl || !bottomEl) throw new Error("Elements not found");
  if ("fonts" in document) await (document as any).fonts.ready;

  const scale = 2;

  const commonOptions = (el: HTMLElement) =>
    ({
      scale,
      backgroundColor,
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: Math.max(el.scrollWidth, el.clientWidth, el.offsetWidth),
      windowHeight: Math.max(el.scrollHeight, el.clientHeight, el.offsetHeight),
      onclone: (doc: Document) => {
        const cTop = doc.getElementById(firstElementId);
        const cBot = doc.getElementById(secondElementId);
        cTop?.classList.add("export-simplify");
        cBot?.classList.add("export-simplify");

        const style = doc.createElement("style");
        style.textContent = `
          .export-simplify, .export-simplify * {
            box-shadow: none !important;
            filter: none !important;
            backdrop-filter: none !important;
            text-shadow: none !important;
          }
          .export-simplify [style*="background-image"],
          .export-simplify .bg-gradient,
          .export-simplify .bg-gradient-to-r,
          .export-simplify .bg-linear-to-r {
            background-image: none !important;
          }
          .export-simplify .bg-gradient,
          .export-simplify .bg-gradient-to-r,
          .export-simplify .bg-linear-to-r {
            background: transparent !important;
            background-color: transparent !important;
          }
          .export-simplify .bg-clip-text,
          .export-simplify .text-transparent,
          .export-simplify [style*="background-clip: text"],
          .export-simplify [style*="-webkit-background-clip: text"] {
            -webkit-background-clip: initial !important;
            background-clip: initial !important;
            -webkit-text-fill-color: ${exportTextColor} !important;
            color: ${exportTextColor} !important;
            opacity: 1 !important;
          }
          .export-simplify .sticky,
          .export-simplify [style*="position: sticky"] {
            position: static !important;
            top: auto !important;
          }
          .export-simplify { background-color: ${backgroundColor} !important; }
        `;
        doc.head.appendChild(style);

        if (stripBgSelectors.length) {
          const roots = [cTop, cBot].filter(Boolean) as Element[];
          for (const root of roots) {
            for (const sel of stripBgSelectors) {
              root.querySelectorAll<HTMLElement>(sel).forEach((n) => {
                n.style.background = "transparent";
                n.style.backgroundColor = "transparent";
                n.style.backgroundImage = "none";
              });
            }
          }
        }
      },
    } as const);

  const [topCanvas, bottomCanvas] = await Promise.all([
    html2canvas(topEl, commonOptions(topEl)),
    html2canvas(bottomEl, commonOptions(bottomEl)),
  ]);

  const gap = Math.round(spacingPx * scale);
  const tailPad = Math.round(bottomPaddingPx * scale);
  const compositeWidth = Math.max(topCanvas.width, bottomCanvas.width);
  const compositeHeight =
    topCanvas.height + gap + bottomCanvas.height + tailPad;

  const composite = document.createElement("canvas");
  composite.width = compositeWidth;
  composite.height = compositeHeight;

  const ctx = composite.getContext("2d", { alpha: false })!;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, compositeWidth, compositeHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const topX = Math.floor((compositeWidth - topCanvas.width) / 2);
  const bottomX = Math.floor((compositeWidth - bottomCanvas.width) / 2);
  ctx.drawImage(topCanvas, topX, 0);
  ctx.drawImage(bottomCanvas, bottomX, topCanvas.height + gap);

  const imgData = composite.toDataURL("image/jpeg", 0.95);

  // Aspect ratios
  const imgAR = compositeWidth / compositeHeight;

  // Decide page orientation (optional auto-rotate to maximize width)
  let pageOrientation = orientation;

  if (autoRotateForWidth) {
    const testPortrait = () => {
      const pW = orientation === "portrait" ? 210 : 297;
      const pH = orientation === "portrait" ? 297 : 210;
      const innerW = Math.max(0, pW - pagePaddingMm * 2);
      const innerH = Math.max(0, pH - pagePaddingMm * 2);
      let w = innerW;
      let h = w / imgAR;
      if (h > innerH) {
        h = innerH;
        w = h * imgAR;
      }
      return w;
    };
    const testLandscape = () => {
      const lW = 297;
      const lH = 210;
      const innerW = Math.max(0, lW - pagePaddingMm * 2);
      const innerH = Math.max(0, lH - pagePaddingMm * 2);
      let w = innerW;
      let h = w / imgAR;
      if (h > innerH) {
        h = innerH;
        w = h * imgAR;
      }
      return w;
    };

    if (testLandscape() > testPortrait()) pageOrientation = "landscape";
  }

  // Page metrics
  const pdfW = pageOrientation === "portrait" ? 210 : 297;
  const pdfH = pageOrientation === "portrait" ? 297 : 210;

  // Width-first fit with small symmetric gutters
  const innerW = Math.max(0, pdfW - pagePaddingMm * 2);
  const innerH = Math.max(0, pdfH - pagePaddingMm * 2);

  let drawW = innerW;
  let drawH = drawW / imgAR;

  if (drawH > innerH) {
    drawH = innerH;
    drawW = drawH * imgAR;
  }

  const x = (pdfW - drawW) / 2;
  const y = (pdfH - drawH) / 2;

  const pdf = new jsPDF({
    orientation: pageOrientation,
    unit: "mm",
    format: "a4",
    compress: false,
  });

  pdf.addImage(imgData, "JPEG", x, y, drawW, drawH, undefined, "FAST");
  pdf.save(fileName);
}
