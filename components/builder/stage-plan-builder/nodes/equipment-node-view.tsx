"use client";

import React, { useMemo } from "react";
import { Position, Handle, NodeProps } from "@xyflow/react";
import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitor-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";

import SynthStandIcon from "@/components/stage-plan-icons/synth-stand-icon/synth-stand-icon";
import { MicIcon } from "@/components/stage-plan-icons/mic-icon/mic-icon";
import { TEquipmentData } from "./equipment-node";

import "@xyflow/react/dist/style.css";
import { useProjectStore } from "@/stores/use-project-creation-store";

export interface IEquipmentViewNodeProps extends NodeProps {
  data: TEquipmentData;
  id: string;
  selected: boolean;
}

export function EquipmentViewNode({
  data,
  id,
  selected,
}: IEquipmentViewNodeProps) {
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

  return (
    <>
      <div
        className="group relative select-none"
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
        }}
      >
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
          className="flex w-fit flex-col items-center justify-center text-center transition-transform duration-200 ease-in-out"
        >
          <div>{icon}</div>

          <span className="cursor-pointer text-[10px] text-slate-900 hover:underline">
            {data.label}
          </span>
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
