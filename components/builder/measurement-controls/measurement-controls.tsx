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
  selectedMeasurementNodes: [string | null, string | null];
}

export const MeasurementControls: React.FC<IMeasurementControlsProps> = ({
  isMeasurementMode,
  onToggleMeasurementMode,
  measurements,
  nodes,
  selectedMeasurementNodes,
}) => {
  const getNodeLabel = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.label : `Node ${nodeId}`;
  };

  return (
    <div className="flex flex-wrap items-start gap-3">
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
        <div className="rounded-lg border border-green-500/50 bg-green-900/30 px-4 py-2.5 text-sm text-green-200">
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
        <div className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-gray-300">
          <span className="font-semibold text-green-400">
            {measurements.length}
          </span>{" "}
          measurement{measurements.length !== 1 ? "s" : ""} active
        </div>
      )}
    </div>
  );
};
