import { useState, useRef, useCallback, useEffect } from "react";

interface IUseTouchGesturesOptions {
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onSingleTap?: () => void;
  longPressDuration?: number;
  doubleTapDelay?: number;
  movementThreshold?: number;
}

interface IUseTouchGesturesReturn {
  isTouchDevice: boolean;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

/**
 * Custom hook for handling touch gestures including long-press and double-tap
 *
 * @param options - Configuration options for gesture detection
 * @returns Touch gesture handlers and state
 *
 * @example
 * ```tsx
 * const { isTouchDevice, isActive, handlePointerDown, handlePointerUp } = useTouchGestures({
 *   onLongPress: () => console.log('Long press detected'),
 *   onDoubleTap: () => console.log('Double tap detected'),
 *   longPressDuration: 500,
 *   doubleTapDelay: 300
 * });
 * ```
 */
export const useTouchGestures = (
  options: IUseTouchGesturesOptions = {}
): IUseTouchGesturesReturn => {
  const {
    onLongPress,
    onDoubleTap,
    onSingleTap,
    longPressDuration = 500,
    doubleTapDelay = 300,
    movementThreshold = 10,
  } = options;

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
    window.addEventListener("touchstart", checkTouchDevice, { once: true });

    return () => {
      window.removeEventListener("touchstart", checkTouchDevice);
    };
  }, []);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const triggerHapticFeedback = useCallback((duration: number = 50) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch") {
        touchStartPosRef.current = { x: e.clientX, y: e.clientY };
        hasMovedRef.current = false;

        longPressTimerRef.current = setTimeout(() => {
          if (!hasMovedRef.current) {
            setIsActive(true);
            triggerHapticFeedback(50);
            onLongPress?.();
          }
        }, longPressDuration);
      }
    },
    [longPressDuration, onLongPress, triggerHapticFeedback]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (
        e.pointerType === "touch" &&
        touchStartPosRef.current &&
        longPressTimerRef.current
      ) {
        const deltaX = Math.abs(e.clientX - touchStartPosRef.current.x);
        const deltaY = Math.abs(e.clientY - touchStartPosRef.current.y);

        if (deltaX > movementThreshold || deltaY > movementThreshold) {
          hasMovedRef.current = true;
          clearLongPressTimer();
        }
      }
    },
    [movementThreshold, clearLongPressTimer]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      clearLongPressTimer();
      touchStartPosRef.current = null;

      if (e.pointerType === "touch" && !hasMovedRef.current) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTimeRef.current;

        if (timeSinceLastTap < doubleTapDelay && timeSinceLastTap > 0) {
          triggerHapticFeedback(30);
          onDoubleTap?.();
          lastTapTimeRef.current = 0;
        } else {
          if (onSingleTap) {
            onSingleTap();
          } else {
            setIsActive((prev) => !prev);
          }
          lastTapTimeRef.current = now;
        }
      }

      hasMovedRef.current = false;
    },
    [
      clearLongPressTimer,
      doubleTapDelay,
      onDoubleTap,
      onSingleTap,
      triggerHapticFeedback,
    ]
  );

  const handlePointerCancel = useCallback(() => {
    clearLongPressTimer();
    touchStartPosRef.current = null;
    hasMovedRef.current = false;
  }, [clearLongPressTimer]);

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, [clearLongPressTimer]);

  return {
    isTouchDevice,
    isActive,
    setIsActive,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
};
