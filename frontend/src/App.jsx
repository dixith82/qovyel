
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

      <main className="flex w-full flex-col [perspective:1400px]">
        <section id="home" className="w-full">
          <Hero />
          <VisualPanel />
        </section>

        <section id="services" className="w-full">
          <Services />
        </section>

        <section id="work" className="w-full">
          <Projects />
        </section>

        <section id="process" className="w-full">
          <Process />
        </section>

        <section id="about" className="w-full">
          <WhyQovyel />
          <Testimonials />
        </section>

        <section id="cinematic" className="w-full">
          <CinematicSection />
        </section>

        <section id="contact" className="w-full">
          <Contact />
        </section>

        <Footer />
      </main>
    </ScrollProgressProvider>
  );
}
