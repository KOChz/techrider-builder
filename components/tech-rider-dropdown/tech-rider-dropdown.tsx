"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

import { TProjectMember } from "@/db/schema";
import { useClickAway, useHover } from "@uidotdev/usehooks";

interface ITechRiderDropdownProps {
  members: TProjectMember[];
}

export function TechRiderDropdown({ members }: ITechRiderDropdownProps) {
  const [hoverRef, isHovering] = useHover<HTMLDivElement>();
  const [isClickOpen, setIsClickOpen] = useState(false);
  const [isInteractedByClick, setIsInteractedByClick] = useState(false);

  const isOpen = isClickOpen || (isHovering && !isInteractedByClick);

  const awayClickRef = useClickAway<HTMLDivElement>(() => {
    if (isClickOpen) {
      setIsClickOpen(false);
      setIsInteractedByClick(false);
    }
  });

  useEffect(() => {
    if (!isClickOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsClickOpen(false);
        setIsInteractedByClick(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isClickOpen]);

  const handleButtonClick = () => {
    const willOpen = !isClickOpen;
    setIsClickOpen(willOpen);
    setIsInteractedByClick(willOpen);
  };

  const handleMenuItemClick = () => {
    setIsClickOpen(false);
    setIsInteractedByClick(true);
  };

  return (
    <div ref={awayClickRef}>
      <div ref={hoverRef} className="relative flex flex-row items-center">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-0.5 border-none bg-transparent text-xs font-medium uppercase tracking-wider text-gray-600 transition-colors duration-200 hover:text-gray-900 focus:text-gray-900 focus:outline-none md:pt-[3px] md:text-[14px]"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={handleButtonClick}
        >
          Tech Rider
          <span
            className={cn(
              "text-[0.75rem] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          >
            ▾
          </span>
        </button>

        {/* Hover buffer to keep the “air gap” hoverable between trigger and panel */}
        <div
          aria-hidden
          className="pointer-events-auto absolute left-0 right-0 top-full h-2"
        />

        <div
          className={cn(
            "absolute top-full z-50",
            // mobile: center under trigger, never overflow
            "left-3/4 -translate-x-1/2 min-w-[260px] max-w-[92vw] w-max",
            // ≥md: right-align to trigger
            "md:left-auto md:right-0 md:translate-x-0 md:min-w-[300px]",
            // visibility/animation
            "transition-opacity duration-200",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          role="menu"
        >
          <div
            className={cn(
              "relative bg-white border border-gray-200 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            )}
          >
            {/* caret: centered on mobile, right on ≥md */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 block h-3 w-3 rotate-45 rounded-sm bg-white",
                "border-l border-t border-gray-200",
                "md:left-auto md:right-5 md:translate-x-0"
              )}
            />
            <div className="cursor-pointer">
              {members.map((member) => (
                <a
                  key={member.id}
                  href={`#${member.name}`}
                  className={cn(
                    "flex cursor-pointer gap-4 px-4 py-4",
                    "relative z-10 text-gray-900 no-underline transition-colors duration-200",
                    "border-b border-gray-100 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    "first:rounded-t-lg last:rounded-b-lg last:border-b-0",
                    "md:px-8 md:py-5 md:min-h-14"
                  )}
                  role="menuitem"
                  onClick={handleMenuItemClick}
                >
                  <span className="shrink-0 text-2xl grayscale">
                    {member.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[0.95rem] font-semibold tracking-tight">
                      {member.name}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
                      {member.role}
                    </span>
                  </div>
                </a>
              ))}
              <a
                href="#stage-plan"
                className={cn(
                  "flex items-center gap-4 px-4 py-4 text-gray-900 no-underline transition-colors duration-200",
                  "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none last:rounded-b-lg",
                  "md:px-8 md:py-5 md:min-h-14"
                )}
                role="menuitem"
                onClick={handleMenuItemClick}
              >
                <span className="shrink-0 text-2xl grayscale">🏟️</span>
                <div className="flex flex-col">
                  <span className="text-[0.95rem] font-semibold tracking-tight">
                    Stage Plan
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
