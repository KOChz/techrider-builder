import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import { TEquipmentType } from "../nodes/equipment-node";
import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitop-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";
import { useCallback } from "react";

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
