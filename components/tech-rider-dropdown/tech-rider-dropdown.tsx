"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

import { TProjectMember } from "@/db/schema";

interface ITechRiderDropdownProps {
  members: TProjectMember[];
}

export function TechRiderDropdown({ members }: ITechRiderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="relative flex flex-row items-center"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        type="button"
        className="flex cursor-pointer items-center gap-0.5 border-none bg-transparent text-[14px] font-medium uppercase tracking-wider text-gray-600 transition-colors duration-200 hover:text-gray-900 focus:text-gray-900 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Tech Rider
        <span
          className={cn(
            "text-[0.8rem] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        >
          ▾
        </span>
      </a>

      <div
        className={cn(
          "absolute top-[calc(100%+0.5rem)] left-1/3 -translate-x-1/2",
          "min-w-[300px] w-max",
          "md:left-auto md:-right-4 md:translate-x-0",

          "transition-all duration-200",

          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        role="menu"
      >
        <div
          className={cn(
            "bg-white border border-gray-200 rounded-lg max-w-lg",
            "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
            "before:content-[''] before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2",
            "before:w-3 before:h-3 before:bg-white before:border-l before:border-t before:border-gray-200",
            "before:rotate-45 before:z-0",
            "md:before:left-auto md:before:right-5 md:before:translate-x-0"
          )}
        >
          {members.map((member) => (
            <a
              key={member.id}
              href={`#${member.name}`}
              className={cn(
                "flex gap-4 px-4 py-4",
                "relative z-10",
                "text-gray-900 no-underline",
                "transition-colors duration-200",
                "border-b border-gray-100",
                "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                "first:rounded-t-lg last:rounded-b-lg last:border-b-0",
                "md:px-8 md:py-5 md:min-h-14"
              )}
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <span className="shrink-0 text-2xl grayscale">{member.icon}</span>
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
              "flex items-center gap-4 px-4 py-4",
              "text-gray-900 no-underline",
              "transition-colors duration-200",
              "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
              "last:rounded-b-lg",
              "md:px-8 md:py-5 md:min-h-14"
            )}
            role="menuitem"
            onClick={() => setIsOpen(false)}
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
  );
}
