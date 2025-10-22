import { z } from "zod";

export const zStageNodeType = z.enum([
  "drumkit",
  "amp",
  "monitor",
  "mic-stand",
  "power-extension",
  "di-box",
  "text",
]);

export type TStageNodeType = z.infer<typeof zStageNodeType>;
export const STAGE_NODE_TYPES = zStageNodeType.options;

export const zStageNode = z.object({
  id: z.string().min(1), // your ids are UUID strings in logs
  x: z.number(),
  y: z.number(),
  label: z.string(),
  type: zStageNodeType, // ✅ actual Zod schema
  angle: z.number(),
  scale: z.number(),
});

export const measurement = z.object({
  id: z.number().int(),
  startNodeId: z.string().min(1),
  endNodeId: z.string().min(1),
  customDistance: z.string().optional(),
});

export const stagePlanConfigSchema = z.object({
  nodes: z.array(zStageNode),
  measurements: z.array(measurement),
  version: z.number().int().optional(),
});

export type TStagePlanConfig = z.infer<typeof stagePlanConfigSchema>;
