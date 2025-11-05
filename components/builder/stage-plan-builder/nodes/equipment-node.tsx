"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Position, Handle, useReactFlow, NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitor-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";
import { RotateCw, X } from "lucide-react";

import SynthStandIcon from "@/components/stage-plan-icons/synth-stand-icon/synth-stand-icon";
import { MicIcon } from "@/components/stage-plan-icons/mic-icon/mic-icon";
import { cn } from "@/lib/utils/cn";

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
  | "synth-stand"
  | "mic"
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

  const icon = useMemo(() => {
    const iconProps = { width, height };

    switch (data.kind) {
      case "drumkit":
        return <DrumkitIcon />;
      case "amp":
        return <AmpIcon {...iconProps} />;
      case "mic":
        return <MicIcon {...iconProps} />;
      case "synth-stand":
        return <SynthStandIcon {...iconProps} />;
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
            className={cn(
              `absolute -right-3 -top-1 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition-opacity hover:bg-blue-600`,
              selected ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
            )}
          >
            <RotateCw className="h-2 w-2" />
          </button>

          <button
            onClick={handleDelete}
            aria-label={`Delete ${data.label}`}
            className={cn(
              `absolute -left-3 -top-1 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-opacity hover:bg-red-600`,
              selected ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
            )}
          >
            <X className="h-2 w-2" />
          </button>
        </>

        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
          className="flex w-fit flex-col items-center justify-center text-center transition-transform duration-200 ease-in-out"
        >
          <div>{icon}</div>

          {isLabelEditing ? (
            <div className="relative flex w-min items-center gap-1 rounded-lg border border-green-700/80 bg-white pr-2">
              <input
                ref={inputRef}
                type="text"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="min-w-16 rounded-lg bg-white py-0.5 text-center text-[16px] text-base text-slate-900 outline-none"
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
              className="cursor-pointer text-[16px] text-slate-700/90 hover:underline"
            >
              {data.label}
            </span>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="pointer-events-none! cursor-none! opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="target"
          position={Position.Left}
          className="pointer-events-none! cursor-none! opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="pointer-events-none! cursor-none! bg-none opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
        <Handle
          type="target"
          position={Position.Top}
          className="pointer-events-none! cursor-none! bg-none opacity-0"
          isValidConnection={(c) => c.source !== c.target}
        />
      </div>
    </>
  );
}
