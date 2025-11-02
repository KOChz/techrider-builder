"use client";

import { useState } from "react";
import { toCanvas } from "html-to-image";
import toast from "react-hot-toast";

type Props = {
  firstElementId?: string;
  secondElementId?: string;
  fileName?: string; // e.g. "tech-rider-full.png" or ".webp"
  backgroundColor?: string;
  spacingPx?: number; // visual gap in CSS px (not device px)
  pixelRatio?: number; // override; defaults to clamped DPR
  className?: string;
  onBeforeStart?: () => void;
  onAfterFinish?: () => void;
};

export function DownloadPageButton({
  firstElementId = "tech-rider",
  secondElementId = "stage-plan",
  fileName = "tech-rider.png",
  backgroundColor = "#ffffff",
  spacingPx = 32,
  pixelRatio,
  className,
  onBeforeStart,
  onAfterFinish,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    const topEl = document.getElementById(firstElementId);
    const bottomEl = document.getElementById(secondElementId);
    if (!topEl || !bottomEl) return;

    setBusy(true);
    onBeforeStart?.();

    try {
      // Ensure webfonts are fully laid out to avoid blurry text
      if ("fonts" in document) await (document as any).fonts.ready;

      // Use device DPR for maximum fidelity, but clamp to avoid OOM on iOS
      const DPR = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
      const pxr = pixelRatio ?? DPR;

      // Render both elements at the same pixelRatio, no width overrides
      const [topCanvas, bottomCanvas] = await Promise.all([
        toCanvas(topEl, { backgroundColor, pixelRatio: pxr, cacheBust: true }),
        toCanvas(bottomEl, {
          backgroundColor,
          pixelRatio: pxr,
          cacheBust: true,
        }),
      ]);

      // ----- NO normalization scaling here -----
      // Keep native render sizes to avoid interpolation blur.
      const gap = Math.round(spacingPx * pxr);

      const compositeWidth = Math.max(topCanvas.width, bottomCanvas.width);
      const compositeHeight = topCanvas.height + gap + bottomCanvas.height;

      // Prefer OffscreenCanvas if available (better perf on Safari/iOS)
      const composite =
        typeof (window as any).OffscreenCanvas === "function"
          ? new (window as any).OffscreenCanvas(compositeWidth, compositeHeight)
          : Object.assign(document.createElement("canvas"), {
              width: compositeWidth,
              height: compositeHeight,
            });

      const ctx =
        "getContext" in composite
          ? (composite as HTMLCanvasElement).getContext("2d")!
          : (composite as OffscreenCanvas).getContext("2d")!;

      // Fill background once to avoid seams
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, compositeWidth, compositeHeight);

      // High-quality resampling if Safari decides to scale anything
      // (we’re drawing 1:1, but this is cheap insurance)
      (ctx as any).imageSmoothingEnabled = true;
      (ctx as any).imageSmoothingQuality = "high";

      // Draw top left-aligned at native size
      ctx.drawImage(topCanvas, 0, 0);

      // Draw bottom immediately after the gap
      ctx.drawImage(bottomCanvas, 0, topCanvas.height + gap);

      // Export – PNG is lossless (quality param is ignored for PNG).
      const mime = fileName.toLowerCase().endsWith(".webp")
        ? "image/webp"
        : "image/png";

      const finalize = async (blob: Blob | null) => {
        if (!blob) throw new Error("Blob generation failed");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        // Note: iOS Safari ignores `download`; it opens a viewer. That’s expected.
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Image generated!");
      };

      if ("convertToBlob" in composite) {
        // OffscreenCanvas path
        const blob = await (composite as OffscreenCanvas).convertToBlob({
          type: mime,
          quality: mime === "image/webp" ? 1 : undefined,
        });
        await finalize(blob);
      } else {
        // HTMLCanvasElement path
        (composite as HTMLCanvasElement).toBlob(
          finalize,
          mime,
          mime === "image/webp" ? 1 : undefined
        );
      }
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
      aria-label="Download stitched image"
      aria-busy={busy}
    >
      Download
    </button>
  );
}
