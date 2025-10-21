import ProjectCreationTabs from "@/components/builder/builder-tabs/builder-tabs";
import React from "react";

export default function CreateNewProjectPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Create a New Project
      </h2>
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <ProjectCreationTabs />
      </div>
    </>
  );
}
