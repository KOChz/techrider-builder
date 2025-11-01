"use client";

import * as React from "react";

export type TMicStandIconProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "width" | "height"
> & {
  title?: string;
  titleId?: string;
  width?: number;
  height?: number;
};

const MicStandIcon = React.forwardRef<SVGSVGElement, TMicStandIconProps>(
  (
    { title = "Mic stand", titleId, width = 50, height = 120, ...props },
    ref
  ) => {
    const autoId = React.useId();
    const a11yId = title ? titleId ?? `${autoId}-title` : undefined;

    return (
      <svg
        id="mic-stand"
        ref={ref}
        viewBox="0 0 50 120"
        role="img"
        aria-labelledby={a11yId}
        width={width}
        height={height}
        {...props}
      >
        {title ? <title id={a11yId}>{title}</title> : null}

        <line
          x1={25}
          y1={115}
          x2={10}
          y2={115}
          stroke="#1a1a1a"
          strokeWidth={3}
        />
        <line
          x1={25}
          y1={115}
          x2={40}
          y2={115}
          stroke="#1a1a1a"
          strokeWidth={3}
        />

        <line
          x1={25}
          y1={115}
          x2={25}
          y2={108}
          stroke="#2a2a2a"
          strokeWidth={3}
        />

        <line
          x1={25}
          y1={108}
          x2={25}
          y2={30}
          stroke="#8b8b8b"
          strokeWidth={2.5}
        />

        <line
          x1={25}
          y1={30}
          x2={35}
          y2={15}
          stroke="#9a9a9a"
          strokeWidth={2}
        />

        <ellipse
          cx={35}
          cy={12}
          rx={3}
          ry={4}
          fill="#1a1a1a"
          stroke="#404040"
          strokeWidth={1}
        />

        <ellipse
          cx={35}
          cy={8}
          rx={4}
          ry={6}
          fill="#2a2a2a"
          stroke="#505050"
          strokeWidth={1.5}
        />

        <rect
          x={31}
          y={2}
          width={8}
          height={6}
          rx={1}
          fill="#1a1a1a"
          stroke="#3a3a3a"
          strokeWidth={1}
        />

        <line
          x1={33}
          y1={3}
          x2={33}
          y2={7}
          stroke="#404040"
          strokeWidth={0.5}
        />
        <line
          x1={35}
          y1={3}
          x2={35}
          y2={7}
          stroke="#404040"
          strokeWidth={0.5}
        />
        <line
          x1={37}
          y1={3}
          x2={37}
          y2={7}
          stroke="#404040"
          strokeWidth={0.5}
        />

        <circle
          cx={25}
          cy={30}
          r={3}
          fill="#6a6a6a"
          stroke="#9a9a9a"
          strokeWidth={1.5}
        />

        <circle
          cx={25}
          cy={70}
          r={2.5}
          fill="#7a7a7a"
          stroke="#4a4a4a"
          strokeWidth={1}
        />
      </svg>
    );
  }
);

MicStandIcon.displayName = "MicStandIcon";

export default React.memo(MicStandIcon);
