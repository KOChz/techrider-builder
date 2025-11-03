import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { TBandMemberBuilder } from "@/components/builder/member-card-builder/member-card-builder";

import { Edge, type Node } from "@xyflow/react";
import { TMeasurmentData } from "@/components/builder/stage-plan-builder/edges/measure-edge";
import { TEquipmentData } from "@/components/builder/stage-plan-builder/nodes/equipment-node";

export interface IStagePlanFlowConfig {
  nodes: Node<TEquipmentData>[];
  edges: Edge<TMeasurmentData>[];
  version?: number;
  position: { x: number; y: number };
}

interface IProjectStore {
  name: string;
  notes: string;
  isPublic: boolean;
  stagePlanConfig: IStagePlanFlowConfig;
  members: TBandMemberBuilder[];

  setName: (name: string) => void;
  setNotes: (notes: string) => void;

  setIsPublic: (isPublic: boolean) => void;
  setStagePlanConfig: (config: IStagePlanFlowConfig) => void;

  addNode: (node: Node<TEquipmentData>[]) => void;
  updateNodeLabel: (nodeId: string, newLabel: string) => void;
  deleteNode: (nodeId: string) => void;

  updateMeasurementDistance: (measurementId: number, distance: string) => void;
  deleteMeasurement: (measurementId: number) => void;

  addMember: (member: TBandMemberBuilder) => void;
  updateMember: (id: string, member: TBandMemberBuilder) => void;
  removeMember: (id: string) => void;

  initializeWithProject: (projectData: Partial<IProjectStore>) => void;
  resetForm: () => void;
}

const getInitialStore = (): Omit<
  IProjectStore,
  | "setName"
  | "setNotes"
  | "setIsPublic"
  | "setStagePlanConfig"
  | "addNode"
  | "updateNodeLabel"
  | "deleteNode"
  | "addMeasurement"
  | "updateMeasurementDistance"
  | "deleteMeasurement"
  | "addMember"
  | "updateMember"
  | "removeMember"
  | "initializeWithProject"
  | "resetForm"
  | "setEdges"
> => ({
  name: "",
  notes: "",
  isPublic: false,
  stagePlanConfig: {
    nodes: [],
    edges: [],
    version: 1,
    position: { x: 100, y: 100 },
  },
  members: [],
});

export const useProjectStore = create<IProjectStore>()(
  devtools(
    (set) => ({
      ...getInitialStore(),

      setName: (name) => set({ name }),

      setNotes: (notes) => set({ notes }),

      setIsPublic: (isPublic) => set({ isPublic }),

      setStagePlanConfig: (stagePlanConfig) => set({ stagePlanConfig }),

      updateNodeLabel: (nodeId, newLabel) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            nodes: state.stagePlanConfig.nodes.map((node) =>
              node.id === nodeId ? { ...node, label: newLabel } : node
            ),
          },
        })),

      updateMeasurementDistance: (measurementId, distance) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
          },
        })),

      deleteNode: (nodeId) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            nodes: state.stagePlanConfig.nodes.filter((n) => n.id !== nodeId),
          },
        })),

      deleteMeasurement: (measurementId) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
          },
        })),

      addMember: (member) =>
        set((state) => ({
          members: [member, ...state.members],
        })),

      addNode: (node) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
          },
        })),

      updateMember: (id, updatedMember) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? updatedMember : m)),
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),

      initializeWithProject: (projectData) =>
        set((state) => ({
          ...state,
          ...projectData,
        })),

      resetForm: () => set(getInitialStore()),
    }),
    { name: "project-creation-store" }
  )
);
