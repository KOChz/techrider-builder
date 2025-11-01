import React from "react";

import EditProjectTabs from "@/components/dashboard/edit-project/edit-project-tabs/edit-project-tabs";
import { getProjectById } from "@/app/actions/get-project-by-id/get-project-by-id";
import { slugify } from "@/lib/utils/slugify";
import { View } from "lucide-react";
import { ProjectLinkWithCopy } from "@/components/dashboard/project-link-with-copy/project-link-with-copy";

interface IEditProjectPageProps {
  params: Promise<{
    "project-id": string;
  }>;
}

export default async function EditProjectPage({
  params,
}: IEditProjectPageProps) {
  const { "project-id": projectId } = await params;

  const { project } = await getProjectById({ projectId });

  return (
    <div>
      <div className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-shadow-2xs text-3xl font-bold text-slate-900">
          Edit {project.name}
        </h2>

        <ProjectLinkWithCopy projectName={project.name} />
      </div>
      <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 md:p-5 lg:p-8">
        <EditProjectTabs project={project} />
      </div>
    </div>
  );
}
