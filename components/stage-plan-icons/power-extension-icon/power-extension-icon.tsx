"use client";

import * as React from "react";

export type PowerExtensionIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
  /** Toggle LED/switch visuals */
  isOn?: boolean;
  /** @deprecated use horizontalPadding / verticalPadding */
  hitboxPadding?: number;
  /** Extra hit area left+right */
  horizontalPadding?: number;
  /** Extra hit area top+bottom */
  verticalPadding?: number;
};

const PowerExtensionIcon = React.forwardRef<
  SVGSVGElement,
  PowerExtensionIconProps
>(
  (
    {
      title = "Power extension strip",
      titleId,
      isOn = true,
      hitboxPadding, // deprecated
      horizontalPadding,
      verticalPadding,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const a11yId = title ? titleId ?? `${autoId}-title` : undefined;

    // --- dimensions ---------------------------------------------------------
    const ICON_WIDTH = 200;
    const ICON_HEIGHT = 40;

    // Support new API first; fall back to legacy `hitboxPadding`
    const padX = horizontalPadding ?? hitboxPadding ?? 200; // wide like MicStand
    const padY = verticalPadding ?? hitboxPadding ?? 50;

    const hitboxX = -padX;
    const hitboxY = -padY;
    const hitboxWidth = ICON_WIDTH + padX * 2;
    const hitboxHeight = ICON_HEIGHT + padY * 2;

    // --- paints -------------------------------------------------------------
    const powerStripGradientId = `${autoId}-powerStripGradient`;
    const outletGradientId = `${autoId}-outletGradient`;

    const switchFill = isOn ? "#ff4444" : "#333333";
    const switchStroke = isOn ? "#cc0000" : "#111111";
    const ledOuter = isOn ? "#ff4444" : "#1a1a1a";
    const ledInner = isOn ? "#ff6666" : "#0f0f0f";
    const ledOuterOpacity = isOn ? 0.9 : 0.6;

    return (
      <svg
        id="power-extension"
        ref={ref}
        viewBox={`0 0 ${ICON_WIDTH} ${ICON_HEIGHT}`}
        role="img"
        aria-labelledby={a11yId}
        focusable="false"
        {...props}
      >
        {title ? <title id={a11yId}>{title}</title> : null}

        {/* Expanded hover/click hitbox */}
        <rect
          x={hitboxX}
          y={hitboxY}
          width={hitboxWidth}
          height={hitboxHeight}
          fill="transparent"
        />

        <defs>
          <linearGradient
            id={powerStripGradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2a2a2a" stopOpacity={1} />
            <stop offset="50%" stopColor="#1a1a1a" stopOpacity={1} />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity={1} />
          </linearGradient>
          <radialGradient id={outletGradientId}>
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity={1} />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity={1} />
          </radialGradient>
        </defs>

        {/* Main power strip housing */}
        <rect
          x={10}
          y={8}
          width={140}
          height={24}
          rx={3}
          fill={`url(#${powerStripGradientId})`}
          stroke="#000"
          strokeWidth={0.8}
        />

        {/* Top highlight */}
        <rect
          x={12}
          y={9}
          width={136}
          height={2}
          rx={1}
          fill="#3a3a3a"
          opacity={0.5}
        />

        {/* Power cable (left side) */}
        <path
          d="M 10 20 Q 5 20 2 18"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M 10 20 Q 5 20 2 18"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Outlet 1 */}
        <rect
          x={25}
          y={14}
          width={18}
          height={12}
          rx={2}
          fill={`url(#${outletGradientId})`}
          stroke="#000"
          strokeWidth={0.5}
        />
        <rect x={28} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <rect x={36} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <circle cx={33.5} cy={20} r={1.2} fill="#6a5511" />

        {/* Outlet 2 */}
        <rect
          x={50}
          y={14}
          width={18}
          height={12}
          rx={2}
          fill={`url(#${outletGradientId})`}
          stroke="#000"
          strokeWidth={0.5}
        />
        <rect x={53} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <rect x={61} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <circle cx={58.5} cy={20} r={1.2} fill="#6a5511" />

        {/* Outlet 3 */}
        <rect
          x={75}
          y={14}
          width={18}
          height={12}
          rx={2}
          fill={`url(#${outletGradientId})`}
          stroke="#000"
          strokeWidth={0.5}
        />
        <rect x={78} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <rect x={86} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <circle cx={83.5} cy={20} r={1.2} fill="#6a5511" />

        {/* Outlet 4 */}
        <rect
          x={100}
          y={14}
          width={18}
          height={12}
          rx={2}
          fill={`url(#${outletGradientId})`}
          stroke="#000"
          strokeWidth={0.5}
        />
        <rect x={103} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <rect x={111} y={17} width={3} height={6} rx={0.5} fill="#8b6914" />
        <circle cx={108.5} cy={20} r={1.2} fill="#6a5511" />

        {/* Power switch (right side) */}
        <rect
          x={125}
          y={13}
          width={12}
          height={14}
          rx={1.5}
          fill="#1a1a1a"
          stroke="#000"
          strokeWidth={0.5}
        />
        <rect
          x={127}
          y={15}
          width={8}
          height={5}
          rx={0.8}
          fill={switchFill}
          stroke={switchStroke}
          strokeWidth={0.4}
        />
        <text
          x={131}
          y={25}
          fontSize={4}
          fill="#888"
          textAnchor="middle"
          fontFamily="Arial"
        >
          ON
        </text>

        {/* Power indicator LED */}
        <circle
          cx={143}
          cy={20}
          r={2}
          fill={ledOuter}
          opacity={ledOuterOpacity}
        />
        <circle cx={143} cy={20} r={1.2} fill={ledInner} />

        {/* Mounting screws */}
        <circle
          cx={15}
          cy={13}
          r={1}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.3}
        />
        <circle
          cx={145}
          cy={13}
          r={1}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.3}
        />
        <circle
          cx={15}
          cy={27}
          r={1}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.3}
        />
        <circle
          cx={145}
          cy={27}
          r={1}
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth={0.3}
        />

        {/* Screw details */}
        <line
          x1={14}
          y1={12}
          x2={16}
          y2={14}
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
        <line
          x1={144}
          y1={12}
          x2={146}
          y2={14}
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
        <line
          x1={14}
          y1={26}
          x2={16}
          y2={28}
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
        <line
          x1={144}
          y1={26}
          x2={146}
          y2={28}
          stroke="#0a0a0a"
          strokeWidth={0.3}
        />
      </svg>
    );
  }
);

PowerExtensionIcon.displayName = "PowerExtensionIcon";

export default React.memo(PowerExtensionIcon);
