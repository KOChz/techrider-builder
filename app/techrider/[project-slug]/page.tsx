import Link from "next/link";

import { MemberCard } from "@/components/member-card/member-card";

import { createServerClientService } from "@/lib/supabase/server";

import { getProjectBySlug } from "@/app/actions/get-project-by-slug/get-project-by-slug";

import { TechRiderDropdown } from "@/components/tech-rider-dropdown/tech-rider-dropdown";

import "./project.css";
import { StagePlanViewer } from "@/components/builder/stage-plan-builder/stage-plan-viewer";

interface IProjectPageProps {
  params: Promise<{
    "project-slug": string;
  }>;
}

export default async function ProjectPage({ params }: IProjectPageProps) {
  const { "project-slug": projectSlug } = await params;

  const { project } = await getProjectBySlug({ projectSlug });

  const supabase = await createServerClientService();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="techrider-page">
      <nav className="bg-white! border-b border-gray-100">
        <div className="flex-end mx-auto flex px-3 py-4 md:px-6">
          <div className="flex-end flex w-full items-center justify-center md:justify-end">
            {/* <a
              href="#home"
              className="shrink-0 text-3xl font-bold text-green-600"
            >
              {project.name}
            </a> */}

            <ul className="flex w-auto items-center gap-3 md:gap-8 md:pr-2">
              <TechRiderDropdown members={project.members} />

              <li>
                <Link
                  href="#contact"
                  className="text-sm font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>

              {user && (
                <li>
                  <Link
                    href="/dashboard/my-projects"
                    aria-label="Home"
                    className="text-sm font-medium uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Home
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <div>
          <h1 className="text-shadow-2xs mb-20 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
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

      <section id="tech-rider" className="container">
        <h2 className="bg-linear-to-r text-shadow-2xs mb-16 from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-center text-5xl font-bold text-transparent">
          Technical Requirements
        </h2>

        <div className="tech-grid">
          {project.members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <h1 className="min-h-20 text-shadow-2xs bg-linear-to-r mb-8 h-full from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
        Stage Plan
      </h1>

      <div id="stage-plan" className="px-4 md:px-10 xl:px-60">
        {project.stagePlanConfig && (
          <StagePlanViewer stagePlanConfig={project.stagePlanConfig} />
        )}
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
    </div>
  );
}
