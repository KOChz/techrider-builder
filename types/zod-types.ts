import { zStageNodeType } from "@/components/builder/equipment-select/equipment-select";
import { z } from "zod";

export const zStageNode = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  label: z.string(),
  type: zStageNodeType,
  angle: z.number(),
  scale: z.number(),
});

export const measurement = z.object({
  id: z.number().int(),
  startNodeId: z.string(),
  endNodeId: z.string(),
  customDistance: z.string().optional(),
});

export const stagePlanConfigSchema = z.object({
  nodes: z.array(zStageNode),
  measurements: z.array(measurement),
  version: z.number().int().optional(),
});
