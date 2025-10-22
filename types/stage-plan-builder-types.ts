import { TMeasurement } from "@/components/builder/dimension-line/dimension-line";
import { TStageNodeBuilder } from "@/components/builder/stage-node-builder/stage-node-builder";

export type TStagePlanConfig = {
  nodes: TStageNodeBuilder[];
  measurements: TMeasurement[];
  version?: number;
};
