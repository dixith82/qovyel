import { motion } from "framer-motion";
import { whyQovyel } from "../data/whyQovyel";
import { fadeUp, depthReveal, staggerContainer, viewportOnce } from "../animations/variants";

export default function WhyQovyel() {
  return (
    <section id="why-qovyel" className="relative py-16 sm:py-20 lg:py-16 xl:py-20 border-t border-white/5">
      <div className="qv-container">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-xl">
            <motion.p variants={fadeUp} className="qv-eyebrow mb-4">
              Why Qovyel
            </motion.p>
            <motion.h2
              variants={depthReveal}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tightest text-gradient"
            >
              More Than
              <br />
              Development.
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-white/40 text-sm max-w-xs md:text-right">
            We're a partner in your journey, not just a service provider.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {whyQovyel.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={depthReveal}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-md border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-colors duration-500"
              >
                <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                  <Icon size={17} strokeWidth={1.5} className="text-white/75" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
