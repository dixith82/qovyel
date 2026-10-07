import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Instagram, Phone, Mail, CheckCircle2 } from "lucide-react";
import MagneticButton from "./MagneticButton";
import ErrorBoundary from "./ErrorBoundary";
import { fadeUp, depthReveal, staggerContainer, viewportOnce } from "../animations/variants";
import { CONTACT } from "../config/contact";
import { services } from "../data/services";

const ContactOrb3D = lazy(() => import("./ContactOrb3D"));

const projectTypes = ["Website", "Web Application", "Mobile App", "AI Solution", "Dashboard", "Other"];
const budgets = ["< $2k", "$2k – $5k", "$5k – $15k", "$15k+", "Not sure yet"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  projectType: "",
  budget: "",
  message: "",
};

// Backend base URL comes from the environment (see .env.example) — never
// hardcoded, so the same build works against local dev and production.
const API_URL = import.meta.env.VITE_API_URL;

// Normalizes the configured base URL so a trailing slash on VITE_API_URL
// (e.g. "https://api.qovyel.com/") never produces a double "/api/api/contact"
// and a bare host never produces a missing-slash "https://api.qovyel.comapi/contact".
function apiBase() {
  return (API_URL || "").replace(/\/+$/, "");
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.projectType) errors.projectType = "Please select a project type.";
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = "Tell us a bit more (10+ characters).";
  }
  return errors;
}

function OrbFallback() {
  return (
    <motion.div
      className="w-32 h-32 sm:w-40 sm:h-40"
      style={{
        background: "linear-gradient(135deg, #2a2a30 0%, #0a0a0c 55%, #16161b 100%)",
        clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 70% 100%, 30% 95%, 0% 55%, 15% 15%)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [canUse3D, setCanUse3D] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanUse3D(!prefersReduced && window.innerWidth >= 768);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!API_URL) {
      // eslint-disable-next-line no-console
      console.error("VITE_API_URL is not set — the contact form has no backend to send to.");
      setSubmitError("Unable to send your inquiry. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      // Build the payload explicitly — only the 8 fields the backend
      // expects, trimmed, never undefined — rather than spreading
      // whatever happens to be in local form state.
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        service: form.service.trim(),
        budget: form.budget.trim(),
        projectType: form.projectType.trim(),
        message: form.message.trim(),
      };

      const res = await fetch(`${apiBase()}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        // Surface field-level validation errors from the backend (same
        // {field, message} shape as the client-side validate() above) on
        // the matching existing Field, instead of only a generic banner.
        if (Array.isArray(json?.errors) && json.errors.length > 0) {
          setErrors((prev) => ({
            ...prev,
            ...Object.fromEntries(json.errors.map((e) => [e.field, e.message])),
          }));
        }
        throw new Error(json?.message || "Request failed");
      }
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setSubmitError("Unable to send your inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-16 xl:py-20 border-t border-white/5">
      <div className="qv-container">
        {/* banner: headline + CTA left, atmospheric 3D visual right — no
            boxed container, integrated directly into the page like the
            reference rather than sitting inside a rounded panel */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative grid md:grid-cols-2 gap-10 items-center pb-12 mb-12 border-b border-white/5"
        >
          <div>
            <motion.p variants={fadeUp} className="qv-eyebrow mb-4">
              Let's Talk
            </motion.p>
            <motion.h2
              variants={depthReveal}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tightest text-gradient mb-6"
            >
              Have a Project
              <br />
              in Mind?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/50 text-base sm:text-lg max-w-sm mb-8">
              Tell us about your idea. We'll take it from there.
            </motion.p>
            <motion.div variants={fadeUp}>
              <MagneticButton
                onClick={() => document.querySelector("#contact-form")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-4 text-sm font-medium tracking-wide"
              >
                Start a Project
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>
          </div>

          <div className="relative hidden md:flex items-center justify-center h-56">
            {canUse3D ? (
              <ErrorBoundary fallback={<OrbFallback />}>
                <Suspense fallback={<OrbFallback />}>
                  <ContactOrb3D />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <OrbFallback />
            )}
            <div className="absolute right-0 bottom-0 flex flex-col items-end gap-0.5 pointer-events-none">
              {["IDEAS", "INTO", "IMPACT"].map((w) => (
                <span key={w} className="text-[11px] tracking-widest2 uppercase text-white/30">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* contact links + form */}
        <div id="contact-form" className="grid lg:grid-cols-2 gap-14">
          <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeUp} className="qv-eyebrow mb-4">
              Reach Us Directly
            </motion.p>
            <motion.h3 variants={fadeUp} className="font-display text-2xl font-semibold mb-8">
              Prefer to message us?
            </motion.h3>
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <ContactLink icon={Instagram} label="Instagram" href={CONTACT.instagramUrl} />
              <ContactLink icon={Phone} label={CONTACT.phone} href={CONTACT.phoneHref} />
              <ContactLink icon={Mail} label="Email" href={`mailto:${CONTACT.email}`} />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="relative rounded-md border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center h-full min-h-[420px] gap-4"
              >
                <CheckCircle2 size={40} className="text-white" />
                <h3 className="font-display text-xl font-semibold">Thank you.</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Your project inquiry has been received.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs tracking-widest2 uppercase text-white/50 hover:text-white transition-colors"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <Field label="Name" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    className="qv-input"
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                  />
                </Field>

                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="qv-input"
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Phone" error={errors.phone}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      className="qv-input"
                      placeholder="Optional"
                      aria-invalid={!!errors.phone}
                    />
                  </Field>

                  <Field label="Company" error={errors.company}>
                    <input
                      type="text"
                      value={form.company}
                      onChange={handleChange("company")}
                      className="qv-input"
                      placeholder="Optional"
                      aria-invalid={!!errors.company}
                    />
                  </Field>
                </div>

                <Field label="Service" error={errors.service}>
                  <select
                    value={form.service}
                    onChange={handleChange("service")}
                    className="qv-input"
                    aria-invalid={!!errors.service}
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Project Type" error={errors.projectType}>
                  <select
                    value={form.projectType}
                    onChange={handleChange("projectType")}
                    className="qv-input"
                    aria-invalid={!!errors.projectType}
                  >
                    <option value="">Select a type</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Budget" error={errors.budget}>
                  <select value={form.budget} onChange={handleChange("budget")} className="qv-input">
                    <option value="">Select a range (optional)</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Message" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={handleChange("message")}
                    rows={4}
                    className="qv-input resize-none"
                    placeholder="Tell us about your idea..."
                    aria-invalid={!!errors.message}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  data-cursor="hover"
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-7 py-4 text-sm font-medium tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Project"}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                {submitError && (
                  <p role="alert" className="text-xs text-red-400/80 text-center">
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .qv-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          color: #f5f5f2;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .qv-input:focus {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
        }
        .qv-input::placeholder { color: rgba(245,245,242,0.35); }
        select.qv-input option { background: #0a0a0c; color: #f5f5f2; }
      `}</style>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs tracking-widest2 uppercase text-white/45">{label}</span>
      {children}
      {error && <span className="text-xs text-red-400/80">{error}</span>}
    </label>
  );
}

function ContactLink({ icon: Icon, label, href }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cursor="hover"
      className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 qv-focus"
    >
      <span className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/40 transition-colors duration-300">
        <Icon size={16} />
      </span>
      <span className="text-sm tracking-wide">{label}</span>
    </a>
  );
}
