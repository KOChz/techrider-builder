import { calculateSnappedCoordinates } from "@/lib/utils/calculate-snapped-coordinates";
import { cn } from "@/lib/utils/cn";
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PX_PER_METER } from "../stage-plan-builder";
import { calculateConnectorLines } from "@/lib/utils/calculate-connector-lines";
import { ConnectorLine } from "../connector-line";

export type TMeasurmentData = {
  customLabel?: string;
};
export interface IMeasureEdgeData extends Edge {
  data: TMeasurmentData;
}

export function MeasureEdge(props: EdgeProps<IMeasureEdgeData>) {
  const { id, sourceX, sourceY, targetX, targetY, selected, data } = props;
  const { deleteElements, setEdges } = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      deleteElements({ edges: [{ id }] });
    },
    [deleteElements, id]
  );

  const handleLabelClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsEditing(true);
      setTempLabel(
        (data?.customLabel as string) || calculatedMeters.toFixed(2)
      );
    },
    [data?.customLabel, calculatedMeters]
  );

  const saveLabel = useCallback(() => {
    const trimmedLabel = tempLabel.trim();

    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...edge.data,
                customLabel: trimmedLabel || undefined,
              },
            }
          : edge
      )
    );

    setIsEditing(false);
  }, [tempLabel, setEdges, id]);

  const cancelEdit = useCallback(() => {
    setTempLabel((data?.customLabel as string) || calculatedMeters.toFixed(2));
    setIsEditing(false);
  }, [data?.customLabel, calculatedMeters]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveLabel();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancelEdit();
      }
    },
    [saveLabel, cancelEdit]
  );

  const handleBlur = useCallback(() => {
    saveLabel();
  }, [saveLabel]);

  const handleCloseEdit = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      cancelEdit();
    },
    [cancelEdit]
  );

  const [edgePath] = getStraightPath({
    sourceX: snapped.startX,
    sourceY: snapped.startY,
    targetX: snapped.endX,
    targetY: snapped.endY,
  });

  // Determine if delete button should be visible
  const isDeleteButtonVisible = isTouchDevice ? selected : false;

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
          stroke: selected ? "#3CB371" : "#334155",
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
          <button
            onClick={handleDelete}
            className={`pointer-events-auto absolute -top-7 left-1/2 flex h-6 w-6 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-opacity hover:bg-slate-100 ${
              isDeleteButtonVisible
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
            aria-label="Delete measurement"
            type="button"
          >
            <X className="h-3.5 w-3.5 text-slate-600" />
          </button>

          <div
            className={cn(
              "border-slate-300",
              selected && "border-slate-900",
              "pointer-events-auto flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1 text-xs shadow-sm"
            )}
          >
            {isEditing ? (
              <div className="relative flex items-center gap-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  className="w-20 rounded border border-blue-500 bg-white px-1 text-center text-xs outline-none"
                  aria-label="Edit measurement value"
                  maxLength={20}
                />
                <button
                  onClick={handleCloseEdit}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="Cancel editing"
                  className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-white shadow-sm hover:bg-gray-600"
                  type="button"
                >
                  <X className="h-2 w-2" />
                </button>
              </div>
            ) : (
              <>
                <span
                  onClick={handleLabelClick}
                  className="cursor-pointer hover:underline"
                >
                  {displayValue}
                </span>
              </>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
