import { useRef, useEffect, useCallback } from "react";

export function useDebouncedFn<T extends (...args: any[]) => void>(
  fn: T,
  delay = 150
) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  const timerRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const run = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = window.setTimeout(() => fnRef.current(...args), delay);
    },
    [cancel, delay]
  );

  useEffect(() => cancel, [cancel]);
  return run;
}
