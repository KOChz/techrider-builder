"use client";

import { TStagePlanConfig } from "@/types/stage-plan-builder";

interface IStagePlanBuilderProps {
  value: TStagePlanConfig;
  onChange: (config: TStagePlanConfig) => void;
}

/**
 * StagePlanBuilder - Controlled component for visual stage layout
 *
 * This component follows the controlled component pattern:
 * - Receives current state via `value` prop
 * - Notifies parent of changes via `onChange` callback
 * - Does NOT manage its own state
 */
export default function StagePlanBuilder({
  value,
  onChange,
}: IStagePlanBuilderProps) {
  const handleAddNode = (node: TStagePlanConfig["nodes"][number]) => {
    onChange({
      ...value,
      nodes: [...value.nodes, node],
    });
  };

  const handleUpdateNode = (
    nodeId: string,
    updates: Partial<TStagePlanConfig["nodes"][number]>
  ) => {
    onChange({
      ...value,
      nodes: value.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    });
  };

  const handleRemoveNode = (nodeId: string) => {
    onChange({
      ...value,
      nodes: value.nodes.filter((node) => node.id !== nodeId),
    });
  };

  const handleAddMeasurement = (
    measurement: TStagePlanConfig["measurements"][number]
  ) => {
    onChange({
      ...value,
      measurements: [...value.measurements, measurement],
    });
  };

  return (
    <div className="rounded-lg border border-gray-300 p-4">
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-slate-800">
          Stage Layout
        </h4>
        <p className="text-xs text-gray-600">
          Nodes: {value.nodes.length} | Measurements:{" "}
          {value.measurements.length}
        </p>
      </div>

      {/* Your canvas/SVG implementation here */}
      <div className="flex min-h-[400px] items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-500">
          Stage plan builder canvas (implement your visual editor here)
        </p>
      </div>

      {/* Example controls */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() =>
            handleAddNode({
              id: crypto.randomUUID(),
              type: "amp",
              x: 100,
              y: 100,
              label: "New Node",
              angle: 0,
              scale: 1,
            } as TStagePlanConfig["nodes"][number])
          }
          className="rounded bg-gray-100 px-3 py-1.5 text-sm transition-colors hover:bg-gray-200"
        >
          Add Node
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              nodes: [],
              measurements: [],
            })
          }
          className="rounded bg-red-100 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-200"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
