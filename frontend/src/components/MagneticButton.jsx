import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Buttons that subtly pull toward the cursor and settle back on leave.
export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  as,
  dataCursor = "hover",
  strength = 0.35,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = motion[as || (href ? "a" : "button")];

  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      data-cursor={dataCursor}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </Component>
  );
}
