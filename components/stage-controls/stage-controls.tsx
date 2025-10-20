import React, { memo } from "react";

interface StageControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string; // e.g., "stage-controls"
}

export const StageControls: React.FC<StageControlsProps> = memo(
  ({ onZoomIn, onZoomOut, onReset, className }) => {
    return (
      <div className={className}>
        <div className="control-group">
          <button
            className="stage-btn"
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            Zoom In (+)
          </button>
          <button
            className="stage-btn"
            type="button"
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            Zoom Out (−)
          </button>
        </div>
        <button
          className="stage-btn"
          type="button"
          onClick={onReset}
          aria-label="Reset view"
        >
          Reset View
        </button>
      </div>
    );
  }
);

StageControls.displayName = "StageControls";
