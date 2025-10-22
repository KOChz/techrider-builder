"use client";

import React from "react";
import { StageNodeDeleteHandle } from "@/components/stage-node-delete-handle/stage-node-delete-handle";
import { StageNodeHandle } from "@/components/stage-node-handle/stage-node-handle";
import { equipmentConfig } from "@/components/stage-plan/stage-plan";
import { TStageNodeType } from "../equipment-select/equipment-select";

export interface TStageNodeBuilder {
  id: number;
  x: number;
  y: number;
  label: string;
  type: TStageNodeType;
  angle: number; // degrees
  scale: number; // scalar
}

export interface StageNodeBuilderProps {
  node: TStageNodeBuilder;
  isHovered: boolean;
  isRotating: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete?: (nodeId: number) => void;
}

const CONTROL_R = 18;
const ROTATION_HITBOX_R = 28; // Larger hitbox for easier targeting
const HITBOX_SCALE_FACTOR = 1;

export const StageNodeBuilderComponent: React.FC<StageNodeBuilderProps> = ({
  node,
  isHovered,
  isRotating,
  onMouseEnter,
  onMouseLeave,
  onDelete,
}) => {
  const config = equipmentConfig[node.type];
  const scale = node.scale || 1;

  if (node.type === "text") {
    const handleY = -30;

    return (
      <g
        className="stage-node cursor-move"
        data-id={node.id}
        transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
      >
        <rect
          x={-120}
          y={handleY - ROTATION_HITBOX_R - 8}
          width={240}
          height={ROTATION_HITBOX_R + 8 + 28}
          fill="transparent"
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

        {/* Rotation feedback line */}
        {(isHovered || isRotating) && (
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={handleY}
            stroke={isRotating ? "#60a5fa" : "#4b5563"}
            strokeWidth={isRotating ? 2 : 1}
            strokeDasharray={isRotating ? "0" : "4 4"}
            pointerEvents="none"
            opacity={0.6}
          />
        )}

        {/* Rotation arc during rotation */}
        {isRotating && (
          <circle
            cx={0}
            cy={0}
            r={Math.abs(handleY) * 0.5}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={1}
            strokeDasharray="6 6"
            pointerEvents="none"
            opacity={0.3}
          />
        )}

        <circle
          className="rotation-hitbox cursor-grab"
          cx={0}
          cy={handleY}
          r={ROTATION_HITBOX_R}
          fill="transparent"
        />

        <g pointerEvents="none">
          <StageNodeDeleteHandle
            onClick={() => {
              onDelete?.(node.id);
            }}
            cx={0}
            cy={handleY}
            isVisible={isHovered}
          />
        </g>

        <circle
          className="delete-handle"
          cx={0}
          cy={handleY}
          r={CONTROL_R}
          fill="#000"
          fillOpacity={0.001}
        />
      </g>
    );
  }

  const isMicStand = node.type === "mic-stand";
  const baseW = (isMicStand ? config.width * 3 : config.width) * scale;
  const baseH = config.height * scale;

  const bodyW = baseW * HITBOX_SCALE_FACTOR;
  const bodyH = baseH * HITBOX_SCALE_FACTOR;

  const handleY = -(config.height * scale) / 3.5 - 25;

  const topY = Math.min(handleY - ROTATION_HITBOX_R - 6, -bodyH / 2);
  const bottomY = bodyH / 2;
  const unifiedHitboxY = topY;
  const unifiedHitboxH = bottomY - topY;

  return (
    <g
      className="stage-node cursor-move"
      data-id={node.id}
      transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
    >
      <rect
        x={-bodyW / 2}
        y={unifiedHitboxY}
        width={bodyW}
        height={unifiedHitboxH}
        fill="transparent"
        pointerEvents="visiblePainted"
      />

      {/* Rotation feedback line - shows rotation axis */}
      {(isHovered || isRotating) && (
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={handleY}
          stroke={isRotating ? "#96D9C0" : "#4b5563"}
          strokeWidth={isRotating ? 2 : 1}
          strokeDasharray={isRotating ? "0" : "4 4"}
          pointerEvents="none"
          opacity={0.6}
        />
      )}

      {/* Rotation arc during rotation - shows rotation range */}
      {isRotating && (
        <circle
          cx={0}
          cy={0}
          r={Math.abs(handleY)}
          fill="none"
          stroke="#96D9C0"
          strokeWidth={1}
          strokeDasharray="6 6"
          pointerEvents="none"
          opacity={0.3}
        />
      )}

      <use
        href={`#${node.type}`}
        x={-(config.width * scale) / 2}
        y={-(config.height * scale) / 2}
        width={config.width * scale}
        height={config.height * scale}
      />

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
        className="node-coords select-none"
        y={config.labelOffset + 15}
        fontSize="10"
        fill="#999"
        textAnchor="middle"
        pointerEvents="none"
      >
        ({Math.round(node.x)}, {Math.round(node.y)}) • {Math.round(node.angle)}°
      </text>

      {/* Larger rotation hitbox for easier targeting */}
      <circle
        className="rotation-hitbox cursor-grab"
        cx={0}
        cy={handleY}
        r={ROTATION_HITBOX_R}
        fill="transparent"
      />

      <g>
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

      <circle
        className="rotation-hitbox z-40"
        cx={0}
        cy={handleY}
        r={CONTROL_R}
        fill="#000"
        fillOpacity={0.001}
      />
    </g>
  );
};
