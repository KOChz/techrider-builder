"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface IDownloadPdfButtonProps {
  projectName: string;
}

export function DownloadPdfButton({ projectName }: IDownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = () => {
    setIsGenerating(true);

    // Set document title for the PDF filename
    const originalTitle = document.title;
    document.title = `${projectName}-Tech-Rider`;

    // Small delay to ensure state update renders
    setTimeout(() => {
      window.print();

      // Restore original title
      document.title = originalTitle;
      setIsGenerating(false);
    }, 100);
  };

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className="download-pdf-button group relative inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Download page as PDF"
    >
      <Download className="h-3 w-3" aria-hidden="true" />
      <span>{isGenerating ? "Preparing..." : "Download PDF"}</span>
    </button>
  );
}
