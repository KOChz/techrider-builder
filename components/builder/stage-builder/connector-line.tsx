interface IConnectorLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isSelected: boolean;
}

export function ConnectorLine({
  x1,
  y1,
  x2,
  y2,
  isSelected,
}: IConnectorLineProps) {
  return (
    <path
      d={`M ${x1},${y1} L ${x2},${y2}`}
      stroke={isSelected ? "#64748b" : "#cbd5e1"}
      strokeWidth={1}
      strokeDasharray="3,3"
      fill="none"
      className="pointer-events-none"
    />
  );
}
