"use client";

import React from "react";

interface IDIBoxProps {
  width?: number;
  height?: number;
  className?: string;
  isPowerOn?: boolean;
  brandName?: string;
}

/**
 * Direct Input (DI) Box SVG Component
 * Renders a visual representation of an audio DI box with input/output jacks,
 * ground lift switch, PAD switch, and power LED indicator
 */
const DIBoxIcon: React.FC<IDIBoxProps> = ({
  width = 120,
  height = 80,
  className = "",
  isPowerOn = true,
  brandName,
}) => {
  const aspectRatio = 60 / 40;
  const calculatedHeight = width / aspectRatio;
  const finalHeight = height || calculatedHeight;

  return (
    <svg
      id="di-box"
      width={width / 2.5}
      height={finalHeight / 2.5}
      viewBox="0 0 60 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="diBoxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4a4a4a", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#2a2a2a", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#1a1a1a", stopOpacity: 1 }}
          />
        </linearGradient>
        <linearGradient id="diTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#3a3a3a", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#2a2a2a", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#1a1a1a", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* Main body - dark metal casing */}
      <rect
        x="5"
        y="8"
        width="50"
        height="24"
        rx="2"
        fill="url(#diBoxGradient)"
        stroke="#000"
        strokeWidth="0.8"
      />

      {/* Top beveled edge */}
      <path
        d="M 5 8 L 7 5 L 53 5 L 55 8 Z"
        fill="url(#diTopGradient)"
        stroke="#000"
        strokeWidth="0.6"
      />

      {/* Brand label area on top */}
      <rect x="15" y="6" width="30" height="2.5" rx="0.3" fill="#1a1a1a" />
      <text
        x="30"
        y="8"
        fontSize="2"
        fill="#c0c0c0"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        {brandName || "DIRECT BOX"}
      </text>

      {/* Screws on top corners */}
      <circle
        cx="9"
        cy="6.5"
        r="0.6"
        fill="#0a0a0a"
        stroke="#000"
        strokeWidth="0.2"
      />
      <circle
        cx="51"
        cy="6.5"
        r="0.6"
        fill="#0a0a0a"
        stroke="#000"
        strokeWidth="0.2"
      />
      <line
        x1="8.5"
        y1="6"
        x2="9.5"
        y2="7"
        stroke="#1a1a1a"
        strokeWidth="0.2"
      />
      <line
        x1="50.5"
        y1="6"
        x2="51.5"
        y2="7"
        stroke="#1a1a1a"
        strokeWidth="0.2"
      />

      {/* Left side - INPUT 1/4" jack */}
      <circle
        cx="5"
        cy="20"
        r="3"
        fill="#0a0a0a"
        stroke="#2a2a2a"
        strokeWidth="0.6"
      />
      <circle cx="5" cy="20" r="1.5" fill="#1a1a1a" />
      <circle cx="5" cy="20" r="0.6" fill="#3a3a3a" />

      {/* Right side - OUTPUT XLR connector */}
      <rect
        x="52"
        y="17"
        width="5"
        height="6"
        rx="0.8"
        fill="#1a1a1a"
        stroke="#2a2a2a"
        strokeWidth="0.5"
      />
      <circle cx="54.5" cy="20" r="1.5" fill="#0a0a0a" />
      {/* XLR pins */}
      <circle cx="53.3" cy="18.8" r="0.4" fill="#b8860b" />
      <circle cx="55.7" cy="18.8" r="0.4" fill="#b8860b" />
      <circle cx="54.5" cy="21.2" r="0.4" fill="#b8860b" />

      {/* Ground lift switch */}
      <rect
        x="12"
        y="14"
        width="7"
        height="5"
        rx="0.5"
        fill="#0a0a0a"
        stroke="#000"
        strokeWidth="0.3"
      />
      <rect x="13" y="15" width="2.5" height="3" rx="0.3" fill="#3a3a3a" />
      <text
        x="15.5"
        y="23"
        fontSize="1.5"
        fill="#7a7a7a"
        textAnchor="middle"
        fontFamily="Arial"
        fontWeight="bold"
      >
        GND
      </text>

      {/* PAD switch */}
      <rect
        x="23"
        y="14"
        width="7"
        height="5"
        rx="0.5"
        fill="#0a0a0a"
        stroke="#000"
        strokeWidth="0.3"
      />
      <rect x="24" y="15" width="2.5" height="3" rx="0.3" fill="#3a3a3a" />
      <text
        x="26.5"
        y="23"
        fontSize="1.5"
        fill="#7a7a7a"
        textAnchor="middle"
        fontFamily="Arial"
        fontWeight="bold"
      >
        PAD
      </text>

      {/* Power LED indicator */}
      <circle cx="40" cy="16.5" r="1.2" fill="#0a0a0a" />
      <circle cx="40" cy="16.5" r="0.9" fill="#2d5016" />
      <circle
        cx="40"
        cy="16.5"
        r="0.6"
        fill={isPowerOn ? "#4CAF50" : "#1a4d1a"}
        opacity={isPowerOn ? 0.95 : 0.4}
      />
      {isPowerOn && (
        <circle cx="39.6" cy="16.2" r="0.3" fill="#81C784" opacity="0.8" />
      )}
      <text
        x="40"
        y="23"
        fontSize="1.3"
        fill="#7a7a7a"
        textAnchor="middle"
        fontFamily="Arial"
        fontWeight="bold"
      >
        PWR
      </text>

      {/* Bottom shadow/depth */}
      <rect
        x="6"
        y="31"
        width="48"
        height="0.8"
        rx="0.2"
        fill="#000"
        opacity="0.4"
      />

      {/* Rubber feet shadows */}
      <ellipse cx="10" cy="32.5" rx="2" ry="0.6" fill="#000" opacity="0.3" />
      <ellipse cx="50" cy="32.5" rx="2" ry="0.6" fill="#000" opacity="0.3" />
    </svg>
  );
};

export default DIBoxIcon;
