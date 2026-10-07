import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { pillars } from "../data/pillars";
import { fadeUp, staggerContainer, viewportOnce } from "../animations/variants";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const dividerWords = ["Ideas", "Technology", "People", "Impact"];

// A dramatic, scroll-driven scene: layered mountain ranges receding into
// fog, a glowing doorway with realistic light spill and bloom, and
// particles drifting past at a different speed than the background
// (parallax depth) — built entirely from gradients/CSS so it stays fast.
export default function CinematicSection() {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const doorScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.15, 1.45]);
  const doorGlow = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 1, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["12%", "-16%"]);
  const camScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  const backParticles = Array.from({ length: 18 });
  const foreParticles = Array.from({ length: 20 });

  return (
    <section className="relative border-t border-white/5" aria-label="Your idea deserves to exist">
      <div ref={ref} className="relative h-[150vh]">
        <motion.div
          style={{ scale: camScale }}
          className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        >
          {/* deep sky gradient with faint stars */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #14161b 0%, #0c0d10 30%, #050506 62%, #000000 100%)",
            }}
          />
          <div className="absolute inset-0">
            {backParticles.map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: 1,
                  height: 1,
                  top: `${Math.random() * 55}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.4 + 0.15,
                }}
              />
            ))}
          </div>

          {/* extremely distant, barely-visible ridge for depth */}
          <div className="absolute inset-0 opacity-40">
            <svg className="absolute bottom-0 w-full h-[68%]" viewBox="0 0 1440 600" preserveAspectRatio="none">
              <polygon
                points="0,600 0,380 240,320 480,400 760,300 1000,390 1440,330 1440,600"
                fill="#1c1f26"
                opacity="0.35"
              />
            </svg>
          </div>

          {/* far mountain range, receding into fog */}
          <motion.div style={{ y: bgY }} className="absolute inset-0">
            <svg className="absolute bottom-0 w-full h-[62%]" viewBox="0 0 1440 560" preserveAspectRatio="none">
              <defs>
                <linearGradient id="farRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a2d34" />
                  <stop offset="100%" stopColor="#15161a" />
                </linearGradient>
              </defs>
              <polygon
                points="0,560 0,300 160,190 340,340 520,150 720,360 940,170 1140,330 1300,210 1440,300 1440,560"
                fill="url(#farRange)"
                opacity="0.55"
              />
            </svg>
            {/* fog band softening the far range into the horizon */}
            <div
              className="absolute bottom-[30%] inset-x-0 h-40"
              style={{ background: "linear-gradient(180deg, transparent, rgba(20,22,27,0.8))" }}
            />
          </motion.div>

          {/* slow-drifting atmospheric fog bands crossing the valley */}
          <motion.div
            className="absolute inset-x-[-10%] bottom-[24%] h-24 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(180,185,195,0.10) 35%, rgba(180,185,195,0.14) 55%, transparent)",
              filter: "blur(18px)",
            }}
            animate={reduceMotion ? { x: "0%" } : { x: ["-4%", "4%", "-4%"] }}
            transition={reduceMotion ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-x-[-10%] bottom-[16%] h-16 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(200,205,215,0.08) 45%, transparent)",
              filter: "blur(14px)",
            }}
            animate={reduceMotion ? { x: "0%" } : { x: ["3%", "-3%", "3%"] }}
            transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* mid mountain range */}
          <motion.div style={{ y: midY }} className="absolute inset-0">
            <svg className="absolute bottom-0 w-full h-[52%]" viewBox="0 0 1440 500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="midRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#191b20" />
                  <stop offset="100%" stopColor="#0a0a0c" />
                </linearGradient>
              </defs>
              <polygon
                points="0,500 0,260 220,120 420,300 620,80 900,320 1120,150 1300,280 1440,200 1440,500"
                fill="url(#midRange)"
              />
            </svg>
          </motion.div>

          {/* near mountain range / valley floor, darkest and closest */}
          <div className="absolute inset-0">
            <svg className="absolute bottom-0 w-full h-[40%]" viewBox="0 0 1440 400" preserveAspectRatio="none">
              <polygon
                points="0,400 0,300 260,220 500,340 760,190 1020,360 1260,220 1440,320 1440,400"
                fill="#050506"
              />
            </svg>
            {/* rocky foreground silhouettes either side of the doorway */}
            <svg className="absolute bottom-0 w-full h-[22%]" viewBox="0 0 1440 220" preserveAspectRatio="none">
              <polygon points="0,220 0,120 90,60 180,140 260,90 340,180 420,110 460,220" fill="#000000" />
              <polygon
                points="1440,220 1440,110 1350,50 1260,150 1180,80 1100,190 1020,120 980,220"
                fill="#000000"
              />
            </svg>
          </div>

          {/* light rays fanning up from the doorway, slowly sweeping */}
          <motion.div
            style={{ opacity: doorGlow }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] max-w-[900px] h-[70%] pointer-events-none"
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 270deg at 50% 100%, transparent 0deg, rgba(255,255,255,0.10) 8deg, transparent 16deg, transparent 344deg, rgba(255,255,255,0.10) 352deg, transparent 360deg)",
                filter: "blur(6px)",
                transformOrigin: "50% 100%",
              }}
              animate={reduceMotion ? { rotate: 0 } : { rotate: [-3, 3, -3] }}
              transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* the doorway itself: layered bloom + solid glowing core */}
          <div className="relative z-10 flex items-end justify-center h-[38%]">
            <motion.div
              className="relative w-14 sm:w-20 h-40 sm:h-56"
              style={{ scale: doorScale }}
            >
              <motion.div
                style={{ opacity: doorGlow }}
                className="absolute -inset-16 rounded-t-full blur-3xl bg-white/25"
              />
              {/* continuous breathing bloom, independent of scroll position,
                  so the light visibly shifts over time like a real portal */}
              <motion.div
                className="absolute -inset-10 rounded-t-full blur-2xl bg-white/20"
                animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
                transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                style={{ opacity: doorGlow }}
                className="absolute -inset-6 rounded-t-full blur-xl bg-white/50"
              />
              <motion.div style={{ opacity: doorGlow }} className="absolute inset-0 rounded-t-full bg-white" />
              {/* ground light-spill pool */}
              <motion.div
                style={{ opacity: doorGlow }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-6 rounded-[100%] blur-xl bg-white/40"
              />
            </motion.div>
          </div>

          {/* foreground particles drifting past at a different speed */}
          <motion.div style={{ y: fgY }} className="absolute inset-0 pointer-events-none">
            {foreParticles.map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white/70"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.15,
                }}
              />
            ))}
          </motion.div>

          {/* vignette for cinematic depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 160px 40px rgba(0,0,0,0.75)" }}
          />

          {/* subtle cool color grade */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
            style={{ background: "linear-gradient(180deg, rgba(120,140,170,0.08), transparent 40%, rgba(20,20,26,0.25))" }}
          />

          {/* copy */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-x-0 top-[13%] flex flex-col items-center text-center px-6 z-20"
          >
            <h2 className="font-display font-semibold text-3xl sm:text-5xl md:text-6xl tracking-tightest text-white max-w-3xl uppercase">
              Your Idea
              <br />
              Deserves to Exist.
            </h2>
          </motion.div>

          <motion.div
            style={{ opacity: textOpacity }}
            className="absolute inset-x-0 bottom-[12%] flex flex-col items-center text-center px-6 z-20 gap-6"
          >
            <p className="text-xs sm:text-sm tracking-widest2 uppercase text-white/50">
              Let's Build It Together.
            </p>
            <MagneticButton
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-4 text-sm font-medium tracking-wide"
            >
              Start a Project
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* divider labels, echoing the reference's IDEAS · TECHNOLOGY · PEOPLE · IMPACT row */}
      <div className="relative z-20 border-t border-white/5 bg-black">
        <div className="qv-container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5">
          {dividerWords.map((w) => (
            <span key={w} className="text-[11px] tracking-widest2 uppercase text-white/35">
              {w}
            </span>
          ))}
        </div>

        {/* brand pillars — no fabricated metrics, see data/pillars.js */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="qv-container grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-white/5"
        >
          {pillars.map((p) => (
            <motion.div key={p.label} variants={fadeUp}>
              <p className="font-display text-lg sm:text-xl font-semibold text-white mb-1.5">{p.label}</p>
              <p className="text-xs text-white/40 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
