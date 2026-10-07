import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../animations/variants";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// A mid-page brand/identity moment — the same eclipse-ring visual language
// as the preloader, brought back as a full-bleed panel partway down the
// page rather than only at load time. Purely atmospheric: no nav, no CTA.
export default function VisualPanel() {
  const particles = Array.from({ length: 26 });
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section
      aria-label="QOVYEL — Where ideas become digital"
      className="relative h-[74vh] min-h-[460px] flex flex-col items-center justify-center overflow-hidden border-t border-white/5 bg-black"
    >
      {/* deep ambient glow, breathing slowly like a light source drifting in intensity */}
      <motion.div
        className="absolute w-[62vw] h-[62vw] max-w-[720px] max-h-[720px] rounded-full blur-[110px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(231,201,163,0.22) 0%, rgba(0,0,0,0) 70%)" }}
        animate={
          reduceMotion
            ? { opacity: 0.25 }
            : { opacity: [0.18, 0.32, 0.18], scale: [1, 1.06, 1] }
        }
        transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint dark planet curve, echoing the reference's horizon arc */}
      <div
        className="absolute -bottom-[38vw] left-1/2 -translate-x-1/2 w-[130vw] h-[70vw] max-w-[1400px] max-h-[760px] rounded-[50%] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, #17171b 0%, #0a0a0c 55%, transparent 75%)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.35 + 0.08,
            }}
          />
        ))}
      </div>

      {/* faint secondary ring for depth */}
      <motion.div
        className="absolute w-[74vw] h-[74vw] max-w-[500px] max-h-[500px] rounded-full border border-white/[0.06]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.6 }}
      />

      <motion.svg
        viewBox="0 0 400 400"
        className="absolute w-[64vw] h-[64vw] max-w-[420px] max-h-[420px]"
        initial={{ opacity: 0, rotate: -12, scale: 0.94 }}
        whileInView={{ opacity: 1, rotate: reduceMotion ? 0 : [-12, 0, 4, 0], scale: 1 }}
        viewport={viewportOnce}
        transition={{
          opacity: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
          rotate: reduceMotion
            ? { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
            : { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <defs>
          <linearGradient id="panelRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="78%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="panelRingGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="200" cy="200" r="150" fill="none" stroke="url(#panelRingGrad)" strokeWidth="2" filter="url(#panelRingGlow)" />
        <circle cx="322" cy="120" r="4" fill="#ffffff" filter="url(#panelRingGlow)" />
      </motion.svg>

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative font-display text-[15vw] sm:text-7xl md:text-8xl font-semibold tracking-[0.1em] text-white select-none"
      >
        QOVYEL
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        transition={{ delay: 0.1 }}
        className="relative mt-4 text-xs sm:text-sm tracking-widest2 uppercase text-white/45"
      >
        Where ideas become digital.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        transition={{ delay: 0.25 }}
        className="relative mt-8 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-widest2 uppercase text-white/30">Loading ideas ...</span>
        <div className="w-[140px] h-[2px] bg-white/10 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-white/70 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {/* vignette for cinematic depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 140px 30px rgba(0,0,0,0.7)" }}
      />
    </section>
  );
}
