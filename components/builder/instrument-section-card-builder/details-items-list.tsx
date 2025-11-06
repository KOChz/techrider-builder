"use client";

import { DetailsItem, TUpdateFn } from "./details-item";

export function DetailsItemsList({
  examples,
  equipmentIndex,
  onUpdateExample,
  onRemoveExample,
  lastItemRef,
}: {
  examples: string[];
  equipmentIndex: number;
  onUpdateExample: TUpdateFn;
  onRemoveExample: (equipmentIndex: number, exampleIndex: number) => void;
  lastItemRef?: React.RefObject<HTMLDivElement | null> | undefined;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {examples.map((example, i) => (
        <DetailsItem
          key={i}
          example={example}
          exampleIndex={i}
          equipmentIndex={equipmentIndex}
          onUpdateExample={onUpdateExample}
          onRemoveExample={onRemoveExample}
          itemRef={i === examples.length - 1 ? lastItemRef : undefined}
        />
      ))}
    </div>
  );
}
