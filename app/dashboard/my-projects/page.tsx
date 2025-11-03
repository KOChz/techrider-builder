import { getMyProjects } from "@/app/actions/get-my-projects/get-my-projects";
import { ProjectCard } from "@/components/dashboard/my-project/project-card/project-card";

export default async function MyProjectsPage() {
  const myProjects = await getMyProjects();

  return (
    <div>
      <h2 className="pb-6 text-2xl font-bold text-slate-900">My Projects</h2>

      <div className="grid grid-cols-1 gap-4 pb-16 md:grid-cols-1 2xl:grid-cols-3">
        {myProjects.projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
}
