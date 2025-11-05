"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import {
  projects,
  projectMembers,
  type TProject,
  type TProjectMember,
} from "@/db/schema";
import { stagePlanConfigSchema } from "@/types/zod-types";
import { slugify } from "@/lib/utils/slugify";

const equipmentExampleSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

const equipmentItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().optional(),
  examples: equipmentExampleSchema.optional(),
});

const memberInputSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  icon: z.string().optional(),
  equipment: z.array(equipmentItemSchema).default([]),
  sortOrder: z.number().optional(),
});

const inputSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).optional(),
  notes: z.string().optional(),
  contactInfo: z.string().optional(),
  isPublic: z.boolean().optional(),
  stagePlanConfig: stagePlanConfigSchema.optional(),
  members: z.array(memberInputSchema).optional(),
  revalidate: z
    .object({ path: z.string().optional(), tag: z.string().optional() })
    .optional(),
});

export type TEditProjectByIdInput = z.infer<typeof inputSchema>;
export type TEditProjectByIdResult = {
  project: TProject & { members: TProjectMember[] };
};

/**
 * Updates an existing project by ID with optional fields and members.
 * Only the project owner can perform this action.
 * If members array is provided, it completely replaces existing members.
 *
 * @returns {Promise<TEditProjectByIdResult>} Updated project with full member list and owner data
 * @throws {Error} If auth fails, user unauthorized, or project not found/not owned by user
 */
export async function editProjectById(
  raw: TEditProjectByIdInput
): Promise<TEditProjectByIdResult> {
  const input = inputSchema.parse(raw);

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error(`Auth lookup failed: ${error.message}`);
  if (!user) throw new Error("Unauthorized");

  const existingProject = await db.query.projects.findFirst({
    where(f, { eq }) {
      return eq(f.id, input.projectId);
    },
  });

  if (!existingProject) throw new Error("Project not found");
  if (existingProject.ownerId !== user.id)
    throw new Error("Unauthorized: You don't own this project");

  const updatedProject = await db.transaction(async (tx) => {
    const updateData: Partial<typeof projects.$inferInsert> = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = await slugify(input.name);
    }
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.contactInfo !== undefined)
      updateData.contactInfo = input.contactInfo;
    if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;
    if (input.stagePlanConfig !== undefined)
      updateData.stagePlanConfig = input.stagePlanConfig as any;

    console.log("input.stagePlanConfig", input.stagePlanConfig?.nodes);
    updateData.updatedAt = new Date();

    let proj: TProject;

    if (Object.keys(updateData).length > 0) {
      const [updated] = await tx
        .update(projects)
        .set(updateData)
        .where(eq(projects.id, input.projectId))
        .returning();

      if (!updated) throw new Error("Update failed: project not returned");
      proj = updated;
    } else {
      proj = existingProject;
    }

    if (input.members !== undefined) {
      await tx
        .delete(projectMembers)
        .where(eq(projectMembers.projectId, input.projectId));

      if (input.members.length > 0) {
        await tx.insert(projectMembers).values(
          input.members.map((m, index) => ({
            projectId: proj.id,
            name: m.name,
            role: m.role ?? null,
            icon: m.icon ?? null,
            equipment: m.equipment ?? [],
            sortOrder: m.sortOrder ?? index,
          }))
        );
      }
    }

    return proj;
  });

  const fullProject = await db.query.projects.findFirst({
    where(f, { eq }) {
      return eq(f.id, updatedProject.id);
    },
    with: {
      members: {
        orderBy(f, { asc }) {
          return [asc(f.sortOrder), asc(f.createdAt)];
        },
      },
      owner: true,
    },
  });

  if (!fullProject) throw new Error("Post-update fetch failed");

  if (input.revalidate?.path) revalidatePath(input.revalidate.path, "page");
  if (input.revalidate?.tag) revalidateTag(input.revalidate.tag);

  return {
    project: {
      ...fullProject,
      members: fullProject.members ?? [],
    },
  };
}
