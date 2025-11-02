"use client";

import * as React from "react";

export type TSynthStandIconProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "width" | "height"
> & {
  title?: string;
  titleId?: string;
  hitboxPadding?: number;
  width?: number;
  height?: number;
};

const SynthStandIcon = React.forwardRef<SVGSVGElement, TSynthStandIconProps>(
  (
    {
      title = "Synth Stage",
      titleId,
      className,
      hitboxPadding = 5,
      width = 55,
      height = 120,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const a11yId = title ? titleId ?? `${autoId}-title` : undefined;

    return (
      <svg
        id="synth-stand"
        viewBox="0 0 64 120"
        ref={ref}
        role="img"
        aria-labelledby={a11yId}
        className={className}
        width={width}
        height={height}
        {...props}
      >
        {title ? <title id={a11yId}>{title}</title> : null}

        <rect
          x={-hitboxPadding}
          y={-hitboxPadding}
          width={64 + hitboxPadding * 2}
          height={120 + hitboxPadding * 2}
          fill="transparent"
        />

        {/* Laptop Screen */}
        <rect
          x={10}
          y={8}
          width={44}
          height={28}
          rx={1.5}
          fill="#1a1a1a"
          stroke="#3a3a3a"
          strokeWidth={2}
        />

        {/* Screen inner display */}
        <rect
          x={13}
          y={11}
          width={38}
          height={22}
          rx={0.5}
          fill="#0a0a0a"
          opacity={0.9}
        />

        {/* Screen reflection/highlight */}
        <rect
          x={15}
          y={13}
          width={16}
          height={4}
          rx={0.5}
          fill="#ffffff"
          opacity={0.08}
        />

        {/* Laptop keyboard/base */}
        <path
          d="M 12 36 L 8 48 L 56 48 L 52 36 Z"
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={1.5}
        />

        {/* Keyboard detail lines */}
        <line
          x1={14}
          y1={40}
          x2={50}
          y2={40}
          stroke="#404040"
          strokeWidth={0.5}
        />
        <line
          x1={15}
          y1={43}
          x2={49}
          y2={43}
          stroke="#404040"
          strokeWidth={0.5}
        />

        {/* Trackpad */}
        <rect
          x={26}
          y={44}
          width={12}
          height={3}
          rx={0.3}
          fill="#1a1a1a"
          stroke="#505050"
          strokeWidth={0.3}
        />

        {/* Stand mounting point */}
        <rect
          x={28}
          y={48}
          width={8}
          height={4}
          rx={1}
          fill="#3a3a3a"
          stroke="#1a1a1a"
          strokeWidth={0.8}
        />

        {/* Stand pole */}
        <rect
          x={30}
          y={52}
          width={4}
          height={55}
          rx={1}
          fill="#4a4a4a"
          stroke="#2a2a2a"
          strokeWidth={0.8}
        />

        {/* Stand pole highlight */}
        <line
          x1={31}
          y1={53}
          x2={31}
          y2={106}
          stroke="#6a6a6a"
          strokeWidth={0.5}
          opacity={0.4}
        />

        {/* Stand adjustment knob */}
        <circle
          cx={32}
          cy={80}
          r={2.5}
          fill="#5a5a5a"
          stroke="#3a3a3a"
          strokeWidth={1}
        />

        {/* Stand base - left leg */}
        <line
          x1={12}
          y1={115}
          x2={32}
          y2={107}
          stroke="#2a2a2a"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          x1={12}
          y1={115}
          x2={32}
          y2={107}
          stroke="#5a5a5a"
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Stand base - right leg */}
        <line
          x1={52}
          y1={115}
          x2={32}
          y2={107}
          stroke="#2a2a2a"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          x1={52}
          y1={115}
          x2={32}
          y2={107}
          stroke="#5a5a5a"
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Stand base - bottom */}
        <line
          x1={12}
          y1={115}
          x2={52}
          y2={115}
          stroke="#2a2a2a"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <line
          x1={12}
          y1={115}
          x2={52}
          y2={115}
          stroke="#5a5a5a"
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Foot pads */}
        <circle
          cx={12}
          cy={115}
          r={2}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.5}
        />
        <circle
          cx={52}
          cy={115}
          r={2}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.5}
        />
      </svg>
    );
  }
);

SynthStandIcon.displayName = "SynthStageIcon";

export default React.memo(SynthStandIcon);
