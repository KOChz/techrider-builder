import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useProjectStore } from "@/stores/use-project-creation-store";
import {
  createNewProject,
  TCreateNewProjectInput,
} from "@/app/actions/create-new-project/create-new-project";

interface IUseCreateProjectReturn {
  isCreating: boolean;
  error: string | null;
  createProject: () => Promise<void>;
}

export function useCreateProject(): IUseCreateProjectReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    name,
    contactInfo,
    notes,
    isPublic,
    stagePlanConfig,
    members,
    resetForm,
  } = useProjectStore();

  const createProject = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (members.some((m) => !m.name.trim())) {
      setError("All members must have a name");
      return;
    }

    setIsCreating(true);

    try {
      const input: TCreateNewProjectInput = {
        name: name.trim(),
        notes: notes.trim() || undefined,
        contactInfo,
        isPublic,
        stagePlanConfig,
        members: members.map((m, index) => ({
          name: m.name.trim(),
          role: m.role.trim() || undefined,
          icon: m.icon.trim() || undefined,
          equipment: m.equipment,
        })),
        revalidate: {
          path: "/projects",
        },
      };

      const result = await createNewProject(input);
      console.log("🚀 ~ createProject ~ result:", result);

      resetForm();
      router.push(`/dashboard/my-projects`);

      toast.success("Your project successfully created!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create project";
      setError(errorMessage);
      console.error("Project creation error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, error, createProject };
}
