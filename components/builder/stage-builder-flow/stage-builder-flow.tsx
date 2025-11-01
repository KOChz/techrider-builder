"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  Handle,
  type Node,
  type Edge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type EdgeProps,
  type ReactFlowInstance,
  useReactFlow,
  BackgroundVariant,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitop-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";
import { RotateCw, X } from "lucide-react";
import { getStraightPath } from "@xyflow/react";

import { IStagePlanFlowConfig } from "@/stores/use-project-creation-store";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils/cn";
import { useDevice } from "@/hooks/use-device";
import { MeasurementButton } from "../measurement-button/measurement-button";

// ---------- Domain types ----------
export type TEquipmentType =
  | "drumkit"
  | "amp"
  | "monitor"
  | "mic-stand"
  | "power-extension"
  | "di-box"
  | "equipment"
  | "microphone"
  | "instrument"
  | "speaker"
  | "custom";

export type TEquipmentData = {
  label: string;
  kind: TEquipmentType;
  rotation?: number;
  width?: number;
  height?: number;
};

const DEFAULT_PX_PER_METER = 100;

const CONNECTOR_THRESHOLD = 20;

interface IConnectorLines {
  sourceConnector: { x1: number; y1: number; x2: number; y2: number } | null;
  targetConnector: { x1: number; y1: number; x2: number; y2: number } | null;
}

export function calculateConnectorLines(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  snappedStartX: number,
  snappedStartY: number,
  snappedEndX: number,
  snappedEndY: number,
  axis: "horizontal" | "vertical"
): IConnectorLines {
  const sourceDistance =
    axis === "horizontal"
      ? Math.abs(sourceY - snappedStartY)
      : Math.abs(sourceX - snappedStartX);

  const targetDistance =
    axis === "horizontal"
      ? Math.abs(targetY - snappedEndY)
      : Math.abs(targetX - snappedEndX);

  return {
    sourceConnector:
      sourceDistance > CONNECTOR_THRESHOLD
        ? {
            x1: sourceX,
            y1: sourceY,
            x2: snappedStartX,
            y2: snappedStartY,
          }
        : null,
    targetConnector:
      targetDistance > CONNECTOR_THRESHOLD
        ? {
            x1: targetX,
            y1: targetY,
            x2: snappedEndX,
            y2: snappedEndY,
          }
        : null,
  };
}

interface IConnectorLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isSelected: boolean;
}

export function ConnectorLine({
  x1,
  y1,
  x2,
  y2,
  isSelected,
}: IConnectorLineProps) {
  return (
    <path
      d={`M ${x1},${y1} L ${x2},${y2}`}
      stroke={isSelected ? "#64748b" : "#cbd5e1"}
      strokeWidth={1}
      strokeDasharray="3,3"
      fill="none"
      className="pointer-events-none"
    />
  );
}

type TSnapAxis = "horizontal" | "vertical";

interface ISnappedCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  midX: number;
  midY: number;
  distance: number;
  axis: TSnapAxis;
}

export function calculateSnappedCoordinates(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): ISnappedCoordinates {
  const horizontalDistance = Math.abs(targetX - sourceX);
  const verticalDistance = Math.abs(targetY - sourceY);

  const isHorizontal = horizontalDistance >= verticalDistance;

  let startX: number, startY: number, endX: number, endY: number;

  if (isHorizontal) {
    const alignedY = (sourceY + targetY) / 2;
    startX = sourceX;
    startY = alignedY;
    endX = targetX;
    endY = alignedY;
  } else {
    const alignedX = (sourceX + targetX) / 2;
    startX = alignedX;
    startY = sourceY;
    endX = alignedX;
    endY = targetY;
  }

  const distance = Math.hypot(endX - startX, endY - startY);
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return {
    startX,
    startY,
    endX,
    endY,
    midX,
    midY,
    distance,
    axis: isHorizontal ? "horizontal" : "vertical",
  };
}

