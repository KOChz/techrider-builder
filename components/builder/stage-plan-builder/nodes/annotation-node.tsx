import { NodeProps } from "@xyflow/react";
import { TEquipmentData } from "./equipment-node";

interface IAnnotationNodeProps extends NodeProps {
  data: TEquipmentData;
}

export function AnnotationNode({ data, id }: IAnnotationNodeProps) {
  const rotation = data.rotation ?? 0;

  return (
    <div
      className="select-noneRetry opacity-45 flex origin-center items-center justify-center whitespace-nowrap rounded bg-transparent text-xl font-bold"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <span className="font-semibold tracking-widest text-slate-700/90">
        {data.label}
      </span>
    </div>
  );
}
