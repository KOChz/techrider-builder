"use client";

import { useState, useRef, useEffect } from "react";

export const MUSICAL_INSTRUMENTS = [
  { emoji: "🎸", label: "Guitar" },
  { emoji: "🎹", label: "Keyboard" },
  { emoji: "🥁", label: "Drums" },
  { emoji: "🎤", label: "Microphone" },
  { emoji: "🎺", label: "Trumpet" },
  { emoji: "🎷", label: "Saxophone" },
  { emoji: "🎻", label: "Violin" },
  { emoji: "🪕", label: "Banjo" },
  { emoji: "🪘", label: "Drum" },
  { emoji: "🎥", label: "Visuals" },
] as const;

interface IMusicalInstrumentSelectorProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function MusicalInstrumentSelector({
  value,
  onChange,
}: IMusicalInstrumentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-3xl transition-colors hover:border-green-500 focus:border-green-500 focus:outline-none"
        aria-label="Select musical instrument icon"
      >
        {value || "🎸"}
      </button>

      {isOpen && (
        <div className="min-w-72 absolute z-10 mt-2 w-full rounded-lg border-2 border-gray-300 bg-white p-3 px-2 shadow-lg">
          <div className="grid grid-cols-5 gap-3">
            {MUSICAL_INSTRUMENTS.map(({ emoji, label }) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className={`w-12 cursor-pointer h-12 text-2xl flex items-center justify-center rounded-lg hover:bg-green-50 transition-colors ${
                  value === emoji ? "bg-green-100 ring-2 ring-green-500" : ""
                }`}
                title={label}
                aria-label={`Select ${label}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
