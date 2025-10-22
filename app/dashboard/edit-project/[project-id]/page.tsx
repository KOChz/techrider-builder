"use client";

import ProjectCreationTabs from "@/components/builder/project-creation-tabs/project-creation-tabs";
import React from "react";

export default function EditProjectPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Edit headeachee Project
      </h2>
      <div className="bg-white rounded-lg flex flex-col border border-slate-200 p-8">
        <ProjectCreationTabs />

        <div className="w-full flex justify-between">
          <button className="border px-12 py-2 w-auto rounded-lg border-red-700/50 cursor-pointer hover:bg-red-700/15 duration-200 transition-all ">
            Delete Project
          </button>

          <button className="border px-12 py-2 w-auto rounded-lg border-green-700/50 cursor-pointer hover:bg-green-700/15 duration-200 transition-all ">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
