import { getMyProjects } from "@/app/actions/get-my-projects/get-my-projects";
import { MyProjectsClientPage } from "@/components/client-page-components/my-projects-client-page";

export default async function MyProjectsPage() {
  const myProjects = await getMyProjects();

  return <MyProjectsClientPage myProjects={myProjects} />;
}
