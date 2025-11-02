// lib/export-stitched-pdf.ts
import html2canvas from "html2canvas-pro";
import { toCanvas as toCanvasHtml2Image } from "html-to-image";
import jsPDF from "jspdf";

type Orientation = "portrait" | "landscape";

interface IExportStitchedPDFOptions {
  firstElementId: string;
  secondElementId: string;
  fileName: string;
  backgroundColor?: string;
  spacingPx?: number;
  orientation?: Orientation;
  exportTextColor?: string;
  stripBgSelectors?: string[];
  bottomPaddingPx?: number;
  pagePaddingMm?: number;
  autoRotateForWidth?: boolean;
  /** DPI multiplier just for stage plan */
  bottomPixelRatio?: number; // default 3

  /** Virtual CSS width (px) to render the TOP section at. Forces desktop-ish layout on mobile. */
  topVirtualWidthPx?: number; // default 960
  /** Extra pixel ratio just for TOP (to match bottom crispness if desired). */
  topPixelRatio?: number; // default = device DPR (min 2)
}

export async function exportStitchedPDF({
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
  pagePaddingMm = 1.2,
  autoRotateForWidth = true,
  bottomPixelRatio = 3,
  topVirtualWidthPx = 960,
  topPixelRatio,
}: IExportStitchedPDFOptions) {
  const topEl = document.getElementById(firstElementId);
  const bottomEl = document.getElementById(secondElementId);
  if (!topEl || !bottomEl) throw new Error("Elements not found");
  if ("fonts" in document) await (document as any).fonts.ready;

  const dpr = Math.max(2, Math.floor(window.devicePixelRatio || 1));

  // --- shared: sanitize styles in clones for export
  const injectSanitizer = (doc: Document) => {
    const style = doc.createElement("style");
    style.textContent = `
      .export-simplify, .export-simplify * { box-shadow: none!important; filter:none!important; text-shadow:none!important; backdrop-filter:none!important; }
      .export-simplify [style*="background-image"],
      .export-simplify .bg-gradient, .export-simplify .bg-gradient-to-r, .export-simplify .bg-linear-to-r { background-image:none!important; }
      .export-simplify .bg-gradient, .export-simplify .bg-gradient-to-r, .export-simplify .bg-linear-to-r { background:transparent!important; background-color:transparent!important; }
      .export-simplify .bg-clip-text, .export-simplify .text-transparent,
      .export-simplify [style*="background-clip: text"], .export-simplify [style*="-webkit-background-clip: text"] {
        -webkit-background-clip: initial!important; background-clip: initial!important;
        -webkit-text-fill-color:${exportTextColor}!important; color:${exportTextColor}!important; opacity:1!important;
      }
      .export-simplify .sticky { position:static!important; top:auto!important; }
      /* Make Tailwind's .container expand for the forced viewport width */
      .container { max-width: none !important; padding-left: 4px; padding-right: 4px; }
      html, body { margin:0!important; }
    `;
    doc.head.appendChild(style);
  };

  // ---------------- TOP CAPTURE (force wider virtual viewport on mobile)
  const forcedCssWidth = Math.max(topVirtualWidthPx, bottomEl.clientWidth);
  const topCanvas = await html2canvas(topEl, {
    backgroundColor,
    scale: topPixelRatio ?? dpr,
    useCORS: true,
    allowTaint: false,
    logging: false,
    // Force media queries and layout to reflow as if the page were wider
    windowWidth: forcedCssWidth,
    windowHeight: Math.max(
      topEl.scrollHeight,
      topEl.clientHeight,
      topEl.offsetHeight
    ),
    onclone: (doc) => {
      injectSanitizer(doc);

      // Make the cloned document "think" it's as wide as forcedCssWidth
      doc.documentElement.style.width = `${forcedCssWidth}px`;
      (doc.body as HTMLBodyElement).style.width = `${forcedCssWidth}px`;
      (doc.body as HTMLBodyElement).style.margin = "0 auto";

      const cloned = doc.getElementById(firstElementId);
      cloned?.classList.add("export-simplify");

      // Strip target backgrounds inside TOP
      if (stripBgSelectors.length && cloned) {
        for (const sel of stripBgSelectors) {
          cloned.querySelectorAll<HTMLElement>(sel).forEach((n) => {
            n.style.background = "transparent";
            n.style.backgroundColor = "transparent";
            n.style.backgroundImage = "none";
          });
        }
      }
    },
  });

  // ---------------- BOTTOM CAPTURE (ReactFlow / stage plan)
  const rfViewport =
    bottomEl.querySelector<HTMLElement>(".react-flow__viewport") || bottomEl;

  const pixelRatio = Math.max(1, (dpr * bottomPixelRatio) / 2); // html-to-image is sensitive to very large DPRs
  const bottomCanvas = await toCanvasHtml2Image(bottomEl, {
    backgroundColor,
    cacheBust: true,
    pixelRatio,
    width: bottomEl.clientWidth,
    height: bottomEl.clientHeight,
    style: {
      webkitTextFillColor: exportTextColor,
      color: exportTextColor,
    },
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      for (const sel of stripBgSelectors) {
        if (node.matches(sel)) return false;
      }
      return true;
    },
  });

  // ---------------- COMPOSE
  const gap = Math.round(spacingPx * dpr);
  const tailPad = Math.round(bottomPaddingPx * dpr);
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

  const img = composite.toDataURL("image/jpeg", 0.95);
  const ar = composite.width / composite.height;

  // ---------------- PDF LAYOUT + OPTIONAL AUTO-ORIENTATION
  let pageOrientation: Orientation = orientation;
  if (autoRotateForWidth) {
    const best = (w: number, h: number) => {
      const innerW = Math.max(0, w - pagePaddingMm * 2);
      const innerH = Math.max(0, h - pagePaddingMm * 2);
      let dw = innerW,
        dh = dw / ar;
      if (dh > innerH) {
        dh = innerH;
        dw = dh * ar;
      }
      return dw;
    };
    // Compare landscape (297x210) vs portrait (210x297)
    if (best(297, 210) > best(210, 297)) pageOrientation = "landscape";
  }

  const pdfW = pageOrientation === "portrait" ? 210 : 297;
  const pdfH = pageOrientation === "portrait" ? 297 : 210;
  const innerW = Math.max(0, pdfW - pagePaddingMm * 2);
  const innerH = Math.max(0, pdfH - pagePaddingMm * 2);
  let drawW = innerW;
  let drawH = drawW / ar;
  if (drawH > innerH) {
    drawH = innerH;
    drawW = drawH * ar;
  }
  const x = (pdfW - drawW) / 2;
  const y = (pdfH - drawH) / 2;

  const pdf = new jsPDF({
    orientation: pageOrientation,
    unit: "mm",
    format: "a4",
    compress: false,
  });

  pdf.addImage(img, "JPEG", x, y, drawW, drawH, undefined, "FAST");
  pdf.save(fileName);
}
