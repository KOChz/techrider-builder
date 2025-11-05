import { z } from "zod";

const zBandMemberBuilder = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  imageUrl: z.string().url().optional(),
});

const xyFlowNodeSchema = z.object({
  id: z.string(),
  type: z
    .string()
    .nullish()
    .transform((val) => (val === null ? undefined : val))
    .optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    kind: z
      .string()
      .transform((val) => val.toLowerCase())
      .pipe(
        z.enum([
          "microphone",
          "instrument",
          "speaker",
          "monitor",
          "custom",
          "equipment",
          "drumkit",
          "power-extension",
          "di-box",
          "mic-stand",
          "amp",
          "synth-stand",
          "mic",
        ])
      ),
    rotation: z.number(),
    label: z.string(),
  }),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
});

export const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    type: z
      .string()
      .nullish()
      .transform((val) => val ?? undefined)
      .optional(),
    selected: z.boolean().optional(),
    data: z
      .object({
        customLabel: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export const stagePlanConfigSchema = z.object({
  nodes: z.array(xyFlowNodeSchema).default([]),
  edges: z.array(edgeSchema).default([]),
  version: z.number().optional(),
});

export const projectFormFlowSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  notes: z.string().optional().default(""),
  isPublic: z.boolean().default(false),
  stagePlanConfig: stagePlanConfigSchema,
  members: z.array(zBandMemberBuilder).default([]),
});

export type TStagePlanConfig = z.infer<typeof stagePlanConfigSchema>;
export type TProjectFormFlow = z.infer<typeof projectFormFlowSchema>;
