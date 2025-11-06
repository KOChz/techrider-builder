"use client";

import { X } from "lucide-react";
import { useLayoutEffect, useMemo, useRef } from "react";

type UpdateFn = (
  equipmentIndex: number,
  exampleIndex: number,
  value: string
) => void;

function useAutosizeTextArea(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  minRows = 2
) {
  const baseHeight = useMemo(() => {
    // Fallback floor in case we can’t compute styles yet.
    return 44; // ~2 rows @ 16px with padding; will be overridden below.
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Compute min height from rows + paddings + borders.
    const cs = getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight || "20") || 20;
    const padding =
      parseFloat(cs.paddingTop || "0") + parseFloat(cs.paddingBottom || "0");
    const borders =
      parseFloat(cs.borderTopWidth || "0") +
      parseFloat(cs.borderBottomWidth || "0");
    const minPx = Math.max(
      baseHeight,
      Math.ceil(minRows * lineHeight + padding + borders)
    );

    // iOS fix: set to 0 first, then read scrollHeight.
    el.style.height = "0px";
    const next = Math.max(el.scrollHeight, minPx);

    // Single write to avoid jitter.
    el.style.height = `${next}px`;
  }, [ref, value, minRows, baseHeight]);
}

function ExampleItem({
  example,
  exampleIndex,
  equipmentIndex,
  onUpdateExample,
  onRemoveExample,
}: {
  example: string;
  exampleIndex: number;
  equipmentIndex: number;
  onUpdateExample: UpdateFn;
  onRemoveExample: (equipmentIndex: number, exampleIndex: number) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textareaRef, example, 2);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={example}
        rows={2}
        onChange={(e) =>
          onUpdateExample(equipmentIndex, exampleIndex, e.target.value)
        }
        // Important: no min-h-full; let JS set height.
        className="no-scrollbar w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-[16px] leading-6 placeholder-slate-500 focus:border-green-500 focus:outline-none"
        placeholder="Example item"
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        // iOS niceties
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
        className="absolute -right-1 -top-1 flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full border border-red-400 bg-red-500 text-white transition-colors hover:bg-red-600"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export function ExampleItemsList({
  examples,
  equipmentIndex,
  onUpdateExample,
  onRemoveExample,
}: {
  examples: string[];
  equipmentIndex: number;
  onUpdateExample: UpdateFn;
  onRemoveExample: (equipmentIndex: number, exampleIndex: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {examples.map((example, i) => (
        <ExampleItem
          key={i}
          example={example}
          exampleIndex={i}
          equipmentIndex={equipmentIndex}
          onUpdateExample={onUpdateExample}
          onRemoveExample={onRemoveExample}
        />
      ))}
    </div>
  );
}
