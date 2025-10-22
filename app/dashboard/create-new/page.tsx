import ProjectCreationTabs from "@/components/builder/project-creation-tabs/project-creation-tabs";
import Link from "next/link";
import React from "react";

export default function CreateNewProjectPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Create a New Project
      </h2>
      <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-8">
        <ProjectCreationTabs />
      </div>
    </div>
  );
}
