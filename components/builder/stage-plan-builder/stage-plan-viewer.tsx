"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type ReactFlowInstance,
  BackgroundVariant,
  NodeChange,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { IStagePlanFlowConfig } from "@/stores/use-project-creation-store";
import { useDevice } from "@/hooks/use-device";
import { TEquipmentData } from "./nodes/equipment-node";
import { TMeasurmentData } from "./edges/measure-edge";

export const nodeViewerTypes = {
  equipment: EquipmentViewNode,
  annotation: AnnotationNode,
};

export const edgeViewerTypes = { measure: ViewMeasureEdge };

import { DEFAULT_PX_PER_METER, edgeTypes } from "./stage-plan-builder";
import { cn } from "@/lib/utils/cn";
import { AnnotationNode } from "./nodes/annotation-node";
import { EquipmentViewNode } from "./nodes/equipment-node-view";
import { ViewMeasureEdge } from "./edges/view-measure-edge";
import { useReactFlowStore } from "@/stores/use-react-flow-store";

const annotationNodes: Node<TEquipmentData>[] = [
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

export function StagePlanViewer({
  stagePlanConfig,
  setStagePlanConfig,
  isDownload,
}: {
  stagePlanConfig?: IStagePlanFlowConfig;
  setStagePlanConfig?: (config: IStagePlanFlowConfig) => void;
  isDownload?: boolean;
}) {
  const setReactFlowInstance = useReactFlowStore((state) => state.setInstance);

  const rfRef = useRef<ReactFlowInstance<Node<TEquipmentData>> | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);

  const { isMobile } = useDevice();

  const [nodes, setNodes] = useState<Node<TEquipmentData>[]>([
    ...(stagePlanConfig?.nodes || [])!,
    ...annotationNodes,
  ]);

  const [edges, setEdges] = useState<Edge<TMeasurmentData>[]>(
    stagePlanConfig?.edges || []
  );

  const [pxPerMeter, setPxPerMeter] = useState<number>(DEFAULT_PX_PER_METER);

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

  return (
    <div
      className={cn(
        "max-w-3/2 flex flex-col gap-2 md:max-h-none md:w-full md:flex-row md:justify-between",
        "h-[400px] md:h-[600px] lg:h-[700px] xl:h-[600px]"
      )}
    >
      {/* Canvas */}
      <div
        ref={flowRef}
        className={cn(
          "touch-none overflow-auto rounded-xl border border-gray-200 md:flex-1",
          "h-[400px] md:h-[600px] lg:h-[700px] xl:h-[600px]"
        )}
      >
        <ReactFlow<Node<TEquipmentData>>
          onInit={(inst) => {
            rfRef.current = inst;
            setReactFlowInstance(inst);
          }}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeViewerTypes}
          edgeTypes={edgeViewerTypes}
          onNodesChange={onNodesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          panOnScroll={false}
          preventScrolling={false}
          zoomOnPinch={true}
          zoomOnScroll={false}
          selectionOnDrag
          minZoom={isMobile ? 0.4 : 0.8}
          maxZoom={2.5}
          snapToGrid
          snapGrid={[10, 10]}
          style={{ width: "100%", height: "100%" }}
        >
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
