"use client";

import React from "react";

interface IMobileMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function MobileMenuButton({ onClick, isOpen }: IMobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed -left-4 top-20 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg transition-colors hover:bg-gray-50 lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <svg
        className="h-6 w-6 text-slate-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
