"use client";

import { useState } from "react";

import { StagePlanContent } from "../builder-tabs-content/stage-plan-content";
import { SettingsContent } from "../builder-tabs-content/settings-content/settings-content";
import { MembersContent } from "../builder-tabs-content/members-content/members-content";
import { BandInfoContent } from "../builder-tabs-content/dand-info-content/band-info-content";

type TTabId = "band-info" | "members" | "stage-plan" | "settings";

interface ITab {
  id: TTabId;
  label: string;
}

const TABS: ITab[] = [
  { id: "band-info", label: "Band Info" },
  { id: "members", label: "Members" },
  { id: "stage-plan", label: "Stage Plan" },
  { id: "settings", label: "Project Settings" },
];

export default function ProjectCreationTabs() {
  const [activeTab, setActiveTab] = useState<TTabId>("band-info");

  const renderContent = () => {
    switch (activeTab) {
      case "band-info":
        return <BandInfoContent />;
      case "members":
        return <MembersContent />;
      case "stage-plan":
        return <StagePlanContent />;
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
          className="flex space-x-1 cursor-pointer"
          role="tablist"
          aria-label="Project tabs"
        >
          {TABS.map((tab) => {
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
                  px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer
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
        className="py-6"
      >
        {renderContent()}
      </div>
    </div>
  );
}
