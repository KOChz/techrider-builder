"use client";

import { DND_TYPES } from "@/constants/dnd";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

type DragItem = { type: typeof DND_TYPES.SECTION; id: string; index: number };

type DraggableSectionProps = PropsWithChildren<{
  id: string;
  index: number;
  move: (from: number, to: number) => void;
}>;

const INTERACTIVE_SELECTOR =
  'input, textarea, select, button, a, [contenteditable="true"], summary, [role="button"], [role="textbox"]';

export function DraggableSection({
  id,
  index,
  move,
  children,
}: DraggableSectionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastPointerTargetRef = useRef<EventTarget | null>(null);

  // Capture pointer target to decide if drag can start.
  // in DraggableSection
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onPointerDown = (e: Event) => {
      lastPointerTargetRef.current = e.target;
    };
    const opts: AddEventListenerOptions = { capture: true, passive: true };
    el.addEventListener("pointerdown", onPointerDown, opts);
    el.addEventListener("touchstart", onPointerDown, opts);
    el.addEventListener("mousedown", onPointerDown, opts);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown, opts);
      el.removeEventListener("touchstart", onPointerDown, opts);
      el.removeEventListener("mousedown", onPointerDown, opts);
    };
  }, []);

  const isInteractiveTarget = () => {
    const t = lastPointerTargetRef.current as Element | null;
    return !!t && !!t.closest(INTERACTIVE_SELECTOR);
  };

  // Drop target on the same container.
  const [, drop] = useDrop<DragItem>({
    accept: DND_TYPES.SECTION,
    hover(item, monitor) {
      if (!rootRef.current) return;
      if (!monitor.isOver({ shallow: true })) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Move immediately on enter — grid-safe
      move(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPES.SECTION,
    item: { type: DND_TYPES.SECTION, id, index },
    canDrag: () => !isInteractiveTarget(), // don’t start drag from inputs/details
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // Connect both drag + drop to the same wrapper element.
  const setRef = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (!el) return;
    drag(el);
    drop(el);
  };

  return (
    <div
      ref={setRef}
      className="cursor-grab active:cursor-grabbing"
      style={{
        opacity: isDragging ? 0.55 : 1,
        transition: "opacity 120ms ease",
        borderRadius: 12,
        // block browser gestures only during drag; scrolling works normally otherwise
        touchAction: isDragging ? "none" : undefined,
        WebkitUserSelect: isDragging ? "none" : undefined,
        userSelect: isDragging ? "none" : undefined,
        WebkitTouchCallout: isDragging ? "none" : undefined,
      }}
    >
      {children}
    </div>
  );
}
