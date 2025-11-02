import { useCallback } from "react";

import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import { TEquipmentType } from "../nodes/equipment-node";
import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitor-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";
import SynthStandIcon from "@/components/stage-plan-icons/synth-stand-icon/synth-stand-icon";
import { MicIcon } from "@/components/stage-plan-icons/mic-icon/mic-icon";

export function PaletteItem({
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
      case "mic":
        return <MicIcon width={25} height={25} />;
      case "monitor":
        return <MonitorIcon width={50} height={50} />;
      case "synth-stand":
        return <SynthStandIcon width={50} height={50} />;
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
      id="PaletteItem"
      draggable
      onDragStart={onDragStart}
      onClick={handleClick}
      className="min-h-16 flex cursor-grab items-center justify-items-end gap-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
    >
      {icon()} <span className="font-bold"> {label}</span>
    </div>
  );
}