export type TMeasurmentData = {
  customLabel?: string;
};
export interface IMeasureEdgeData extends Edge {
  data: TMeasurmentData;
}

function MeasureEdge(props: EdgeProps<IMeasureEdgeData>) {
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

const edgeTypes = { measure: MeasureEdge };

export interface IEquipmentNodeProps extends NodeProps {
  data: TEquipmentData;
  id: string;
  selected: boolean;
}

interface IAnnotationNodeProps extends NodeProps {
  data: TEquipmentData;
}

function AnnotationNode({ data, id }: IAnnotationNodeProps) {
  const rotation = data.rotation ?? 0;

  return (
    <div
      className="select-noneRetry flex origin-center items-center justify-center whitespace-nowrap rounded bg-transparent text-9xl font-bold"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <span className="text-[12px] font-semibold text-slate-700">
        {data.label}
      </span>
    </div>
  );
}

function EquipmentNode({ data, id, selected }: IEquipmentNodeProps) {
  const { deleteElements, setNodes } = useReactFlow();
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const width = data.width ?? undefined;
  const height = data.height ?? undefined;

  const ICON_W = width ?? 100; // pick sensible defaults per icon type
  const ICON_H = height ?? 20;

  const icon = useMemo(() => {
    const iconProps = { width, height };

    switch (data.kind) {
      case "drumkit":
        return (
          <DrumkitIcon
          // {...{ width: (width || 0) * 2, height: (height || 0) * 2 }}
          />
        );
      case "amp":
        return <AmpIcon {...iconProps} />;
      case "monitor":
        return <MonitorIcon {...iconProps} />;
      case "mic-stand":
        return <MicStandIcon {...iconProps} />;
      case "power-extension":
        return <PowerExtensionIcon {...iconProps} />;
      case "di-box":
        return <DIBoxIcon {...iconProps} />;
      default:
        return null;
    }
  }, [data.kind]);

  const rotation = data.rotation ?? 0;

  useEffect(() => {
    if (isLabelEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isLabelEditing]);

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      deleteElements({ nodes: [{ id }] });
    },
    [deleteElements, id]
  );

  const handleRotate = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      const newRotation = (rotation + 90) % 360;

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                rotation: newRotation,
              },
            };
          }
          return node;
        })
      );
    },
    [rotation, setNodes, id]
  );

  const handleLabelClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsLabelEditing(true);
      setTempLabel(data.label);
    },
    [data.label]
  );

  const saveLabel = useCallback(() => {
    const trimmedLabel = tempLabel.trim();
    if (trimmedLabel && trimmedLabel !== data.label) {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: trimmedLabel,
              },
            };
          }
          return node;
        })
      );
    }
    setIsLabelEditing(false);
  }, [tempLabel, data.label, setNodes, id]);

  const cancelEdit = useCallback(() => {
    setTempLabel(data.label);
    setIsLabelEditing(false);
  }, [data.label]);

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

  return (
    <>
      <div
        className="group relative"
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
        }}
      >
        <>
          <button
            onClick={handleRotate}
            aria-label={`Rotate ${data.label}`}
            className={`absolute -right-3 -top-1 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition-opacity hover:bg-blue-600 ${
              selected ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
            }`}
          >
            <RotateCw className="h-2 w-2" />
          </button>

          <button
            onClick={handleDelete}
            aria-label={`Delete ${data.label}`}
            className={`absolute -left-3 -top-1 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-opacity hover:bg-red-600 ${
              selected ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
            }`}
          >
            <X className="h-2 w-2" />
          </button>
        </>

        <div
          style={{ transform: `rotate(${rotation}deg)` }}
          className="flex w-fit flex-col items-center justify-center text-center transition-transform duration-200 ease-in-out"
        >
          <div>{icon}</div>

          {isLabelEditing ? (
            <div className="relative flex w-min items-center gap-1">
              <input
                ref={inputRef}
                type="text"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="min-w-20 rounded border border-green-700/80 bg-white py-0.5 text-center text-base text-slate-900 outline-none sm:text-sm"
                aria-label="Edit equipment label"
                maxLength={50}
              />
              <button
                onClick={handleCloseEdit}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Cancel editing"
                className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-white shadow-sm hover:bg-gray-600"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ) : (
            <span
              onClick={handleLabelClick}
              className="cursor-pointer text-[10px] text-slate-900 hover:underline"
            >
              {data.label}
            </span>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="bg-red !h-full !w-3 opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="target"
          position={Position.Left}
          className="bg-red !h-full !w-3 opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-3 !w-full bg-none opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="target"
          position={Position.Top}
          className="!h-3 !w-full bg-none opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
      </div>
    </>
  );
}

