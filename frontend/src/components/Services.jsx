import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "../data/services";
import { fadeUp, depthReveal, staggerContainer, viewportOnce } from "../animations/variants";

function ServiceCard({ service }) {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      variants={depthReveal}
      data-cursor="hover"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative rounded-md border border-white/10 bg-white/[0.02] p-5 overflow-hidden flex flex-col justify-between min-h-[190px]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

      <div>
        <motion.div
          className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6"
          whileHover={{ scale: 1.08, rotate: 4 }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={17} strokeWidth={1.5} className="text-white/75" />
        </motion.div>

        <h3 className="font-display text-base font-semibold mb-2">{service.title}</h3>
        <p className="text-[13px] text-white/40 leading-relaxed">{service.description}</p>
      </div>

      <button
        aria-label={`Learn more about ${service.title}`}
        className="relative mt-6 w-8 h-8 rounded-full border border-white/15 flex items-center justify-center transition-all duration-400 group-hover:bg-white group-hover:text-black group-hover:border-white"
      >
        <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-16 xl:py-20 border-t border-white/5">
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
              01 / Our Services
            </motion.p>
            <motion.h2
              variants={depthReveal}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tightest text-gradient"
            >
              Everything You Need
              <br />
              to Build, Grow and Scale.
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-white/40 text-sm max-w-xs md:text-right">
            From concept to deployment, we create digital solutions that make an impact.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
