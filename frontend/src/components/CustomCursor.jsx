import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Custom cursor: small dot by default, expands on interactive elements,
// shows "VIEW PROJECT →" over project cards. Desktop-only (fine pointer).
export default function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [variant, setVariant] = useState("default"); // default | hover | project
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 350, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 350, mass: 0.4 });

  const glowX = useSpring(x, { damping: 40, stiffness: 120 });
  const glowY = useSpring(y, { damping: 40, stiffness: 120 });

  const frame = useRef();

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsFinePointer(mq.matches);
    document.body.classList.toggle("qv-custom-cursor", mq.matches);

    const update = (e) => setIsFinePointer(e.matches);
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target.closest?.("[data-cursor]");
      setVariant(target?.dataset.cursor || "default");
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [isFinePointer, x, y, visible]);

  if (!isFinePointer) return null;

  const isProject = variant === "project";
  const isHover = variant === "hover";

  return (
    <>
      {/* soft trailing glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 260,
          height: 260,
          background:
            "radial-gradient(circle, rgba(157,157,255,0.10) 0%, rgba(157,157,255,0) 70%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {/* main cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center rounded-full border border-white/70 bg-white/5 backdrop-blur-sm"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isProject ? 120 : isHover ? 56 : 14,
          height: isProject ? 120 : isHover ? 56 : 14,
          backgroundColor: isProject
            ? "rgba(0,0,0,0.65)"
            : isHover
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.9)",
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {isProject && (
          <span className="text-[11px] tracking-widest2 uppercase font-medium text-white whitespace-nowrap">
            View Project →
          </span>
        )}
      </motion.div>
    </>
  );
}
