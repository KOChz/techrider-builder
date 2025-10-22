import { getMyProjects } from "@/app/actions/get-my-projects/get-my-projects";
import { ProjectCard } from "@/components/dashboard/my-project/project-card/project-card";
import { slugify } from "@/lib/utils/slugify";

export default async function MyProjectsPage() {
  const myProjects = await getMyProjects();

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">My Projects</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myProjects.projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
}
