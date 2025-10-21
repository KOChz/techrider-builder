"use client";

import StagePlan from "@/components/stage-plan/stage-plan";
import { useState } from "react";

type TTabId = "band-info" | "members" | "equipment" | "stage-plan" | "settings";

interface ITab {
  id: TTabId;
  label: string;
}

const TABS: ITab[] = [
  { id: "band-info", label: "Band Info" },
  { id: "members", label: "Members" },
  { id: "equipment", label: "Equipment" },
  { id: "stage-plan", label: "Stage Plan" },
  { id: "settings", label: "Settings" },
];

function BandInfoContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Band Information</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-slate-900 font-medium mb-1">
            Band Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border placeholder-slate-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter band name"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-900 font-medium mb-1">
            Genre
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border placeholder-slate-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter genre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Description
          </label>
          <textarea
            className="w-full placeholder-slate-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tell us about your band"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

function MembersContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Band Members</h3>
      <p className="text-sm text-gray-600">Add and manage your band members</p>
      <button className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        + Add Member
      </button>
    </div>
  );
}

function EquipmentContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Equipment</h3>
      <p className="text-sm text-gray-600">
        List your band's equipment and technical requirements
      </p>
      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        + Add Equipment
      </button>
    </div>
  );
}

function StagePlanContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Stage Plan</h3>
      <p className="text-sm text-gray-600">
        Create your stage setup and positioning
      </p>
      {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"> */}
      <StagePlan />
      {/* </div> */}
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Project Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-800">
            Make project public
          </label>
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-800">
            Allow collaboration
          </label>
          <input type="checkbox" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectCreationTabs() {
  const [activeTab, setActiveTab] = useState<TTabId>("band-info");

  const renderContent = () => {
    switch (activeTab) {
      case "band-info":
        return <BandInfoContent />;
      case "members":
        return <MembersContent />;
      case "equipment":
        return <EquipmentContent />;
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
