import { X } from "lucide-react";

interface IStageNodeDeleteHandleProps {
  cx: number;
  cy: number;
  isVisible: boolean;
  nodeWidth?: number;
  spacing?: number;
}

/**
 * Delete handle indicator for stage nodes
 * Positioned at the left edge of the node for quick deletion access
 */
export const StageNodeDeleteHandle: React.FC<IStageNodeDeleteHandleProps> = ({
  cx,
  cy,
  isVisible,
  nodeWidth = 100,
  spacing = -5,
}) => {
  const handleRadius = 13;

  // Position at left edge: subtract half the node width, then add slight overlap with negative spacing
  const handleX = cx - nodeWidth / 3.2 - handleRadius + spacing;
  const handleY = cy / 10;

  return (
    <g
      opacity={isVisible ? 0.8 : 0}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.2s ease-in-out",
        cursor: "pointer",
      }}
      transform={`translate(${handleX}, ${handleY})`}
    >
      <circle
        cx={0}
        cy={0}
        r={handleRadius}
        fill="#ef4444"
        stroke="#fff"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
      />

      <X
        size={16}
        color="#fff"
        strokeWidth={2.5}
        style={{
          transform: "translate(-8px, -8px)",
        }}
      />
    </g>
  );
};
