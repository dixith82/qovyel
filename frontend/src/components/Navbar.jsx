import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#why-qovyel" },
  { label: "Contact", href: "#contact" },
];

const sectionIds = links.map((l) => l.href.replace("#", ""));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="qv-container flex items-center justify-between h-20">
          <a
            href="#home"
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault();
              handleNav("#home");
            }}
            className="font-display text-lg font-semibold tracking-widest2 uppercase qv-focus"
          >
            Qovyel
          </a>

          <ul className="hidden md:flex items-center gap-9">
            {links.map((link) => {
              const isActive = active === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-cursor="hover"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.href);
                    }}
                    className={`relative text-sm tracking-wide transition-colors qv-focus ${
                      isActive ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-white"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            data-cursor="hover"
            onClick={() => handleNav("#contact")}
            className="hidden md:inline-flex items-center rounded-full border border-white/25 px-5 py-2.5 text-xs tracking-widest2 uppercase font-medium hover:bg-white hover:text-black transition-all duration-300 qv-focus"
          >
            Start a Project
          </button>

          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden relative z-[70] w-10 h-10 flex items-center justify-center rounded-full border border-white/20 qv-focus"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: "rgba(0,0,0,0.98)" }}
            className="fixed inset-0 z-[60] backdrop-blur-2xl flex flex-col items-center justify-center md:hidden"
          >
            <ul className="flex flex-col items-center gap-7">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.href);
                    }}
                    className="text-3xl font-display font-medium text-white/85 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + links.length * 0.08, duration: 0.5 }}
                className="mt-4"
              >
                <button
                  onClick={() => handleNav("#contact")}
                  className="rounded-full border border-white/30 px-7 py-3 text-xs tracking-widest2 uppercase font-medium"
                >
                  Start a Project
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
