import { useEffect, useState } from "react";

// Framer Motion's `animate` prop drives JS-based transforms, not CSS
// animations/transitions, so the global CSS prefers-reduced-motion rule
// (which zeroes out animation/transition durations) doesn't reach it.
// Components with continuous/looping `animate` props should check this
// hook directly and fall back to a static state when true.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return reduced;
}
