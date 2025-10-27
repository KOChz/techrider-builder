"use client";

import React, { useEffect, useState } from "react";
import { StageNodeDeleteHandle } from "@/components/stage-node-delete-handle/stage-node-delete-handle";
import { StageNodeHandle } from "@/components/stage-node-handle/stage-node-handle";
import { equipmentConfig } from "@/components/stage-plan/stage-plan";
import { TStageNodeType } from "@/schemas/stage-plan-schema";

export interface TStageNodeBuilder {
  id: string;
  x: number;
  y: number;
  label: string;
  type: TStageNodeType;
  angle: number;
  scale: number;
}

export interface StageNodeBuilderProps {
  node: TStageNodeBuilder;
  isHovered: boolean;
  isRotating: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete?: (nodeId: string) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onUpdateLabel?: (nodeId: string, newLabel: string) => void;
}

type TXHTMLDivProps = React.HTMLAttributes<HTMLDivElement> & {
  xmlns?: string;
};

const XHTMLDiv: React.FC<TXHTMLDivProps> = (props) => <div {...props} />;

const CONTROL_R = 18;
const ROTATION_HITBOX_R = 28;
const HITBOX_SCALE_FACTOR = 1;

export const StageNodeBuilderComponent: React.FC<StageNodeBuilderProps> = ({
  node,
  isHovered,
  isRotating,
  onMouseEnter,
  onMouseLeave,
  onDelete,
  onPointerDown,
  onUpdateLabel,
}) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editValue, setEditValue] = useState("");

  const config = equipmentConfig[node.type];
  const scale = node.scale || 1;

  const startEditing = () => {
    setIsEditingLabel(true);
    setEditValue(node.label);
  };

  const commitLabel = () => {
    const trimmedValue = editValue.trim();
    setIsEditingLabel(false);

    if (trimmedValue && trimmedValue !== node.label) {
      onUpdateLabel?.(node.id, trimmedValue);
    }
  };

  const cancelEditing = () => {
    setIsEditingLabel(false);
    setEditValue("");
  };

  useEffect(() => {
    setEditValue(node.label);
  }, [node.id, node.label]);

  if (node.type === "text") {
    const handleY = -30;

    return (
      <g
        className="stage-node cursor-move"
        data-id={node.id}
        transform={`translate(${node.x}, ${node.y}) rotate(${node.angle})`}
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
        onPointerDown={onPointerDown}
      >
        <rect
          x={-120}
          y={handleY - ROTATION_HITBOX_R - 8}
          width={240}
          height={ROTATION_HITBOX_R + 8 + 28}
          fill="transparent"
        />

        {isEditingLabel ? (
          <foreignObject
            x={-120}
            y={-18}
            width={240}
            height={36}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <XHTMLDiv xmlns="http://www.w3.org/1999/xhtml">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitLabel}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitLabel();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelEditing();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                autoFocus
                className="h-full w-full rounded border border-gray-500 bg-slate-800 px-2 text-center text-2xl font-semibold text-gray-400 outline-none"
              />
            </XHTMLDiv>
          </foreignObject>
        ) : (
          <g
            onClick={(e) => {
              e.stopPropagation();
              startEditing();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ cursor: "text" }}
            pointerEvents="bounding-box"
          >
            <rect
              x={-120}
              y={-18}
              width={240}
              height={36}
              fill="transparent"
              pointerEvents="all"
            />

            <text
              className="node-text select-none"
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
          </g>
        )}

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
      onPointerDown={onPointerDown}
    >
      <rect
        x={-bodyW / 2}
        y={unifiedHitboxY}
        width={bodyW}
        height={unifiedHitboxH}
        fill="transparent"
        pointerEvents="visiblePainted"
      />

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

      {isEditingLabel ? (
        <foreignObject
          x={-70}
          y={config.labelOffset - 10}
          width={140}
          height={24}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <XHTMLDiv xmlns="http://www.w3.org/1999/xhtml">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitLabel();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelEditing();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              autoFocus
              className="h-full w-full rounded border border-white bg-slate-800 px-2 text-center text-sm text-white outline-none"
            />
          </XHTMLDiv>
        </foreignObject>
      ) : (
        <g
          onClick={(e) => {
            e.stopPropagation();
            startEditing();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ cursor: "text" }}
          pointerEvents="bounding-box"
        >
          <rect
            x={-70}
            y={config.labelOffset - 10}
            width={140}
            height={24}
            fill="transparent"
            pointerEvents="all"
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
        </g>
      )}

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
