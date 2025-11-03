import { TEquipmentItemBuilder } from "@/components/builder/member-card-builder/member-card-builder";
import { IStagePlanFlowConfig } from "@/stores/use-project-creation-store";
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  index,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    // Updated to match your actual data structure
    stagePlanConfig: jsonb("stage_plan_config")
      .$type<IStagePlanFlowConfig>()
      .default(sql`'{"nodes":[],"version":1}'::jsonb`),

    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    slug: text("slug").notNull().unique(),
    notes: text("notes"),
    contactInfo: text("contact_info"),
  },
  (t) => ({
    ownerIdx: index("projects_owner_idx").on(t.ownerId),
    publicIdx: index("projects_is_public_idx").on(t.isPublic),
    createdIdx: index("projects_created_at_idx").on(t.createdAt),
    slugIdx: index("slug_idx").on(t.slug),
  })
);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    role: text("role"),
    icon: text("icon"), // emoji or short code
    // pragmatic middle ground: keep “equipment” as JSONB array to avoid 2 extra tables
    equipment: jsonb("equipment")
      .$type<TEquipmentItemBuilder[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    byProjectIdx: index("project_members_project_idx").on(t.projectId),
    uniqueNamePerProject: uniqueIndex("project_members_project_name_uidx").on(
      t.projectId,
      t.name
    ),
  })
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [projects.ownerId],
    references: [profiles.id],
  }),
  members: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
}));

export type TProject = typeof projects.$inferSelect;
export type TNewProject = typeof projects.$inferInsert;

export type TProjectMember = typeof projectMembers.$inferSelect;
export type TNewProjectMember = typeof projectMembers.$inferInsert;
