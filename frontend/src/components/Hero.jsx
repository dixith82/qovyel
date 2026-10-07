import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import ErrorBoundary from "./ErrorBoundary";
import { easeCinematic } from "../animations/variants";

const Hero3D = lazy(() => import("./Hero3D"));

const headline = ["WE TURN IDEAS", "INTO DIGITAL", "EXPERIENCES."];
const facets = ["IDEAS", "BUILD", "EVOLVE"];

// Lightweight CSS-only fallback for mobile / reduced-motion / low power,
// so the visual experience is never simply removed.
function HeroVisualFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-56 h-56 sm:w-72 sm:h-72"
        style={{
          background: "linear-gradient(135deg, #2a2a30 0%, #0a0a0c 55%, #16161b 100%)",
          clipPath:
            "polygon(50% 0%, 90% 20%, 100% 60%, 70% 100%, 30% 95%, 0% 55%, 15% 15%)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 0 60px rgba(255,255,255,0.05)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-6"
          style={{ background: "linear-gradient(225deg, rgba(231,201,163,0.22), transparent 60%)" }}
        />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const [canUse3D, setCanUse3D] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;
    setCanUse3D(!prefersReduced && !isSmall);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden pt-24 lg:pt-16 pb-8">
      {/* ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full opacity-25 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(231,201,163,0.15), transparent 70%)" }}
      />

      <div className="qv-container relative grid md:grid-cols-2 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-4 xl:gap-8 items-center flex-1">
        <div className="relative z-10">
          <h1 className="font-display font-semibold text-[10vw] leading-[1.02] sm:text-6xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl tracking-tightest text-gradient">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block whitespace-nowrap"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: easeCinematic, delay: 0.3 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-7 text-base sm:text-lg lg:text-sm xl:text-base text-white/55 max-w-md"
          >
            Websites. Apps. AI. Dashboards. And Beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-10 flex flex-wrap items-center gap-3 lg:gap-2 xl:gap-3"
          >
            <MagneticButton
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-4 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 text-sm lg:text-xs xl:text-sm font-medium tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] transition-shadow duration-300 whitespace-nowrap"
            >
              Start a Project
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>

            <MagneticButton
              onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 text-sm lg:text-xs xl:text-sm font-medium tracking-wide hover:bg-white/5 transition-colors duration-300 whitespace-nowrap"
            >
              Explore Our Work
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: easeCinematic }}
          className="relative h-[300px] sm:h-[400px] md:h-[440px] lg:h-[330px] xl:h-[410px] 2xl:h-[490px]"
        >
          {canUse3D ? (
            <ErrorBoundary fallback={<HeroVisualFallback />}>
              <Suspense fallback={<HeroVisualFallback />}>
                <Hero3D />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <HeroVisualFallback />
          )}

          {/* faceted label stack, echoing the reference's "IDEAS / BUILD / EVOLVE" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="hidden xl:flex absolute right-2 top-1/2 -translate-y-1/2 flex-col gap-2 text-right pointer-events-none"
          >
            {facets.map((word) => (
              <span key={word} className="text-[10px] tracking-widest2 uppercase text-white/30">
                {word}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="qv-container relative flex items-center justify-between gap-4 pt-8 lg:pt-6 border-t border-white/5"
      >
        <span className="text-[10px] lg:text-[9px] xl:text-[10px] tracking-widest2 uppercase text-white/35">
          Trusted by creators, startups &amp; businesses
        </span>
        <div className="flex items-center gap-2 text-white/40 shrink-0">
          <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown size={14} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
