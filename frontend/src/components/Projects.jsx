import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjectCount } from "../data/projects";
import ProjectMockup from "./ProjectMockup";
import { fadeUp, depthReveal, staggerContainer, viewportOnce } from "../animations/variants";

function ProjectCard({ project }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={depthReveal}
      layout
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
      data-cursor="project"
      aria-label={`View the ${project.title} project (opens in a new tab)`}
      className="group relative overflow-hidden rounded-md border border-white/10 bg-[#0c0c0e] cursor-pointer block transition-colors duration-500 hover:border-white/25 qv-focus"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProjectMockup type={project.mockup} accent={project.accent} />
        </motion.div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(400px circle at 50% 30%, ${project.accent}22, transparent 65%)` }}
        />
        <ArrowUpRight
          size={16}
          className="absolute top-4 right-4 text-white/50 transition-all duration-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>

      <div className="p-5 flex items-center justify-between transition-transform duration-500 group-hover:-translate-y-0.5">
        <div>
          <span className="text-[11px] tracking-widest2 text-white/30 transition-transform duration-500 group-hover:translate-x-0.5 inline-block">
            {project.index}
          </span>
          <h3 className="font-display text-[15px] leading-snug font-semibold mt-1">{project.title}</h3>
        </div>
        <span className="text-[11px] tracking-wide uppercase text-white/40 text-right">
          {project.category}
        </span>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? projects : projects.slice(0, featuredProjectCount);

  return (
    <section id="work" className="relative py-16 sm:py-20 lg:py-16 xl:py-20 border-t border-white/5">
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
              01 / Selected Work
            </motion.p>
            <motion.h2
              variants={depthReveal}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tightest text-gradient"
            >
              Projects
              <br />
              That Speak.
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} className="flex flex-col items-start md:items-end gap-4 max-w-xs">
            <p className="text-white/40 text-sm md:text-right">
              A glimpse of what we build — from simple ideas to powerful digital experiences.
            </p>
            {projects.length > featuredProjectCount && (
              <button
                data-cursor="hover"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-1.5 text-xs tracking-widest2 uppercase text-white/60 hover:text-white transition-colors border border-white/15 rounded-full px-4 py-2 qv-focus"
              >
                {expanded ? "Show Fewer Projects" : "View All Projects"}
                <ArrowUpRight
                  size={13}
                  className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          layout
          className="grid md:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
