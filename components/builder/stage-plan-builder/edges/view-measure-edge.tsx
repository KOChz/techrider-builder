import { useMemo } from "react";
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
} from "@xyflow/react";

import { calculateSnappedCoordinates } from "@/lib/utils/calculate-snapped-coordinates";
import { cn } from "@/lib/utils/cn";
import { DEFAULT_PX_PER_METER } from "../stage-plan-builder";
import { calculateConnectorLines } from "@/lib/utils/calculate-connector-lines";
import { ConnectorLine } from "../connector-line";

export type TViewMeasurmentData = {
  customLabel?: string;
};
export interface IViewMeasureEdgeData extends Edge {
  data: TViewMeasurmentData;
}

export function ViewMeasureEdge(props: EdgeProps<IViewMeasureEdgeData>) {
  const { id, sourceX, sourceY, targetX, targetY, selected, data } = props;

  const snapped = calculateSnappedCoordinates(
    sourceX,
    sourceY,
    targetX,
    targetY
  );

  const connectors = calculateConnectorLines(
    sourceX,
    sourceY,
    targetX,
    targetY,
    snapped.startX,
    snapped.startY,
    snapped.endX,
    snapped.endY,
    snapped.axis
  );

  const pxPerMeter = useMemo(() => {
    if (typeof window === "undefined") return DEFAULT_PX_PER_METER;

    return (
      Number(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--px-per-meter"
        )
      ) || DEFAULT_PX_PER_METER
    );
  }, []);

  const calculatedMeters = useMemo(
    () => snapped.distance / pxPerMeter,
    [snapped.distance, pxPerMeter]
  );

  const displayValue = data?.customLabel || `${calculatedMeters.toFixed(2)} m`;

  const [edgePath] = getStraightPath({
    sourceX: snapped.startX,
    sourceY: snapped.startY,
    targetX: snapped.endX,
    targetY: snapped.endY,
  });

  return (
    <>
      {connectors.sourceConnector && (
        <ConnectorLine
          x1={connectors.sourceConnector.x1}
          y1={connectors.sourceConnector.y1}
          x2={connectors.sourceConnector.x2}
          y2={connectors.sourceConnector.y2}
          isSelected={!!selected}
        />
      )}

      {connectors.targetConnector && (
        <ConnectorLine
          x1={connectors.targetConnector.x1}
          y1={connectors.targetConnector.y1}
          x2={connectors.targetConnector.x2}
          y2={connectors.targetConnector.y2}
          isSelected={!!selected}
        />
      )}

      {/* White outline for contrast */}
      <BaseEdge
        id={`${id}-outline`}
        path={edgePath}
        style={{
          strokeDasharray: "5,5",
          strokeWidth: selected ? 5 : 4,
          stroke: "#ffffff",
          opacity: 0.8,
        }}
      />

      {/* Main edge line */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeDasharray: "5,5",
          strokeWidth: selected ? 3 : 2,
          stroke: "#3CB371",
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${snapped.midX}px, ${snapped.midY}px)`,
          }}
          className="group pointer-events-none"
        >
          <div
            className={cn(
              "border-slate-300",
              selected && "border-slate-900",
              "pointer-events-auto flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1 text-xs shadow-sm"
            )}
          >
            <span className="cursor-pointer hover:underline">
              {displayValue}
            </span>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
