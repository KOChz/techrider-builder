import { cn } from "@/lib/utils/cn";

interface IStageNodeDeleteHandleProps {
  cx: number;
  cy: number;
  isVisible: boolean;
  nodeWidth?: number;
  spacing?: number;
  onClick?: () => void;
}

export const StageNodeDeleteHandle: React.FC<IStageNodeDeleteHandleProps> = ({
  cx,
  cy,
  isVisible,
  nodeWidth = 100,
  spacing = -5,
  onClick,
}) => {
  const handleRadius = 13;
  const handleX = cx - nodeWidth / 3.2 - handleRadius + spacing;
  const handleY = cy / 10;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.();
  };

  return (
    <g
      onMouseDown={handleMouseDown}
      className={cn(
        "delete-handle",
        "transition-opacity duration-200 ease-in-out cursor-pointer",
        isVisible
          ? "opacity-80 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      transform={`translate(${handleX}, ${handleY})`}
    >
      <circle
        className="delete-handle"
        cx={0}
        cy={0}
        r={handleRadius}
        fill="#ef4444"
        stroke="#fff"
        strokeWidth={2}
      />

      {/* Native SVG X icon instead of Lucide */}
      <g className="delete-handle pointer-events-none">
        <line
          x1={-5}
          y1={-5}
          x2={5}
          y2={5}
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <line
          x1={5}
          y1={-5}
          x2={-5}
          y2={5}
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};
