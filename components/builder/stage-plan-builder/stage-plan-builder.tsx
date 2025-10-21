"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";
import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitop-icon";

import {
  StageNodeBuilder,
  StageNodeBuilderComponent,
} from "../stage-node-builder/stage-node-builder";
import EquipmentSelect from "../equipment-select/equipment-select";
import { cn } from "@/lib/utils/cn";

interface Vec2 {
  x: number;
  y: number;
}
interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface EquipmentConfig {
  width: number;
  height: number;
  labelOffset: number;
}

// ============================================================================
// EQUIPMENT CONFIGURATION
// ============================================================================
export const equipmentConfig: Record<
  StageNodeBuilder["type"],
  EquipmentConfig
> = {
  drumkit: { width: 200, height: 180, labelOffset: 100 },
  amp: { width: 80, height: 100, labelOffset: 60 },
  monitor: { width: 70, height: 50, labelOffset: 35 },
  "mic-stand": { width: 50, height: 120, labelOffset: 70 },
  "power-extension": { width: 160, height: 40, labelOffset: 30 },
  text: { width: 0, height: 0, labelOffset: 0 },
  "di-box": { width: 60, height: 40, labelOffset: 30 },
};

// ============================================================================
// INITIAL STAGE NODES
// ============================================================================
const initialNodes: StageNodeBuilder[] = [
  {
    id: 1,
    x: 0,
    y: -299,
    label: "Drumkit",
    type: "drumkit",
    angle: 0,
    scale: 1.2,
  },
  {
    id: 2,
    x: 170,
    y: -280,
    label: "Drum Monitor",
    type: "monitor",
    angle: 90,
    scale: 1,
  },
  {
    id: 3,
    x: 330,
    y: -270,
    label: "Bass Amp",
    type: "amp",
    angle: 0,
    scale: 1.1,
  },
  {
    id: 4,
    x: 309,
    y: 177,
    label: "Bass Monitor",
    type: "monitor",
    angle: 0,
    scale: 1,
  },
  {
    id: 5,
    x: -346,
    y: -296,
    label: "Guitar Amp 1",
    type: "amp",
    angle: 0,
    scale: 1,
  },
  {
    id: 7,
    x: -210,
    y: -296,
    label: "Guitar Amp 2",
    type: "amp",
    angle: 0,
    scale: 1,
  },
  {
    id: 8,
    x: -285,
    y: 155,
    label: "Guitar 2/Backing Vocal 2 Monitor",
    type: "monitor",
    angle: 0,
    scale: 1,
  },
  {
    id: 9,
    x: 0,
    y: 81,
    label: "Lead Vocal Mic",
    type: "mic-stand",
    angle: 0,
    scale: 1,
  },
  {
    id: 10,
    x: 2,
    y: 196,
    label: "Vocal 1/Guitar 1 Monitor",
    type: "monitor",
    angle: 0,
    scale: 1.1,
  },
  {
    id: 11,
    x: -285,
    y: 50,
    label: "Backing Vocal 2 Mic",
    type: "mic-stand",
    angle: 0,
    scale: 0.9,
  },
  {
    id: 12,
    x: -450,
    y: 0,
    label: "Stage Left",
    type: "text",
    angle: -90,
    scale: 1.2,
  },
  {
    id: 13,
    x: 450,
    y: 0,
    label: "Stage Right",
    type: "text",
    angle: 90,
    scale: 1.2,
  },
  {
    id: 14,
    x: 0,
    y: -450,
    label: "Upstage",
    type: "text",
    angle: 0,
    scale: 1.2,
  },
  {
    id: 15,
    x: 0,
    y: 350,
    label: "Downstage / Audience",
    type: "text",
    angle: 0,
    scale: 1.2,
  },
  {
    id: 16,
    x: -415,
    y: 110,
    label: "Power Strip 1",
    type: "power-extension",
    angle: 0,
    scale: 0.4,
  },
  {
    id: 17,
    x: 115,
    y: 110,
    label: "Power Strip 2",
    type: "power-extension",
    angle: 0,
    scale: 0.4,
  },
  {
    id: 18,
    x: 410,
    y: 90,
    label: "Power Strip 3",
    type: "power-extension",
    angle: 0,
    scale: 0.4,
  },
];

