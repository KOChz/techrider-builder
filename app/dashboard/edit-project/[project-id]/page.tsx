import React from "react";

import EditProjectTabs from "@/components/dashboard/edit-project/edit-project-tabs/edit-project-tabs";
import { getProjectById } from "@/app/actions/get-project-by-id/get-project-by-id";

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
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Edit {project.name}
      </h2>
      <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-8">
        <EditProjectTabs project={project} />
      </div>
    </div>
  );
}
