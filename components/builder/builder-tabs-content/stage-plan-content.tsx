"use client";

import { useProjectCreationStore } from "@/stores/use-project-creation-store";
import StagePlanBuilder from "../stage-plan-builder/stage-plan-builder";
import { TStagePlanConfig } from "@/types/stage-plan-builder";

export function StagePlanContent() {
  const { stagePlanConfig, setStagePlanConfig } = useProjectCreationStore();

  const handleConfigChange = (config: TStagePlanConfig) => {
    setStagePlanConfig(config);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Stage Plan</h3>
      <p className="text-sm text-gray-600">
        Create your stage setup and positioning
      </p>
      <StagePlanBuilder value={stagePlanConfig} onChange={handleConfigChange} />
    </div>
  );
}
