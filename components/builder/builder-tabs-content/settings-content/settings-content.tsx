"use client";

import { useState } from "react";

interface IProjectSettings {
  name: string;
  isPublic: boolean;
}

export function SettingsContent() {
  const [settings, setSettings] = useState<IProjectSettings>({
    name: "",
    isPublic: false,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePublicToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, isPublic: e.target.checked }));
  };

  return (
    <div className="space-y-4 min-h-64">
      <h3 className="text-2xl font-semibold text-slate-900">
        Project Settings
      </h3>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-name"
            className="text-sm font-medium text-slate-800"
          >
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={settings.name}
            onChange={handleNameChange}
            placeholder="Enter project name"
            className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-800">
            Make project public
          </label>
          <input type="checkbox" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
