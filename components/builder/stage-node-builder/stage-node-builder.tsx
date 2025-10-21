"use client";

import React from "react";
import { StageNodeDeleteHandle } from "@/components/stage-node-delete-handle/stage-node-delete-handle";
import { StageNodeHandle } from "@/components/stage-node-handle/stage-node-handle";
import { equipmentConfig } from "@/components/stage-plan/stage-plan";

export interface StageNodeBuilder {
  id: number;
  x: number;
  y: number;
  label: string;
  type:
    | "drumkit"
    | "amp"
    | "monitor"
    | "mic-stand"
    | "power-extension"
    | "di-box"
    | "text";
  angle: number;
  scale: number;
}

export interface StageNodeBuilderProps {
  node: StageNodeBuilder;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete?: (nodeId: number) => void;
}

// Keep the handle radius aligned with your visual component styling
const CONTROL_R = 18;

// Stop shrinking the hitbox. We want the corridor to the handles included.
const HITBOX_SCALE_FACTOR = 1;

export const StageNodeBuilderComponent: React.FC<StageNodeBuilderProps> = ({
  node,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onDelete,
}) => {
  const config = equipmentConfig[node.type];
  const scale = node.scale || 1;

  // Text nodes: simple path with unified hitbox around the handle
  if (node.type === "text") {
    const handleY = -30;

    return (
      <g
        className="stage-node"
        data-id={node.id}
        transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
        style={{ cursor: "move" }}
      >
        {/* Unified hitbox incl. handle */}
        <rect
          x={-120}
          y={handleY - CONTROL_R - 8}
          width={240}
          height={CONTROL_R + 8 + 28} // handle corridor + text area
          fill="transparent"
          pointerEvents="all"
        />

        <text
          className="node-text"
          y={0}
          fontSize="28"
          letterSpacing="2"
          fill="#9a9a9a"
          opacity="0.7"
          fontWeight="600"
          textAnchor="middle"
          pointerEvents="none"
        >
          {node.label}
        </text>

        {/* rotation / handle targets */}
        <circle
          className="rotation-hitbox"
          cx={0}
          cy={handleY}
          r={CONTROL_R}
          fill="transparent"
          style={{ cursor: "grab" }}
        />

        {/* Visuals rendered with pointerEvents=none, we handle events via overlays */}
        <g
          pointerEvents="none"
          onClick={(e) => {
            e.preventDefault(); // stop text selection / drag heuristics
            e.stopPropagation(); // don't let SVG handler see this
            onDelete?.(node.id);
          }}
        >
          <StageNodeDeleteHandle
            onClick={() => {
              onDelete?.(node.id);
            }}
            cx={0}
            cy={handleY}
            isVisible={isHovered}
          />
        </g>

        {/* Delete overlay (captures pointer, keeps hover alive, stops drag) */}
        <circle
          className="delete-handle"
          cx={0}
          cy={handleY}
          r={CONTROL_R}
          // Paint one alpha'd pixel so it's always hittable
          fill="#000"
          fillOpacity={0.001}
          // Capture phase => runs before the SVG's onPointerDown
          // onPointerDownCapture={(e) => {
          // e.preventDefault(); // stop text selection / drag heuristics
          // e.stopPropagation(); // don't let SVG handler see this
          // onDelete?.(node.id);
          // }}
          onClick={(e) => {
            console.log("click");
          }}
        />
      </g>
    );
  }

  // Non-text nodes
  const isMicStand = node.type === "mic-stand";
  const baseW = (isMicStand ? config.width * 3 : config.width) * scale;
  const baseH = config.height * scale;

  const bodyW = baseW * HITBOX_SCALE_FACTOR;
  const bodyH = baseH * HITBOX_SCALE_FACTOR;

  // Placement of the top handle
  const handleY = -(config.height * scale) / 3.5 - 25;

  // Unified hitbox that covers the body + corridor to handles
  const topY = Math.min(handleY - CONTROL_R - 6, -bodyH / 2);
  const bottomY = bodyH / 2;
  const unifiedHitboxY = topY;
  const unifiedHitboxH = bottomY - topY;

  return (
    <g
      className="stage-node !z-40"
      data-id={node.id}
      transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      style={{ cursor: "move" }}
    >
      {/* Unified hitbox ensures no dead zone between body and controls */}
      <rect
        x={-bodyW / 2}
        y={unifiedHitboxY}
        width={bodyW}
        height={unifiedHitboxH}
        fill="transparent"
        pointerEvents="visiblePainted" // ensures painted-only; your rect is transparent, so it won't steal hits
      />

      {/* Render the symbol. Keep visuals non-interactive; overlay rect handles pointer hits */}
      <use
        href={`#${node.type}`}
        x={-(config.width * scale) / 2}
        y={-(config.height * scale) / 2}
        width={config.width * scale}
        height={config.height * scale}
        pointerEvents="none"
      />

      {/* Labels are decorative */}
      <text
        className="node-text select-none"
        y={config.labelOffset}
        fontSize="14"
        fill="#fff"
        textAnchor="middle"
        pointerEvents="none"
      >
        {node.label}
      </text>
      <text
        className="node-coords"
        y={config.labelOffset + 15}
        fontSize="10"
        fill="#999"
        textAnchor="middle"
        pointerEvents="none"
      >
        ({Math.round(node.x)}, {Math.round(node.y)}) • {Math.round(node.angle)}°
      </text>

      {/* Rotation target */}
      <circle
        className="rotation-hitbox"
        cx={0}
        cy={handleY}
        r={CONTROL_R}
        fill="transparent"
        style={{ cursor: "grab" }}
      />

      {/* Visual handles with pointerEvents disabled */}
      <g pointerEvents="none">
        <StageNodeHandle cx={0} cy={handleY} isVisible={isHovered} />
        <StageNodeDeleteHandle
          onClick={() => {
            onDelete?.(node.id);
          }}
          cx={0}
          cy={handleY}
          isVisible={isHovered}
        />
      </g>

      {/* Overlay delete target to keep hover alive and intercept clicks */}
      <circle
        className="delete-handle z-40"
        cx={0}
        cy={handleY}
        r={CONTROL_R}
        // Paint one alpha'd pixel so it's always hittable
        fill="#000"
        fillOpacity={0.001}
        // Capture phase => runs before the SVG's onPointerDown
        // onPointerDownCapture={(e) => {
        //   e.preventDefault(); // stop text selection / drag heuristics
        //   e.stopPropagation(); // don't let SVG handler see this
        //   onDelete?.(node.id);
        // }}
        onClick={() => {
          console.log("click");
        }}
      />
    </g>
  );
};
