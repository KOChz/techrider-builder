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
      className="delete-handle"
      onMouseDown={handleMouseDown}
      opacity={isVisible ? 0.8 : 0}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.2s ease-in-out",
        cursor: "pointer",
      }}
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
      <g className="delete-handle" style={{ pointerEvents: "none" }}>
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
