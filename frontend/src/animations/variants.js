// Shared Framer Motion variants used across the site.
// Kept slow, smooth and intentional per the QOVYEL animation system.

export const easeCinematic = [0.16, 1, 0.3, 1];

// A "coming into focus" entrance — combines scale, blur and vertical
// travel so sections feel like the camera is pushing forward and settling
// on them, rather than a flat opacity fade. Used for section headlines
// and cards across the site; paired with the global CSS perspective
// context (see index.css) so the scale reads as real depth, not just size.
export const depthReveal = {
  hidden: { opacity: 0, y: 36, scale: 0.96, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeCinematic },
  },
};

export const fadeUpBlur = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: easeCinematic },
  },
};

export const staggerContainer = (stagger = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: easeCinematic },
  },
};

export const lineReveal = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.9, ease: easeCinematic },
  },
};

export const viewportOnce = { once: true, amount: 0.25 };
