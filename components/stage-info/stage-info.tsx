import React, { memo } from "react";
import { Vec2 } from "../stage-canvas/stage-canvas";

interface StageInfoProps {
  zoom: number; // 1.25 -> 125%
  pan: Vec2;
  mouse: Vec2;
  className?: string; // e.g., "stage-info"
}

const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

export const StageInfo: React.FC<StageInfoProps> = memo(
  ({ zoom, pan, mouse, className }) => {
    return (
      <div className={className}>
        <div className="info-line">
          Zoom: <span className="info-value">{Math.round(zoom * 100)}%</span>
        </div>
        <div className="info-line">
          Pan:{" "}
          <span className="info-value">
            {fmt(pan.x)}, {fmt(pan.y)}
          </span>
        </div>
        <div className="info-line">
          Mouse:{" "}
          <span className="info-value">
            {fmt(mouse.x)}, {fmt(mouse.y)}
          </span>
        </div>
      </div>
    );
  }
);

StageInfo.displayName = "StageInfo";
