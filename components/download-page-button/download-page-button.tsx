"use client";

import { useState } from "react";
import { toCanvas } from "html-to-image";
import toast from "react-hot-toast";

type Props = {
  firstElementId?: string; // "tech-rider-section"
  secondElementId?: string; // "stage-plan-section"
  fileName?: string;
  backgroundColor?: string;
  spacingPx?: number;
  pixelRatio?: number;
  className?: string;
  onBeforeStart?: () => void;
  onAfterFinish?: () => void;
};

export function DownloadPageButton({
  firstElementId = "tech-rider",
  secondElementId = "stage-plan",
  fileName = "tech-rider-full.png",
  backgroundColor = "#ffffff",
  spacingPx = 32,
  pixelRatio = 2,
  className,
  onBeforeStart,
  onAfterFinish,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    const firstEl = document.getElementById(firstElementId);
    console.log("🚀 ~ handleDownload ~ firstEl:", firstEl);
    const bottomEl = document.getElementById(secondElementId);
    console.log("🚀 ~ handleDownload ~ bottomEl:", bottomEl);
    if (!firstEl || !bottomEl) return;

    setBusy(true);
    onBeforeStart?.();

    try {
      // Ensure fonts/images are ready to avoid a tainted canvas
      if ("fonts" in document) await (document as any).fonts.ready;

      // Render both regions
      const [topCanvas, bottomCanvas] = await Promise.all([
        toCanvas(firstEl, { backgroundColor, pixelRatio, cacheBust: true }),
        toCanvas(bottomEl, { backgroundColor, pixelRatio, cacheBust: true }),
      ]);

      // Normalize width, keep aspect ratios
      const targetWidth = Math.max(topCanvas.width, bottomCanvas.width);
      const sTop = targetWidth / topCanvas.width;
      const sBottom = targetWidth / bottomCanvas.width;

      const topH = Math.round(topCanvas.height * sTop);
      const bottomH = Math.round(bottomCanvas.height * sBottom);
      const gap = Math.round(spacingPx * pixelRatio);
      const totalH = topH + gap + bottomH;

      const composite = document.createElement("canvas");
      composite.width = targetWidth;
      composite.height = totalH;

      const ctx = composite.getContext("2d")!;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetWidth, totalH);

      // Draw top
      ctx.drawImage(
        topCanvas,
        0,
        0,
        topCanvas.width,
        topCanvas.height,
        0,
        0,
        targetWidth,
        topH
      );

      // Draw bottom
      ctx.drawImage(
        bottomCanvas,
        0,
        0,
        bottomCanvas.width,
        bottomCanvas.height,
        0,
        topH + gap,
        targetWidth,
        bottomH
      );

      // Export and download (single gesture; iOS-safe)
      composite.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = fileName;
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Image generated!");
      }, "image/png");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate image");
    } finally {
      onAfterFinish?.();
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className={
        className ||
        "relative cursor-pointer md:text-sm text-xs font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      }
      aria-label="Download stitched PNG"
      aria-busy={busy}
    >
      Download
    </button>
  );
}
