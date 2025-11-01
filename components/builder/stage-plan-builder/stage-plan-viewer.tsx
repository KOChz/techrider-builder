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
import { TEquipmentData, TEquipmentType } from "./nodes/equipment-node";
import { TMeasurmentData } from "./edges/measure-edge";

import {
  DEFAULT_PX_PER_METER,
  edgeTypes,
  egdeMeasure,
  nodeTypes,
} from "./stage-plan-builder";

export function StagePlanViewer({
  stagePlanConfig,
  setStagePlanConfig,
}: {
  stagePlanConfig?: IStagePlanFlowConfig;
  setStagePlanConfig?: (config: IStagePlanFlowConfig) => void;
}) {
  const [nodes, setNodes] = useState<Node<TEquipmentData>[]>([
    ...(stagePlanConfig?.nodes || [])!,
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
  ]);

  const [edges, setEdges] = useState<Edge<TMeasurmentData>[]>(
    stagePlanConfig?.edges || []
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

  const { isMobile } = useDevice();

  return (
    <div className="max-w-3/2 flex h-[50dvh] flex-col gap-2 md:h-[50dvh] md:max-h-none md:w-full md:flex-row md:justify-between xl:h-[70dvh]">
      {/* Canvas */}
      <div
        ref={flowRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="h-[50dvh] touch-none overflow-auto rounded-xl border border-gray-200 md:flex-1 xl:h-[70dvh]"
      >
        <ReactFlow<Node<TEquipmentData>>
          onInit={(inst) => (rfRef.current = inst)}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 10 }}
          proOptions={{ hideAttribution: true }}
          // sensible interaction defaults
          panOnScroll={false}
          preventScrolling={false}
          // panOnDrag={false}
          zoomOnPinch={true}
          zoomOnScroll={false}
          selectionOnDrag
          minZoom={isMobile ? 0.42 : 0.8}
          maxZoom={3}
          snapToGrid
          snapGrid={[10, 10]}
          style={{ overflow: "auto !important" }}
        >
          {/* <MiniMap pannable zoomable className="scale-65 md:scale-100" /> */}
          <Background
            id="1"
            gap={10}
            color="#f1f1f1"
            variant={BackgroundVariant.Lines}
          />

          <Background
            style={{ overflow: "auto" }}
            id="2"
            gap={100}
            color="#ccc"
            variant={BackgroundVariant.Lines}
          />
          {/* <Controls showInteractive={false} position="bottom-right" /> */}
        </ReactFlow>
      </div>
    </div>
  );
}
