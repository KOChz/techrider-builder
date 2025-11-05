import { useState } from "react";
import { Edge, Panel, ReactFlowInstance, useReactFlow } from "@xyflow/react";
import toast from "react-hot-toast";
import { FileDown, Loader2 } from "lucide-react";
import { exportStagePlanToPdf } from "@/lib/utils/export-stage-plan-to-pdf";
import { TEquipmentData } from "../stage-plan-builder/nodes/equipment-node";

interface IDownloadTechRiderPdfButtonProps {
  fileName?: string;
  inst?: ReactFlowInstance;
}

export function DownloadTechRiderPdfButton({
  fileName = "stage-plan.pdf",
  inst,
}: IDownloadTechRiderPdfButtonProps) {
  const reactFlowInstance = useReactFlow();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      toast.loading("Generating PDF...", { id: "pdf-export" });

      await exportStagePlanToPdf({
        reactFlowInstance: inst || reactFlowInstance,
        fileName,
      });

      toast.success("PDF downloaded successfully!", { id: "pdf-export" });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to export PDF",
        { id: "pdf-export" }
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Panel position="top-right">
      <button
        className="flex cursor-pointer flex-row items-center justify-between gap-2 rounded-lg bg-green-600/80 p-2 text-xs text-white transition-colors duration-200 hover:bg-green-700/90 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleExportPdf}
        disabled={isExporting}
        aria-label="Download stage plan as PDF"
      >
        {isExporting ? (
          <Loader2 strokeWidth={1.3} size={20} className="animate-spin" />
        ) : (
          <FileDown strokeWidth={1.3} size={20} />
        )}
        <span>{isExporting ? "Generating..." : "Download PDF"}</span>
      </button>
    </Panel>
  );
}
