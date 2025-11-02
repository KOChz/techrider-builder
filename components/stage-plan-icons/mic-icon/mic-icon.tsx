"use client";

import * as React from "react";

export type TMicIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  hitboxPadding?: number;
};

/**
 * Microphone icon built from provided SVG.
 * Color system + API mirrors AmpIcon for consistency.
 */
export const MicIcon = React.memo(
  React.forwardRef<SVGSVGElement, TMicIconProps>(function MicrophoneIcon(
    {
      title = "Microphone",
      className,
      hitboxPadding = 5,
      width,
      height,
      ...props
    },
    ref
  ) {
    const uid = React.useId();
    const gBody = `${uid}-bodyGradient`;
    const gGrille = `${uid}-grilleGradient`;
    const gAccent = `${uid}-accentGradient`;

    return (
      <svg
        viewBox="0 0 256 256"
        ref={ref}
        role="img"
        aria-label={title}
        className={className}
        width={width || 24}
        height={height || 24}
        {...props}
      >
        <title>{title}</title>

        {/* Hitbox padding for easier touch/drag */}
        <rect
          x={-hitboxPadding}
          y={-hitboxPadding}
          width={256 + hitboxPadding * 2}
          height={256 + hitboxPadding * 2}
          fill="transparent"
        />

        {/* Same color schema as AmpIcon */}
        <defs>
          {/* Body: deep vertical charcoal */}
          <linearGradient id={gBody} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          {/* Grille: slightly lighter vertical charcoal */}
          <linearGradient id={gGrille} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="50%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>

          {/* Accent: gold radial */}
          <radialGradient id={gAccent}>
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="70%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#8b6914" />
          </radialGradient>
        </defs>

        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
          {/* Top accent pieces (grille gradient for detail) */}
          <g fill={`url(#${gGrille})`}>
            <path d="M 81.682 32.457 c 6.379 -7.802 5.933 -19.358 -1.342 -26.634 C 76.584 2.068 71.591 0 66.28 0 c -4.639 0 -9.035 1.579 -12.575 4.48 L 81.682 32.457 z" />
            <path d="M 50.877 7.309 c -2.902 3.541 -4.48 7.936 -4.48 12.575 c 0 5.311 2.068 10.304 5.824 14.06 c 3.755 3.756 8.748 5.824 14.06 5.824 c 4.638 0 9.034 -1.579 12.575 -4.481 L 50.877 7.309 z" />
          </g>

          {/* Primary microphone body (body gradient) */}
          <g fill={`url(#${gBody})`}>
            <path d="M 37.826 86 H 10.955 c -1.25 0 -2.306 -0.679 -2.827 -1.814 c -0.52 -1.137 -0.343 -2.38 0.473 -3.326 l 1.761 -2.04 c 1.591 1.007 3.416 1.522 5.247 1.522 c 2.295 0 4.595 -0.798 6.438 -2.409 l 3.939 -3.442 L 11.674 60.177 l -3.442 3.94 C 5.275 67.5 5.058 72.422 7.486 76.031 l -1.913 2.215 c -1.839 2.131 -2.253 5.045 -1.082 7.604 S 8.14 90 10.955 90 h 26.871 c 1.104 0 2 -0.896 2 -2 S 38.931 86 37.826 86 z" />
            <path d="M 29.006 71.852 l 32.126 -28.069 c -4.493 -1.111 -8.614 -3.425 -11.969 -6.781 c -3.357 -3.356 -5.67 -7.477 -6.781 -11.969 l -28.07 32.125 L 29.006 71.852 z" />
          </g>

          {/* Subtle outline for legibility at small sizes */}
          <g fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="0.8">
            <path d="M 81.682 32.457 c 6.379 -7.802 5.933 -19.358 -1.342 -26.634 C 76.584 2.068 71.591 0 66.28 0 c -4.639 0 -9.035 1.579 -12.575 4.48 L 81.682 32.457 z" />
            <path d="M 50.877 7.309 c -2.902 3.541 -4.48 7.936 -4.48 12.575 c 0 5.311 2.068 10.304 5.824 14.06 c 3.755 3.756 8.748 5.824 14.06 5.824 c 4.638 0 9.034 -1.579 12.575 -4.481 L 50.877 7.309 z" />
            <path d="M 37.826 86 H 10.955 c -1.25 0 -2.306 -0.679 -2.827 -1.814 c -0.52 -1.137 -0.343 -2.38 0.473 -3.326 l 1.761 -2.04 c 1.591 1.007 3.416 1.522 5.247 1.522 c 2.295 0 4.595 -0.798 6.438 -2.409 l 3.939 -3.442 L 11.674 60.177 l -3.442 3.94 C 5.275 67.5 5.058 72.422 7.486 76.031 l -1.913 2.215 c -1.839 2.131 -2.253 5.045 -1.082 7.604 S 8.14 90 10.955 90 h 26.871 c 1.104 0 2 -0.896 2 -2 S 38.931 86 37.826 86 z" />
            <path d="M 29.006 71.852 l 32.126 -28.069 c -4.493 -1.111 -8.614 -3.425 -11.969 -6.781 c -3.357 -3.356 -5.67 -7.477 -6.781 -11.969 l -28.07 32.125 L 29.006 71.852 z" />
          </g>
        </g>
      </svg>
    );
  })
);
