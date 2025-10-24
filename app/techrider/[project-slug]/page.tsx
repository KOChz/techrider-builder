import Link from "next/link";

import StagePlan from "@/components/stage-plan/stage-plan";
import { MemberCard } from "@/components/member-card/member-card";

import { createServerClientService } from "@/lib/supabase/server";

import { getProjectBySlug } from "@/app/actions/get-project-by-slug/get-project-by-slug";

import "./project.css";
import { TechRiderDropdown } from "@/components/tech-rider-dropdown/tech-rider-dropdown";

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
      <nav>
        <div className="nav-container">
          <a href="#home" className="logo">
            {project.name}
          </a>

          <ul className="nav-links">
            <TechRiderDropdown members={project.members} />

            <li>
              <Link href="#contact">Contact</Link>
            </li>

            {user && (
              <li>
                <Link href="/dashboard/my-projects" aria-label="Home">
                  Home
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <section id="home" className="hero">
        <div>
          <h1>{project.name}</h1>
          <a href="#tech-rider" className="cta-button">
            View Tech Rider
          </a>
        </div>
      </section>

      <section id="tech-rider" className="container">
        <h2 className="section-title">Technical Requirements</h2>

        <div className="tech-grid">
          {project.members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <StagePlan config={project.stagePlanConfig} />

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
