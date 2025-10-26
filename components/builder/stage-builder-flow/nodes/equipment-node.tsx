import { useCallback, useMemo } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { X, RotateCw } from "lucide-react";
import { IEquipmentNodeProps } from "../stage-builder-flow";
import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitop-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";

function EquipmentNode({ data, id }: IEquipmentNodeProps) {
  const { deleteElements, setNodes } = useReactFlow();

  const icon = useMemo(() => {
    switch (data.kind) {
      case "drumkit":
        return <DrumkitIcon className="scale-200" />;
      case "amp":
        return <AmpIcon />;
      case "monitor":
        return <MonitorIcon />;
      case "mic-stand":
        return <MicStandIcon />;
      case "power-extension":
        return <PowerExtensionIcon />;
      case "di-box":
        return <DIBoxIcon />;
      default:
        return null;
    }
  }, [data.kind]);

  const rotation = data.rotation ?? 0;

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

  return (
    <div className="group relative">
      <button
        onClick={handleRotate}
        aria-label={`Rotate ${data.label}`}
        className="absolute -right-2 -top-2 z-10 flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white opacity-0 shadow-md transition-opacity hover:bg-blue-600 group-hover:opacity-100"
      >
        <RotateCw className="h-2 w-2" />
      </button>

      <button
        onClick={handleDelete}
        aria-label={`Delete ${data.label}`}
        className="absolute -right-2 top-2 z-10 flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-opacity hover:bg-red-600 group-hover:opacity-100"
      >
        <X className="h-2 w-2" />
      </button>

      <div
        style={{ transform: `rotate(${rotation}deg)` }}
        className="flex flex-col items-center transition-transform duration-200 ease-in-out"
      >
        {icon}
        <span className="text-[10px] text-slate-900">{data.label}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !rounded-full"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !rounded-full"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !rounded-full"
      />
    </div>
  );
}

export default EquipmentNode;
