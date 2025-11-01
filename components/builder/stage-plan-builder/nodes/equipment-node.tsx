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

export interface IEquipmentNodeProps extends NodeProps {
  data: TEquipmentData;
  id: string;
  selected: boolean;
}

export function EquipmentNode({ data, id, selected }: IEquipmentNodeProps) {
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
          className="pointer-events-none! cursor-none! !h-full !w-3 opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="target"
          position={Position.Left}
          className="pointer-events-none! cursor-none! !h-full !w-3 opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="pointer-events-none! cursor-none! !h-3 !w-full bg-none opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="target"
          position={Position.Top}
          className="pointer-events-none! cursor-none! !h-3 !w-full bg-none opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
      </div>
    </>
  );
}
