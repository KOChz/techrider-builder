"use client";

import { TStageNodeType } from "@/schemas/stage-plan";
import * as React from "react";
import z from "zod";

// exclude "text" on purpose—no SVG symbol.
const EQUIPMENT_OPTIONS: { value: TStageNodeType; label: string }[] = [
  { value: "drumkit", label: "Drumkit" },
  { value: "amp", label: "Amp" },
  { value: "monitor", label: "Monitor" },
  { value: "mic-stand", label: "Mic Stand" },
  { value: "power-extension", label: "Power Strip" },
  { value: "di-box", label: "DI Box" },
];

export type EquipmentSelectProps = {
  value: TStageNodeType;
  onChange: (value: TStageNodeType) => void;
  onAdd?: (value: TStageNodeType) => void; // optional CTA hook
  disabled?: boolean;
  id?: string;
};

export default function EquipmentSelect({
  value,
  onChange,
  onAdd,
  disabled,
  id,
}: EquipmentSelectProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(
    Math.max(
      0,
      EQUIPMENT_OPTIONS.findIndex((o) => o.value === value)
    )
  );

  // keep activeIndex in sync with external value
  React.useEffect(() => {
    const idx = EQUIPMENT_OPTIONS.findIndex((o) => o.value === value);
    setActiveIndex(Math.max(0, idx));
  }, [value]);

  // Close on outside click / focus loss
  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(t) &&
        listRef.current &&
        !listRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [open]);

  // Keyboard UX
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % EQUIPMENT_OPTIONS.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) => (i - 1 + EQUIPMENT_OPTIONS.length) % EQUIPMENT_OPTIONS.length
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const next = EQUIPMENT_OPTIONS[activeIndex];
      if (next) {
        onChange(next.value);
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
  }

  const selected =
    EQUIPMENT_OPTIONS.find((o) => o.value === value) ?? EQUIPMENT_OPTIONS[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            id={id}
            ref={buttonRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            title="Choose equipment"
            className={[
              "min-w-[220px] inline-flex items-center justify-between gap-2",
              "rounded-md border border-slate-700 cursor-pointer bg-slate-900 px-2 py-2 text-slate-100",
              "shadow-sm hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-green-500/60",
              "disabled:cursor-not-allowed disabled:opacity-60 select-none",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2.5">
              <IconPreview symbolId={selected.value} />
              <span>{selected.label}</span>
            </span>
            <span aria-hidden>▾</span>
          </button>

          {open && (
            <ul
              ref={listRef}
              role="listbox"
              aria-labelledby={id}
              tabIndex={-1}
              onKeyDown={onKeyDown}
              aria-activedescendant={
                id ? `${id}-opt-${activeIndex}` : undefined
              }
              className={[
                "absolute left-0 z-20 mt-1 min-w-[220px] max-h-80 overflow-y-auto",
                "rounded-lg border border-slate-800 bg-slate-950 p-1.5",
                "shadow-xl ring-1 ring-black/10",
              ].join(" ")}
            >
              {EQUIPMENT_OPTIONS.map((opt, idx) => {
                const active = idx === activeIndex;
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    id={id ? `${id}-opt-${idx}` : undefined}
                    role="option"
                    aria-selected={isSelected}
                    data-active={active ? "true" : "false"}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()} // keep focus flow clean
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                    className={[
                      "list-none flex items-center justify-between gap-2.5",
                      "rounded-md py-2 px-2.5 cursor-pointer text-slate-100",
                      "hover:bg-slate-800/60 focus:bg-slate-800/60",
                      active
                        ? "bg-slate-800 outline outline-1 outline-slate-700"
                        : "",
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <IconPreview symbolId={opt.value} />
                      <span>{opt.label}</span>
                    </span>
                    {isSelected ? (
                      <span className="text-green-400" aria-hidden>
                        ✓
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={() => onAdd(value)}
            disabled={disabled}
            title="Add selected equipment to canvas"
            className={[
              "inline-flex select-none items-center rounded-md border cursor-pointer border-slate-700 bg-slate-900",
              "px-2 py-5 text-slate-100 shadow-sm hover:bg-slate-800/60",
              "focus:outline-none focus:ring-2 focus:ring-green-500/60",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          >
            Add to Canvas
          </button>
        )}
      </div>
    </div>
  );
}

function IconPreview({ symbolId }: { symbolId: string }) {
  // Leans on your global <symbol id="..."> from <SvgSymbols />
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className="inline-block"
    >
      {/* We wrap the symbol in a <g> to normalize sizing;
          adjust scale/translate if any icon looks off */}
      <use width={88} height={88} href={`#${symbolId}`} />
    </svg>
  );
}
