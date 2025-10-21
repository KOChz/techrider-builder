"use client";

import React, { useState } from "react";
import { StageNodeBuilder } from "../stage-node-builder/stage-node-builder";

export interface IMeasurement {
  id: number;
  startNodeId: number;
  endNodeId: number;
  customDistance?: string;
  offsetAngle?: number;
}

interface IDimensionLineProps {
  measurement: IMeasurement;
  startNode: StageNodeBuilder;
  endNode: StageNodeBuilder;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onDelete: (id: number) => void;
  onUpdateCustomDistance: (id: number, distance: string) => void;
}

export const DimensionLine: React.FC<IDimensionLineProps> = ({
  measurement,
  startNode,
  endNode,
  isHovered,
  onHover,
  onLeave,
  onDelete,
  onUpdateCustomDistance,
}) => {
  const [isEditingDistance, setIsEditingDistance] = useState(false);
  const [editValue, setEditValue] = useState(measurement.customDistance || "");

  const dx = endNode.x - startNode.x;
  const dy = endNode.y - startNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const offsetDistance = 80;
  const offsetAngle = measurement.offsetAngle ?? 90;
  const offsetRad = ((angle + offsetAngle) * Math.PI) / 180;

  const startX = startNode.x + Math.cos(offsetRad) * offsetDistance;
  const startY = startNode.y + Math.sin(offsetRad) * offsetDistance;
  const endX = endNode.x + Math.cos(offsetRad) * offsetDistance;
  const endY = endNode.y + Math.sin(offsetRad) * offsetDistance;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const displayDistance = measurement.customDistance
    ? measurement.customDistance
    : `${Math.round(distance)} units`;

  const arrowSize = 12;

  const handleDistanceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingDistance(true);
    setEditValue(measurement.customDistance || String(Math.round(distance)));
  };

  const handleDistanceBlur = () => {
    setIsEditingDistance(false);
    if (editValue.trim()) {
      onUpdateCustomDistance(measurement.id, editValue.trim());
    }
  };

  const handleDistanceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleDistanceBlur();
    } else if (e.key === "Escape") {
      setIsEditingDistance(false);
      setEditValue(measurement.customDistance || "");
    }
  };

  return (
    <g className="dimension-line" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isHovered ? "#60a5fa" : "#10b981"}
        strokeWidth={2}
        strokeDasharray="5,5"
      />

      <line
        x1={startNode.x}
        y1={startNode.y}
        x2={startX}
        y2={startY}
        stroke={isHovered ? "#60a5fa" : "#10b981"}
        strokeWidth={1}
      />
      <line
        x1={endNode.x}
        y1={endNode.y}
        x2={endX}
        y2={endY}
        stroke={isHovered ? "#60a5fa" : "#10b981"}
        strokeWidth={1}
      />

      <polygon
        points={`${endX},${endY} ${
          endX -
          arrowSize * Math.cos((angle * Math.PI) / 180) +
          arrowSize * 0.5 * Math.sin((angle * Math.PI) / 180)
        },${
          endY -
          arrowSize * Math.sin((angle * Math.PI) / 180) -
          arrowSize * 0.5 * Math.cos((angle * Math.PI) / 180)
        } ${
          endX -
          arrowSize * Math.cos((angle * Math.PI) / 180) -
          arrowSize * 0.5 * Math.sin((angle * Math.PI) / 180)
        },${
          endY -
          arrowSize * Math.sin((angle * Math.PI) / 180) +
          arrowSize * 0.5 * Math.cos((angle * Math.PI) / 180)
        }`}
        fill={isHovered ? "#60a5fa" : "#10b981"}
      />

      <polygon
        points={`${startX},${startY} ${
          startX +
          arrowSize * Math.cos((angle * Math.PI) / 180) +
          arrowSize * 0.5 * Math.sin((angle * Math.PI) / 180)
        },${
          startY +
          arrowSize * Math.sin((angle * Math.PI) / 180) -
          arrowSize * 0.5 * Math.cos((angle * Math.PI) / 180)
        } ${
          startX +
          arrowSize * Math.cos((angle * Math.PI) / 180) -
          arrowSize * 0.5 * Math.sin((angle * Math.PI) / 180)
        },${
          startY +
          arrowSize * Math.sin((angle * Math.PI) / 180) +
          arrowSize * 0.5 * Math.cos((angle * Math.PI) / 180)
        }`}
        fill={isHovered ? "#60a5fa" : "#10b981"}
      />

      {isEditingDistance ? (
        <foreignObject x={midX - 60} y={midY - 15} width={120} height={30}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleDistanceBlur}
            onKeyDown={handleDistanceKeyDown}
            autoFocus
            className="w-full h-full bg-slate-800 border border-green-500 rounded px-2 text-white text-center text-sm outline-none"
          />
        </foreignObject>
      ) : (
        <text
          x={midX}
          y={midY}
          fill={isHovered ? "#60a5fa" : "#10b981"}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          className="cursor-pointer select-none"
          onClick={handleDistanceClick}
        >
          <tspan
            x={midX}
            dy="0"
            style={{
              paintOrder: "stroke",
              stroke: "#000",
              strokeWidth: "3px",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
            }}
          >
            {displayDistance}
          </tspan>
          <tspan x={midX} dy="0">
            {displayDistance}
          </tspan>
        </text>
      )}

      {isHovered && (
        <g
          className="delete-handle cursor-pointer"
          transform={`translate(${midX - 5}, ${midY - 20})`}
          onPointerDown={(e) => {
            e.stopPropagation();
            onDelete(measurement.id);
          }}
        >
          <circle cx={0} cy={0} r={12} fill="#ef4444" />
          <line
            x1={-6}
            y1={-6}
            x2={6}
            y2={6}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={6}
            y1={-6}
            x2={-6}
            y2={6}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
};
