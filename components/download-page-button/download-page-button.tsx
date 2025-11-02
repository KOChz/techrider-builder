"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import { useIsIOS } from "@/hooks/use-is-ios";

interface IDownloadPageButtonProps {
  /**
   * The ID of the element to capture. Defaults to 'page-content'
   */
  targetElementId?: string;
  /**
   * Filename for the downloaded image. Defaults to 'tech-rider-page.png'
   */
  fileName?: string;
  /**
   * Background color for the captured image. Defaults to 'white'
   */
  backgroundColor?: string;
  /**
   * Optional CSS classes for styling
   */
  className?: string;

  onClick?: () => void;
}

/**
 * Client component that captures and downloads a full page screenshot
 * Uses html-to-image library to convert DOM elements to PNG
 */
export function DownloadPageButton({
  targetElementId = "page-content",
  fileName = "tech-rider-page.png",
  backgroundColor = "white",
  className,
  onClick,
}: IDownloadPageButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const isIOSDevice = useIsIOS();

  const handleDownload = async () => {
    onClick?.();

    setTimeout(async () => {
      const element = document.getElementById(targetElementId);

      if (!element) {
        console.error(`Element with ID "${targetElementId}" not found`);
        return;
      }

      setIsDownloading(true);

      try {
        const dataUrl = await toPng(element, {
          backgroundColor,
          pixelRatio: 2,
          cacheBust: true,
          quality: 1,
        });

        if (isIOSDevice) {
          fetch(dataUrl)
            .then((res) => res.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = fileName;
              anchor.target = "_blank";
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
              URL.revokeObjectURL(url);
              toast.success("Image opened - tap and hold to save");
            })
            .catch(() => {
              toast.error("Failed to open image");
            });
        } else {
          const link = document.createElement("a");
          link.download = fileName;
          link.href = dataUrl;
          link.click();

          toast.success("Image generated!");
        }
      } catch (error) {
        console.error("Failed to download page:", error);
      } finally {
        setIsDownloading(false);
      }
    }, 500);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={
        className ||
        "relative cursor-pointer md:text-sm text-xs font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      }
      aria-label="Download page as image"
      aria-busy={isDownloading}
    >
      Download
    </button>
  );
}
