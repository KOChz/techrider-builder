"use client";

import * as React from "react";

export type MicStandIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};

const MicStandIcon = React.forwardRef<SVGSVGElement, MicStandIconProps>(
  ({ title = "Mic stand", titleId, ...props }, ref) => {
    const autoId = React.useId();
    const a11yId = title ? titleId ?? `${autoId}-title` : undefined;

    return (
      <svg
        id="mic-stand"
        ref={ref}
        viewBox="0 0 50 120"
        role="img"
        aria-labelledby={a11yId}
        {...props}
      >
        {title ? <title id={a11yId}>{title}</title> : null}

        {/* Base tripod legs - matte black powder coat */}
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

        {/* Center post connector - black metal */}
        <line
          x1={25}
          y1={115}
          x2={25}
          y2={108}
          stroke="#2a2a2a"
          strokeWidth={3}
        />

        {/* Main vertical pole - brushed chrome/silver */}
        <line
          x1={25}
          y1={108}
          x2={25}
          y2={30}
          stroke="#8b8b8b"
          strokeWidth={2.5}
        />

        {/* Boom arm - chrome with slight shadow */}
        <line
          x1={25}
          y1={30}
          x2={35}
          y2={15}
          stroke="#9a9a9a"
          strokeWidth={2}
        />

        {/* Mic clip bottom - black plastic */}
        <ellipse
          cx={35}
          cy={12}
          rx={3}
          ry={4}
          fill="#1a1a1a"
          stroke="#404040"
          strokeWidth={1}
        />

        {/* Mic body - dark metal housing */}
        <ellipse
          cx={35}
          cy={8}
          rx={4}
          ry={6}
          fill="#2a2a2a"
          stroke="#505050"
          strokeWidth={1.5}
        />

        {/* Mic grille mesh - charcoal black */}
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

        {/* Grille mesh lines - subtle gray */}
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

        {/* Boom arm joint - chrome knob */}
        <circle
          cx={25}
          cy={30}
          r={3}
          fill="#6a6a6a"
          stroke="#9a9a9a"
          strokeWidth={1.5}
        />

        {/* Height adjustment knob - smaller chrome detail */}
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
