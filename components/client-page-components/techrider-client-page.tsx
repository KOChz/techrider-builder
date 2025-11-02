"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils/cn";
import { TechRiderDropdown } from "../tech-rider-dropdown/tech-rider-dropdown";
import Link from "next/link";
import { TProjectWithRelations } from "@/app/actions/get-my-projects/get-my-projects";
import { DownloadPageButton } from "../download-page-button/download-page-button";
import { MemberCard } from "../member-card/member-card";
import { StagePlanViewer } from "../builder/stage-plan-builder/stage-plan-viewer";
import { User } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils/slugify";
import { NotesSection } from "../techrider/notes-section";

export function TechRiderClientPage({
  isOwner,
  project,
  user,
}: {
  isOwner: boolean;
  project: TProjectWithRelations;
  user: User | null;
}) {
  const [isDonwload, setIsDownload] = useState(false);

  function handleDownload() {
    setIsDownload(true);
  }

  return (
    <div className="techrider-page">
      <nav className="bg-white! border-b border-gray-100">
        <div className="flex-end mx-auto flex px-3 py-4 md:px-6">
          <div className="flex-end flex w-full items-center justify-center md:justify-end">
            <ul
              className={cn(
                "flex w-auto items-center gap-3 md:gap-8 md:pr-2",
                isOwner && "text-xs! md:text-md"
              )}
            >
              <li>
                <Link
                  href="#contact"
                  className="text-xs font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900 md:text-sm"
                >
                  Contact
                </Link>
              </li>

              <TechRiderDropdown members={project.members} />

              {isOwner && (
                <li>
                  <Link
                    href="/dashboard/my-projects"
                    aria-label="Home"
                    className="text-xs font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900 md:text-sm"
                  >
                    Home
                  </Link>
                </li>
              )}

              {isOwner && (
                <DownloadPageButton
                  onBeforeStart={handleDownload}
                  onAfterFinish={() => {
                    setTimeout(() => {
                      setIsDownload(false);
                    }, 2000);
                  }}
                  fileName={`tech-rider-${slugify(project.name)}`}
                />
              )}
            </ul>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <div>
          <h1 className="text-shadow-2xs bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text pb-10 text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
            {project.name}
          </h1>
          <a
            href="#tech-rider"
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-700 to-green-700 px-8 py-4 text-2xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
            aria-label="Scroll to Tech Rider section"
          >
            <div className="relative z-10 text-white">View Tech Rider</div>

            {/* Animated scroll icon */}
            <svg
              className="h-6 w-6 animate-bounce transition-transform group-hover:translate-y-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>

            {/* Shine effect on hover */}
            <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-500/80 to-green-500/80 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
          </a>
        </div>
      </section>

      <>
        <div className="container">
          <section id="tech-rider">
            <h2 className="bg-linear-to-r text-shadow-2xs min-h-24 from-green-600 via-emerald-500 to-teal-600 bg-clip-text py-10 text-center text-4xl font-bold text-transparent">
              Technical Requirements
            </h2>

            <div className="tech-grid">
              {project.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isOpened={isDonwload}
                />
              ))}
            </div>
            {project.notes && <NotesSection notes={project.notes} />}
          </section>

          <section id="stage-plan">
            <h1 className="min-h-40 text-shadow-2xs bg-linear-to-r pt-18 h-full from-emerald-400 via-green-500 to-emerald-600 bg-clip-text pb-6 text-center text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
              Stage Plan
            </h1>

            <div>
              {project.stagePlanConfig && (
                <StagePlanViewer stagePlanConfig={project.stagePlanConfig} />
              )}
            </div>
          </section>
        </div>

        <footer className="w-full" id="contact">
          <h3>Get in Touch</h3>
          <p>For bookings and technical questions:</p>
          <p>
            <a href={user?.email}>{user?.email}</a>
          </p>
          <p className="mt-(--spacing-md) text-[0.85rem]">
            © 2025 {project.name}. All rights reserved.
          </p>
        </footer>
      </>
    </div>
  );
}
