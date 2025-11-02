// lib/utils/export-stage-plan-to-pdf.ts
import { toCanvas as toCanvasHtml2Image } from "html-to-image";
import jsPDF from "jspdf";
import type { ReactFlowInstance } from "@xyflow/react";

type TOrientation = "portrait" | "landscape";

interface IExportStagePlanToPdfOptions {
  reactFlowInstance: ReactFlowInstance;
  fileName: string;
  backgroundColor?: string;
  orientation?: TOrientation;
  exportTextColor?: string;
  stripBgSelectors?: string[];
  pagePaddingMm?: number;
  autoRotateForWidth?: boolean;
  pixelRatio?: number;
}

/**
 * Exports a ReactFlow stage plan to PDF by capturing at actual container dimensions
 *
 * @param options - Configuration options for PDF export
 * @returns Promise that resolves when PDF is downloaded
 * @throws Error if ReactFlow instance is invalid or rendering fails
 */
export async function exportStagePlanToPdf({
  reactFlowInstance,
  fileName,
  backgroundColor = "#ffffff",
  orientation = "landscape",
  exportTextColor = "#059669",
  stripBgSelectors = [
    ".bg-gradient-to-r",
    ".bg-linear-to-r",
    ".bg-gradient",
    "[data-export-strip-bg]",
  ],
  pagePaddingMm = 1.2,
  autoRotateForWidth = true,
  pixelRatio = 6,
}: IExportStagePlanToPdfOptions): Promise<void> {
  const nodes = reactFlowInstance.getNodes();

  if (nodes.length === 0) {
    throw new Error("No nodes to export");
  }

  if ("fonts" in document) {
    await (document as Document & { fonts: { ready: Promise<void> } }).fonts
      .ready;
  }

  const reactFlowWrapper = document.querySelector<HTMLElement>(".react-flow");
  const viewportElement = document.querySelector<HTMLElement>(
    ".react-flow__viewport"
  );

  if (!reactFlowWrapper || !viewportElement) {
    throw new Error("ReactFlow viewport not found");
  }

  const originalViewport = reactFlowInstance.getViewport();

  try {
    reactFlowInstance.fitView({
      padding: 0.15,
      duration: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 150));

    const containerRect = reactFlowWrapper.getBoundingClientRect();
    const captureWidth = Math.round(containerRect.width);
    const captureHeight = Math.round(containerRect.height);

    const canvas = await toCanvasHtml2Image(viewportElement, {
      backgroundColor,
      cacheBust: true,
      pixelRatio,
      width: captureWidth,
      height: captureHeight,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;

        for (const selector of stripBgSelectors) {
          if (node.matches(selector)) {
            return false;
          }
        }
        return true;
      },
    });

    const imageData = canvas.toDataURL("image/png", 1);
    const aspectRatio = canvas.width / canvas.height;

    let pageOrientation: TOrientation = orientation;

    if (autoRotateForWidth) {
      const calculateBestWidth = (width: number, height: number): number => {
        const innerWidth = Math.max(0, width - pagePaddingMm * 2);
        const innerHeight = Math.max(0, height - pagePaddingMm * 2);

        let drawWidth = innerWidth;
        let drawHeight = drawWidth / aspectRatio;

        if (drawHeight > innerHeight) {
          drawHeight = innerHeight;
          drawWidth = drawHeight * aspectRatio;
        }

        return drawWidth;
      };

      const landscapeWidth = calculateBestWidth(297, 210);
      const portraitWidth = calculateBestWidth(210, 297);

      pageOrientation =
        landscapeWidth > portraitWidth ? "landscape" : "portrait";
    }

    const pdfWidth = pageOrientation === "portrait" ? 210 : 297;
    const pdfHeight = pageOrientation === "portrait" ? 297 : 210;
    const innerWidth = Math.max(0, pdfWidth - pagePaddingMm * 2);
    const innerHeight = Math.max(0, pdfHeight - pagePaddingMm * 2);

    let drawWidth = innerWidth;
    let drawHeight = drawWidth / aspectRatio;

    if (drawHeight > innerHeight) {
      drawHeight = innerHeight;
      drawWidth = drawHeight * aspectRatio;
    }

    const xPosition = (pdfWidth - drawWidth) / 2;
    const yPosition = (pdfHeight - drawHeight) / 2;

    const pdf = new jsPDF({
      orientation: pageOrientation,
      unit: "mm",
      format: "a4",
      compress: true,
    });

    pdf.addImage(
      imageData,
      "JPEG",
      xPosition,
      yPosition,
      drawWidth,
      drawHeight,
      undefined,
      "FAST"
    );

    pdf.save(fileName);
  } finally {
    reactFlowInstance.setViewport(originalViewport, { duration: 0 });
  }
}
