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

        <ProjectCardActions
          onEdit={() => router.push(`/dashboard/edit-project/${project.id}`)}
          onDelete={onDelete}
          projectSlug={slugify(project.name)}
        />
      </div>
    </Link>
  );
}
