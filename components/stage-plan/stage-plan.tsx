"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

import { AmpIcon } from "../stage-plan-icons/amp-icon/amp-icon";
import { DrumkitIcon } from "../stage-plan-icons/drumkit-icon/drumkit-icon";
import { MonitorIcon } from "../stage-plan-icons/monitor-icon/monitop-icon";
import MicStandIcon from "../stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "../stage-plan-icons/power-extension-icon/power-extension-icon";
import DIBoxIcon from "../stage-plan-icons/di-box-icon/di-box-icon";

import { StageNode, StageNodeComponent } from "../stage-node/stage-node";

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

export const equipmentConfig: Record<StageNode["type"], EquipmentConfig> = {
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

const initialNodes: StageNode[] = [
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
    {/* Grid patterns */}
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

    {/* Drumkit Symbol */}
    <DrumkitIcon />

    {/* Amplifier Symbol */}
    <AmpIcon />

    <MonitorIcon />

    {/* Microphone Stand Symbol */}
    <MicStandIcon />

    {/* Power Extension Symbol */}
    <PowerExtensionIcon />

    {/* DI Box Symbol */}
    <DIBoxIcon />
  </defs>
);

export default function StagePlan() {
  const [nodes, setNodes] = useState<StageNode[]>(initialNodes);
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

  const svgRef = useRef<SVGSVGElement>(null);
  const panStartRef = useRef<Vec2>({ x: 0, y: 0 });

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
    centerX: number,
    centerY: number,
    pointX: number,
    pointY: number
  ): number => {
    const dx = pointX - centerX;
    const dy = pointY - centerY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const normalizeAngle = (angle: number): number => {
    angle = angle % 360;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    return angle;
  };

  const handleReset = useCallback(() => {
    setViewBox({ x: -500, y: -500, width: 1000, height: 1000 });
    setZoom(1);
  }, []);

  const ZOOM_MIN = 0.1;
  const ZOOM_MAX = 10;
  const ZOOM_SENSITIVITY = 0.0015; // smaller = slower; try 0.001–0.002
  const BUTTON_STEP = 1.06; // was 1.2; smaller = slower

  // helper to apply zoom anchored at a point
  const zoomTo = useCallback((scale: number, anchor: Vec2) => {
    setZoom((prev) => {
      const next = Math.max(ZOOM_MIN, Math.min(prev * scale, ZOOM_MAX));
      const actual = next / prev;
      setViewBox((vb) => ({
        x: anchor.x - (anchor.x - vb.x) / actual,
        y: anchor.y - (anchor.y - vb.y) / actual,
        width: vb.width / actual,
        height: vb.height / actual,
      }));
      return next;
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    const center = {
      x: viewBox.x + viewBox.width / 2,
      y: viewBox.y + viewBox.height / 2,
    };
    zoomTo(BUTTON_STEP, center);
  }, [viewBox, zoomTo]);

  const handleZoomOut = useCallback(() => {
    const center = {
      x: viewBox.x + viewBox.width / 2,
      y: viewBox.y + viewBox.height / 2,
    };
    zoomTo(1 / BUTTON_STEP, center);
  }, [viewBox, zoomTo]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation(); // ensure it never bubbles to page
      const anchor = screenToCanvas(e.clientX, e.clientY);
      const scale = Math.exp(-e.deltaY * 0.0015);
      zoomTo(scale, anchor);
    },
    [screenToCanvas, zoomTo]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as SVGElement;
      const isRotationHandle = target.classList.contains("rotation-hitbox");
      const nodeElement = target.closest(".stage-node");

      if (nodeElement) {
        const nodeId = parseInt(nodeElement.getAttribute("data-id") || "0");
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const canvasPos = screenToCanvas(e.clientX, e.clientY);

        if (isRotationHandle || e.altKey) {
          setIsRotating(true);
          setDraggedNodeId(nodeId);
          const mouseAngle = calculateAngle(
            node.x,
            node.y,
            canvasPos.x,
            canvasPos.y
          );
          setRotationStart({ angle: node.angle, mouseAngle });
        } else {
          setIsDragging(true);
          setDraggedNodeId(nodeId);
          setDragOffset({ x: canvasPos.x - node.x, y: canvasPos.y - node.y });
        }
        e.preventDefault();
      } else {
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [nodes, screenToCanvas]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
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

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDragging(false);
    setIsRotating(false);
    setDraggedNodeId(null);
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const preventPageScroll = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault(); // block page scroll/zoom
    };

    // Safari pinch zoom uses gesture* events
    const blockGesture = (e: Event) => e.preventDefault();

    el.addEventListener("wheel", preventPageScroll, { passive: false });
    el.addEventListener("gesturestart", blockGesture as EventListener, {
      passive: false,
    });
    el.addEventListener("gesturechange", blockGesture as EventListener, {
      passive: false,
    });
    el.addEventListener("gestureend", blockGesture as EventListener, {
      passive: false,
    });

    return () => {
      el.removeEventListener("wheel", preventPageScroll);
      el.removeEventListener("gesturestart", blockGesture as EventListener);
      el.removeEventListener("gesturechange", blockGesture as EventListener);
      el.removeEventListener("gestureend", blockGesture as EventListener);
    };
  }, []);

  return (
    <div
      id="stage-plan"
      className="w-full h-screen justify-center flex bg-[#1a1a1a] text-white font-sans"
    >
      <div className="p-5 md:w-5xl">
        <h2 className="mb-2.5">Stage Plan</h2>
        <p className="mb-5 text-[#999]">
          To zoom press control button and scroll
        </p>

        <div className="relative w-full h-[70vh] bg-[#0a0a0a] border border-[#333]">
          <svg
            ref={svgRef}
            className="touch-none select-none"
            style={{
              width: "100%",
              height: "100%",
              cursor: isPanning ? "grabbing" : "default",
            }}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <SvgSymbols />
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
              <StageNodeComponent
                key={node.id}
                node={node}
                isHovered={hoveredNodeId === node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              />
            ))}
          </svg>
        </div>

        <div className="flex gap-5 mt-5 items-center">
          <button onClick={handleZoomIn} style={buttonStyle}>
            Zoom In (+)
          </button>
          <button onClick={handleZoomOut} style={buttonStyle}>
            Zoom Out (−)
          </button>
          <button onClick={handleReset} style={buttonStyle}>
            Reset View
          </button>

          <div>
            Zoom:{" "}
            <span className="text-green-700">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  background: "#333",
  border: "1px solid #555",
  color: "#fff",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "14px",
};
