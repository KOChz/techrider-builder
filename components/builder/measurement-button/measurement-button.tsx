import { cn } from "@/lib/utils/cn";
import { Ruler, X } from "lucide-react";

interface IMeasurementButtonProps {
  isMeasurementMode: boolean;
  selectedSourceNode: string | null;
  onStartMeasurement: () => void;
  onCancelMeasurement: () => void;
}

export function MeasurementButton({
  isMeasurementMode,
  selectedSourceNode,
  onStartMeasurement,
  onCancelMeasurement,
}: IMeasurementButtonProps) {
  return (
    <div className="grid gap-2">
      <button
        onClick={isMeasurementMode ? onCancelMeasurement : onStartMeasurement}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors",
          isMeasurementMode
            ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
            : "border-green-600 bg-green-600 text-white hover:bg-green-700"
        )}
        type="button"
      >
        {isMeasurementMode ? (
          <>
            <X className="h-4 w-4" />
            Cancel Measurement
          </>
        ) : (
          <>
            <Ruler size={20} strokeWidth={1.8} />
            Add Measurement
          </>
        )}
      </button>

      {isMeasurementMode && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-900">
            {!selectedSourceNode ? (
              <>
                <span className="font-bold">Step 1:</span> Click on the first
                equipment
              </>
            ) : (
              <>
                <span className="font-bold">Step 2:</span> Click on the second
                equipment
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
