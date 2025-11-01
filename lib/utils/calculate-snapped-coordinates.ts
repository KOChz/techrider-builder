export type TSnapAxis = "horizontal" | "vertical";

export interface ISnappedCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  midX: number;
  midY: number;
  distance: number;
  axis: TSnapAxis;
}

export function calculateSnappedCoordinates(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): ISnappedCoordinates {
  const horizontalDistance = Math.abs(targetX - sourceX);
  const verticalDistance = Math.abs(targetY - sourceY);

  const isHorizontal = horizontalDistance >= verticalDistance;

  let startX: number, startY: number, endX: number, endY: number;

  if (isHorizontal) {
    const alignedY = (sourceY + targetY) / 2;
    startX = sourceX;
    startY = alignedY;
    endX = targetX;
    endY = alignedY;
  } else {
    const alignedX = (sourceX + targetX) / 2;
    startX = alignedX;
    startY = sourceY;
    endX = alignedX;
    endY = targetY;
  }

  const distance = Math.hypot(endX - startX, endY - startY);
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return {
    startX,
    startY,
    endX,
    endY,
    midX,
    midY,
    distance,
    axis: isHorizontal ? "horizontal" : "vertical",
  };
}
