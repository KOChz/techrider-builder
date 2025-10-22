import ProjectCreationTabs from "@/components/builder/builder-tabs/builder-tabs";
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

        <div className="flex w-full justify-between">
          <Link
            href="/dashboard/my-projects"
            className="hover:bg-red-700/15 inline-block w-auto cursor-pointer rounded-lg border border-red-700/50 px-12 py-2 transition-all duration-200"
          >
            Cancel
          </Link>

          <button className="hover:bg-green-700/15 w-auto cursor-pointer rounded-lg border border-green-700/50 px-12 py-2 transition-all duration-200">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
