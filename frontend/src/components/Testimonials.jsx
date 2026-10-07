import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { fadeUp, depthReveal, staggerContainer, viewportOnce } from "../animations/variants";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="relative py-16 sm:py-20 lg:py-16 xl:py-20 border-t border-white/5">
      <div className="qv-container">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex items-end justify-between gap-6 mb-16"
        >
          <div>
            <motion.p variants={fadeUp} className="qv-eyebrow mb-4">
              What Our Clients Say
            </motion.p>
            <motion.h2
              variants={depthReveal}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tightest text-gradient"
            >
              Real People.
              <br />
              Real Experiences.
            </motion.h2>
          </div>

          <motion.div variants={fadeUp} className="hidden sm:flex items-center gap-3 mb-2">
            <button
              aria-label="Previous testimonial"
              data-cursor="hover"
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 qv-focus"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              aria-label="Next testimonial"
              data-cursor="hover"
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 qv-focus"
            >
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          <div className="relative rounded-md border border-white/10 bg-white/[0.02] p-7 sm:p-9 overflow-hidden min-h-[300px] flex flex-col justify-center">
            <Quote className="absolute top-8 left-8 text-white/10" size={56} />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <p className="text-lg sm:text-xl font-display leading-relaxed text-white/90 mb-8 max-w-xl">
                  "{current.testimonial}"
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-medium text-white/60">
                      {current.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{current.name}</p>
                      <p className="text-xs text-white/45">
                        {current.role} · {current.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] tracking-widest2 uppercase text-white/40 border border-white/15 rounded-full px-3 py-1.5">
                    Demo Testimonial
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex sm:hidden items-center gap-3 mt-10">
              <button onClick={prev} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center">
                <ArrowLeft size={14} />
              </button>
              <button onClick={next} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center">
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-8">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* atmospheric visual panel, echoing the reference's doorway imagery */}
          <div className="hidden lg:flex relative rounded-md border border-white/10 overflow-hidden flex-col justify-between p-8 min-h-[320px]">
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(200deg, #1c1d22 0%, #0a0a0c 55%, #000 100%)" }}
            />
            <div
              className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 opacity-40 blur-2xl"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5), transparent 70%)" }}
            />
            <div className="relative flex flex-col gap-1">
              {["IDEAS", "PEOPLE", "TECHNOLOGY"].map((w) => (
                <span key={w} className="font-display text-xl font-semibold tracking-tightest text-white/90">
                  {w}
                </span>
              ))}
            </div>
            <p className="relative text-xs tracking-widest2 uppercase text-white/40">A Brighter Tomorrow</p>
          </div>
        </div>
      </div>
    </section>
  );
}
