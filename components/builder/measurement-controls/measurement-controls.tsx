"use client";

import React from "react";
import { TStageNodeBuilder } from "../stage-node-builder/stage-node-builder";
import { cn } from "@/lib/utils/cn";
import { TMeasurement } from "../dimension-line/dimension-line";

interface IMeasurementControlsProps {
  isMeasurementMode: boolean;
  onToggleMeasurementMode: () => void;
  measurements: TMeasurement[];
  nodes: TStageNodeBuilder[];
  selectedMeasurementNodes: [number | null, number | null];
}

export const MeasurementControls: React.FC<IMeasurementControlsProps> = ({
  isMeasurementMode,
  onToggleMeasurementMode,
  measurements,
  nodes,
  selectedMeasurementNodes,
}) => {
  const getNodeLabel = (nodeId: number) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.label : `Node ${nodeId}`;
  };

  return (
    <div className="flex gap-3 items-start flex-wrap">
      <button
        onClick={onToggleMeasurementMode}
        className={cn(
          "cursor-pointer select-none rounded border px-5 py-2.5 text-sm font-medium transition-colors",
          isMeasurementMode
            ? "bg-green-600 border-green-500 text-white hover:bg-green-700"
            : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        )}
      >
        {isMeasurementMode ? "✓ Measurement Mode Active" : "📏 Add Measurement"}
      </button>

      {isMeasurementMode && (
        <div className="bg-green-900/30 border border-green-500/50 px-4 py-2.5 rounded-lg text-sm text-green-200">
          {selectedMeasurementNodes[0] === null ? (
            "Click the first item to measure from"
          ) : selectedMeasurementNodes[1] === null ? (
            <>
              First:{" "}
              <span className="font-semibold">
                {getNodeLabel(selectedMeasurementNodes[0])}
              </span>{" "}
              • Click second item
            </>
          ) : null}
        </div>
      )}

      {measurements.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-lg text-sm text-gray-300">
          <span className="font-semibold text-green-400">
            {measurements.length}
          </span>{" "}
          measurement{measurements.length !== 1 ? "s" : ""} active
        </div>
      )}
    </div>
  );
};
