"use client";

import { useProjectStore } from "@/stores/use-project-creation-store";

export function SettingsContent() {
  const { name, isPublic, setName, setIsPublic } = useProjectStore();

  return (
    <div className="min-h-[360px] space-y-2">
      <h3 className="text-2xl font-semibold text-slate-900">
        Project Settings
      </h3>
      <div className="space-y-3">
        {/* <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-name"
            className="text-sm font-medium text-slate-800"
          >
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div> */}

        <div className="flex items-center justify-between">
          <label
            htmlFor="project-public"
            className="text-sm font-medium text-slate-800"
          >
            Make project public
          </label>
          <input
            id="project-public"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
