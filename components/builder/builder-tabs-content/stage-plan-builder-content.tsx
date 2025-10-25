"use client";

import { useProjectStore } from "@/stores/use-project-creation-store";
import StagePlanBuilder from "../stage-plan-builder/stage-plan-builder";
import { TStagePlanConfig } from "@/schemas/stage-plan";
import StagePlanCanvas from "../stage-builder-flow/stage-builder-flow";
import { ReactFlowProvider } from "@xyflow/react";

export function StagePlanBuilderContent() {
  // const { stagePlanConfig, setStagePlanConfig } = useProjectStore();

  // const handleConfigChange = (config: TStagePlanConfig) => {
  //   setStagePlanConfig(config);
  // };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Stage Plan</h3>
      <p className="text-sm text-gray-600">
        Create your stage setup and positioning
      </p>

      <div className="select-none overscroll-none">
        <ReactFlowProvider>
          <StagePlanCanvas />
        </ReactFlowProvider>
        {/* <StagePlanBuilder
          config={stagePlanConfig}
          onConfigChange={handleConfigChange}
        /> */}
      </div>
    </div>
  );
}
