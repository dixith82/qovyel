import { useState } from "react";
import { useScroll } from "framer-motion";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VisualPanel from "./components/VisualPanel";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Process from "./components/Process";
import WhyQovyel from "./components/WhyQovyel";
import Testimonials from "./components/Testimonials";
import CinematicSection from "./components/CinematicSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GlobalAtmosphere from "./components/GlobalAtmosphere";
import { ScrollProgressProvider } from "./context/ScrollProgressContext";

// Desktop keeps the asymmetric two-column editorial composition from the
// reference (left: Hero → Services → Process → Cinematic; right: Visual
// Panel → Selected Work → Why Qovyel → Testimonials → Contact → Footer),
// but scrolling is unified — the whole page scrolls together as one
// continuous experience rather than each column scrolling independently.
// If one column ends up shorter than the other, its last section simply
// sits above whitespace while the taller column keeps going underneath —
// simpler and more predictable than trying to pin/stick the shorter
// column's end, which is fragile with this much variance in content
// length.
//
// On mobile this collapses into a single, sensibly-ordered column (each
// section carries a mobile `order` and reverts to normal flow at desktop).
function Slot({ orderClass, children }) {
  return <div className={`${orderClass} lg:contents`}>{children}</div>;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  return (
    <ScrollProgressProvider value={scrollYProgress}>
      {loading && <Preloader onDone={() => setLoading(false)} />}

      <div className="noise" />
      <GlobalAtmosphere />
      <CustomCursor />

      <Navbar />

      <main className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start lg:pt-20 [perspective:1400px]">
        <div className="contents lg:flex lg:flex-col lg:border-r lg:border-white/10">
          <Slot orderClass="order-1">
            <Hero />
          </Slot>
          <Slot orderClass="order-4">
            <Services />
          </Slot>
          <Slot orderClass="order-5">
            <Process />
          </Slot>
          <Slot orderClass="order-8">
            <CinematicSection />
          </Slot>
        </div>

        <div className="contents lg:flex lg:flex-col lg:min-h-screen">
          <Slot orderClass="order-2">
            <VisualPanel />
          </Slot>
          <Slot orderClass="order-3">
            <Projects />
          </Slot>
          <Slot orderClass="order-6">
            <WhyQovyel />
          </Slot>
          <Slot orderClass="order-7">
            <Testimonials />
          </Slot>
          <Slot orderClass="order-9">
            <Contact />
          </Slot>
          <Slot orderClass="order-10">
            <Footer />
          </Slot>
        </div>
      </main>
    </ScrollProgressProvider>
  );
}
