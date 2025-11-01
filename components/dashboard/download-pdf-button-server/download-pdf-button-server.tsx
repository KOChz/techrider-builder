"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface IDownloadPdfButtonServerProps {
  projectSlug: string;
}

export function DownloadPdfButtonServer({
  projectSlug,
}: IDownloadPdfButtonServerProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
  };

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className="download-pdf-button group relative inline-flex cursor-pointer items-center justify-between rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Download page as PDF"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span>{isGenerating ? "Generating..." : "Download PDF"}</span>
    </button>
  );
}
