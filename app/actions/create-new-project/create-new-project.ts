"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServerClient } from "@supabase/ssr";

import { db } from "@/db"; // Drizzle instance
import {
  profiles,
  projects,
  projectMembers,
  type TProject,
  type TProjectMember,
} from "@/db/schema";
import { stagePlanConfigSchema } from "@/types/zod-types";
import { TSupabaseUserMetadata } from "@/types/user-types";

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
});

const inputSchema = z.object({
  name: z.string().min(1),
  notes: z.string().optional(),
  isPublic: z.boolean().optional(), // DB default true
  stagePlanConfig: stagePlanConfigSchema.optional(), // ✅ your schema
  members: z.array(memberInputSchema).optional(),
  revalidate: z
    .object({ path: z.string().optional(), tag: z.string().optional() })
    .optional(),
});

export type TCreateNewProjectInput = z.infer<typeof inputSchema>;
export type TCreateNewProjectResult = {
  project: TProject & { members: TProjectMember[] };
};

export async function createNewProject(raw: TCreateNewProjectInput) {
  console.log("🚀 ~ createNewProject ~ raw:", raw.stagePlanConfig);
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

  // Ensure profile (FK to auth.users)
  const prof = await db.query.profiles.findFirst({
    where(f, { eq }) {
      return eq(f.id, user.id);
    },
  });

  if (!prof) {
    await db
      .insert(profiles)
      .values({
        id: user.id,
        email: user.email ?? null,
        displayName:
          (user.user_metadata as TSupabaseUserMetadata | undefined)?.name ??
          null,
      })
      .onConflictDoNothing();
  }

  // Transactional write: project + members
  const createdProject = await db.transaction(async (tx) => {
    const [proj] = await tx
      .insert(projects)
      .values({
        ownerId: user.id,
        name: input.name,
        isPublic: input.isPublic ?? undefined,
        stagePlanConfig:
          input.stagePlanConfig ??
          ({
            nodes: [],
            measurements: [],
            version: 1,
          } as z.infer<typeof stagePlanConfigSchema>),
      })
      .returning();

    if (!proj) throw new Error("Insert failed: project not returned");

    if (input.members?.length) {
      await tx.insert(projectMembers).values(
        input.members.map((m) => ({
          projectId: proj.id,
          name: m.name,
          role: m.role ?? null,
          icon: m.icon ?? null,
          equipment: m.equipment ?? [],
        }))
      );
    }

    return proj;
  });

  // Read back with relations for a ready-to-render payload
  const fullProject = await db.query.projects.findFirst({
    where(f, { eq }) {
      return eq(f.id, createdProject.id);
    },
    with: {
      members: true,
      owner: true,
    },
  });

  if (!fullProject) throw new Error("Post-insert fetch failed");

  // Optional cache hooks
  if (input.revalidate?.path) revalidatePath(input.revalidate.path, "page");
  if (input.revalidate?.tag) revalidateTag(input.revalidate.tag);

  return {
    project: {
      ...fullProject,
      members: fullProject.members ?? [],
    },
  };
}
