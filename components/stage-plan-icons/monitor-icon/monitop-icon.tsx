"use client";

import * as React from "react";

export type MonitorIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  hitboxPadding?: number;
};

export const MonitorIcon = React.memo(
  React.forwardRef<SVGSVGElement, MonitorIconProps>(function MonitorIcon(
    {
      title = "Monitor",
      className,
      hitboxPadding = 5,
      width,
      height,
      ...props
    },
    ref
  ) {
    const uid = React.useId();
    const gBody = `${uid}-monitorBodyGradient`;
    const gSpeaker = `${uid}-speakerGradient`;

    return (
      <svg
        id="monitor"
        ref={ref}
        viewBox="0 0 70 50"
        role="img"
        aria-label={title}
        className={className}
        width={width || 55 + hitboxPadding * 2}
        height={height || 55 + hitboxPadding * 2}
        {...props}
      >
        <title>{title}</title>
        <rect
          x={-hitboxPadding}
          y={-hitboxPadding}
          width={width || 70 + hitboxPadding * 2}
          height={height || 70 + hitboxPadding * 2}
          fill="transparent"
        />
        <defs>
          <linearGradient id={gBody} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" stopOpacity={1} />
            <stop offset="50%" stopColor="#2a2a2a" stopOpacity={1} />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity={1} />
          </linearGradient>
          <linearGradient id={gSpeaker} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" stopOpacity={1} />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity={1} />
          </linearGradient>
        </defs>

        {/* Monitor body (trapezoid / wedge) */}
        <path
          d="M 10 45 L 5 15 L 65 15 L 60 45 Z"
          fill={`url(#${gBody})`}
          stroke="#000"
          strokeWidth={1}
        />

        {/* Front face (angled) */}
        <path
          d="M 5 15 L 35 5 L 65 15 Z"
          fill="#2a2a2a"
          stroke="#000"
          strokeWidth={0.8}
        />

        {/* Speaker grille */}
        <path
          d="M 12 40 L 8 20 L 62 20 L 58 40 Z"
          fill={`url(#${gSpeaker})`}
          stroke="#1a1a1a"
          strokeWidth={0.8}
        />

        {/* Grille mesh pattern */}
        <g opacity={0.5}>
          <line
            x1={10}
            y1={23}
            x2={60}
            y2={23}
            stroke="#0a0a0a"
            strokeWidth={0.4}
          />
          <line
            x1={10.5}
            y1={26}
            x2={59.5}
            y2={26}
            stroke="#0a0a0a"
            strokeWidth={0.4}
          />
          <line
            x1={11}
            y1={29}
            x2={59}
            y2={29}
            stroke="#0a0a0a"
            strokeWidth={0.4}
          />
          <line
            x1={11.5}
            y1={32}
            x2={58.5}
            y2={32}
            stroke="#0a0a0a"
            strokeWidth={0.4}
          />
          <line
            x1={12}
            y1={35}
            x2={58}
            y2={35}
            stroke="#0a0a0a"
            strokeWidth={0.4}
          />
          <line
            x1={12.5}
            y1={38}
            x2={57.5}
            y2={38}
            stroke="#0a0a0a"
            strokeWidth={0.4}
          />
        </g>

        {/* Speaker cone outlines */}
        <ellipse
          cx={35}
          cy={30}
          rx={12}
          ry={10}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={0.6}
          opacity={0.6}
        />
        <ellipse
          cx={35}
          cy={30}
          rx={8}
          ry={6}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={0.5}
          opacity={0.5}
        />

        {/* Handle on top */}
        <rect
          x={30}
          y={7}
          width={10}
          height={3}
          rx={1}
          fill="#1a1a1a"
          stroke="#0a0a0a"
          strokeWidth={0.5}
        />

        {/* Logo/brand area */}
        <rect
          x={28}
          y={21}
          width={14}
          height={4}
          rx={1}
          fill="#1a1a1a"
          opacity={0.6}
        />

        {/* Corner details */}
        <circle
          cx={13}
          cy={42}
          r={1}
          fill="#1a1a1a"
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
        <circle
          cx={57}
          cy={42}
          r={1}
          fill="#1a1a1a"
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
      </svg>
    );
  })
);
