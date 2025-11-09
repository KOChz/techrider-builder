"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCreateProject } from "@/hooks/use-create-project";

import { BandInfoContent } from "@/components/builder/builder-tabs-content/band-info-content/band-info-content";
import { EquipmentSetupContent } from "@/components/builder/builder-tabs-content/equipment-setup-content/equipment-setup-content";
import { StagePlanBuilderContent } from "@/components/builder/builder-tabs-content/stage-plan-builder-content";
import { SettingsContent } from "@/components/builder/builder-tabs-content/settings-content/settings-content";
import {
  IStagePlanFlowConfig,
  useProjectStore,
} from "@/stores/use-project-creation-store";
import { TProjectWithRelations } from "@/app/actions/get-my-projects/get-my-projects";
import { TInstrumentSectionBuilder } from "@/components/builder/instrument-section-card-builder/instrument-section-card-builder";
import { useEditProject } from "@/hooks/use-edit-project";
import {
  CREATE_PROJECT_TABS,
  TTabId,
} from "@/components/builder/project-creation-tabs/project-creation-tabs";
import { IoAuxSetupContent } from "@/components/builder/builder-tabs-content/io-aux-setup-content/io-aux-setup-content";
import { ClientDndProvider } from "@/lib/client-dnd-provider";

export default function EditProjectTabs({
  project,
}: {
  project: TProjectWithRelations;
}) {
  const [activeTab, setActiveTab] = useState<TTabId>("band-info");
  const { isEditing, error, editProject } = useEditProject({
    project,
  });

  const initializeWithProject = useProjectStore(
    (state) => state.initializeWithProject
  );

  const renderContent = () => {
    switch (activeTab) {
      case "band-info":
        return <BandInfoContent />;
      case "equipment-setup":
        return (
          <ClientDndProvider>
            <EquipmentSetupContent />
          </ClientDndProvider>
        );
      case "io-aux-setup":
        return <IoAuxSetupContent />;
      case "stage-plan":
        return <StagePlanBuilderContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return null;
    }
  };

  useEffect(() => {
    initializeWithProject({
      name: project.name,
      contactInfo: project.contactInfo || "",
      notes: project.notes ?? "",
      isPublic: project.isPublic,
      stagePlanConfig: project.stagePlanConfig as IStagePlanFlowConfig,
      ioSetupConfig: project.ioSetupConfig,
      members: project.members as TInstrumentSectionBuilder[],
    });

    return () => {
      useProjectStore.getState().resetForm();
    };
  }, [project.id]);

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
        className="pt-4"
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
          onClick={editProject}
          disabled={isEditing}
          className="cursor-pointer rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEditing ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
