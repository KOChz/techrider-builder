"use client";

import { ProjectCard } from "@/components/dashboard/my-project/project-card/project-card";

export default function MyProjectsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Projects</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          href="/techrider/headeachee"
          title="headeachee"
          description="Tech rider project"
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
}
