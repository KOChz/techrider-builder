"use client";

import { Pencil, Trash2 } from "lucide-react";

interface IProjectCardActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCardActions({
  onEdit,
  onDelete,
}: IProjectCardActionsProps) {
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

  return (
    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
    </div>
  );
}
