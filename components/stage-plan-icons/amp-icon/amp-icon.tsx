"use client";

import * as React from "react";

export type AmpIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  hitboxPadding?: number;
};

export const AmpIcon = React.memo(
  React.forwardRef<SVGSVGElement, AmpIconProps>(function AmpIcon(
    { title = "Amp", className, hitboxPadding = 5, ...props },
    ref
  ) {
    const uid = React.useId();
    const gBody = `${uid}-ampBodyGradient`;
    const gGrille = `${uid}-grilleGradient`;
    const gKnob = `${uid}-knobGradient`;

    return (
      <svg
        id="amp"
        viewBox="0 0 50 50"
        ref={ref}
        role="img"
        aria-label={title}
        className={className}
        {...props}
      >
        <title>{title}</title>

        <rect
          x={-hitboxPadding}
          y={-hitboxPadding}
          width={50 + hitboxPadding * 2}
          height={50 + hitboxPadding * 2}
          fill="transparent"
        />

        <defs>
          <linearGradient id={gBody} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" stopOpacity="1" />
            <stop offset="50%" stopColor="#1a1a1a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
          </linearGradient>

          <linearGradient id={gGrille} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a4a4a" stopOpacity="1" />
            <stop offset="50%" stopColor="#3a3a3a" stopOpacity="1" />
            <stop offset="100%" stopColor="#2a2a2a" stopOpacity="1" />
          </linearGradient>

          <radialGradient id={gKnob}>
            <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
            <stop offset="70%" stopColor="#b8860b" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b6914" stopOpacity="1" />
          </radialGradient>
        </defs>

        <rect
          x={3}
          y={6}
          width={44}
          height={38}
          rx={2}
          fill={`url(#${gBody})`}
          stroke="#000"
          strokeWidth={0.5}
        />
        <path
          d="M 15 6 Q 15 3 25 3 Q 35 3 35 6"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={2}
        />
        <rect
          x={5}
          y={8}
          width={40}
          height={6}
          rx={1}
          fill="#1a1a1a"
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
        <circle cx={9} cy={11} r={1} fill="#ff4444" opacity={0.8} />
        <circle
          cx={16}
          cy={11}
          r={1.2}
          fill={`url(#${gKnob})`}
          stroke="#8b6914"
          strokeWidth={0.3}
        />
        <circle
          cx={22}
          cy={11}
          r={1.2}
          fill={`url(#${gKnob})`}
          stroke="#8b6914"
          strokeWidth={0.3}
        />
        <circle
          cx={28}
          cy={11}
          r={1.2}
          fill={`url(#${gKnob})`}
          stroke="#8b6914"
          strokeWidth={0.3}
        />
        <circle
          cx={34}
          cy={11}
          r={1.2}
          fill={`url(#${gKnob})`}
          stroke="#8b6914"
          strokeWidth={0.3}
        />
        <circle
          cx={40}
          cy={11}
          r={1.2}
          fill={`url(#${gKnob})`}
          stroke="#8b6914"
          strokeWidth={0.3}
        />
        <line
          x1={16}
          y1={10}
          x2={16}
          y2={9.2}
          stroke="#fff"
          strokeWidth={0.3}
        />
        <line
          x1={22}
          y1={10}
          x2={22}
          y2={9.2}
          stroke="#fff"
          strokeWidth={0.3}
        />
        <line
          x1={28}
          y1={10}
          x2={28}
          y2={9.2}
          stroke="#fff"
          strokeWidth={0.3}
        />
        <line
          x1={34}
          y1={10}
          x2={34}
          y2={9.2}
          stroke="#fff"
          strokeWidth={0.3}
        />
        <line
          x1={40}
          y1={10}
          x2={40}
          y2={9.2}
          stroke="#fff"
          strokeWidth={0.3}
        />

        <rect
          x={7}
          y={16}
          width={36}
          height={26}
          rx={1.5}
          fill={`url(#${gGrille})`}
          stroke="#2a2a2a"
          strokeWidth={0.5}
        />

        <g opacity={0.6}>
          {/* Horizontal grille lines */}
          <line
            x1={9}
            y1={18}
            x2={41}
            y2={18}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={20}
            x2={41}
            y2={20}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={22}
            x2={41}
            y2={22}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={24}
            x2={41}
            y2={24}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={26}
            x2={41}
            y2={26}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={28}
            x2={41}
            y2={28}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={30}
            x2={41}
            y2={30}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={32}
            x2={41}
            y2={32}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={34}
            x2={41}
            y2={34}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={36}
            x2={41}
            y2={36}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={38}
            x2={41}
            y2={38}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={9}
            y1={40}
            x2={41}
            y2={40}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          {/* Vertical grille lines */}
          <line
            x1={11}
            y1={16}
            x2={11}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={15}
            y1={16}
            x2={15}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={19}
            y1={16}
            x2={19}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={23}
            y1={16}
            x2={23}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={27}
            y1={16}
            x2={27}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={31}
            y1={16}
            x2={31}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={35}
            y1={16}
            x2={35}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
          <line
            x1={39}
            y1={16}
            x2={39}
            y2={42}
            stroke="#1a1a1a"
            strokeWidth={0.3}
          />
        </g>

        <circle
          cx={25}
          cy={29}
          r={8}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={0.5}
          opacity={0.5}
        />
        <circle
          cx={25}
          cy={29}
          r={5}
          fill="none"
          stroke="#3a3a3a"
          strokeWidth={0.4}
          opacity={0.4}
        />

        <circle
          cx={8}
          cy={17}
          r={0.6}
          fill="#4a4a4a"
          stroke="#2a2a2a"
          strokeWidth={0.2}
        />
        <circle
          cx={42}
          cy={17}
          r={0.6}
          fill="#4a4a4a"
          stroke="#2a2a2a"
          strokeWidth={0.2}
        />
        <circle
          cx={8}
          cy={41}
          r={0.6}
          fill="#4a4a4a"
          stroke="#2a2a2a"
          strokeWidth={0.2}
        />
        <circle
          cx={42}
          cy={41}
          r={0.6}
          fill="#4a4a4a"
          stroke="#2a2a2a"
          strokeWidth={0.2}
        />

        <rect
          x={44}
          y={35}
          width={2}
          height={4}
          rx={0.5}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.3}
        />
      </svg>
    );
  })
);
