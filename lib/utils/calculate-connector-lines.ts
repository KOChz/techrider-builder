const CONNECTOR_THRESHOLD = 20;

interface IConnectorLines {
  sourceConnector: { x1: number; y1: number; x2: number; y2: number } | null;
  targetConnector: { x1: number; y1: number; x2: number; y2: number } | null;
}

export function calculateConnectorLines(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  snappedStartX: number,
  snappedStartY: number,
  snappedEndX: number,
  snappedEndY: number,
  axis: "horizontal" | "vertical"
): IConnectorLines {
  const sourceDistance =
    axis === "horizontal"
      ? Math.abs(sourceY - snappedStartY)
      : Math.abs(sourceX - snappedStartX);

  const targetDistance =
    axis === "horizontal"
      ? Math.abs(targetY - snappedEndY)
      : Math.abs(targetX - snappedEndX);

  return {
    sourceConnector:
      sourceDistance > CONNECTOR_THRESHOLD
        ? {
            x1: sourceX,
            y1: sourceY,
            x2: snappedStartX,
            y2: snappedStartY,
          }
        : null,
    targetConnector:
      targetDistance > CONNECTOR_THRESHOLD
        ? {
            x1: targetX,
            y1: targetY,
            x2: snappedEndX,
            y2: snappedEndY,
          }
        : null,
  };
}
