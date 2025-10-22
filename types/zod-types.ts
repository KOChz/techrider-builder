import { measurement, zStageNode, zStageNodeType } from "@/schemas/stage-plan";
import { z } from "zod";

export const stagePlanConfigSchema = z.object({
  nodes: z.array(zStageNode),
  measurements: z.array(measurement),
  version: z.number().int().optional(),
});

export type TStagePlanConfig = z.infer<typeof stagePlanConfigSchema>;
