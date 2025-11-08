"use client";

import { useState } from "react";
import { View, Copy, Check } from "lucide-react";
import { slugify } from "transliteration";
import toast from "react-hot-toast";

interface IProjectLinkWithCopyProps {
  projectName: string;
}

export function ProjectLinkWithCopy({
  projectName,
}: IProjectLinkWithCopyProps) {
  const [isCopied, setIsCopied] = useState(false);

  const projectUrl = `/techrider/${slugify(projectName)}`;
  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${projectUrl}`
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setIsCopied(true);
      toast.success("Tech Rider URL copied!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="flex w-full shrink-0 overflow-hidden rounded-md bg-green-600/90 transition-all duration-200 hover:drop-shadow-lg md:w-auto">
      <a
        href={projectUrl}
        className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700/90 md:flex-initial md:px-3 md:text-base"
      >
        <View size={20} strokeWidth={1.5} className="shrink-0" />
        <span className="hidden sm:inline">View Project</span>
        <span className="sm:hidden">View</span>
      </a>

      <button
        onClick={handleCopy}
        className="flex shrink-0 items-center justify-center border-l border-green-500/30 px-3.5 py-2.5 text-white transition-all hover:bg-green-700/90 md:px-3"
        aria-label={isCopied ? "URL copied" : "Copy project URL"}
      >
        {isCopied ? (
          <Check
            size={20}
            strokeWidth={2}
            className="animate-in zoom-in-50 duration-200"
          />
        ) : (
          <Copy size={20} strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
