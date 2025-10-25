import { useCallback, useRef } from "react";

interface IPointerPosition {
  x: number;
  y: number;
}

interface IPointerState {
  isPrimaryDown: boolean;
  isSecondaryDown: boolean;
  positions: IPointerPosition[];
}

export interface IUnifiedPointerEvent {
  clientX: number;
  clientY: number;
  isPrimary: boolean;
  isTouch: boolean;
  touchCount: number;
  preventDefault: () => void;
  stopPropagation: () => void;
}

interface IUseUnifiedPointerReturn {
  handlePointerDown: (
    e: React.MouseEvent | React.TouchEvent
  ) => IUnifiedPointerEvent | null;
  handlePointerMove: (
    e: React.MouseEvent | React.TouchEvent
  ) => IUnifiedPointerEvent | null;
  handlePointerUp: (
    e: React.MouseEvent | React.TouchEvent
  ) => IUnifiedPointerEvent | null;
  getPointerState: () => IPointerState;
  reset: () => void;
}

export function useUnifiedPointer(): IUseUnifiedPointerReturn {
  const stateRef = useRef<IPointerState>({
    isPrimaryDown: false,
    isSecondaryDown: false,
    positions: [],
  });

  const normalizeEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent): IUnifiedPointerEvent | null => {
      const isTouch = "touches" in e;

      if (isTouch) {
        const touch = e.touches[0] || e.changedTouches[0];
        if (!touch) return null;

        return {
          clientX: touch.clientX,
          clientY: touch.clientY,
          isPrimary: e.touches.length === 1,
          isTouch: true,
          touchCount: e.touches.length,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
        };
      }

      return {
        clientX: e.clientX,
        clientY: e.clientY,
        isPrimary: e.button === 0,
        isTouch: false,
        touchCount: 0,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
      };
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const normalized = normalizeEvent(e);
      if (!normalized) return null;

      stateRef.current.isPrimaryDown = true;
      return normalized;
    },
    [normalizeEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      return normalizeEvent(e);
    },
    [normalizeEvent]
  );

  const handlePointerUp = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const normalized = normalizeEvent(e);
      stateRef.current.isPrimaryDown = false;
      stateRef.current.isSecondaryDown = false;
      return normalized;
    },
    [normalizeEvent]
  );

  const getPointerState = useCallback(() => stateRef.current, []);

  const reset = useCallback(() => {
    stateRef.current = {
      isPrimaryDown: false,
      isSecondaryDown: false,
      positions: [],
    };
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getPointerState,
    reset,
  };
}
