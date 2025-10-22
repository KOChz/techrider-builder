"use server";

import { z } from "zod";

import { db } from "@/db";
import { TProjectWithRelations } from "../get-my-projects/get-my-projects";

const inputSchema = z.object({
  projectSlug: z.string().min(1, "Project slug cannot be empty"),
});

export type TGetProjectBySlugInput = z.infer<typeof inputSchema>;

export type TGetProjectBySlugResult = {
  project: TProjectWithRelations;
};

/**
 * Retrieves a single project by its unique slug.
 * Includes project members and owner information.
 *
 * @param input - Project identifier
 * @param input.projectSlug - URL-friendly slug of the project to retrieve
 *
 * @returns Object containing the project with its members and owner
 * @throws Error if project doesn't exist
 *
 * @example
 * ```ts
 * const { project } = await getProjectBySlug({ projectSlug: "my-awesome-project" });
 * ```
 */
export async function getProjectBySlug(
  raw: TGetProjectBySlugInput
): Promise<TGetProjectBySlugResult> {
  const input = inputSchema.parse(raw);

  const project = await db.query.projects.findFirst({
    where: (fields, { eq }) => eq(fields.slug, input.projectSlug),
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
