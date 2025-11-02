import React from "react";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "stage-plan.png");
  a.setAttribute("href", dataUrl);
  a.click();
  toast.success("Image donwloaded!");
}

const imageWidth = 10000;
const imageHeight = 5000;

export function DownloadStagePlanButton() {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      1
    );

    toPng(document.querySelector(".react-flow__viewport")! as HTMLElement, {
      backgroundColor: "white",
      type: "png",
      width: imageWidth,
      height: imageHeight,
      skipAutoScale: true,
      quality: 1,
      style: {
        width: `${imageWidth}`,
        height: `${imageHeight}`,
        transform: `translate(${viewport.x}px, ${viewport.y / 1.25}px) scale(${
          viewport.zoom * 3
        })`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        className="flex cursor-pointer flex-row items-center justify-between gap-2 rounded-lg bg-green-600/80 p-2 text-xs text-white transition-colors duration-200 hover:bg-green-700/90"
        onClick={onClick}
      >
        <ImagePlus strokeWidth={1.3} size={20} />
        <span>Download image</span>
      </button>
    </Panel>
  );
}
