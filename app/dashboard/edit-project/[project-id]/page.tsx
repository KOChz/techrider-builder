import React from "react";

import EditProjectTabs from "@/components/dashboard/edit-project/edit-project-tabs/edit-project-tabs";
import { getProjectById } from "@/app/actions/get-project-by-id/get-project-by-id";

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
    <div id="EditProjectPage">
      <div className="flex flex-col items-stretch gap-3 pb-4 md:flex-row md:items-center md:justify-between md:pb-6">
        <h2 className="text-shadow-2xs truncate text-2xl font-bold text-slate-900 md:text-3xl">
          Edit {project.name}
        </h2>

        <ProjectLinkWithCopy projectName={project.name} />
      </div>

      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3.5 md:p-5 lg:p-8">
        <EditProjectTabs project={project} />
      </div>
    </div>
  );
}
