"use client";

import React from "react";

import ProjectCreationTabs from "@/components/builder/project-creation-tabs/project-creation-tabs";

export default function CreateNewProjectPage() {
  return (
    <div>
      <h2 className="pb-6 text-2xl font-bold text-slate-900">
        Create a New Project
      </h2>
      <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 md:p-5 lg:p-8">
        <ProjectCreationTabs />
      </div>
    </div>
  );
}
