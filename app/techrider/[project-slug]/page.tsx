import { createServerClientService } from "@/lib/supabase/server";

import { getProjectBySlug } from "@/app/actions/get-project-by-slug/get-project-by-slug";

import { TechRiderClientPage } from "@/components/client-page-components/techrider-client-page";

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

  const isOwner = user?.id === project.ownerId;

  return (
    <TechRiderClientPage isOwner={isOwner} project={project} user={user} />
  );
}
