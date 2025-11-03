"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type ReactFlowInstance,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";

import { IStagePlanFlowConfig } from "@/stores/use-project-creation-store";
import { useDebouncedCallback } from "use-debounce";
import { useDevice } from "@/hooks/use-device";
import { MeasurementButton } from "../measurement-button/measurement-button";
import {
  EquipmentNode,
  TEquipmentData,
  TEquipmentType,
} from "./nodes/equipment-node";
import { MeasureEdge, TMeasurmentData } from "./edges/measure-edge";
import { AnnotationNode } from "./nodes/annotation-node";
import { Palette } from "./stage-builder-sidebar/palette";
import { DownloadStagePlanPdfButton } from "./download-stage-plan-button/download-stage-plan-button";

export const DEFAULT_PX_PER_METER = 100;

export const edgeTypes = { measure: MeasureEdge };

export const ANNOTATION_NODES: Node<TEquipmentData>[] = [
  {
    id: "up-stage",
    type: "annotation",
    draggable: false,
    selectable: false,

    data: {
      kind: "amp",
      label: "Upstage",
    },
    position: { x: -0, y: -200 },
  },
  {
    id: "down-stage",
    type: "annotation",
    draggable: false,
    selectable: false,

    data: {
      kind: "amp",
      label: "Downstage / Audience",
    },
    position: { x: -50, y: 400 },
  },
  {
    id: "stage-left",
    type: "annotation",
    draggable: false,
    selectable: false,

    data: {
      kind: "amp",
      label: "Stage Left",
      rotation: -90,
    },
    position: { x: -400, y: 100 },
  },
  {
    id: "stage-right",
    type: "annotation",
    draggable: false,
    selectable: false,

    data: {
      kind: "amp",
      label: "Stage Right",
      rotation: 90,
    },
    position: { x: 400, y: 100 },
  },
];

export const nodeTypes = {
  equipment: EquipmentNode,
  annotation: AnnotationNode,
};

export const egdeMeasure = "measure" as const;

