import { useState, useRef, useEffect } from "react";
import { TEquipmentType } from "../nodes/equipment-node";
import { PaletteItem } from "./palette-item";

interface IPaletteProps {
  onAddNode: (kind: TEquipmentType) => void;
}

export function Palette({ onAddNode }: IPaletteProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAddNode = (kind: TEquipmentType) => {
    onAddNode(kind);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="relative xl:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-400/90 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <span>Add Equipment</span>
          <svg
            className={`h-5 w-5 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-slate-400/75 bg-white shadow-lg">
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="grid gap-2">
                <PaletteItem
                  kind="drumkit"
                  label="Drumkit"
                  onAddNode={handleAddNode}
                />
                <PaletteItem
                  kind="synth-stand"
                  label="Synth Stand"
                  onAddNode={handleAddNode}
                />
                <PaletteItem
                  kind="monitor"
                  label="Monitor"
                  onAddNode={handleAddNode}
                />
                <PaletteItem kind="amp" label="Amp" onAddNode={handleAddNode} />
                <PaletteItem
                  kind="mic-stand"
                  label="Mic Stand"
                  onAddNode={handleAddNode}
                />
                <PaletteItem
                  kind="power-extension"
                  label="Power Strip"
                  onAddNode={handleAddNode}
                />
                <PaletteItem
                  kind="di-box"
                  label="DI Box"
                  onAddNode={handleAddNode}
                />
                <PaletteItem kind="mic" label="Mic" onAddNode={handleAddNode} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden xl:grid xl:auto-rows-min xl:gap-2">
        <PaletteItem kind="drumkit" label="Drumkit" onAddNode={onAddNode} />
        <PaletteItem kind="monitor" label="Monitor" onAddNode={onAddNode} />
        <PaletteItem
          kind="synth-stand"
          label="Synth Stand"
          onAddNode={onAddNode}
        />
        <PaletteItem kind="amp" label="Amp" onAddNode={onAddNode} />
        <PaletteItem kind="mic" label="Mic" onAddNode={onAddNode} />
        <PaletteItem kind="mic-stand" label="Mic Stand" onAddNode={onAddNode} />
        <PaletteItem
          kind="power-extension"
          label="Power Strip"
          onAddNode={onAddNode}
        />
        <PaletteItem kind="di-box" label="DI Box" onAddNode={onAddNode} />
      </div>
    </>
  );
}
