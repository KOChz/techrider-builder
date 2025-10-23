"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { AmpIcon } from "@/components/stage-plan-icons/amp-icon/amp-icon";
import DIBoxIcon from "@/components/stage-plan-icons/di-box-icon/di-box-icon";
import { DrumkitIcon } from "@/components/stage-plan-icons/drumkit-icon/drumkit-icon";
import MicStandIcon from "@/components/stage-plan-icons/mic-stand-icon/mic-stand-icon";
import PowerExtensionIcon from "@/components/stage-plan-icons/power-extension-icon/power-extension-icon";
import { MonitorIcon } from "@/components/stage-plan-icons/monitor-icon/monitop-icon";

import {
  StageNodeBuilderComponent,
  TStageNodeBuilder,
} from "../stage-node-builder/stage-node-builder";
import { DimensionLine, TMeasurement } from "../dimension-line/dimension-line";
import { MeasurementControls } from "../measurement-controls/measurement-controls";
import EquipmentSelect from "../equipment-select/equipment-select";

import { TStageNodeType, TStagePlanConfig } from "@/schemas/stage-plan";

import { cn } from "@/lib/utils/cn";

import { useProjectStore } from "@/stores/use-project-creation-store";

interface IVec2 {
  x: number;
  y: number;
}
interface IViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface IEquipmentConfig {
  width: number;
  height: number;
  labelOffset: number;
}

export const equipmentConfig: Record<
  TStageNodeBuilder["type"],
  IEquipmentConfig
> = {
  drumkit: { width: 200, height: 180, labelOffset: 100 },
  amp: { width: 80, height: 100, labelOffset: 60 },
  monitor: { width: 70, height: 50, labelOffset: 35 },
  "mic-stand": { width: 50, height: 120, labelOffset: 70 },
  "power-extension": { width: 160, height: 40, labelOffset: 30 },
  text: { width: 0, height: 0, labelOffset: 0 },
  "di-box": { width: 60, height: 40, labelOffset: 30 },
};

const getDefaultNodes = (): TStageNodeBuilder[] => [
  {
    id: uuidv4(),
    x: 0,
    y: -299,
    label: "Drumkit",
    type: "drumkit",
    angle: 0,
    scale: 1.2,
  },
  {
    id: uuidv4(),
    x: 170,
    y: -280,
    label: "Drum Monitor",
    type: "monitor",
    angle: 90,
    scale: 1,
  },
  {
    id: uuidv4(),
    x: 330,
    y: -270,
    label: "Bass Amp",
    type: "amp",
    angle: 0,
    scale: 1.1,
  },
  {
    id: uuidv4(),
    x: 309,
    y: 177,
    label: "Bass Monitor",
    type: "monitor",
    angle: 0,
    scale: 1,
  },
  {
    id: uuidv4(),
    x: -346,
    y: -296,
    label: "Guitar Amp 1",
    type: "amp",
    angle: 0,
    scale: 1,
  },
  {
    id: uuidv4(),
    x: -210,
    y: -296,
    label: "Guitar Amp 2",
    type: "amp",
    angle: 0,
    scale: 1,
  },
  {
    id: uuidv4(),
    x: -285,
    y: 155,
    label: "Guitar 2/Backing Vocal 2 Monitor",
    type: "monitor",
    angle: 0,
    scale: 1,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 81,
    label: "Lead Vocal Mic",
    type: "mic-stand",
    angle: 0,
    scale: 1,
  },
  {
    id: uuidv4(),
    x: 2,
    y: 196,
    label: "Vocal 1/Guitar 1 Monitor",
    type: "monitor",
    angle: 0,
    scale: 1.1,
  },
  {
    id: uuidv4(),
    x: -285,
    y: 50,
    label: "Backing Vocal 2 Mic",
    type: "mic-stand",
    angle: 0,
    scale: 0.9,
  },
  {
    id: uuidv4(),
    x: -450,
    y: 0,
    label: "Stage Left",
    type: "text",
    angle: -90,
    scale: 1.2,
  },
  {
    id: uuidv4(),
    x: 450,
    y: 0,
    label: "Stage Right",
    type: "text",
    angle: 90,
    scale: 1.2,
  },
  {
    id: uuidv4(),
    x: 0,
    y: -450,
    label: "Upstage",
    type: "text",
    angle: 0,
    scale: 1.2,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 350,
    label: "Downstage / Audience",
    type: "text",
    angle: 0,
    scale: 1.2,
  },
  {
    id: uuidv4(),
    x: -415,
    y: 110,
    label: "Power Strip 1",
    type: "power-extension",
    angle: 0,
    scale: 0.4,
  },
  {
    id: uuidv4(),
    x: 115,
    y: 110,
    label: "Power Strip 2",
    type: "power-extension",
    angle: 0,
    scale: 0.4,
  },
  {
    id: uuidv4(),
    x: 410,
    y: 90,
    label: "Power Strip 3",
    type: "power-extension",
    angle: 0,
    scale: 0.4,
  },
];

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

    <DrumkitIcon />
    <AmpIcon />
    <MonitorIcon />
    <MicStandIcon />
    <PowerExtensionIcon />
    <DIBoxIcon />
  </defs>
);

