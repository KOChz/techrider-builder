import React, { memo, useRef } from "react";

export type Vec2 = { x: number; y: number };

interface StageCanvasProps {
  zoom: number; // e.g., 1 = 100%
  pan: Vec2; // SVG units
  className?: string;
  /** Mouse move in SVG coords (post pan/zoom). */
  onMouseMove?: (pt: Vec2) => void;
  /** Optional ref consumer for hit-testing, etc. */
  svgRefCb?: (el: SVGSVGElement | null) => void;
}

export const StageCanvas: React.FC<StageCanvasProps> = memo(
  ({ zoom, pan, className, onMouseMove, svgRefCb }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const handleMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
      if (!onMouseMove || !svgRef.current) return;
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;

      // Convert screen → SVG, then invert current pan/zoom transform
      const inv = ctm.inverse();
      const svgPt = pt.matrixTransform(inv);

      // Undo our pan/zoom so consumer gets logical world coords
      const logicalX = (svgPt.x - pan.x) / zoom;
      const logicalY = (svgPt.y - pan.y) / zoom;

      onMouseMove({ x: logicalX, y: logicalY });
    };

    return (
      <svg
        ref={(el) => {
          svgRef.current = el;
          svgRefCb?.(el);
        }}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Stage canvas"
      >
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="50" className="grid-line" />
            <line x1="0" y1="0" x2="50" y2="0" className="grid-line" />
          </pattern>

          <pattern
            id="grid-major"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <rect width="200" height="200" fill="url(#grid)" />
            <line x1="0" y1="0" x2="0" y2="200" className="grid-line-major" />
            <line x1="0" y1="0" x2="200" y2="0" className="grid-line-major" />
          </pattern>
        </defs>

        {/* Apply pan+zoom at the viewport level */}
        <g
          id="viewport"
          transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}
          onMouseMove={handleMouseMove}
        >
          <rect
            x={-5000}
            y={-5000}
            width={10000}
            height={10000}
            fill="url(#grid-major)"
          />
          <line x1={-5000} y1={0} x2={5000} y2={0} className="axis-line" />
          <line x1={0} y1={-5000} x2={0} y2={5000} className="axis-line" />

          <g id="stageNodes">
            {/* Sample equipment — keep draggable hook via className */}
            <use
              xlinkHref="#drumkit"
              x={-100}
              y={-100}
              width={100}
              height={100}
              className="draggable"
            />
            <use
              xlinkHref="#amp"
              x={150}
              y={-50}
              width={80}
              height={80}
              className="draggable"
            />
            <use
              xlinkHref="#amp"
              x={250}
              y={-50}
              width={80}
              height={80}
              className="draggable"
            />
            <use
              xlinkHref="#monitor"
              x={-200}
              y={50}
              width={70}
              height={70}
              className="draggable"
            />
            <use
              xlinkHref="#monitor"
              x={200}
              y={50}
              width={70}
              height={70}
              className="draggable"
            />
            <use
              xlinkHref="#mic-stand"
              x={-50}
              y={-80}
              width={40}
              height={100}
              className="draggable"
            />
          </g>
        </g>
      </svg>
    );
  }
);

StageCanvas.displayName = "StageCanvas";
