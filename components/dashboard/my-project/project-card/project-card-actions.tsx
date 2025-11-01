"use client";

import { Copy, Pencil, Trash2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DownloadPdfButtonServer } from "../../download-pdf-button-server/download-pdf-button-server";

interface IProjectCardActionsProps {
  projectSlug: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCardActions({
  projectSlug,
  onEdit,
  onDelete,
}: IProjectCardActionsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/techrider/${projectSlug}`;

    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      toast.success("Tech Rider URL copied!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="flex items-center gap-1 transition-opacity duration-200 group-hover:opacity-100">
      <button
        onClick={handleCopyUrl}
        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-purple-50 hover:text-purple-600"
        aria-label={isCopied ? "URL copied" : "Copy project URL"}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      {onEdit && (
        <button
          onClick={handleEdit}
          className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-green-700"
          aria-label="Edit project"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {/* <DownloadPdfButtonServer projectSlug={projectSlug} /> */}
    </div>
  );
}
