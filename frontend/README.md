# QOVYEL — Digital Studio Website

A complete, cinematic marketing site for QOVYEL — a digital studio building
websites, web apps, mobile apps, AI solutions, data dashboards and UI/UX.

Built with **React + Vite + Tailwind CSS + Framer Motion + React Three Fiber**.

> **Revision 5** — a visual-fidelity pass on top of the revision-4 structure
> (no architecture changes, per instruction): switched from independent
> dual-column scrolling to a single unified page scroll (the asymmetric
> two-column visual split stays, but the window scrolls once, as one
> continuous experience, rather than each column having its own
> scrollbar — independent scrolling was flagged as feeling like "two
> unrelated websites," and it did). Rebuilt the Cinematic section with real
> layered depth (three mountain ranges receding into fog, light rays, a
> multi-layer bloom and ground light-spill under the doorway) instead of
> two flat SVG polygons. Tightened corners/padding/density across Services,
> Why Qovyel, Projects, Testimonials and Contact cards (less rounded, less
> padding, more editorial). Removed the boxy rounded-container treatment
> from the Contact banner so it sits directly in the page flow. Enriched
> the QOVYEL Visual Panel with a second faint ring, a soft "planet curve"
> horizon, and a "Loading ideas..." label.
>
> **Bug fixed this pass:** an early attempt to keep Footer pinned to the
> viewport bottom (`position: sticky`) while relying on `display: contents`
> for responsive reordering caused Footer to render on top of Selected Work
> near the top of the page instead of at the bottom — the two techniques
> didn't compose the way expected. Fixed by dropping the sticky trick and
> letting Footer flow normally; verified via screenshots that both columns
> now reach their natural end at close to the same scroll position with no
> overlap or awkward gap.

> **Revision 6** — a further visual-fidelity pass, no architecture changes.
> The hero's 3D rock is larger (closer to the reference's dominant scale),
> with the camera pulled back slightly to fix a clipping issue the
> enlargement introduced, plus a thin curved highlight streak (a
> partial-arc torus with an unlit material) echoing the reference's
> crescent glint — a detail that's hard to get from physically-lit
> materials alone. The Cinematic section gained a fourth, very distant
> ridge layer, two slow drifting fog bands, and a subtle cool color-grade
> overlay for more atmospheric depth.
>
> **Note on this pass's QA:** while re-verifying the preloader, an
> automated check first suggested it might be stuck — it wasn't. The check
> searched the page for the text "LOADING IDEAS", but this pass also added
> a "Loading ideas..." label to the QOVYEL Visual Panel (styled with
> `uppercase`), so the check kept matching that permanent, unrelated
> element instead of the preloader. Direct DOM inspection confirmed the
> preloader unmounts correctly around 3 seconds in and stays gone — no
> code change was needed, just a better test.

> **Revision 7** — replaced the placeholder Selected Work projects with
> five real QOVYEL portfolio projects (Avengers: Doomsday, Alien Galaxy
> Explorer, Anandobrahma, Webhead Archives, Shopify Sparkle), each linking
> to its actual live URL (`target="_blank" rel="noopener noreferrer"`,
> exactly as supplied — none invented or altered). The Selected Work
> section shows the first three by default, matching the reference
> composition, with a "View All Projects" toggle that reveals the
> remaining two with a staggered fade-in and switches to "Show Fewer
> Projects" to collapse again. Each card mockup is a distinct dark
> CSS/SVG treatment themed to its project (a cinematic glow panel, a
> ringed-planet starfield, a plated dish, a comic-panel grid, an
> e-commerce dashboard) rather than a generic placeholder, since
> automated screenshot capture of the live project URLs isn't available
> in this environment — see "Real screenshots" below.

