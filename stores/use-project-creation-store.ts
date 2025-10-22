import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TStagePlanConfig } from "@/types/stage-plan-builder-types";
import { TBandMemberBuilder } from "@/components/builder/member-card-builder/member-card-builder";
import { TStageNodeBuilder } from "@/components/builder/stage-node-builder/stage-node-builder";
import { TMeasurement } from "@/components/builder/dimension-line/dimension-line";

interface IProjectCreationState {
  // ========================================
  // State Properties
  // ========================================
  name: string;
  notes: string;
  isPublic: boolean;
  stagePlanConfig: TStagePlanConfig;
  members: TBandMemberBuilder[];

  // ========================================
  // Basic Setters
  // ========================================
  setName: (name: string) => void;
  setNotes: (notes: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  setStagePlanConfig: (config: TStagePlanConfig) => void;

  // ========================================
  // Stage Plan Node Operations
  // ========================================
  addNode: (node: TStageNodeBuilder) => void;
  updateNodeLabel: (nodeId: string, newLabel: string) => void;
  deleteNode: (nodeId: string) => void;

  // ========================================
  // Stage Plan Measurement Operations
  // ========================================
  addMeasurement: (measurement: TMeasurement) => void; // ← Add this
  updateMeasurementDistance: (measurementId: number, distance: string) => void;
  deleteMeasurement: (measurementId: number) => void;

  // ========================================
  // Member Operations
  // ========================================
  addMember: (member: TBandMemberBuilder) => void;
  updateMember: (id: string, member: TBandMemberBuilder) => void;
  removeMember: (id: string) => void;

  // ========================================
  // Form Control
  // ========================================
  resetForm: () => void;
}

const getInitialState = () => ({
  name: "",
  notes: "",
  isPublic: false,
  stagePlanConfig: {
    nodes: [],
    measurements: [],
    version: 1,
  } as TStagePlanConfig,
  members: [] as TBandMemberBuilder[],
});

export const useProjectCreationStore = create<IProjectCreationState>()(
  devtools(
    (set) => ({
      ...getInitialState(),

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
            measurements: state.stagePlanConfig.measurements.map((m) =>
              m.id === measurementId ? { ...m, customDistance: distance } : m
            ),
          },
        })),

      deleteNode: (nodeId) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            nodes: state.stagePlanConfig.nodes.filter((n) => n.id !== nodeId),
            measurements: state.stagePlanConfig.measurements.filter(
              (m) => m.startNodeId !== nodeId && m.endNodeId !== nodeId
            ),
          },
        })),

      deleteMeasurement: (measurementId) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            measurements: state.stagePlanConfig.measurements.filter(
              (m) => m.id !== measurementId
            ),
          },
        })),

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      addMeasurement: (measurement) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            measurements: [...state.stagePlanConfig.measurements, measurement],
          },
        })),

      addNode: (node) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            nodes: [...state.stagePlanConfig.nodes, node],
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

      resetForm: () => set(getInitialState()),
    }),
    { name: "project-creation-store" }
  )
);