// ============================================================================
// SVG SYMBOLS COMPONENT
// ============================================================================
const SvgSymbols: React.FC = () => (
  <defs>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="50" stroke="#2a2a2a" strokeWidth="0.5" />
      <line x1="0" y1="0" x2="50" y2="0" stroke="#2a2a2a" strokeWidth="0.5" />
    </pattern>
    <pattern
      id="grid-major"
      width="200"
      height="200"
      patternUnits="userSpaceOnUse"
    >
      <rect width="200" height="200" fill="url(#grid)" />
      <line x1="0" y1="0" x2="0" y2="200" stroke="#3a3a3a" strokeWidth="1" />
      <line x1="0" y1="0" x2="200" y2="0" stroke="#3a3a3a" strokeWidth="1" />
    </pattern>

    {/* Components must render <symbol id="..."> */}
    <DrumkitIcon />
    <AmpIcon />
    <MonitorIcon />
    <MicStandIcon />
    <PowerExtensionIcon />
    <DIBoxIcon />
  </defs>
);

export default function StagePlanBuilder() {
  const [nodes, setNodes] = useState<StageNodeBuilder[]>(initialNodes);
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: -500,
    y: -500,
    width: 1000,
    height: 1000,
  });
  const [zoom, setZoom] = useState(1);
  const [mouse, setMouse] = useState<Vec2>({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  const [dragOffset, setDragOffset] = useState<Vec2>({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState({
    angle: 0,
    mouseAngle: 0,
  });

  // selection state for rename UX
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null); // NEW
  const selectedNode =
    selectedNodeId != null
      ? nodes.find((n) => n.id === selectedNodeId) ?? null
      : null; // NEW

  const svgRef = useRef<SVGSVGElement>(null);
  const panStartRef = useRef<Vec2>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- hover stabilization ---------------------------------------------------
  const leaveTimer = useRef<number | null>(null);
  const armedEnter = useCallback((id: number) => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    setHoveredNodeId(id);
  }, []);
  const armedLeave = useCallback(() => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHoveredNodeId(null), 50);
  }, []);

  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Vec2 => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const x =
        viewBox.x + ((screenX - rect.left) / rect.width) * viewBox.width;
      const y =
        viewBox.y + ((screenY - rect.top) / rect.height) * viewBox.height;
      return { x, y };
    },
    [viewBox]
  );

  const calculateAngle = (
    cx: number,
    cy: number,
    px: number,
    py: number
  ): number => (Math.atan2(py - cy, px - cx) * 180) / Math.PI;

  const normalizeAngle = (angle: number): number => {
    angle = angle % 360;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    return angle;
  };

  // --- zoom controls --------------------------------------------------------
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.min(prev * 1.2, 10);
      const delta = newZoom / prev;
      setViewBox((vb) => ({
        ...vb,
        width: vb.width / delta,
        height: vb.height / delta,
      }));
      return newZoom;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.max(prev / 1.2, 0.1);
      const delta = newZoom / prev;
      setViewBox((vb) => ({
        ...vb,
        width: vb.width / delta,
        height: vb.height / delta,
      }));
      return newZoom;
    });
  }, []);

  const handleReset = useCallback(() => {
    setViewBox({ x: -500, y: -500, width: 1000, height: 1000 });
    setZoom(1);
    setSelectedNodeId(null); // NEW: clear selection on reset
  }, []);

  // Wheel zoom (native listener for passive: false)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const normalizedDelta =
        Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 100);
      const zoomFactor = 1 - normalizedDelta / 2000;
      const canvasPos = screenToCanvas(e.clientX, e.clientY);

      setZoom((prev) => {
        const newZoom = Math.max(0.1, Math.min(prev * zoomFactor, 10));
        const actualDelta = newZoom / prev;

        setViewBox((vb) => ({
          x: canvasPos.x - (canvasPos.x - vb.x) / actualDelta,
          y: canvasPos.y - (canvasPos.y - vb.y) / actualDelta,
          width: vb.width / actualDelta,
          height: vb.height / actualDelta,
        }));

        return newZoom;
      });
    },
    [screenToCanvas]
  );

  // --- pointer flows --------------------------------------------------------
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as SVGElement;

      // Early exit for delete actions
      const path = (e.nativeEvent as PointerEvent).composedPath() as Element[];
      if (
        path.some((el) =>
          (el as Element)?.classList?.contains?.("delete-handle")
        )
      ) {
        return; // Delete handler will handle this via onPointerDownCapture
      }

      const nodeElement = target.closest(".stage-node") as SVGGElement | null;

      if (nodeElement) {
        const nodeId = parseInt(nodeElement.getAttribute("data-id") || "0", 10);
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        setSelectedNodeId(nodeId);

        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        const isRotationHandle =
          target.classList.contains("rotation-hitbox") ||
          !!target.closest(".rotation-hitbox");

        if (isRotationHandle || (e as any).altKey) {
          setIsRotating(true);
          setDraggedNodeId(nodeId);
          const mouseAngle = calculateAngle(
            node.x,
            node.y,
            canvasPos.x,
            canvasPos.y
          );
          setRotationStart({ angle: node.angle, mouseAngle });
          (target as any).style.cursor = "grabbing";
        } else {
          setIsDragging(true);
          setDraggedNodeId(nodeId);
          setDragOffset({ x: canvasPos.x - node.x, y: canvasPos.y - node.y });
        }
        e.preventDefault();
      } else {
        setSelectedNodeId(null);
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [nodes, screenToCanvas]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setMouse(canvasPos);

      if (isRotating && draggedNodeId !== null) {
        setNodes((prev) =>
          prev.map((node) => {
            if (node.id !== draggedNodeId) return node;
            const currentMouseAngle = calculateAngle(
              node.x,
              node.y,
              canvasPos.x,
              canvasPos.y
            );
            const angleDelta = currentMouseAngle - rotationStart.mouseAngle;
            return {
              ...node,
              angle: normalizeAngle(rotationStart.angle + angleDelta),
            };
          })
        );
      } else if (isDragging && draggedNodeId !== null) {
        setNodes((prev) =>
          prev.map((node) => {
            if (node.id !== draggedNodeId) return node;
            return {
              ...node,
              x: canvasPos.x - dragOffset.x,
              y: canvasPos.y - dragOffset.y,
            };
          })
        );
      } else if (isPanning && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const dx =
          ((e.clientX - panStartRef.current.x) * viewBox.width) / rect.width;
        const dy =
          ((e.clientY - panStartRef.current.y) * viewBox.height) / rect.height;
        setViewBox((vb) => ({ ...vb, x: vb.x - dx, y: vb.y - dy }));
        panStartRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [
      isRotating,
      isDragging,
      isPanning,
      draggedNodeId,
      dragOffset,
      rotationStart,
      screenToCanvas,
      viewBox,
    ]
  );

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
    setIsDragging(false);
    setIsRotating(false);
    setDraggedNodeId(null);
  }, []);

  const handleDeleteNode = useCallback((nodeId: number) => {
    console.log("🚀 ~ StagePlanBuilder ~ nodeId:", nodeId);
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setSelectedNodeId((prev) => (prev === nodeId ? null : prev)); // NEW: clear selection if deleted
  }, []);

  type PickableType =
    | "drumkit"
    | "amp"
    | "monitor"
    | "mic-stand"
    | "power-extension"
    | "di-box";
  const [picker, setPicker] = useState<PickableType>("drumkit");

  function addNodeOfType(t: PickableType) {
    const cx = viewBox.x + viewBox.width / 2;
    const cy = viewBox.y + viewBox.height / 2;
    const nextId =
      nodes.length > 0 ? Math.max(...nodes.map((n) => n.id)) + 1 : 1;

    const labelByType: Record<PickableType, string> = {
      drumkit: "Drumkit",
      amp: "Amp",
      monitor: "Monitor",
      "mic-stand": "Mic Stand",
      "power-extension": "Power Strip",
      "di-box": "DI Box",
    };

    setNodes((prev) => [
      ...prev,
      {
        id: nextId,
        x: cx,
        y: cy,
        label: labelByType[t],
        type: t as any,
        angle: 0,
        scale: 1,
      },
    ]);
    setSelectedNodeId(nextId); // NEW: select freshly added node for immediate rename
  }

  // NEW: update label helper
  const updateSelectedLabel = useCallback(
    (next: string) => {
      if (selectedNodeId == null) return;
      setNodes((prev) =>
        prev.map((n) => (n.id === selectedNodeId ? { ...n, label: next } : n))
      );
    },
    [selectedNodeId]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div
      id="stage-plan"
      className="w-full h-screen bg-[#1a1a1a] text-white font-sans"
    >
      <div style={{ padding: "20px" }}>
        <p style={{ margin: "0 0 20px 0", color: "#999" }}>
          Interactive stage layout - pan, zoom, and drag equipment positions
        </p>

        {/* Toolbar: picker + rename control */}
        <div className="flex gap-3 items-center mb-3 flex-wrap">
          <EquipmentSelect
            value={picker}
            onChange={setPicker}
            onAdd={addNodeOfType}
          />

          {/* Name editor for the selected node */}
          <div
            className="select-none flex items-center gap-2 bg-slate-900 border border-slate-700 px-2.5 py-3.5 rounded-lg min-w-[260px]"
            aria-live="polite"
          >
            <label htmlFor="node-name" className="text-xs text-gray-400">
              Name
            </label>
            <input
              id="node-name"
              type="text"
              placeholder="Select an item, then rename"
              disabled={!selectedNode}
              value={selectedNode?.label ?? ""}
              onChange={(e) => updateSelectedLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") (e.target as HTMLInputElement).blur();
              }}
              className={cn(
                "flex-1 bg-transparent border-none outline-none px-2 py-1.5",
                selectedNode ? "text-gray-200" : "text-gray-500"
              )}
            />
          </div>
        </div>

        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "70vh",
            background: "#0a0a0a",
            border: "1px solid #333",
          }}
        >
          <svg
            ref={svgRef}
            style={{
              width: "100%",
              height: "100%",
              cursor: isPanning ? "grabbing" : "default",
            }}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <SvgSymbols />

            {/* grid + axes */}
            <rect
              x={-5000}
              y={-5000}
              width={10000}
              height={10000}
              fill="url(#grid-major)"
            />
            <line
              x1={-5000}
              y1={0}
              x2={5000}
              y2={0}
              stroke="#555"
              strokeWidth={2}
            />
            <line
              x1={0}
              y1={-5000}
              x2={0}
              y2={5000}
              stroke="#555"
              strokeWidth={2}
            />

            {nodes.map((node) => (
              <StageNodeBuilderComponent
                key={node.id}
                node={node}
                isHovered={hoveredNodeId === node.id}
                isRotating={isRotating && draggedNodeId === node.id}
                onMouseEnter={() => armedEnter(node.id)}
                onMouseLeave={armedLeave}
                onDelete={handleDeleteNode}
              />
            ))}
          </svg>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            onClick={handleZoomIn}
            className="cursor-pointer rounded border border-[#555] bg-[#333] px-5 py-2.5 text-sm text-white hover:bg-[#444] active:bg-[#222]"
          >
            Zoom In (+)
          </button>
          <button
            onClick={handleZoomOut}
            className="cursor-pointer rounded border border-[#555] bg-[#333] px-5 py-2.5 text-sm text-white hover:bg-[#444] active:bg-[#222]"
          >
            Zoom Out (−)
          </button>
          <button
            onClick={handleReset}
            className="cursor-pointer rounded border border-[#555] bg-[#333] px-5 py-2.5 text-sm text-white hover:bg-[#444] active:bg-[#222]"
          >
            Reset View
          </button>

          <div className="mt-5 flex gap-5 text-sm text-gray-400">
            <div>
              Zoom:{" "}
              <span className="text-green-500">{Math.round(zoom * 100)}%</span>
            </div>
            <div>
              Pan:{" "}
              <span className="text-green-500">
                {Math.round(viewBox.x)}, {Math.round(viewBox.y)}
              </span>
            </div>
            <div>
              Mouse:{" "}
              <span className="text-green-500">
                {Math.round(mouse.x)}, {Math.round(mouse.y)}
              </span>
            </div>
            <div>
              Selected:{" "}
              <span className="text-green-500">
                {selectedNode
                  ? `#${selectedNode.id} • ${selectedNode.label}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
