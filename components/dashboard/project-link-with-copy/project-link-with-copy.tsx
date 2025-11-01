"use client";

import { useState } from "react";
import { View, Copy, Check } from "lucide-react";
import { slugify } from "@/lib/utils/slugify";
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
    }
  };

  return (
    <div className="flex overflow-hidden rounded-md bg-green-600/90 transition-all duration-200 hover:drop-shadow-lg">
      <a
        href={projectUrl}
        className="flex flex-row items-center gap-2 px-3 py-2 text-white transition-colors hover:bg-green-700/90"
      >
        <View size={24} strokeWidth={1.2} />
        View Project
      </a>

      <button
        onClick={handleCopy}
        className="flex items-center border-l border-green-500/30 px-3 py-2 text-sm text-white transition-all hover:bg-green-700/90"
        aria-label={isCopied ? "URL copied" : "Copy project URL"}
      >
        {isCopied ? (
          <Check
            size={18}
            strokeWidth={2}
            className="animate-in zoom-in-50 duration-200"
          />
        ) : (
          <Copy size={18} strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
