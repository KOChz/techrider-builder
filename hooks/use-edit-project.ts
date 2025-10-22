import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useProjectStore } from "@/stores/use-project-creation-store";
import {
  editProjectById,
  TEditProjectByIdInput,
} from "@/app/actions/edit-project-by-id/edit-project-by-id";
import { TProjectWithRelations } from "@/app/actions/get-my-projects/get-my-projects";
import { slugify } from "@/lib/utils/slugify";

interface IUseEditProjectParams {
  project: TProjectWithRelations;
  onSuccessRedirect?: string;
}

interface IUseEditProjectReturn {
  isEditing: boolean;
  error: string | null;
  editProject: () => Promise<void>;
}

/**
 * Hook for editing an existing project using data from the project store.
 * Validates input, calls the editProjectById server action, and handles success/error states.
 *
 * @param {IUseEditProjectParams} params - Configuration object
 * @param {string} params.project - Project object
 * @param {string} [params.onSuccessRedirect] - Optional path to redirect after success (defaults to project detail page)
 *
 * @returns {IUseEditProjectReturn} Object containing editing state, error, and edit function
 */
export function useEditProject({
  project,
  onSuccessRedirect,
}: IUseEditProjectParams): IUseEditProjectReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { name, notes, isPublic, stagePlanConfig, members } = useProjectStore();

  const editProject = async () => {
    setError(null);

    if (name && !name.trim()) {
      setError("Project name cannot be empty if provided");
      return;
    }

    if (members && members.some((m) => !m.name.trim())) {
      setError("All members must have a name");
      return;
    }

    setIsEditing(true);

    try {
      const input: TEditProjectByIdInput = {
        projectId: project.id,
        name: name?.trim(),
        notes: notes?.trim() || undefined,
        isPublic,
        stagePlanConfig,
        members: members
          ? members.map((m, index) => ({
              name: m.name.trim(),
              role: m.role?.trim() || undefined,
              icon: m.icon?.trim() || undefined,
              equipment: m.equipment || [],
            }))
          : undefined,
        revalidate: {
          path: `/dashboard/techrider/${slugify(project.name)}`,
          tag: `project-${project.id}`,
        },
      };

      await editProjectById(input);

      const redirectPath = onSuccessRedirect ?? `/dashboard/my-projects`;

      toast.success("Project updated successfully!");

      router.push(redirectPath);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update project";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Project update error:", err);
    } finally {
      setIsEditing(false);
    }
  };

  return { isEditing, error, editProject };
}
