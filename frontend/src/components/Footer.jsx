import { Instagram, Linkedin, Github } from "lucide-react";
import { CONTACT } from "../config/contact";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#why-qovyel" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Instagram", icon: Instagram, href: CONTACT.instagramUrl },
  { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/qovyel" },
  { label: "GitHub", icon: Github, href: "https://github.com/qovyel" },
];

export default function Footer() {
  const scrollTo = (href) => (e) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 pt-14 pb-8">
      <div className="qv-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-6">
          <a
            href="#home"
            onClick={scrollTo("#home")}
            data-cursor="hover"
            className="font-display text-2xl font-semibold tracking-tightest qv-focus"
          >
            QOVYEL
          </a>

          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={scrollTo(link.href)}
                  data-cursor="hover"
                  className="text-sm text-white/55 hover:text-white transition-colors qv-focus"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="hover"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/55 hover:text-white hover:border-white/40 transition-colors duration-300 qv-focus"
              >
                <s.icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs tracking-widest2 uppercase text-white/35 mb-10">
          Where ideas become digital.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-white/35">© 2026 QOVYEL. All rights reserved.</p>
          <p className="text-xs tracking-widest2 uppercase text-white/35">Build • Grow • Evolve</p>
        </div>
      </div>
    </footer>
  );
}
