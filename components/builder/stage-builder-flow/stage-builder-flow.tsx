"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  Handle,
  type Node,
  type Edge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type EdgeProps,
  type ReactFlowInstance,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";

// ---------- Domain types ----------
export type EquipmentType =
  | "drumkit"
  | "amp"
  | "monitor"
  | "mic-stand"
  | "power-extension"
  | "di-box";

export type EquipmentData = {
  label: string;
  kind: EquipmentType;
};

// visual scaling: pixels per meter (tweak at runtime)
const DEFAULT_PX_PER_METER = 50;

// ---------- Custom Measure Edge ----------
function MeasureEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, selected } = props;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const px = Math.hypot(dx, dy);

  // read from CSS var for live scale control
  const pxPerMeter =
    Number(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--px-per-meter"
      )
    ) || DEFAULT_PX_PER_METER;

  const meters = px / pxPerMeter;
  const mx = sourceX + dx / 2;
  const my = sourceY + dy / 2;

  return (
    <>
      <BaseEdge path={`M ${sourceX},${sourceY} L ${targetX},${targetY}`} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${mx}px, ${my}px)`,
            pointerEvents: "none",
            background: "white",
            border: selected ? "1px solid #0f172a" : "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "2px 6px",
            fontSize: 12,
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          {meters.toFixed(2)} m
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const edgeTypes = { measure: MeasureEdge };

// ---------- Custom Node (SVG icon + hidden handles) ----------
const handleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 4,
  background: "#64748b",
  border: "1px solid #334155",
  opacity: 0.0001, // effectively hidden but connectable
};

function EquipmentNode({ data }: { data: EquipmentData }) {
  const icon = useMemo(() => {
    switch (data.kind) {
      case "drumkit":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <circle cx="7" cy="14" r="4" fill="#1f2937" />
            <circle cx="16" cy="16" r="3" fill="#1f2937" />
            <rect x="5" y="7" width="12" height="2" rx="1" fill="#1f2937" />
          </svg>
        );
      case "amp":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect x="4" y="5" width="16" height="14" rx="2" fill="#1f2937" />
            <circle cx="9" cy="12" r="3" fill="#0ea5e9" />
            <circle cx="15" cy="12" r="3" fill="#0ea5e9" />
          </svg>
        );
      case "monitor":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect x="6" y="6" width="12" height="8" rx="1.5" fill="#1f2937" />
            <rect x="9" y="15" width="6" height="2" rx="1" fill="#1f2937" />
          </svg>
        );
      case "mic-stand":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect x="11" y="4" width="2" height="14" fill="#1f2937" />
            <rect x="7" y="18" width="10" height="2" rx="1" fill="#1f2937" />
            <circle cx="12" cy="3" r="2" fill="#0ea5e9" />
          </svg>
        );
      case "power-extension":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect x="5" y="7" width="14" height="10" rx="2" fill="#1f2937" />
            <circle cx="10" cy="12" r="1.2" fill="#0ea5e9" />
            <circle cx="14" cy="12" r="1.2" fill="#0ea5e9" />
          </svg>
        );
      case "di-box":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect x="6" y="6" width="12" height="12" rx="2" fill="#1f2937" />
            <rect x="9" y="11" width="6" height="2" rx="1" fill="#0ea5e9" />
          </svg>
        );
      default:
        return null;
    }
  }, [data.kind]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        background: "#f8fafc",
        border: "1px solid #cbd5e1",
        borderRadius: 10,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        userSelect: "none",
      }}
    >
      {icon}
      <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 600 }}>
        {data.label}
      </span>

      {/* hidden handles enable draw-to-measure */}
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <Handle type="target" position={Position.Top} style={handleStyle} />
    </div>
  );
}

const nodeTypes = { equipment: EquipmentNode };

// ---------- DnD Palette ----------
function PaletteItem({ kind, label }: { kind: EquipmentType; label: string }) {
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("application/reactflow", kind);
      e.dataTransfer.effectAllowed = "move";
    },
    [kind]
  );

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        fontSize: 12,
        padding: "6px 8px",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        background: "white",
        cursor: "grab",
      }}
    >
      {label}
    </div>
  );
}

function Palette() {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        gridAutoRows: "min-content",
      }}
    >
      <PaletteItem kind="drumkit" label="Drumkit" />
      <PaletteItem kind="monitor" label="Monitor" />
      <PaletteItem kind="amp" label="Amp" />
      <PaletteItem kind="mic-stand" label="Mic Stand" />
      <PaletteItem kind="power-extension" label="Power Strip" />
      <PaletteItem kind="di-box" label="DI Box" />
    </div>
  );
}

// ---------- Main Canvas ----------
export default function StagePlanCanvas() {
  const [nodes, setNodes] = useState<Node<EquipmentData>[]>([
    {
      id: nanoid(),
      type: "equipment",
      position: { x: 120, y: 120 },
      data: { label: "Drumkit", kind: "drumkit" },
    },
    {
      id: nanoid(),
      type: "equipment",
      position: { x: 420, y: 160 },
      data: { label: "Bass Amp", kind: "amp" },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const rfRef = useRef<ReactFlowInstance<Node<EquipmentData>> | null>(null);

  const [pxPerMeter, setPxPerMeter] = useState<number>(DEFAULT_PX_PER_METER);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const rf = useReactFlow();

  // reflect current scale into a CSS var for the MeasureEdge
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--px-per-meter",
      String(pxPerMeter)
    );
  }, [pxPerMeter]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) =>
        applyNodeChanges<Node<EquipmentData>>(changes as any, nds)
      ),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) => addEdge({ ...c, type: "measure" }, eds)),
    []
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData(
      "application/reactflow"
    ) as EquipmentType;
    if (!kind || !rfRef.current) return;

    // v12: use screenToFlowPosition with raw client coords
    const position = rfRef.current.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const node: Node<EquipmentData> = {
      id: nanoid(),
      type: "equipment",
      position,
      data: {
        kind,
        label:
          kind === "mic-stand"
            ? "Mic Stand"
            : kind === "power-extension"
            ? "Power Strip"
            : kind.replace("-", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      },
    };

    setNodes((ns) => ns.concat(node));
  }, []);

  // container styles: critical for mobile gestures
  const containerStyle: React.CSSProperties = {
    height: "70vh",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    touchAction: "none", // avoid browser-native panning conflicting with canvas
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 12,
        alignItems: "stretch",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 12,
          background: "#f8fafc",
          display: "grid",
          gap: 12,
          alignContent: "start",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <strong style={{ fontSize: 12, color: "#0f172a" }}>Scale</strong>
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <input
              type="number"
              min={10}
              step={5}
              value={pxPerMeter}
              onChange={(e) => setPxPerMeter(Number(e.target.value) || 10)}
              style={{
                width: 100,
                padding: "6px 8px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                background: "white",
              }}
            />
            <span>px / meter</span>
          </label>
          <span style={{ fontSize: 12, color: "#475569" }}>
            Connect two nodes to show distance.
          </span>
        </div>

        <div style={{ height: 1, background: "#e2e8f0" }} />
        <div style={{ display: "grid", gap: 8 }}>
          <strong style={{ fontSize: 12, color: "#0f172a" }}>Equipment</strong>
          <Palette />
          <span style={{ fontSize: 12, color: "#475569" }}>
            Drag from here into the canvas.
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={flowRef}
        style={containerStyle}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow<Node<EquipmentData>>
          onInit={(inst) => (rfRef.current = inst)}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          // sensible interaction defaults
          panOnScroll
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          selectionOnDrag
          minZoom={0.25}
          maxZoom={2.5}
          snapToGrid
          snapGrid={[10, 10]}
        >
          <MiniMap pannable zoomable />
          <Background gap={20} />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
}