const nodeTypes = { equipment: EquipmentNode, annotation: AnnotationNode };

// ---------- DnD Palette ----------
function PaletteItem({
  kind,
  label,
  onAddNode,
}: {
  kind: TEquipmentType;
  label: string;
  onAddNode: (kind: TEquipmentType) => void;
}) {
  const icon = () => {
    switch (kind) {
      case "drumkit":
        return <DrumkitIcon width={50} height={50} />;
      case "amp":
        return <AmpIcon width={50} height={50} />;
      case "monitor":
        return <MonitorIcon width={50} height={50} />;
      case "mic-stand":
        return <MicStandIcon width={50} height={50} />;
      case "power-extension":
        return <PowerExtensionIcon width={50} height={50} />;
      case "di-box":
        return <DIBoxIcon width={50} height={50} />;
      default:
        return null;
    }
  };

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("application/reactflow", kind);
      e.dataTransfer.effectAllowed = "move";
    },
    [kind]
  );

  const handleClick = useCallback(() => {
    onAddNode(kind);
  }, [kind, onAddNode]);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={handleClick}
      className="justify-items-end-safe items- min-h-16 flex cursor-grab items-center gap-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
    >
      {icon()} <span className="font-bold"> {label}</span>
    </div>
  );
}

interface IPaletteProps {
  onAddNode: (kind: TEquipmentType) => void;
}

