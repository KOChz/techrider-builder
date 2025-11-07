"use client";

import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";

import { FolderIcon } from "lucide-react";
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

  return (
    <Link
      id="ProjectCard"
      href={`/techrider/${slugify(project.name)}`}
      className="group relative w-full rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-green-500 hover:bg-slate-50 hover:shadow-sm md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex-shrink-0 rounded-lg bg-green-50 p-2 text-green-700 transition-colors group-hover:bg-green-100">
            <FolderIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-slate-900 transition-colors group-hover:text-green-700 sm:text-xl md:text-2xl">
              {project.name}
            </h3>
          </div>
        </div>

        <div className="flex-shrink-0">
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
