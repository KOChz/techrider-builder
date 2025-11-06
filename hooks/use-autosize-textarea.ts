import { useMemo, useLayoutEffect } from "react";

export function useAutosizeTextArea(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  minRows = 2
) {
  const baseHeight = useMemo(() => {
    return 44;
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cs = getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight || "20") || 20;
    const padding =
      parseFloat(cs.paddingTop || "0") + parseFloat(cs.paddingBottom || "0");
    const borders =
      parseFloat(cs.borderTopWidth || "0") +
      parseFloat(cs.borderBottomWidth || "0");
    const minPx = Math.max(
      baseHeight,
      Math.ceil(minRows * lineHeight + padding + borders)
    );

    el.style.height = "0px";
    const next = Math.max(el.scrollHeight, minPx);

    el.style.height = `${next}px`;
  }, [ref, value, minRows, baseHeight]);
}