> **Revision 8** — a QA-only pass, no design or content changes: this
> revision's brief asked for the same real-project integration, honest
> stats, and demo-testimonial labeling already shipped in revision 7, plus
> a full functional/responsive re-verification. Confirmed via an
> automated pass (not just re-reading the code) that: no placeholder
> project names remain; all five project links carry the exact supplied
> URLs with `target="_blank" rel="noopener noreferrer"`; no fabricated
> statistics or "Verified Client" claims appear anywhere; the preloader
> and Hero's 3D fallback both behave correctly under
> `prefers-reduced-motion`; and there's no horizontal overflow on a
> tablet-width viewport. That last check did turn up one real, previously
> unnoticed bug — see below — which is now fixed.
>
> **Bug fixed this pass:** the hero headline clipped on tablet widths
> (768–1023px). The Hero's internal two-column grid switches on at
> Tailwind's `md` breakpoint (768px), but the headline's font size only
> stepped down for the `lg` split-screen layout (≥1024px) — so in the
> 768–1023px range the text was still sized for a full-width column while
> actually confined to roughly half the screen, clipping the last word of
> each line. Fixed by sizing the headline down starting at `md`, matching
> the point where the column itself narrows, not just at `lg`.

> **Revision 9** — motion pass. Worth being direct about this: the
> uploaded reference video is a ~10-second AI-generation-tool "building
> your site" preview clip (an eclipse-ring logo formation, then a fast,
> low-framerate scroll through a mockup) — it doesn't contain shot
> cinematography (camera dollies, a moving key light, choreographed
> lighting sweeps) to extract frame-by-frame; that request described an
> aspiration for the motion rather than something literally in the source
> clip. What this pass does is implement the concrete, technically real
> version of that ask: lights that actually move over time instead of
> sitting static, so highlights visibly drift across surfaces. Added a
> slow-orbiting key light to both the hero rock and the contact orb (their
> rim highlights now sweep rather than stay fixed), a continuously
> breathing glow on the QOVYEL Visual Panel and the cinematic doorway (on
> top of, not instead of, the existing scroll-driven glow), a slow rocking
> sweep on the doorway's light rays, and a second particle depth layer in
> the hero scene drifting at a different speed than the first for
> parallax. None of this touches layout, content, or section order.
>
> Since these are Framer Motion `animate` loops (JS-driven transforms, not
> CSS animations), they don't automatically stop for
> `prefers-reduced-motion` the way the site's other, CSS-based motion
> does. Added a small `usePrefersReducedMotion` hook and gated every new
> continuous loop behind it — verified with a reduced-motion browser
> context that they hold at a static state with no console errors.

> **Revision 10** — this pass asked for a global 3D camera system
> reproducing the reference video's cinematography frame-by-frame.
> Repeating the honest assessment from revision 9: the source clip is a
> short AI-tool "building your site" preview, not shot footage with a
> literal camera to frame-match — building a from-scratch WebGL/Three.js
> camera engine wrapping the entire DOM would also be a large, risky
> rewrite that conflicts with this project's own "don't change the
> architecture" rule. What's implemented instead is the closest honest,
> real equivalent: a genuine CSS `perspective` context on `<main>` (not
> `body` — see note below) so any 3D-ish transforms in the page have a
> real depth reference, and a new `depthReveal` animation variant (scale
> + blur + vertical travel, settling into sharp focus) applied to every
> major section headline and card grid — Services, Process, Why Qovyel,
> Testimonials, Selected Work, Contact — replacing plain opacity fades
> with something closer to "coming into focus" as the camera arrives,
> verified by screenshotting mid-transition (caught a frame with the
> heading still blurred and near-invisible, confirming the effect
> actually runs) and again once settled (confirmed fully sharp).
>
> **Implementation note:** `perspective` was deliberately added to
> `<main>` rather than `<body>`. Setting `perspective` (or `transform`) on
> an ancestor of a `position: fixed` element changes that element's
> containing block from the viewport to that ancestor — it would have
> broken the fixed navbar and custom cursor, making them scroll away
> instead of staying pinned. `<main>` doesn't contain either (they're
> siblings in `App.jsx`), so it was the safe place for a real perspective
> context.

