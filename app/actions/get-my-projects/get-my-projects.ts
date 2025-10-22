"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { db } from "@/db";
import { profiles, type TProject, type TProjectMember } from "@/db/schema";

const inputSchema = z
  .object({
    includePrivate: z.boolean().optional().default(true),
    sortBy: z
      .enum(["createdAt", "updatedAt", "name"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .optional();

export type TGetMyProjectsInput = z.infer<typeof inputSchema>;

export type TProjectWithRelations = TProject & {
  members: TProjectMember[];
  owner: typeof profiles.$inferSelect;
};

// In your action:
export type TGetMyProjectsResult = {
  projects: TProjectWithRelations[];
};

/**
 * Retrieves all projects owned by the authenticated user.
 *
 * @param input - Optional filtering and sorting parameters
 * @param input.includePrivate - Whether to include private projects (default: true)
 * @param input.sortBy - Field to sort by: 'createdAt', 'updatedAt', or 'name' (default: 'createdAt')
 * @param input.sortOrder - Sort direction: 'asc' or 'desc' (default: 'desc')
 *
 * @returns Object containing array of projects with their members
 * @throws Error if authentication fails or user is not authenticated
 *
 * @example
 * ```ts
 * const { projects } = await getMyProjects();
 * const { projects } = await getMyProjects({ sortBy: 'name', sortOrder: 'asc' });
 * ```
 */
export async function getMyProjects(
  raw?: TGetMyProjectsInput
): Promise<TGetMyProjectsResult> {
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

  const userProjects = await db.query.projects.findMany({
    where: (fields, { eq, and }) => {
      const conditions = [eq(fields.ownerId, user.id)];

      if (!input?.includePrivate) {
        conditions.push(eq(fields.isPublic, true));
      }

      return and(...conditions);
    },
    with: {
      members: {
        orderBy: (members, { asc }) => [
          asc(members.sortOrder),
          asc(members.name),
        ],
      },
      owner: true,
    },
    orderBy: (fields, { asc, desc: descOrder }) => {
      const sortField = fields[input?.sortBy ?? "createdAt"];
      const orderFn = input?.sortOrder === "asc" ? asc : descOrder;
      return [orderFn(sortField)];
    },
  });

  return {
    projects: userProjects.map((project) => ({
      ...project,
      members: project.members ?? [],
    })),
  };
}
