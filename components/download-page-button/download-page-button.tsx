"use client";

import { exportStitchedPDF } from "@/lib/utils/export-to-pdf";
import { useState } from "react";

import toast from "react-hot-toast";

type TExportFormat = "png" | "pdf";

type TProps = {
  firstElementId?: string;
  secondElementId?: string;
  fileName?: string;
  backgroundColor?: string;
  spacingPx?: number;
  pixelRatio?: number;
  format?: TExportFormat;
  className?: string;
  onBeforeStart?: () => void;
  onAfterFinish?: () => void;
};

export function DownloadPageButton({
  firstElementId = "tech-rider",
  secondElementId = "stage-plan",
  fileName = "tech-rider",
  backgroundColor = "#ffffff",
  spacingPx = 32,
  pixelRatio,
  format = "pdf",
  className,
  onBeforeStart,
  onAfterFinish,
}: TProps) {
  const [isBusy, setIsBusy] = useState(false);

  const handleDownload = async () => {
    setIsBusy(true);
    onBeforeStart?.();

    try {
      const baseOptions = {
        firstElementId,
        secondElementId,
        fileName: `${fileName}.${format}`,
        backgroundColor,
        spacingPx,
        bottomPaddingPx: 160,
      };

      await exportStitchedPDF(baseOptions);

      toast.success(`${format.toUpperCase()} generated!`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to generate ${format.toUpperCase()}`);
    } finally {
      onAfterFinish?.();
      setIsBusy(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isBusy}
      className={
        className ||
        "relative cursor-pointer text-xs font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      }
      aria-label={`Download as ${format.toUpperCase()}`}
      aria-busy={isBusy}
    >
      {isBusy ? "Exporting..." : "Export"}
    </button>
  );
}
