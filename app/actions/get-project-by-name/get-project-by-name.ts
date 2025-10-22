"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { db } from "@/db";
import { TProjectWithRelations } from "../get-my-projects/get-my-projects";

const inputSchema = z.object({
  projectName: z.string().min(1, "Project name cannot be empty"),
});

export type TGetProjectByNameInput = z.infer<typeof inputSchema>;

export type TGetProjectByNameResult = {
  project: TProjectWithRelations;
};

/**
 * Retrieves a single project by name if the authenticated user has access.
 * User must be either the project owner or a project member.
 *
 * @param input - Project identifier
 * @param input.projectName - Name of the project to retrieve
 *
 * @returns Object containing the project with its members and owner
 * @throws Error if authentication fails, user lacks access, or project doesn't exist
 *
 * @example
 * ```ts
 * const { project } = await getProjectByName({ projectName: "My Awesome Project" });
 * ```
 */
export async function getProjectByName(
  raw: TGetProjectByNameInput
): Promise<TGetProjectByNameResult> {
  const input = inputSchema.parse(raw);

  const project = await db.query.projects.findFirst({
    where: (fields, { eq }) => eq(fields.name, input.projectName),
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

  return {
    project: {
      ...project,
      members: project.members ?? [],
    },
  };
}
