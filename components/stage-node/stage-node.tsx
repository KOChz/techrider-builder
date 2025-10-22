import { TStageNodeType } from "../builder/equipment-select/equipment-select";
import { StageNodeDeleteHandle } from "../stage-node-delete-handle/stage-node-delete-handle";
import { StageNodeHandle } from "../stage-node-handle/stage-node-handle";
import { equipmentConfig } from "../stage-plan/stage-plan";

export interface StageNode {
  id: number;
  x: number;
  y: number;
  label: string;
  type: TStageNodeType;
  angle: number;
  scale: number;
}

export interface StageNodeProps {
  node: StageNode;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const StageNodeComponent: React.FC<StageNodeProps> = ({
  node,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  const config = equipmentConfig[node.type];
  const scale = node.scale || 1;

  if (node.type === "text") {
    const handleY = -30;
    return (
      <g
        className="stage-node cursor-move"
        data-id={node.id}
        transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <text
          className="node-text"
          y={0}
          fontSize="28"
          letterSpacing="2"
          fill="#9a9a9a"
          opacity="0.7"
          fontWeight="600"
          textAnchor="middle"
        >
          {node.label}
        </text>
        <circle
          className="rotation-hitbox cursor-grab"
          cx={0}
          cy={handleY}
          r={20}
          fill="transparent"
        />
        <StageNodeHandle cx={0} cy={handleY} isVisible={isHovered} />
      </g>
    );
  }

  const handleY = -(config.height * scale) / 3.5 - 25;

  return (
    <g
      className="stage-node cursor-move"
      data-id={node.id}
      transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <use
        xlinkHref={`#${node.type}`}
        x={-(config.width * scale) / 2}
        y={-(config.height * scale) / 2}
        width={config.width * scale}
        height={config.height * scale}
      />
      <text
        className="node-text"
        y={config.labelOffset}
        fontSize="14"
        fill="#fff"
        textAnchor="middle"
      >
        {node.label}
      </text>
      <text
        className="node-coords"
        y={config.labelOffset + 15}
        fontSize="10"
        fill="#999"
        textAnchor="middle"
      >
        ({Math.round(node.x)}, {Math.round(node.y)}) • {Math.round(node.angle)}°
      </text>
      <circle
        className="rotation-hitbox cursor-grab"
        cx={0}
        cy={handleY}
        r={20}
        fill="transparent"
      />
      <StageNodeHandle cx={0} cy={handleY} isVisible={isHovered} />
    </g>
  );
};
