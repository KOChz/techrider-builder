import { useCallback, useRef } from "react";

interface IPinchState {
  isActive: boolean;
  initialDistance: number;
  initialScale: number;
  centerX: number;
  centerY: number;
}

interface IUsePinchZoomReturn {
  handleTouchStart: (e: React.TouchEvent) => IPinchState | null;
  handleTouchMove: (
    e: React.TouchEvent,
    currentScale: number
  ) => { scale: number; centerX: number; centerY: number } | null;
  handleTouchEnd: () => void;
  isPinching: () => boolean;
}

export function usePinchZoom(): IUsePinchZoomReturn {
  const pinchStateRef = useRef<IPinchState>({
    isActive: false,
    initialDistance: 0,
    initialScale: 1,
    centerX: 0,
    centerY: 0,
  });

  const calculateDistance = useCallback(
    (touch1: React.Touch, touch2: React.Touch): number => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    []
  );

  const calculateCenter = useCallback(
    (touch1: React.Touch, touch2: React.Touch) => {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    },
    []
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent): IPinchState | null => {
      if (e.touches.length !== 2) {
        pinchStateRef.current.isActive = false;
        return null;
      }

      const distance = calculateDistance(e.touches[0], e.touches[1]);
      const center = calculateCenter(e.touches[0], e.touches[1]);

      pinchStateRef.current = {
        isActive: true,
        initialDistance: distance,
        initialScale: 1,
        centerX: center.x,
        centerY: center.y,
      };

      return pinchStateRef.current;
    },
    [calculateDistance, calculateCenter]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent, currentScale: number) => {
      if (!pinchStateRef.current.isActive || e.touches.length !== 2) {
        return null;
      }

      const currentDistance = calculateDistance(e.touches[0], e.touches[1]);
      const center = calculateCenter(e.touches[0], e.touches[1]);
      const scaleChange =
        currentDistance / pinchStateRef.current.initialDistance;

      return {
        scale: pinchStateRef.current.initialScale * scaleChange,
        centerX: center.x,
        centerY: center.y,
      };
    },
    [calculateDistance, calculateCenter]
  );

  const handleTouchEnd = useCallback(() => {
    pinchStateRef.current.isActive = false;
  }, []);

  const isPinching = useCallback(() => pinchStateRef.current.isActive, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isPinching,
  };
}
