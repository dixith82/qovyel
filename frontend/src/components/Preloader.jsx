import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Full-screen cinematic preloader: a glowing eclipse-ring behind the QOVYEL
// logo, drifting particles, a thin progress line, then a smooth fade + scale
// into the hero. Matches the reference video's opening moment.
export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading | tagline | exit

  useEffect(() => {
    let raf;
    let exitTimer;
    let doneTimer;
    const start = performance.now();
    const duration = 2000;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Schedule the whole exit sequence right here, in one place, so it
        // can't be cancelled by an unrelated effect re-run further down.
        setPhase("tagline");
        exitTimer = setTimeout(() => setPhase("exit"), 950);
        doneTimer = setTimeout(() => onDone?.(), 1700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const particles = Array.from({ length: 34 });

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1, scale: phase === "exit" ? 1.08 : 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ambient glow */}
          <div
            className="absolute w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full opacity-30 blur-[110px]"
            style={{ background: "radial-gradient(circle, rgba(231,201,163,0.25) 0%, rgba(0,0,0,0) 70%)" }}
          />

          {/* particles */}
          <div className="absolute inset-0">
            {particles.map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* eclipse ring */}
          <motion.svg
            viewBox="0 0 400 400"
            className="absolute w-[78vw] h-[78vw] max-w-[440px] max-h-[440px]"
            initial={{ opacity: 0, rotate: -18, scale: 0.92 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="55%" stopColor="rgba(255,255,255,0.75)" />
                <stop offset="78%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="ringGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2.5"
              filter="url(#ringGlow)"
            />
            <circle cx="322" cy="120" r="5" fill="#ffffff" filter="url(#ringGlow)" />
          </motion.svg>

          {/* logo */}
          <motion.h1
            className="relative font-display text-[13vw] sm:text-[5.5rem] font-semibold tracking-tightest text-white select-none"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <span className="tracking-[0.12em]">QOVYEL</span>
          </motion.h1>

          <AnimatePresence>
            {(phase === "tagline" || phase === "exit") && (
              <motion.p
                className="relative mt-4 text-[11px] sm:text-xs tracking-widest2 uppercase text-white/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                "Where ideas become digital."
              </motion.p>
            )}
          </AnimatePresence>

          {/* progress */}
          <div className="absolute bottom-16 flex flex-col items-center gap-3">
            <span className="text-[10px] tracking-widest2 uppercase text-white/30">
              Loading ideas ...
            </span>
            <div className="w-[140px] h-[2px] bg-white/10 overflow-hidden rounded-full">
              <motion.div className="h-full bg-white/80" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
