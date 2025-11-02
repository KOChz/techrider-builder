"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface IExampleItemsListProps {
  examples: string[];
  equipmentIndex: number;
  onUpdateExample: (
    equipmentIndex: number,
    exampleIndex: number,
    value: string
  ) => void;
  onRemoveExample: (equipmentIndex: number, exampleIndex: number) => void;
}

export function ExampleItemsList({
  examples,
  equipmentIndex,
  onUpdateExample,
  onRemoveExample,
}: IExampleItemsListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {examples.map((example, exampleIndex) => (
        <ExampleItem
          key={exampleIndex}
          example={example}
          exampleIndex={exampleIndex}
          equipmentIndex={equipmentIndex}
          onUpdateExample={onUpdateExample}
          onRemoveExample={onRemoveExample}
        />
      ))}
    </div>
  );
}

interface IExampleItemProps {
  example: string;
  exampleIndex: number;
  equipmentIndex: number;
  onUpdateExample: (
    equipmentIndex: number,
    exampleIndex: number,
    value: string
  ) => void;
  onRemoveExample: (equipmentIndex: number, exampleIndex: number) => void;
}

function ExampleItem({
  example,
  exampleIndex,
  equipmentIndex,
  onUpdateExample,
  onRemoveExample,
}: IExampleItemProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [example]);

  return (
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={example}
        onChange={(e) =>
          onUpdateExample(equipmentIndex, exampleIndex, e.target.value)
        }
        className="no-scrollbar w-full resize-none rounded border border-gray-300 px-3 py-1 text-[16px] placeholder-slate-500 focus:border-green-500 focus:outline-none"
        placeholder="Example item"
        rows={1}
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
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
