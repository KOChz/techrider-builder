"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

interface IMobileReorderControlsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  className?: string;
}

export function MobileReorderControls({
  index,
  total,
  onMoveUp,
  onMoveDown,
  className = "",
}: IMobileReorderControlsProps) {
  const isAtTop = index === 0;
  const isAtBottom = index === total - 1;

  if (total <= 1) return null;

  return (
    <div
      className={`z-20 w-min flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white md:hidden ${className}`}
      role="group"
      aria-label="Reorder section controls"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        disabled={isAtTop}
        aria-label="Move section up"
        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
      >
        <ChevronUp size={18} className="text-slate-700" />
      </button>

      <div className="h-px bg-slate-200" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        disabled={isAtBottom}
        aria-label="Move section down"
        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
      >
        <ChevronDown size={18} className="text-slate-700" />
      </button>
    </div>
  );
}
