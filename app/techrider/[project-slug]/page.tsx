import Link from "next/link";

import StagePlan from "@/components/stage-plan/stage-plan";
import { MemberCard } from "@/components/member-card/member-card";

import { createServerClientService } from "@/lib/supabase/server";

import { getProjectBySlug } from "@/app/actions/get-project-by-slug/get-project-by-slug";

import "./project.css";

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
            <li className="dropdown">
              <button
                className="dropdown-toggle"
                aria-haspopup="true"
                aria-expanded="false"
                id="techRiderToggle"
              >
                Tech Rider
              </button>
              <div
                className="dropdown-menu"
                role="menu"
                aria-labelledby="techRiderToggle"
              >
                {project.members.map((member) => (
                  <a
                    key={member.id}
                    href={`#${member.name}`}
                    id={`dropdown-${member.name}`}
                    className="dropdown-item"
                    role="menuitem"
                  >
                    <span className="dropdown-icon">{member.icon}</span>
                    <div className="dropdown-info">
                      <span className="dropdown-name">{member.name}</span>
                      <span className="dropdown-role">{member.role}</span>
                    </div>
                  </a>
                ))}

                <a
                  href="#stage-plan"
                  id="dropdown-stage-plan"
                  className="dropdown-item"
                  role="menuitem"
                >
                  <span className="dropdown-icon">🏟️</span>
                  <div className="dropdown-info">
                    <span className="dropdown-name">Stage Plan</span>
                  </div>
                </a>
              </div>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>

            {user && (
              <li>
                <Link
                  href="/dashboard/my-projects"
                  type="submit"
                  className="cursor-pointer rounded-md px-3 py-1.5 text-slate-200 transition-colors hover:bg-green-500/20"
                  aria-label="Home"
                >
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
