import { useAutosizeTextArea } from "@/hooks/use-autosize-textarea";
import { X } from "lucide-react";
import { useRef } from "react";

export type TUpdateFn = (
  equipmentIndex: number,
  exampleIndex: number,
  value: string
) => void;

export function DetailsItem({
  example,
  exampleIndex,
  equipmentIndex,
  onUpdateExample,
  onRemoveExample,
  itemRef,
}: {
  example: string;
  exampleIndex: number;
  equipmentIndex: number;
  onUpdateExample: TUpdateFn;
  onRemoveExample: (equipmentIndex: number, exampleIndex: number) => void;
  itemRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textareaRef, example, 2);

  return (
    <div
      ref={itemRef}
      className="relative scroll-mb-48"
      style={{ scrollMarginBottom: "12rem" }}
    >
      <textarea
        ref={textareaRef}
        value={example}
        rows={2}
        onChange={(e) =>
          onUpdateExample(equipmentIndex, exampleIndex, e.target.value)
        }
        className="no-scrollbar w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-[16px] leading-6 placeholder-slate-500 focus:border-green-500 focus:outline-none"
        placeholder="Details item"
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        inputMode="text"
        autoCorrect="on"
        autoCapitalize="sentences"
        style={{
          overflow: "hidden",
          WebkitAppearance: "none",
        }}
      />
      <button
        type="button"
        onClick={() => onRemoveExample(equipmentIndex, exampleIndex)}
        className="absolute right-2 top-2 flex h-[18px] w-[18px] cursor-pointer items-center justify-center text-gray-400 transition-colors hover:text-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
