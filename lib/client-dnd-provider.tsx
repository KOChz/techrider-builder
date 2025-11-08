"use client";

import { PropsWithChildren, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export function ClientDndProvider({ children }: PropsWithChildren) {
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const backend = useMemo(() => HTML5Backend, [isTouch]);

  const options = isTouch
    ? {
        enableMouseEvents: true, // hybrid devices
        delay: 150, // press-and-hold to start drag (prevents accidental drags while scrolling)
        touchSlop: 8, // px movement allowed before drag
        // allow vertical scroll to pass through when gesture is ~vertical
        scrollAngleRanges: [{ start: 80, end: 100 }],
      }
    : undefined;

  return (
    <DndProvider backend={backend} options={options as any}>
      {children}
    </DndProvider>
  );
}
