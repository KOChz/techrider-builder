"use client";

import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";

import { FolderIcon, Pencil, Trash2 } from "lucide-react";
import { ProjectCardActions } from "./project-card-actions";
import { useRouter } from "next/navigation";
import { TProjectWithRelations } from "@/app/actions/get-my-projects/get-my-projects";
import { slugify } from "@/lib/utils/slugify";
import { deleteProject } from "@/app/actions/delete-project/delete-project";

interface IProjectCardProps {
  onDelete?: () => void;
  project: TProjectWithRelations;
}

export function ProjectCard({ project }: IProjectCardProps) {
  const router = useRouter();

  async function onDelete() {
    try {
      const res = await deleteProject({
        projectId: project.id,
        revalidate: { path: "/dashboard/my-projects" },
      });

      res.deletedProjectId && toast.success("Project successfully deleted!");
    } catch (error) {
      toast.error("Error while deleting project...");
      console.log("Error in onDelete:", error);
    }
  }

  // helper to stop the <Link> navigation when clicking mobile buttons
  const intercept =
    (cb: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      cb();
    };

  return (
    <Link
      href={`/techrider/${slugify(project.name)}`}
      className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-green-500 hover:bg-slate-50 hover:shadow-sm md:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-row gap-1">
          <div className="rounded-lg bg-green-50 p-2 text-green-700 transition-colors group-hover:bg-green-100">
            <FolderIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-green-700">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Mobile: always-visible inline actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            aria-label="Edit project"
            onClick={intercept(() =>
              router.push(`/dashboard/edit-project/${project.id}`)
            )}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[.98]"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            aria-label="Delete project"
            onClick={intercept(onDelete)}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 active:scale-[.98]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>

        {/* Desktop/Tablet: keep your existing hover/ellipsis actions */}
        <div className="hidden sm:block">
          <ProjectCardActions
            onEdit={() => router.push(`/dashboard/edit-project/${project.id}`)}
            onDelete={onDelete}
            projectSlug={slugify(project.name)}
          />
        </div>
      </div>
    </Link>
  );
}