function Palette({ onAddNode }: IPaletteProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAddNode = (kind: TEquipmentType) => {
    onAddNode(kind);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="relative xl:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-400/90 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <span>Add Equipment</span>
          <svg
            className={`h-5 w-5 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-slate-400/75 bg-white shadow-md">
            <div className="grid auto-rows-min gap-2 p-2">
              <PaletteItem
                kind="drumkit"
                label="Drumkit"
                onAddNode={handleAddNode}
              />
              <PaletteItem
                kind="monitor"
                label="Monitor"
                onAddNode={handleAddNode}
              />
              <PaletteItem kind="amp" label="Amp" onAddNode={handleAddNode} />
              <PaletteItem
                kind="mic-stand"
                label="Mic Stand"
                onAddNode={handleAddNode}
              />
              <PaletteItem
                kind="power-extension"
                label="Power Strip"
                onAddNode={handleAddNode}
              />
              <PaletteItem
                kind="di-box"
                label="DI Box"
                onAddNode={handleAddNode}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden xl:grid xl:auto-rows-min xl:gap-2">
        <PaletteItem kind="drumkit" label="Drumkit" onAddNode={onAddNode} />
        <PaletteItem kind="monitor" label="Monitor" onAddNode={onAddNode} />
        <PaletteItem kind="amp" label="Amp" onAddNode={onAddNode} />
        <PaletteItem kind="mic-stand" label="Mic Stand" onAddNode={onAddNode} />
        <PaletteItem
          kind="power-extension"
          label="Power Strip"
          onAddNode={onAddNode}
        />
        <PaletteItem kind="di-box" label="DI Box" onAddNode={onAddNode} />
      </div>
    </>
  );
}

export const egdeMeasure = "measure" as const;

// ---------- Main Builder ----------
export default function StagePlanBuilder({
  stagePlanConfig,
  setStagePlanConfig,
  isViewer = false,
}: {
  stagePlanConfig?: IStagePlanFlowConfig;
  setStagePlanConfig?: (config: IStagePlanFlowConfig) => void;
  isViewer?: boolean;
}) {
  const isBuilder = !isViewer;
  const [nodes, setNodes] = useState<Node<TEquipmentData>[]>([
    ...(stagePlanConfig?.nodes || [])!,
    {
      id: "up-stage",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Upstage",
      },
      position: { x: -0, y: -200 },
    },
    {
      id: "down-stage",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Downstage / Audience",
      },
      position: { x: 0, y: 400 },
    },
    {
      id: "stage-left",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Stage Left",
        rotation: -90,
      },
      position: { x: -400, y: 200 },
    },
    {
      id: "stage-right",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Stage Right",
        rotation: 90,
      },
      position: { x: 400, y: 200 },
    },
  ]);

  const [edges, setEdges] = useState<Edge<TMeasurmentData>[]>(
    stagePlanConfig?.edges || []
  );

  const [isMeasurementMode, setIsMeasurementMode] = useState(false);
  const [selectedSourceNode, setSelectedSourceNode] = useState<string | null>(
    null
  );

  const saveStagePlan = useDebouncedCallback(
    (n: Node<TEquipmentData>[], e: Edge<TMeasurmentData>[]) => {
      if (!setStagePlanConfig) return;

      const config: IStagePlanFlowConfig = {
        ...stagePlanConfig!,
        nodes: n,
        edges: e,
      };

      setStagePlanConfig(config);
    },
    800
  );

  useEffect(() => {
    saveStagePlan(nodes, edges);
  }, [nodes, edges, saveStagePlan]);

  const rfRef = useRef<ReactFlowInstance<Node<TEquipmentData>> | null>(null);

  const [pxPerMeter, setPxPerMeter] = useState<number>(DEFAULT_PX_PER_METER);
  const flowRef = useRef<HTMLDivElement | null>(null);

  // reflect current scale into a CSS var for the MeasureEdge
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--px-per-meter",
      String(pxPerMeter)
    );
  }, [pxPerMeter]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<TEquipmentData>) => {
      if (!isMeasurementMode) return;

      // Ignore annotation nodes
      if (node.type === "annotation") return;

      // First node selection
      if (!selectedSourceNode) {
        setSelectedSourceNode(node.id);
        return;
      }

      // Second node selection - create the edge
      if (selectedSourceNode && node.id !== selectedSourceNode) {
        const newEdge: Edge<TMeasurmentData> = {
          id: nanoid(),
          source: selectedSourceNode,
          target: node.id,
          type: egdeMeasure,
          data: {},
        };

        setEdges((eds) => [...eds, newEdge]);

        // Reset measurement mode
        setSelectedSourceNode(null);
        setIsMeasurementMode(false);
      }
    },
    [isMeasurementMode, selectedSourceNode]
  );

  const handleCancelMeasurement = useCallback(() => {
    setIsMeasurementMode(false);
    setSelectedSourceNode(null);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<TEquipmentData>>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) => addEdge({ ...c, type: egdeMeasure }, eds)),
    []
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData(
      "application/reactflow"
    ) as TEquipmentType;
    if (!kind || !rfRef.current) return;

    // v12: use screenToFlowPosition with raw client coords
    const position = rfRef.current.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const node: Node<TEquipmentData> = {
      id: nanoid(),
      type: "equipment",
      position,

      data: {
        kind,
        label:
          kind === "mic-stand"
            ? "Mic Stand"
            : kind === "power-extension"
            ? "Power Strip"
            : kind.replace("-", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      },
    };

    setNodes((ns) => ns.concat(node));
  }, []);

  const handleAddNode = useCallback((kind: TEquipmentType) => {
    if (!rfRef.current || !flowRef.current) return;

    // Get the flow container's bounding rectangle
    const flowBounds = flowRef.current.getBoundingClientRect();

    // Calculate the center point of the viewport
    const centerX = flowBounds.left + flowBounds.width / 2;
    const centerY = flowBounds.top + flowBounds.height / 2;

    // Convert screen coordinates to flow coordinates
    const position = rfRef.current.screenToFlowPosition({
      x: centerX,
      y: centerY,
    });

    const newNode: Node<TEquipmentData> = {
      id: nanoid(),
      type: "equipment",
      position,
      data: {
        kind,
        label:
          kind === "mic-stand"
            ? "Mic Stand"
            : kind === "power-extension"
            ? "Power Strip"
            : kind.replace("-", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, []);

  const { isMobile } = useDevice();

  return (
    <div className="flex flex-col gap-2 xl:h-[78dvh] xl:flex-row xl:items-stretch xl:justify-between">
      {/* Sidebar */}
      {isBuilder && (
        <div className="grid min-h-0 content-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:w-full lg:max-w-none xl:h-full xl:w-72 xl:flex-shrink-0">
          <div className="grid min-h-0 gap-1.5">
            <span className="text-xs text-slate-600">
              Connect two nodes to show distance.
            </span>

            <span className="md:display-none text-xs text-slate-600">
              <span className="font-bold text-green-700/90">Drag</span> from
              here into the canvas or{" "}
              <span className="font-bold text-green-700/90">Click</span> on
              mobile.
            </span>

            <div className="hidden md:block">
              <div className="h-px bg-slate-200" />
              <MeasurementButton
                isMeasurementMode={isMeasurementMode}
                selectedSourceNode={selectedSourceNode}
                onStartMeasurement={() => setIsMeasurementMode(true)}
                onCancelMeasurement={handleCancelMeasurement}
              />
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="grid min-h-0 gap-2">
            <strong className="text-xs text-slate-900">Equipment</strong>
            <Palette onAddNode={handleAddNode} />
            <span className="text-xs text-slate-600 md:hidden">
              <span className="font-bold text-green-700/90">Drag</span> from
              here into the canvas or{" "}
              <span className="font-bold text-green-700/90">Click</span> on
              mobile.
            </span>
          </div>

          <div className="md:hidden">
            <div className="h-px bg-slate-200" />
            <MeasurementButton
              isMeasurementMode={isMeasurementMode}
              selectedSourceNode={selectedSourceNode}
              onStartMeasurement={() => setIsMeasurementMode(true)}
              onCancelMeasurement={handleCancelMeasurement}
            />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={flowRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="aspect-square h-[45dvh] min-h-0 touch-none select-none overflow-auto rounded-xl border border-slate-200 xl:aspect-auto xl:h-full xl:flex-1"
        style={{ WebkitTouchCallout: "none" }}
      >
        <ReactFlow<Node<TEquipmentData>>
          onNodeClick={handleNodeClick}
          onInit={(inst) => (rfRef.current = inst)}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          panOnScroll
          panOnDrag
          zoomOnPinch
          zoomOnScroll={false}
          selectionOnDrag
          minZoom={isMobile ? 0.4 : 0.5}
          maxZoom={2.5}
          snapToGrid
          snapGrid={[10, 10]}
          style={{ width: "100%", height: "100%" }}
        >
          <Background
            id="1"
            gap={10}
            color="#f1f1f1"
            variant={BackgroundVariant.Lines}
          />
          <Background
            id="2"
            gap={100}
            color="#ccc"
            variant={BackgroundVariant.Lines}
          />
          <Controls
            showInteractive={false}
            position="bottom-right"
            className="md:scale-125"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export function StagePlanCanvasViewer({
  stagePlanConfig,
  setStagePlanConfig,
}: {
  stagePlanConfig?: IStagePlanFlowConfig;
  setStagePlanConfig?: (config: IStagePlanFlowConfig) => void;
}) {
  const [nodes, setNodes] = useState<Node<TEquipmentData>[]>([
    ...(stagePlanConfig?.nodes || [])!,
    {
      id: "up-stage",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Upstage",
      },
      position: { x: -0, y: -200 },
    },
    {
      id: "down-stage",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Downstage / Audience",
      },
      position: { x: 0, y: 400 },
    },
    {
      id: "stage-left",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Stage Left",
        rotation: -90,
      },
      position: { x: -400, y: 200 },
    },
    {
      id: "stage-right",
      type: "annotation",
      draggable: false,
      selectable: false,

      data: {
        kind: "amp",
        label: "Stage Right",
        rotation: 90,
      },
      position: { x: 400, y: 200 },
    },
  ]);

  const [edges, setEdges] = useState<Edge<TMeasurmentData>[]>(
    stagePlanConfig?.edges || []
  );

  const saveStagePlan = useDebouncedCallback(
    (n: Node<TEquipmentData>[], e: Edge<TMeasurmentData>[]) => {
      if (!setStagePlanConfig) return;

      const config: IStagePlanFlowConfig = {
        ...stagePlanConfig!,
        nodes: n,
        edges: e,
      };

      setStagePlanConfig(config);
    },
    800
  );

  useEffect(() => {
    saveStagePlan(nodes, edges);
  }, [nodes, edges, saveStagePlan]);

  const rfRef = useRef<ReactFlowInstance<Node<TEquipmentData>> | null>(null);

  const [pxPerMeter, setPxPerMeter] = useState<number>(DEFAULT_PX_PER_METER);
  const flowRef = useRef<HTMLDivElement | null>(null);

  // reflect current scale into a CSS var for the MeasureEdge
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--px-per-meter",
      String(pxPerMeter)
    );
  }, [pxPerMeter]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<TEquipmentData>>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) => addEdge({ ...c, type: egdeMeasure }, eds)),
    []
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData(
      "application/reactflow"
    ) as TEquipmentType;
    if (!kind || !rfRef.current) return;

    // v12: use screenToFlowPosition with raw client coords
    const position = rfRef.current.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const node: Node<TEquipmentData> = {
      id: nanoid(),
      type: "equipment",
      position,

      data: {
        kind,
        label:
          kind === "mic-stand"
            ? "Mic Stand"
            : kind === "power-extension"
            ? "Power Strip"
            : kind.replace("-", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      },
    };

    setNodes((ns) => ns.concat(node));
  }, []);

  const { isMobile } = useDevice();

  return (
    <div className="max-w-3/2 flex h-[50dvh] flex-col gap-2 px-2.5 md:h-[50dvh] md:max-h-none md:w-full md:flex-row md:justify-between md:px-0 xl:h-[70dvh]">
      {/* Canvas */}
      <div
        ref={flowRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="h-[50dvh] touch-none overflow-auto rounded-xl border border-gray-200 md:flex-1 xl:h-[70dvh]"
      >
        <ReactFlow<Node<TEquipmentData>>
          onInit={(inst) => (rfRef.current = inst)}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 10 }}
          proOptions={{ hideAttribution: true }}
          // sensible interaction defaults
          panOnScroll={false}
          preventScrolling={false}
          // panOnDrag={false}
          zoomOnPinch={true}
          zoomOnScroll={false}
          selectionOnDrag
          minZoom={isMobile ? 0.42 : 0.8}
          maxZoom={3}
          snapToGrid
          snapGrid={[10, 10]}
          style={{ overflow: "auto !important" }}
        >
          {/* <MiniMap pannable zoomable className="scale-65 md:scale-100" /> */}
          <Background
            id="1"
            gap={10}
            color="#f1f1f1"
            variant={BackgroundVariant.Lines}
          />

          <Background
            style={{ overflow: "auto" }}
            id="2"
            gap={100}
            color="#ccc"
            variant={BackgroundVariant.Lines}
          />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
}