function useDebouncedFn<T extends (...args: any[]) => void>(
  fn: T,
  delay = 150
) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  const timerRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const run = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = window.setTimeout(() => fnRef.current(...args), delay);
    },
    [cancel, delay]
  );

  useEffect(() => cancel, [cancel]);
  return run;
}

interface IStagePlanBuilderProps {
  config: TStagePlanConfig;
  onConfigChange: (config: TStagePlanConfig) => void;
}

export default function StagePlanBuilder({
  config,
  onConfigChange,
}: IStagePlanBuilderProps) {
  const [nodes, setNodes] = useState<TStageNodeBuilder[]>(
    config.nodes.length > 0 ? config.nodes : getDefaultNodes()
  );
  const [measurements, setMeasurements] = useState<TMeasurement[]>(
    config.measurements
  );

  const {
    updateNodeLabel: storeUpdateNodeLabel,
    updateMeasurementDistance: storeUpdateMeasurementDistance,
    deleteNode: storeDeleteNode,
    deleteMeasurement: storeDeleteMeasurement,
    addNode: storeAddNode,
    addMeasurement: storeAddMeasurement,
  } = useProjectStore();

  const [viewBox, setViewBox] = useState<IViewBox>({
    x: -500,
    y: -500,
    width: 1000,
    height: 1000,
  });
  const [zoom, setZoom] = useState(1);
  const [mouse, setMouse] = useState<IVec2>({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredMeasurementId, setHoveredMeasurementId] = useState<
    number | null
  >(null);

  const [dragOffset, setDragOffset] = useState<IVec2>({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState({
    angle: 0,
    mouseAngle: 0,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode =
    selectedNodeId != null
      ? nodes.find((n) => n.id === selectedNodeId) ?? null
      : null;

  const [isMeasurementMode, setIsMeasurementMode] = useState(false);
  const [selectedMeasurementNodes, setSelectedMeasurementNodes] = useState<
    [string | null, string | null]
  >([null, null]);

  const svgRef = useRef<SVGSVGElement>(null);
  const panStartRef = useRef<IVec2>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Track if we should delay drag start for touch gestures
  const dragDelayTimerRef = useRef<number | null>(null);
  const [isPendingDrag, setIsPendingDrag] = useState(false);

  const leaveTimer = useRef<number | null>(null);
  const armedEnter = useCallback((id: string) => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    setHoveredNodeId(id);
  }, []);
  const armedLeave = useCallback(() => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHoveredNodeId(null), 50);
  }, []);

  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): IVec2 => {
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
    setSelectedNodeId(null);
    setIsMeasurementMode(false);
    setSelectedMeasurementNodes([null, null]);
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey) return;
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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      (svgRef.current as SVGElement | null)?.setPointerCapture?.(e.pointerId);

      const target = e.target as SVGElement;
      const path = (e.nativeEvent as PointerEvent).composedPath() as Element[];
      if (
        path.some((el) =>
          (el as Element)?.classList?.contains?.("delete-handle")
        )
      )
        return;

      if (path.some((el) => (el as Element).closest?.(".dimension-line"))) {
        return;
      }

      const nodeElement = target.closest(".stage-node") as SVGGElement | null;
      const isTouchDevice = e.pointerType === "touch";

      if (nodeElement) {
        const nodeId = nodeElement.getAttribute("data-id");
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        if (isMeasurementMode) {
          if (selectedMeasurementNodes[0] === null) {
            setSelectedMeasurementNodes([nodeId, null]);
          } else if (
            selectedMeasurementNodes[1] === null &&
            selectedMeasurementNodes[0] !== nodeId
          ) {
            const nextId =
              measurements.length > 0
                ? Math.max(...measurements.map((m) => m.id)) + 1
                : 1;

            const newMeasurement = {
              id: nextId,
              startNodeId: selectedMeasurementNodes[0]!,
              endNodeId: nodeId!,
            };

            setMeasurements((prev) => [...prev, newMeasurement]);
            storeAddMeasurement(newMeasurement);
            setSelectedMeasurementNodes([null, null]);
            setIsMeasurementMode(false);
          }
          return;
        }

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
          // On touch devices, delay drag start to allow gesture detection
          if (isTouchDevice) {
            setIsPendingDrag(true);
            dragDelayTimerRef.current = window.setTimeout(() => {
              setIsDragging(true);
              setDraggedNodeId(nodeId);
              setDragOffset({
                x: canvasPos.x - node.x,
                y: canvasPos.y - node.y,
              });
              setIsPendingDrag(false);
            }, 150); // 150ms delay for gesture detection
          } else {
            // Desktop: immediate drag
            setIsDragging(true);
            setDraggedNodeId(nodeId);
            setDragOffset({ x: canvasPos.x - node.x, y: canvasPos.y - node.y });
          }
        }
        e.preventDefault();
      } else {
        setSelectedNodeId(null);
        if (isMeasurementMode) setSelectedMeasurementNodes([null, null]);
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [
      nodes,
      screenToCanvas,
      isMeasurementMode,
      selectedMeasurementNodes,
      measurements,
      storeAddMeasurement,
    ]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setMouse(canvasPos);

      // Cancel pending drag if pointer moved too much (likely a gesture)
      if (isPendingDrag && dragDelayTimerRef.current) {
        const threshold = 10;
        if (dragOffset.x !== 0 || dragOffset.y !== 0) {
          const dx = Math.abs(canvasPos.x - (dragOffset.x || 0));
          const dy = Math.abs(canvasPos.y - (dragOffset.y || 0));
          if (dx > threshold || dy > threshold) {
            clearTimeout(dragDelayTimerRef.current);
            setIsPendingDrag(false);
          }
        }
      }

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
      isPendingDrag,
      draggedNodeId,
      dragOffset,
      rotationStart,
      screenToCanvas,
      viewBox,
    ]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (svgRef.current as SVGElement | null)?.releasePointerCapture?.(e.pointerId);

    // Clear pending drag timer
    if (dragDelayTimerRef.current) {
      clearTimeout(dragDelayTimerRef.current);
      dragDelayTimerRef.current = null;
    }

    setIsPanning(false);
    setIsDragging(false);
    setIsRotating(false);
    setIsPendingDrag(false);
    setDraggedNodeId(null);
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
      setMeasurements((prev) =>
        prev.filter((m) => m.startNodeId !== nodeId && m.endNodeId !== nodeId)
      );

      storeDeleteNode(nodeId);
    },
    [storeDeleteNode]
  );

  const handleDeleteMeasurement = useCallback(
    (measurementId: number) => {
      setMeasurements((prev) => prev.filter((m) => m.id !== measurementId));

      storeDeleteMeasurement(measurementId);
    },
    [storeDeleteMeasurement]
  );

  const handleUpdateCustomDistance = useCallback(
    (measurementId: number, distance: string) => {
      setMeasurements((prev) =>
        prev.map((m) =>
          m.id === measurementId ? { ...m, customDistance: distance } : m
        )
      );

      storeUpdateMeasurementDistance(measurementId, distance);
    },
    [storeUpdateMeasurementDistance]
  );

  const handleUpdateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, label: newLabel } : n))
      );

      storeUpdateNodeLabel(nodeId, newLabel);
    },
    [storeUpdateNodeLabel]
  );

  const toggleMeasurementMode = useCallback(() => {
    setIsMeasurementMode((prev) => !prev);
    setSelectedMeasurementNodes([null, null]);
  }, []);

  const [picker, setPicker] = useState<TStageNodeType>("drumkit");

  const addNodeOfType = useCallback(
    (t: TStageNodeType) => {
      const cx = viewBox.x + viewBox.width / 2;
      const cy = viewBox.y + viewBox.height / 2;
      const nextId = uuidv4();

      const labelByType: Record<TStageNodeType, string> = {
        drumkit: "Drumkit",
        amp: "Amp",
        monitor: "Monitor",
        "mic-stand": "Mic Stand",
        "power-extension": "Power Strip",
        "di-box": "DI Box",
        text: "Text",
      };

      const newNode: TStageNodeBuilder = {
        id: nextId,
        x: cx,
        y: cy,
        label: labelByType[t],
        type: t,
        angle: 0,
        scale: 1,
      };

      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(nextId);

      storeAddNode(newNode);
    },
    [viewBox, storeAddNode]
  );

  const updateSelectedLabel = useCallback(
    (next: string) => {
      if (selectedNodeId == null) return;
      setNodes((prev) =>
        prev.map((n) => (n.id === selectedNodeId ? { ...n, label: next } : n))
      );

      storeUpdateNodeLabel(selectedNodeId, next);
    },
    [selectedNodeId, storeUpdateNodeLabel]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const hydratedRef = useRef(false);
  const lastVersionRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!hydratedRef.current || lastVersionRef.current !== config.version) {
      setNodes(config.nodes.length ? config.nodes : getDefaultNodes());
      setMeasurements(config.measurements ?? []);
      hydratedRef.current = true;
      lastVersionRef.current = config.version;
    }
  }, [config.version, config.nodes, config.measurements]);

  const debouncedPush = useDebouncedFn(
    (n: TStageNodeBuilder[], m: TMeasurement[], v?: number) => {
      onConfigChange({ nodes: n, measurements: m, version: v });
    },
    150
  );

  useEffect(() => {
    if (!hydratedRef.current) return;
    debouncedPush(nodes, measurements, config.version);
  }, [nodes, measurements, debouncedPush, config.version]);

  return (
    <div
      style={{
        touchAction: "none", // ✅ Prevents mobile scrolling
      }}
      id="stage-plan"
      className="md:min-h-none min-h-auto w-full bg-[#1a1a1a] font-sans text-white"
    >
      <div className="max-w-full p-3 sm:p-5">
        <p className="mb-2 text-xs text-gray-400 sm:text-sm">
          Desktop: Hold Ctrl + scroll to zoom | Mobile: Double-tap labels to
          edit
        </p>

        <div className="mb-3 flex flex-wrap items-start gap-2 sm:items-center sm:gap-3">
          <EquipmentSelect
            value={picker}
            onChange={setPicker}
            onAdd={addNodeOfType}
          />

          <div
            className="flex w-full select-none items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 sm:w-auto sm:min-w-[260px] md:py-4"
            aria-live="polite"
          >
            <label
              htmlFor="node-name"
              className="shrink-0 text-xs text-gray-400"
            >
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
                "flex-1 bg-transparent border-none outline-none px-2 py-1.5 text-sm",
                selectedNode ? "text-gray-200" : "text-gray-500"
              )}
            />
          </div>
        </div>

        <div className="mb-3">
          <MeasurementControls
            isMeasurementMode={isMeasurementMode}
            onToggleMeasurementMode={toggleMeasurementMode}
            measurements={measurements}
            nodes={nodes}
            selectedMeasurementNodes={selectedMeasurementNodes}
          />
        </div>

        <div
          ref={containerRef}
          className="relative w-full border border-[#333] bg-[#0a0a0a]"
          style={{
            height: "calc(100vh - 280px)",
            minHeight: "400px",
            maxHeight: "800px",
            touchAction: "none",
          }}
        >
          <svg
            ref={svgRef}
            style={{
              width: "100%",
              height: "100%",
              cursor: isPanning
                ? "grabbing"
                : isMeasurementMode
                ? "crosshair"
                : "default",
              touchAction: "none",
            }}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
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
              <StageNodeBuilderComponent
                key={node.id}
                node={node}
                isHovered={hoveredNodeId === node.id}
                isRotating={isRotating && draggedNodeId === node.id}
                onMouseEnter={() => armedEnter(node.id)}
                onMouseLeave={armedLeave}
                onDelete={handleDeleteNode}
                onUpdateLabel={handleUpdateNodeLabel}
              />
            ))}

            {measurements.map((measurement) => {
              const startNode = nodes.find(
                (n) => n.id === measurement.startNodeId
              );
              const endNode = nodes.find((n) => n.id === measurement.endNodeId);
              if (!startNode || !endNode) return null;

              return (
                <DimensionLine
                  key={measurement.id}
                  measurement={measurement}
                  startNode={startNode}
                  endNode={endNode}
                  isHovered={hoveredMeasurementId === measurement.id}
                  onHover={() => setHoveredMeasurementId(measurement.id)}
                  onLeave={() => setHoveredMeasurementId(null)}
                  onDelete={handleDeleteMeasurement}
                  onUpdateCustomDistance={handleUpdateCustomDistance}
                />
              );
            })}
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 sm:mt-5 sm:gap-5">
          <button
            onClick={handleZoomIn}
            className="cursor-pointer select-none rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-white hover:bg-[#444] active:bg-[#222] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Zoom In (+)
          </button>
          <button
            onClick={handleZoomOut}
            className="cursor-pointer select-none rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-white hover:bg-[#444] active:bg-[#222] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Zoom Out (−)
          </button>
          <button
            onClick={handleReset}
            className="cursor-pointer select-none rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-white hover:bg-[#444] active:bg-[#222] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Reset View
          </button>

          <div className="flex w-full select-none items-center gap-2 text-xs text-gray-400 sm:ml-auto sm:w-auto sm:gap-5 sm:text-sm">
            <div>
              Zoom:{" "}
              <span className="text-green-700">{Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
