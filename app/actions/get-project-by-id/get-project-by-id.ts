"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { db } from "@/db";
import { TProjectWithRelations } from "../get-my-projects/get-my-projects";

const inputSchema = z.object({
  projectId: z.string().uuid("Invalid project ID format"),
});

export type TGetProjectByIdInput = z.infer<typeof inputSchema>;

export type TGetProjectByIdResult = {
  project: TProjectWithRelations;
};

/**
 * Retrieves a single project by ID if the authenticated user has access.
 * User must be either the project owner or a project member.
 *
 * @param input - Project identifier
 * @param input.projectId - UUID of the project to retrieve
 *
 * @returns Object containing the project with its members and owner
 * @throws Error if authentication fails, user lacks access, or project doesn't exist
 *
 * @example
 * ```ts
 * const { project } = await getProjectById({ projectId: "123e4567-e89b-12d3-a456-426614174000" });
 * ```
 */
export async function getProjectById(
  raw: TGetProjectByIdInput
): Promise<TGetProjectByIdResult> {
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

  const project = await db.query.projects.findFirst({
    where: (fields, { eq }) => eq(fields.id, input.projectId),
    with: {
      members: {
        orderBy: (members, { asc }) => [
          asc(members.sortOrder),
          asc(members.name),
        ],
      },
      owner: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const isOwner = project.ownerId === user.id;
  const isMember = project.members.some((member) => member.id === user.id);

  if (!isOwner && !isMember) {
    throw new Error("Forbidden: You don't have access to this project");
  }

  return {
    project: {
      ...project,
      members: project.members ?? [],
    },
  };
}
