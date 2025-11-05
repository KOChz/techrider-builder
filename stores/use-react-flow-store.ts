import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Node, type ReactFlowInstance } from "@xyflow/react";
import { TEquipmentData } from "@/components/builder/stage-plan-builder/nodes/equipment-node";

interface IReactFlowStore {
  instance: ReactFlowInstance<Node<TEquipmentData>> | null;
  setInstance: (
    instance: ReactFlowInstance<Node<TEquipmentData>> | null
  ) => void;
}

export const useReactFlowStore = create<IReactFlowStore>()(
  devtools(
    (set) => ({
      instance: null,
      setInstance: (instance) => set({ instance }),
    }),
    { name: "react-flow-store" }
  )
);
