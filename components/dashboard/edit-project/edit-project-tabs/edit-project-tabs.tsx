"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCreateProject } from "@/hooks/use-create-project";

import { BandInfoContent } from "@/components/builder/builder-tabs-content/dand-info-content/band-info-content";
import { MembersContent } from "@/components/builder/builder-tabs-content/members-content/members-content";
import { StagePlanBuilderContent } from "@/components/builder/builder-tabs-content/stage-plan-builder-content";
import { SettingsContent } from "@/components/builder/builder-tabs-content/settings-content/settings-content";
import {
  IStagePlanFlowConfig,
  useProjectStore,
} from "@/stores/use-project-creation-store";
import { TProjectWithRelations } from "@/app/actions/get-my-projects/get-my-projects";
import { TStagePlanConfig } from "@/schemas/stage-plan-schema";
import { TBandMemberBuilder } from "@/components/builder/member-card-builder/member-card-builder";
import { useEditProject } from "@/hooks/use-edit-project";
import { CREATE_PROJECT_TABS } from "@/components/builder/project-creation-tabs/project-creation-tabs";

type TTabId = "band-info" | "members" | "stage-plan" | "settings";

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
      case "members":
        return <MembersContent />;
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
      notes: project.notes ?? "",
      isPublic: project.isPublic,
      stagePlanConfig: project.stagePlanConfig as IStagePlanFlowConfig,
      members: project.members as TBandMemberBuilder[],
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
        className="py-6"
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
          className="hover:bg-red-700/15 inline-block w-auto cursor-pointer rounded-lg border border-red-700/50 px-12 py-2 transition-all duration-200"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={editProject}
          disabled={isEditing}
          className="cursor-pointer rounded-md bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEditing ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
