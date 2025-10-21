"use client";

import Link from "next/link";
import { FolderIcon } from "lucide-react";
import { ProjectCardActions } from "./project-card-actions";

interface IProjectCardProps {
  href: string;
  title: string;
  description: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({
  href,
  title,
  description,
  onEdit,
  onDelete,
}: IProjectCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-200 hover:border-green-500 hover:shadow-sm hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-green-50 p-2 text-green-700 transition-colors group-hover:bg-green-100">
          <FolderIcon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-green-700">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {(onEdit || onDelete) && (
          <ProjectCardActions onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
    </Link>
  );
}
