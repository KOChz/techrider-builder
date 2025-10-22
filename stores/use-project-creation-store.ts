import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TStagePlanConfig } from "@/types/stage-plan-builder-types";
import { TBandMemberBuilder } from "@/components/builder/member-card-builder/member-card-builder";

interface IProjectCreationState {
  name: string;
  notes: string;
  isPublic: boolean;
  stagePlanConfig: TStagePlanConfig;
  members: TBandMemberBuilder[];

  setName: (name: string) => void;
  setNotes: (notes: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  setStagePlanConfig: (config: TStagePlanConfig) => void;
  addMember: (member: TBandMemberBuilder) => void;
  updateMember: (id: string, member: TBandMemberBuilder) => void;
  removeMember: (id: string) => void;
  resetForm: () => void;
}

const initialState = {
  name: "",
  notes: "",
  isPublic: false,
  stagePlanConfig: {
    nodes: [],
    measurements: [],
    version: 1,
  } as TStagePlanConfig,
  members: [] as TBandMemberBuilder[],
};

export const useProjectCreationStore = create<IProjectCreationState>()(
  devtools(
    (set) => ({
      ...initialState,

      setName: (name) => set({ name }),

      setNotes: (notes) => set({ notes }),

      setIsPublic: (isPublic) => set({ isPublic }),

      setStagePlanConfig: (stagePlanConfig) => set({ stagePlanConfig }),

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      updateMember: (id, updatedMember) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? updatedMember : m)),
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),

      resetForm: () => set(initialState),
    }),
    { name: "project-creation-store" }
  )
);
