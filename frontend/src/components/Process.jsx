import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { processSteps } from "../data/process";
import { fadeUp, depthReveal, staggerContainer, viewportOnce } from "../animations/variants";

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.4"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="relative py-16 sm:py-20 lg:py-16 xl:py-20 border-t border-white/5">
      <div className="qv-container">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
        >
          <div className="max-w-xl">
            <motion.p variants={fadeUp} className="qv-eyebrow mb-4">
              02 / Our Process
            </motion.p>
            <motion.h2
              variants={depthReveal}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tightest text-gradient"
            >
              A Simple Process.
              <br />
              Powerful Results.
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-white/40 text-sm max-w-xs md:text-right">
            We keep things clear, collaborative and efficient.
          </motion.p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* connecting line - desktop horizontal, through icon centers */}
          <div className="hidden md:block absolute top-6 left-6 right-6 h-px bg-white/10">
            <motion.div className="h-full bg-white/70 origin-left" style={{ scaleX: lineScale }} />
          </div>

          {/* connecting line - mobile vertical */}
          <div className="md:hidden absolute top-0 bottom-0 left-6 w-px bg-white/10">
            <motion.div className="w-full bg-white/70 origin-top h-full" style={{ scaleY: lineScale }} />
          </div>

          <div className="grid md:grid-cols-5 gap-10 md:gap-5">
            {processSteps.map((step, i) => (
              <ProcessStep
                key={step.id}
                step={step}
                index={i}
                progress={scrollYProgress}
                total={processSteps.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index, progress, total }) {
  const activateAt = index / total;
  const opacity = useTransform(progress, [activateAt - 0.05, activateAt + 0.1], [0.3, 1]);
  const nodeScale = useTransform(progress, [activateAt - 0.02, activateAt + 0.08], [0.85, 1]);
  const Icon = step.icon;

  return (
    <motion.div style={{ opacity }} className="relative pl-16 md:pl-0 flex md:flex-col gap-4 md:gap-0">
      <motion.div
        style={{ scale: nodeScale }}
        className="absolute left-0 md:static md:mb-5 w-12 h-12 rounded-lg bg-[#101012] border border-white/15 flex items-center justify-center"
      >
        <Icon size={18} strokeWidth={1.5} className="text-white/80" />
      </motion.div>
      <div>
        <span className="block text-xs text-white/35 font-mono mb-2">{step.id}</span>
        <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-white/45 leading-relaxed max-w-[180px]">{step.description}</p>
      </div>
    </motion.div>
  );
}
