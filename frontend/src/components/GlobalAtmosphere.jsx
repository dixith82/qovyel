import { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "../context/ScrollProgressContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// A fixed, full-viewport atmosphere spanning the entire page — not scoped
// to any one section — so the site reads as one continuous environment
// the viewer moves through rather than a stack of independently-animated
// sections. Two things tie sections together here:
//
// 1. A starfield that drifts slowly as the shared scroll progress changes,
//    giving a persistent sense of depth/travel that survives section
//    boundaries (each section no longer "resets" the atmosphere).
// 2. A vignette whose intensity is driven by the same progress value,
//    subtly deepening toward the cinematic mountain section (roughly the
//    middle of the page) and easing back toward the ends — so lighting
//    feels like it belongs to one journey, not per-section resets.
//
// Deliberately NOT a Three.js/WebGL scene: this is a fixed, GPU-cheap
// (opacity/transform only) layer, skipped entirely on small screens and
// under prefers-reduced-motion, per the performance/accessibility
// requirements — a heavy always-on canvas here would cost far more than
// it's worth for a background atmosphere effect.
export default function GlobalAtmosphere() {
  const scrollYProgress = useScrollProgress();
  const reduceMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 1024 && !reduceMotion);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [reduceMotion]);

  // Hooks must run unconditionally, so useTransform always gets a real
  // MotionValue — App always provides one via useScroll() before this
  // component ever mounts, so scrollYProgress is never actually null here.
  const driftY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const vignette = useTransform(scrollYProgress, [0, 0.4, 0.55, 0.75, 1], [0.35, 0.55, 0.75, 0.55, 0.4]);

  if (!enabled || !scrollYProgress) return null;

  const stars = Array.from({ length: 46 });

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      <motion.div className="absolute inset-x-0 -top-1/4 h-[130%]" style={{ y: driftY }}>
        {stars.map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 1.6 + 0.6,
              height: Math.random() * 1.6 + 0.6,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.08,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: vignette,
          boxShadow: "inset 0 0 220px 60px rgba(0,0,0,0.9)",
        }}
      />
    </div>
  );
}
