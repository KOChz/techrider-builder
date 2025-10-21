import { StageNodeDeleteHandle } from "@/components/stage-node-delete-handle/stage-node-delete-handle";
import { StageNodeHandle } from "@/components/stage-node-handle/stage-node-handle";
import { equipmentConfig } from "@/components/stage-plan/stage-plan";

export interface StageNodeBuilder {
  id: number;
  x: number;
  y: number;
  label: string;
  type:
    | "drumkit"
    | "amp"
    | "monitor"
    | "mic-stand"
    | "power-extension"
    | "di-box"
    | "text";
  angle: number;
  scale: number;
}

export interface StageNodeBuilderProps {
  node: StageNodeBuilder;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete?: (nodeId: number) => void;
}

const HITBOX_SCALE_FACTOR = 0.85;

export const StageNodeBuilderComponent: React.FC<StageNodeBuilderProps> = ({
  node,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onDelete,
}) => {
  const config = equipmentConfig[node.type];
  const scale = node.scale || 1;

  if (node.type === "text") {
    const handleY = -30;
    return (
      <g
        className="stage-node"
        data-id={node.id}
        transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ cursor: "move" }}
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
          className="rotation-hitbox"
          cx={0}
          cy={handleY}
          r={20}
          fill="transparent"
          style={{ cursor: "grab" }}
        />
        <StageNodeDeleteHandle
          onClick={() => onDelete?.(node.id)}
          cx={0}
          cy={handleY}
          isVisible={isHovered}
        />
      </g>
    );
  }

  const handleY = -(config.height * scale) / 3.5 - 25;

  const isMicStand = node.type === "mic-stand";
  const baseHitboxWidth = isMicStand
    ? config.width * scale * 3
    : config.width * scale;

  const hitboxWidth = baseHitboxWidth * HITBOX_SCALE_FACTOR;
  const hitboxHeight = config.height * scale * HITBOX_SCALE_FACTOR;

  return (
    <g
      className="stage-node"
      data-id={node.id}
      transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: "move" }}
    >
      <rect
        x={-hitboxWidth / 2}
        y={-hitboxHeight / 2}
        width={hitboxWidth}
        height={hitboxHeight}
        fill="transparent"
        stroke="transparent"
        pointerEvents="all"
      />

      <use
        xlinkHref={`#${node.type}`}
        x={-(config.width * scale) / 2}
        y={-(config.height * scale) / 2}
        width={config.width * scale}
        height={config.height * scale}
        pointerEvents="none"
      />
      <text
        className="node-text"
        y={config.labelOffset}
        fontSize="14"
        fill="#fff"
        textAnchor="middle"
        pointerEvents="none"
      >
        {node.label}
      </text>
      <text
        className="node-coords"
        y={config.labelOffset + 15}
        fontSize="10"
        fill="#999"
        textAnchor="middle"
        pointerEvents="none"
      >
        ({Math.round(node.x)}, {Math.round(node.y)}) • {Math.round(node.angle)}°
      </text>
      <circle
        className="rotation-hitbox"
        cx={0}
        cy={handleY}
        r={20}
        fill="transparent"
        style={{ cursor: "grab" }}
      />
      <StageNodeHandle cx={0} cy={handleY} isVisible={isHovered} />
      <StageNodeDeleteHandle
        onClick={() => onDelete?.(node.id)}
        cx={0}
        cy={handleY}
        isVisible={isHovered}
      />
    </g>
  );
};
