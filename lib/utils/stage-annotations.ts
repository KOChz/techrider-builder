export const createStageAnnotations = () => [
  {
    id: "up-stage",
    data: {
      kind: "amp",
      label: "Upstage",
      rotation: 0,
    },
    type: "annotation",
    position: { x: 0, y: -200 },
  },
  {
    id: "down-stage",
    data: {
      kind: "amp",
      label: "Downstage / Audience",
      rotation: 0,
    },
    type: "annotation",
    position: { x: -50, y: 400 },
  },
  {
    id: "stage-left",
    data: {
      kind: "amp",
      label: "Stage Left",
      rotation: -90,
    },
    type: "annotation",
    position: { x: -400, y: 100 },
  },
  {
    id: "stage-right",
    data: {
      kind: "amp",
      label: "Stage Right",
      rotation: 90,
    },
    type: "annotation",
    position: { x: 400, y: 100 },
  },
];
