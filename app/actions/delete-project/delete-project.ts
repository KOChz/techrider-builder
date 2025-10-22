"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { projects } from "@/db/schema";

const inputSchema = z.object({
  projectId: z.string().uuid(),
  revalidate: z
    .object({ path: z.string().optional(), tag: z.string().optional() })
    .optional(),
});

export type TDeleteProjectInput = z.infer<typeof inputSchema>;

/**
 * Deletes a project owned by the authenticated user.
 * Cascading deletes will automatically remove related project members.
 *
 * @param raw - The input containing projectId and optional revalidation config
 * @returns Object confirming deletion with the deleted project ID
 * @throws Error if unauthorized, project not found, or user doesn't own the project
 */
export async function deleteProject(raw: TDeleteProjectInput) {
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

  const projectToDelete = await db.query.projects.findFirst({
    where(f, { eq }) {
      return eq(f.id, input.projectId);
    },
  });

  if (!projectToDelete) throw new Error("Project not found");
  if (projectToDelete.ownerId !== user.id) {
    throw new Error("Forbidden: You don't own this project");
  }

  await db.delete(projects).where(eq(projects.id, input.projectId));

  if (input.revalidate?.path) revalidatePath(input.revalidate.path, "page");
  if (input.revalidate?.tag) revalidateTag(input.revalidate.tag);

  return {
    deletedProjectId: input.projectId,
  };
}
