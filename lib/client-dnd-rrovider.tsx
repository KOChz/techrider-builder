"use client";

import { PropsWithChildren, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export function ClientDndProvider({ children }: PropsWithChildren) {
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Touch backend with mouse events enabled helps on hybrid devices
  const backend = useMemo(
    () => (isTouch ? TouchBackend : HTML5Backend),
    [isTouch]
  );
  const options = isTouch ? { enableMouseEvents: true } : undefined;

  return (
    <DndProvider backend={backend} options={options as any}>
      {children}
    </DndProvider>
  );
}
