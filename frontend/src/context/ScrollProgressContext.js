import { createContext, useContext } from "react";

// A single, shared normalized scroll-progress value (0 at the top of the
// page, 1 at the bottom), used as the one source of truth for atmosphere
// that spans section boundaries — so the page reads as one continuous
// environment the viewer moves through, rather than each section running
// its own disconnected animation. This is a motion-value (framer-motion),
// not plain state, so subscribers can derive transforms from it without
// forcing a React re-render on every scroll tick.
const ScrollProgressContext = createContext(null);

export const ScrollProgressProvider = ScrollProgressContext.Provider;

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}
