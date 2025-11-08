import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { TInstrumentSectionBuilder } from "@/components/builder/instrument-section-card-builder/instrument-section-card-builder";

import { Edge, type Node } from "@xyflow/react";
import { TMeasurmentData } from "@/components/builder/stage-plan-builder/edges/measure-edge";
import { TEquipmentData } from "@/components/builder/stage-plan-builder/nodes/equipment-node";
import {
  TChannelListItem,
  TIORoutingItem,
  TIOSetupConfig,
} from "./io-aux-types";

export interface IStagePlanFlowConfig {
  nodes: Node<TEquipmentData>[];
  edges: Edge<TMeasurmentData>[];
  version?: number;
}

export interface IProjectStore {
  name: string;
  notes: string;
  contactInfo: string;
  isPublic: boolean;
  stagePlanConfig: IStagePlanFlowConfig;
  ioSetupConfig: TIOSetupConfig;
  members: TInstrumentSectionBuilder[];

  addChannel: (channel: TChannelListItem) => void;
  updateChannel: (id: string, updates: Partial<TChannelListItem>) => void;
  removeChannel: (id: string) => void;

  addIoRouting: (routing: TIORoutingItem) => void;
  updateIoRouting: (id: string, updates: Partial<TIORoutingItem>) => void;
  removeIoRouting: (id: string) => void;

  setName: (name: string) => void;
  setNotes: (notes: string) => void;
  setContactInfo: (contactInfo: string) => void;

  setIsPublic: (isPublic: boolean) => void;
  setStagePlanConfig: (config: IStagePlanFlowConfig) => void;
  setIOSetupConfig: (config: TIOSetupConfig) => void;

  addNode: (node: Node<TEquipmentData>[]) => void;
  updateNodeLabel: (nodeId: string, newLabel: string) => void;
  updateNodeRotation: (nodeId: string, rotation: number) => void;
  deleteNode: (nodeId: string) => void;

  updateMeasurementDistance: (measurementId: number, distance: string) => void;
  deleteMeasurement: (measurementId: number) => void;

  addMember: (member: TInstrumentSectionBuilder) => void;
  updateMember: (id: string, member: TInstrumentSectionBuilder) => void;
  removeMember: (id: string) => void;
  moveMember: (fromIndex: number, toIndex: number) => void;

  initializeWithProject: (projectData: Partial<IProjectStore>) => void;
  resetForm: () => void;
}

const getInitialStore = (): Omit<
  IProjectStore,
  | "addIoRouting"
  | "updateIoRouting"
  | "removeIoRouting"
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
  | "setIOSetupConfig"
  | "moveMember"
  | "updateMember"
  | "removeMember"
  | "initializeWithProject"
  | "addChannel"
  | "updateChannel"
  | "removeChannel"
  | "resetForm"
  | "setEdges"
  | "updateNodeRotation"
  | "setContactInfo"
> => ({
  name: "",
  notes: "",
  contactInfo: "",
  isPublic: false,
  stagePlanConfig: {
    nodes: [],
    edges: [],
    version: 1,
  },
  ioSetupConfig: {
    channelList: [],
    ioRouting: [],
  },
  members: [],
});

export const useProjectStore = create<IProjectStore>()(
  devtools(
    (set) => ({
      ...getInitialStore(),

      setName: (name) => set({ name }),

      setNotes: (notes) => set({ notes }),

      setContactInfo: (contactInfo) => set({ contactInfo }),

      setIsPublic: (isPublic) => set({ isPublic }),

      setIOSetupConfig: (ioSetupConfig) => set({ ioSetupConfig }),

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

      updateNodeRotation: (nodeId, rotation) =>
        set((state) => ({
          stagePlanConfig: {
            ...state.stagePlanConfig,
            nodes: state.stagePlanConfig.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, rotation } }
                : node
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
          members: [...state.members, member],
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

      moveMember: (fromIndex, toIndex) =>
        set((state) => {
          if (fromIndex === toIndex) return state;
          const next = [...state.members];
          const [m] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, m);
          return { ...state, members: next };
        }),

      // Channel management
      addChannel: (channel) =>
        set((state) => ({
          ioSetupConfig: {
            ...state.ioSetupConfig,
            channelList: [...state.ioSetupConfig.channelList, channel],
          },
        })),

      updateChannel: (id, updates) =>
        set((state) => ({
          ioSetupConfig: {
            ...state.ioSetupConfig,
            channelList: state.ioSetupConfig.channelList.map((ch) =>
              ch.id === id ? { ...ch, ...updates } : ch
            ),
          },
        })),

      removeChannel: (id) =>
        set((state) => ({
          ioSetupConfig: {
            ...state.ioSetupConfig,
            channelList: state.ioSetupConfig.channelList.filter(
              (ch) => ch.id !== id
            ),
          },
        })),

      // IO Routing management
      addIoRouting: (routing) =>
        set((state) => ({
          ioSetupConfig: {
            ...state.ioSetupConfig,
            ioRouting: [...state.ioSetupConfig.ioRouting, routing],
          },
        })),

      updateIoRouting: (id, updates) =>
        set((state) => ({
          ioSetupConfig: {
            ...state.ioSetupConfig,
            ioRouting: state.ioSetupConfig.ioRouting.map((io) =>
              io.id === id ? { ...io, ...updates } : io
            ),
          },
        })),

      removeIoRouting: (id) =>
        set((state) => ({
          ioSetupConfig: {
            ...state.ioSetupConfig,
            ioRouting: state.ioSetupConfig.ioRouting.filter(
              (io) => io.id !== id
            ),
          },
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
