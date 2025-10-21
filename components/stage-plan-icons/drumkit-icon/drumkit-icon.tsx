"use client";

import React, { SVGProps, useId, useMemo } from "react";

interface IDrumkitIconProps extends SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  title?: string;
  description?: string;
  hitboxPadding?: number;
}

export function DrumkitIcon({
  width = 24,
  height = 24,
  title = "Drumkit",
  description = "A musical drumkit illustration",
  className,
  hitboxPadding = 5,
  ...restProps
}: IDrumkitIconProps): React.JSX.Element {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  // Only set aria-labelledby if the corresponding nodes exist
  const labelledBy = useMemo(() => {
    const ids: string[] = [];
    if (title) ids.push(titleId);
    if (description) ids.push(descId);
    return ids.length ? ids.join(" ") : undefined;
  }, [title, description, titleId, descId]);

  return (
    <svg
      id="drumkit"
      width={width}
      height={height}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={labelledBy}
      aria-hidden={labelledBy ? undefined : true}
      className={className}
      {...restProps}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {description ? <desc id={descId}>{description}</desc> : null}

      <rect
        x={-hitboxPadding}
        y={-hitboxPadding}
        width={50 + hitboxPadding * 2}
        height={50 + hitboxPadding * 2}
        fill="transparent"
      />

      {/* Drumstick holders */}
      <path d="M783.744 200.64h38.528V908.16h-38.528z" fill="#C2C7E5" />
      <path
        d="M822.272 187.584v-18.176h-38.528v18.176h-99.264v35.52h236.992v-35.52zM684.48 251.648h236.992v35.52h-236.992z"
        fill="#F5BB1B"
      />
      <path d="M218.496 200.64h38.528V908.16h-38.528z" fill="#C2C7E5" />
      <path
        d="M135.168 138.624l218.88 91.2-13.696 32.832-218.88-91.2z"
        fill="#F5BB1B"
      />

      {/* Left drum */}
      <path d="M73.024 347.392h317.568v35.52H73.024z" fill="#35464E" />
      <path d="M88.448 382.848h286.784v135.68H88.448z" fill="#E72845" />
      <path d="M73.024 518.656h317.568v35.648H73.024z" fill="#35464E" />
      <path d="M88.448 382.848h286.784v39.104H88.448z" fill="#C7161E" />
      <path
        d="M135.872 382.848h42.048v92.416h-42.048zM286.912 382.848h42.112v92.416h-42.112z"
        fill="#35464E"
      />

      {/* Right drum */}
      <path d="M644.16 347.392h317.568v35.52h-317.568z" fill="#35464E" />
      <path d="M659.648 382.848h286.72v135.68h-286.72z" fill="#E72845" />
      <path d="M644.16 518.656h317.568v35.648h-317.568z" fill="#35464E" />
      <path d="M659.648 382.848h286.72v39.104h-286.72z" fill="#C7161E" />
      <path
        d="M707.008 382.848h41.984v92.416h-41.984zM858.112 382.848h41.984v92.416h-41.984z"
        fill="#35464E"
      />

      {/* Drum legs */}
      <path
        d="M727.36 880.192l-33.408 27.84-52.352-62.72 33.344-27.84zM366.912 817.472l33.408 27.84-52.352 62.72-33.472-27.84z"
        fill="#C2C7E5"
      />

      {/* Center bass drum */}
      <path
        d="M521.664 671.424m-224.96 0a224.96 224.96 0 1 0 449.92 0 224.96 224.96 0 1 0-449.92 0Z"
        fill="#526C78"
      />
      <path
        d="M521.664 914.176a242.944 242.944 0 0 1-242.688-242.752 242.944 242.944 0 0 1 242.688-242.688 242.944 242.944 0 0 1 242.688 242.688 242.944 242.944 0 0 1-242.688 242.752z m0-449.856a207.36 207.36 0 0 0-207.168 207.104c0 114.24 92.928 207.168 207.168 207.168s207.232-92.928 207.232-207.168a207.424 207.424 0 0 0-207.232-207.104z"
        fill="#263137"
      />
    </svg>
  );
}