> **Revision 11** — this pass explicitly asked for a full Three.js/GSAP
> camera-path system (`CAMERA_PATH` waypoints with position/target/FOV,
> tuned frame-by-frame against the reference video) replacing the site's
> per-section animation. I declined to build that, for two concrete
> reasons rather than just effort: (1) the video still doesn't contain
> literal camera data — waypoint values "tuned against the video" would
> be fabricated, not extracted, no matter how much engineering time went
> in; (2) the brief's own Rule #1 ("do not change the architecture, do
> not refactor") directly contradicts its later instruction to "refactor
> the architecture" for the camera — converting a working, DOM-based,
> accessible, 11-revision-polished site into one Three.js-rendered scene
> is a full rewrite, not a tuning pass, and risks breaking text
> selection, SEO, and the project links along the way.
>
> What I built instead is the honest, scoped version of "one coherent
> world": a single shared scroll-progress value (`ScrollProgressContext`,
> sourced from one `useScroll()` call in `App.jsx`, the one source of
> truth requested) driving a new `GlobalAtmosphere` component — a fixed,
> full-viewport star layer and vignette that span every section boundary,
> so the page reads as one continuous environment instead of each section
> resetting its own atmosphere. It's deliberately not a WebGL scene:
> fixed-position, opacity/transform-only, and skipped entirely below
> 1024px and under `prefers-reduced-motion`, verified by checking the
> element count is exactly zero on a mobile viewport. Also verified the
> new layer doesn't block interaction — the "View All Projects" toggle
> was tested through it and still works.

## Desktop composition vs. mobile

- **Desktop (`lg` and up, ≥1024px):** `<main>` is a two-column CSS grid
  (`lg:items-start` so each column sizes to its own content rather than
  stretching to match the other). The page scrolls as one normal document —
  there's no per-column scroll container — so Framer Motion's scroll-linked
  animations (Process's connecting line, the Cinematic doorway parallax)
  track ordinary window scroll, same as everywhere else on the site. If one
  column's content is shorter than the other's, it simply ends above
  whitespace while the taller column keeps going — in practice the two
  columns' natural lengths land close enough that this isn't noticeable.
- **Mobile / tablet (below `lg`):** both column wrappers become
  `display: contents` (they contribute no box of their own), so their
  children fall back to being ordinary flex children of `<main>`, and each
  section's `order-N lg:contents` class puts them back into the original
  single-column reading order (Hero, Visual Panel, Selected Work, Services,
  Process, Why Qovyel, Testimonials, Cinematic, Contact, Footer).

One implementation note worth flagging: the reference *video* shows a
completely ordinary single-column top-to-bottom scroll (no split-screen
behavior), which is a different motion story than the reference *image*'s
two-column composition. This build follows the explicit instruction to
treat the image as the layout source of truth and the video only for
motion — so the split-screen is intentional, not an oversight.

## Sections (top to bottom)

1. Cinematic preloader — eclipse-ring logo reveal, particles, progress line
2. Fixed navigation (glass-on-scroll, animated mobile overlay menu)
3. Hero — line-by-line headline reveal, magnetic CTAs, rotating faceted 3D
   crystal with mouse parallax, "IDEAS / BUILD / EVOLVE" facet labels
4. QOVYEL visual panel — a mid-page brand moment reusing the preloader's
   eclipse-ring motif, so the identity beat isn't only seen once at load
5. Selected Work — 3 interactive project cards with illustrative mockups
6. Services — 5 cards with icon boxes, 3D tilt, circular arrow buttons
7. Process — 5-step journey with a scroll-driven connecting line
8. Why Qovyel — 4 value cards
9. Testimonials — two-column slider with a "Demo Testimonial" badge (no
   unverified claims) and an atmospheric visual panel
10. Cinematic brand section — parallax mountain/doorway scene, a divider
    row, and an honest brand-pillars bar (no invented stats)
11. Contact — banner with a second 3D object, working validated form, socials
12. Footer

A custom cursor (desktop only) and film-grain noise overlay run globally.
Everything respects `prefers-reduced-motion`, and both 3D objects swap for a
lightweight CSS fallback on mobile / reduced-motion / WebGL failure, so the
visual experience is never simply removed.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

### Production build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/       All UI sections (Preloader, Navbar, CustomCursor, Hero,
                     Hero3D, MagneticButton, VisualPanel, Projects,
                     ProjectMockup, Services, Process, WhyQovyel,
                     Testimonials, CinematicSection, Contact, ContactOrb3D,
                     ErrorBoundary, Footer)
  data/             projects.js, services.js, process.js, whyQovyel.js,
                     testimonials.js, pillars.js — edit these to change
                     content without touching component code
  animations/       variants.js — shared Framer Motion variants
  hooks/            useActiveSection.js — nav scroll-spy
  index.css         design tokens, global styles
  App.jsx           the two-column desktop grid / single-column mobile flow
  main.jsx          React entry point