export default function StagePlanBuilder({
  stagePlanConfig,
  setStagePlanConfig,
  isViewer = false,
}: {
  stagePlanConfig?: IStagePlanFlowConfig;
  setStagePlanConfig?: (config: IStagePlanFlowConfig) => void;
  isViewer?: boolean;
}) {
  const isBuilder = !isViewer;
  const [nodes, setNodes] = useState<Node<TEquipmentData>[]>([
    ...(stagePlanConfig?.nodes || [])!,
    ...ANNOTATION_NODES,
  ]);

  const [edges, setEdges] = useState<Edge<TMeasurmentData>[]>(
    stagePlanConfig?.edges || []
  );

  const [isMeasurementMode, setIsMeasurementMode] = useState(false);
  const [selectedSourceNode, setSelectedSourceNode] = useState<string | null>(
    null
  );

  const saveStagePlan = useDebouncedCallback(
    (n: Node<TEquipmentData>[], e: Edge<TMeasurmentData>[]) => {
      if (!setStagePlanConfig) return;

      const config: IStagePlanFlowConfig = {
        ...stagePlanConfig!,
        nodes: n,
        edges: e,
      };

      setStagePlanConfig(config);
    },
    800
  );

  useEffect(() => {
    saveStagePlan(nodes, edges);
  }, [nodes, edges, saveStagePlan]);

  const rfRef = useRef<ReactFlowInstance<Node<TEquipmentData>> | null>(null);

  const [pxPerMeter, setPxPerMeter] = useState<number>(DEFAULT_PX_PER_METER);
  const flowRef = useRef<HTMLDivElement | null>(null);

  // reflect current scale into a CSS var for the MeasureEdge
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--px-per-meter",
      String(pxPerMeter)
    );
  }, [pxPerMeter]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<TEquipmentData>) => {
      if (!isMeasurementMode) return;

      // Ignore annotation nodes
      if (node.type === "annotation") return;

      // First node selection
      if (!selectedSourceNode) {
        setSelectedSourceNode(node.id);
        return;
      }

      // Second node selection - create the edge
      if (selectedSourceNode && node.id !== selectedSourceNode) {
        const newEdge: Edge<TMeasurmentData> = {
          id: nanoid(),
          source: selectedSourceNode,
          target: node.id,
          type: egdeMeasure,
          data: {},
        };

        setEdges((eds) => [...eds, newEdge]);

        // Reset measurement mode
        setSelectedSourceNode(null);
        setIsMeasurementMode(false);
      }
    },
    [isMeasurementMode, selectedSourceNode]
  );

  const handleCancelMeasurement = useCallback(() => {
    setIsMeasurementMode(false);
    setSelectedSourceNode(null);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<TEquipmentData>>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) => addEdge({ ...c, type: egdeMeasure }, eds)),
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
    ) as TEquipmentType;
    if (!kind || !rfRef.current) return;

    // v12: use screenToFlowPosition with raw client coords
    const position = rfRef.current.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const node: Node<TEquipmentData> = {
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

  const handleAddNode = useCallback((kind: TEquipmentType) => {
    if (!rfRef.current || !flowRef.current) return;

    // Get the flow container's bounding rectangle
    const flowBounds = flowRef.current.getBoundingClientRect();

    // Calculate the center point of the viewport
    const centerX = flowBounds.left + flowBounds.width / 2;
    const centerY = flowBounds.top + flowBounds.height / 2;

    // Convert screen coordinates to flow coordinates
    const position = rfRef.current.screenToFlowPosition({
      x: centerX,
      y: centerY,
    });

    const newNode: Node<TEquipmentData> = {
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

    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, []);

  const { isMobile } = useDevice();

  return (
    <div className="flex flex-col gap-2 xl:h-[80vh] xl:flex-row xl:items-stretch xl:justify-between">
      {/* Sidebar */}
      {isBuilder && (
        <div className="min-h-10 grid content-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:w-full lg:max-w-none xl:h-full xl:w-72 xl:flex-shrink-0 xl:overflow-y-auto">
          <div className="grid gap-1.5">
            <span className="text-xs text-slate-600">
              Connect two nodes to show distance.
            </span>

            <span className="md:display-none text-xs text-slate-600">
              <span className="font-bold text-green-700/90">Drag</span> from
              here into the canvas or{" "}
              <span className="font-bold text-green-700/90">Click</span> on
              mobile.
            </span>

            <div className="hidden md:block">
              <div className="h-px bg-slate-200" />
              <MeasurementButton
                isMeasurementMode={isMeasurementMode}
                selectedSourceNode={selectedSourceNode}
                onStartMeasurement={() => setIsMeasurementMode(true)}
                onCancelMeasurement={handleCancelMeasurement}
              />
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="grid gap-2 pb-6">
            <strong className="text-xs text-slate-900">Equipment</strong>
            <Palette onAddNode={handleAddNode} />
            <span className="text-xs text-slate-600 md:hidden">
              <span className="font-bold text-green-700/90">Drag</span> from
              here into the canvas or{" "}
              <span className="font-bold text-green-700/90">Click</span> on
              mobile.
            </span>
          </div>

          <div className="md:hidden">
            <div className="h-px bg-slate-200" />
            <MeasurementButton
              isMeasurementMode={isMeasurementMode}
              selectedSourceNode={selectedSourceNode}
              onStartMeasurement={() => setIsMeasurementMode(true)}
              onCancelMeasurement={handleCancelMeasurement}
            />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={flowRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="aspect-square h-[400px] min-h-0 touch-none select-none overflow-auto rounded-xl border border-slate-200 xl:aspect-auto xl:h-full xl:flex-1"
        style={{ WebkitTouchCallout: "none" }}
      >
        <ReactFlow<Node<TEquipmentData>>
          onNodeClick={handleNodeClick}
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
          panOnScroll
          panOnDrag
          zoomOnPinch
          zoomOnScroll={false}
          selectionOnDrag
          minZoom={isMobile ? 0.4 : 0.8}
          maxZoom={2.5}
          snapToGrid
          snapGrid={[10, 10]}
          style={{ width: "100%", height: "100%" }}
        >
          <DownloadStagePlanPdfButton />

          <Background
            id="1"
            gap={10}
            color="#f1f1f1"
            variant={BackgroundVariant.Lines}
          />
          <Background
            id="2"
            gap={100}
            color="#ccc"
            variant={BackgroundVariant.Lines}
          />
          {/* <Controls
            showInteractive={false}
            position="bottom-right"
            className="md:scale-125"
          /> */}
        </ReactFlow>
      </div>
    </div>
  );
}
