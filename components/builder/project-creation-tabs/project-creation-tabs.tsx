"use client";

import { useState } from "react";

import { StagePlanBuilderContent } from "../builder-tabs-content/stage-plan-builder-content";
import { SettingsContent } from "../builder-tabs-content/settings-content/settings-content";
import { EquipmentSetupContent } from "../builder-tabs-content/equipment-setup-content/equipment-setup-content";
import { BandInfoContent } from "../builder-tabs-content/band-info-content/band-info-content";
import { useCreateProject } from "@/hooks/use-create-project";
import Link from "next/link";

export type TTabId =
  | "band-info"
  | "equipment-setup"
  | "stage-plan"
  | "settings";

interface ITab {
  id: TTabId;
  label: string;
}

export const CREATE_PROJECT_TABS: ITab[] = [
  { id: "band-info", label: "Band Info" },
  { id: "equipment-setup", label: "Equipment Setup" },
  { id: "stage-plan", label: "Stage Plan" },
  { id: "settings", label: "Project Settings" },
];

export default function ProjectCreationTabs() {
  const [activeTab, setActiveTab] = useState<TTabId>("band-info");
  const { isCreating, error, createProject } = useCreateProject();

  const renderContent = () => {
    switch (activeTab) {
      case "band-info":
        return <BandInfoContent />;
      case "equipment-setup":
        return <EquipmentSetupContent />;
      case "stage-plan":
        return <StagePlanBuilderContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <div
          className="flex cursor-pointer space-x-1"
          role="tablist"
          aria-label="Project tabs"
        >
          {CREATE_PROJECT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 text-xs py-3 md:text-sm font-medium border-b-2 transition-colors cursor-pointer
                  ${
                    isActive
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="py-6 pb-0"
      >
        {renderContent()}
      </div>

      {error && (
        <div
          className="mt-4 rounded-md border border-red-200 bg-red-50 p-4"
          role="alert"
        >
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-6 flex justify-between gap-3">
        <Link
          href="/dashboard/my-projects"
          className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={createProject}
          disabled={isCreating}
          className="cursor-pointer rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? "Creating..." : "Create Project"}
        </button>
      </div>
    </div>
  );
}
