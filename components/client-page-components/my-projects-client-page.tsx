"use client";

import React, { useState } from "react";

import { TGetMyProjectsResult } from "@/app/actions/get-my-projects/get-my-projects";
import { ProjectCard } from "../dashboard/my-project/project-card/project-card";
import { ITemplateItem } from "../templates/template-item";
import { TemplateGallery } from "../templates/template-gallery";
import { useRouter } from "next/navigation";

const templates: ITemplateItem[] = [
  {
    id: "3-piece-band",
    name: "3-Piece Band",
    description: "Band with additional keys/guitar",
    thumbnailUrl: "/images/3piece-band.webp",
    category: "Band",
    isPopular: true,
    memberCount: 3,
  },
  {
    id: "4-piece-band",
    name: "4-Piece Band",
    description: "Standard rock/pop band setup",
    thumbnailUrl: "/images/4piece-band.webp",
    category: "Band",
    memberCount: 4,
  },
  {
    id: "2-piece-band",
    name: "2-Piece Band",
    description: "Standard rock/pop band setup",
    thumbnailUrl: "/images/2piece-band.webp",
    category: "Band",
    memberCount: 2,
  },
  {
    id: "solo-artist",
    name: "Solo Artist",
    description: "Single performer with backing tracks",
    thumbnailUrl: "/images/one-man-band.jpeg",
    category: "Solo Artist",
    memberCount: 1,
  },
  {
    id: "dj-setup",
    name: "DJ Setup",
    description: "Electronic music performance",
    thumbnailUrl: "/images/dj.jpg",
    category: "DJ",
    memberCount: 1,
  },
];

export function MyProjectsClientPage({
  myProjects,
}: {
  myProjects: TGetMyProjectsResult;
}) {
  const router = useRouter();

  const [isCreatingFromTemplate, setIsCreatingFromTemplate] = useState(false);

  const handleTemplateSelect = async (template: ITemplateItem) => {
    setIsCreatingFromTemplate(true);

    try {
      router.push(`/dashboard/create-new?templateId=${template.id}`);

      console.log("Creating project from template:", template.name);
    } catch (error) {
      console.error("Failed to create project from template:", error);
    } finally {
      setIsCreatingFromTemplate(false);
    }
  };

  return (
    <div id="MyProjectsPage">
      {/* Template Gallery */}
      <TemplateGallery
        templates={templates}
        onTemplateSelect={handleTemplateSelect}
        className="mb-12"
      />

      <h2 className="pb-6 text-2xl font-bold text-slate-900">My Projects</h2>

      <div className="grid grid-cols-1 gap-4 pb-16 md:grid-cols-1 2xl:grid-cols-3">
        {myProjects.projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>

      {isCreatingFromTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              <p className="text-gray-900">Creating project from template...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
