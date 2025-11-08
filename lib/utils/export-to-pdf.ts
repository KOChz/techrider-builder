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
  bottomPixelRatio?: number;
  topVirtualWidthPx?: number;
  topPixelRatio?: number;
}

const transformInputsToText = (container: HTMLElement): void => {
  const inputs = container.querySelectorAll<
    HTMLInputElement | HTMLSelectElement
  >("input[data-export-input], select[data-export-input]");

  inputs.forEach((input) => {
    const div = document.createElement("div");
    const computedStyle = window.getComputedStyle(input);

    // Copy all computed styles
    Array.from(computedStyle).forEach((key) => {
      div.style.setProperty(
        key,
        computedStyle.getPropertyValue(key),
        computedStyle.getPropertyPriority(key)
      );
    });

    // Get the display value
    let displayValue = "";
    if (input instanceof HTMLSelectElement) {
      const selectedOption = input.options[input.selectedIndex];
      displayValue = selectedOption?.text || "";
    } else {
      displayValue = input.value || input.placeholder;
    }

    // Enhanced text rendering styles
    div.textContent = displayValue;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.boxSizing = "border-box";
    div.style.whiteSpace = "nowrap";
    div.style.overflow = "hidden";
    div.style.textOverflow = "ellipsis";
    div.style.lineHeight = "1.5";
    div.style.paddingTop = "6px";
    div.style.paddingBottom = "6px";

    // Handle empty values (show placeholder styling)
    if (!input.value) {
      div.style.color = "#9ca3af";
      div.style.opacity = "0.6";
    }

    input.replaceWith(div);
  });
};

const injectSanitizer = (doc: Document, exportTextColor: string) => {
  const style = doc.createElement("style");
  style.textContent = `
    .export-simplify, .export-simplify * { 
      box-shadow:none!important; 
      filter:none!important; 
      text-shadow:none!important; 
      backdrop-filter:none!important; 
    }
    .export-simplify [style*="background-image"],
    .export-simplify .bg-gradient, 
    .export-simplify .bg-gradient-to-r, 
    .export-simplify .bg-linear-to-r { 
      background-image:none!important; 
    }
    .export-simplify .bg-gradient, 
    .export-simplify .bg-gradient-to-r, 
    .export-simplify .bg-linear-to-r { 
      background:transparent!important; 
      background-color:transparent!important; 
    }
    .export-simplify .bg-clip-text, 
    .export-simplify .text-transparent,
    .export-simplify [style*="background-clip: text"], 
    .export-simplify [style*="-webkit-background-clip: text"] {
      -webkit-background-clip:initial!important; 
      background-clip:initial!important;
      -webkit-text-fill-color:${exportTextColor}!important; 
      color:${exportTextColor}!important; 
      opacity:1!important;
    }
    .export-simplify .sticky { 
      position:static!important; 
      top:auto!important; 
    }
    .container { 
      max-width:none!important; 
      padding-left:4px; 
      padding-right:4px; 
    }
    html, body { 
      margin:0!important; 
    }
    /* Ensure text renders clearly */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;
  doc.head.appendChild(style);
};

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
  bottomPaddingPx = 0,
  pagePaddingMm = 1.2,
  autoRotateForWidth = true,
  bottomPixelRatio = 3,
  topVirtualWidthPx = 960,
  topPixelRatio,
}: IExportStitchedPDFOptions) {
  const topEl = document.getElementById(firstElementId);
  const bottomEl = document.getElementById(secondElementId);
  if (!topEl || !bottomEl) throw new Error("Elements not found");
  if ("fonts" in document) await document.fonts.ready;

  const dpr = Math.max(2, Math.floor(window.devicePixelRatio || 1));
  const topScale = Math.max(2, topPixelRatio ?? dpr);

  // BOTTOM FIRST
  const html2ImgPixelRatio = Math.max(1, (dpr * bottomPixelRatio) / 2);
  const bottomCanvas = await toCanvasHtml2Image(bottomEl, {
    backgroundColor,
    cacheBust: true,
    pixelRatio: html2ImgPixelRatio,
    width: bottomEl.clientWidth,
    height: bottomEl.clientHeight,
    style: {
      width: "100%",
      boxSizing: "border-box",
      webkitTextFillColor: exportTextColor,
      color: exportTextColor,
    },
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      for (const sel of stripBgSelectors) if (node.matches(sel)) return false;
      return true;
    },
  });
  const targetCanvasWidth = bottomCanvas.width;

  // TOP SECOND
  const forcedCssWidth = Math.max(
    Math.round(targetCanvasWidth / topScale),
    topVirtualWidthPx
  );

  const topCanvas = await html2canvas(topEl, {
    backgroundColor,
    scale: topScale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    windowWidth: forcedCssWidth,
    windowHeight: Math.max(
      topEl.scrollHeight,
      topEl.clientHeight,
      topEl.offsetHeight
    ),
    onclone: (doc) => {
      injectSanitizer(doc, exportTextColor);
      doc.documentElement.style.width = `${forcedCssWidth}px`;
      (doc.body as HTMLBodyElement).style.width = `${forcedCssWidth}px`;
      (doc.body as HTMLBodyElement).style.margin = "0 auto";

      const cloned = doc.getElementById(firstElementId);
      if (!cloned) return;

      cloned.classList.add("export-simplify");

      // Transform inputs to divs for better rendering
      transformInputsToText(cloned);

      if (stripBgSelectors.length) {
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

  // Rescale TOP if needed
  let topBitmap = topCanvas;
  if (topCanvas.width !== targetCanvasWidth) {
    const s = targetCanvasWidth / topCanvas.width;
    const fixed = document.createElement("canvas");
    fixed.width = targetCanvasWidth;
    fixed.height = Math.round(topCanvas.height * s);
    const fctx = fixed.getContext("2d")!;
    fctx.imageSmoothingEnabled = true;
    fctx.imageSmoothingQuality = "high";
    fctx.drawImage(topCanvas, 0, 0, fixed.width, fixed.height);
    topBitmap = fixed;
  }

  // COMPOSE
  const gap = Math.round(spacingPx * dpr);
  const tailPad = Math.round(bottomPaddingPx * dpr);
  const compositeWidth = targetCanvasWidth;
  const compositeHeight =
    topBitmap.height + gap + bottomCanvas.height + tailPad;

  const composite = document.createElement("canvas");
  composite.width = compositeWidth;
  composite.height = compositeHeight;

  const ctx = composite.getContext("2d", { alpha: false })!;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, compositeWidth, compositeHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    topBitmap,
    Math.floor((compositeWidth - topBitmap.width) / 2),
    0
  );
  ctx.drawImage(
    bottomCanvas,
    Math.floor((compositeWidth - bottomCanvas.width) / 2),
    topBitmap.height + gap
  );

  const img = composite.toDataURL("image/jpeg", 0.95);
  const ar = composite.width / composite.height;

  // PDF LAYOUT
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
    if (best(297, 210) > best(210, 297)) pageOrientation = "landscape";
  }

  const pdfW = pageOrientation === "portrait" ? 210 : 297;
  const pdfH = pageOrientation === "portrait" ? 297 : 210;
  const innerW = Math.max(0, pdfW - pagePaddingMm * 2);
  const innerH = Math.max(0, pdfH - pagePaddingMm * 2);
  let drawW = innerW,
    drawH = drawW / ar;
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
