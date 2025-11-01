"use client";

import { ReactFlowProvider } from "@xyflow/react";

import { useProjectStore } from "@/stores/use-project-creation-store";
import StagePlanBuilder from "../stage-builder-flow/stage-builder-flow";

export function StagePlanBuilderContent() {
  const { stagePlanConfig, setStagePlanConfig } = useProjectStore();

  return (
    <div className="space-y-2">
      <h3 className="text-2xl font-semibold text-slate-900">Stage Plan</h3>
      <p className="pb-1 text-sm text-gray-600">
        Create your stage setup and positioning
      </p>

      <div className="select-none overscroll-none">
        <ReactFlowProvider>
          <StagePlanBuilder
            stagePlanConfig={stagePlanConfig}
            setStagePlanConfig={setStagePlanConfig}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