```

## Things to plug in before launch

- **Testimonials** (`src/data/testimonials.js`): replace the placeholder
  name/role/company/testimonial entries with real ones once you have them.
  The UI clearly labels these "Demo Testimonial" until you do.
- **Brand pillars** (`src/data/pillars.js`): currently non-quantified
  statements ("Custom-Built", "Client-Focused", etc.) rather than specific
  numbers, since no verified metrics (project count, client count) were
  supplied. Swap in real, verifiable stats when you have them.
- **Social links** (`src/components/Contact.jsx`, `src/components/Footer.jsx`):
  swap the placeholder Instagram / WhatsApp / Email / LinkedIn / GitHub URLs
  for your real ones.
- **Contact form** (`src/components/Contact.jsx`): validates on the frontend
  and shows a success state, but isn't wired to a backend yet. Point
  `handleSubmit` at your email service / API endpoint of choice (no API keys
  are hardcoded anywhere in this project).
- **Project cards** (`src/data/projects.js`): the five projects and their
  URLs are real and live — nothing here needs replacing unless the
  portfolio changes. The card *images* are still illustrative CSS/SVG
  mockups, not real screenshots (see "Real screenshots" just below).

## Real screenshots for project cards

This environment can't reach the live project URLs to capture screenshots
(they're outside its network allowlist), so each Selected Work card uses a
themed CSS/SVG illustration instead of a real preview image. To swap in
real screenshots once you're working locally:

1. Capture a screenshot of each project URL (browser dev tools, a
   screenshot CLI, or a service like Vercel's OG image API all work).
2. Save the images under `src/assets/` (e.g. `avengers-doomsday.jpg`).
3. In `src/components/Projects.jsx`, replace the `<ProjectMockup ... />`
   element with an `<img src={...} alt={project.title} className="w-full
   h-full object-cover" />`, importing each image at the top of the file.

The `accent` and `mockup` fields in `src/data/projects.js` can then be
removed once every card uses a real image.

## Fixed during QA

Two real bugs were found and fixed while testing this build in a headless
browser:

1. **Preloader could hang forever.** The exit sequence was scheduled inside
   a `useEffect` keyed on `phase`; when the effect set `phase` to trigger the
   next step, React re-ran the effect and its cleanup cancelled the pending
   "reveal the site" timer before it fired. Fixed by scheduling the whole
   exit sequence from one place (the loading-progress completion callback)
   instead of chaining state-dependent effects.
2. **Mobile menu had no background.** It used a Tailwind arbitrary-opacity
   utility (`bg-black/98`) that didn't make it into the compiled CSS, leaving
   the full-screen menu transparent over the page content. Fixed with an
   explicit inline background color so it doesn't depend on that utility.
3. **3D canvases could crash the whole app.** They used `Environment
   preset="city"`, which fetches an HDR file from an external CDN; if that
   fetch fails (blocked network, offline, strict CSP) the app crashed to a
   blank screen with no fallback. Removed the external dependency (using
   local lights instead) and added an error boundary around both canvases as
   defense-in-depth.

## Notes on performance & accessibility

- Animations use `transform`/`opacity` wherever possible.
- Both 3D objects (hero crystal, contact orb) are lazy-loaded and skipped
  entirely on small screens, when "reduce motion" is on, or if WebGL fails.
- Keyboard focus states, semantic headings and alt-friendly structure are in
  place; the custom cursor only activates on fine-pointer (desktop) devices.
