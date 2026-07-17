/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { UnrealShowcase } from "./components/UnrealShowcase";
import { BeyondCode } from "./components/BeyondCode";
import { Certificates } from "./components/Certificates";
import { Badges } from "./components/Badges";
import { Experience } from "./components/Experience";
import { Services } from "./components/Services";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { TornPaper, TornPaperTop } from "./components/TornPaper";
import { SEO } from "./components/SEO";
import { SmoothScroll } from "./components/SmoothScroll";

export default function App() {
  return (
    <SmoothScroll>
      <div id="top" className="min-h-screen bg-brand-black selection:bg-brand-orange selection:text-brand-white">
      <SEO />
      <div className="noise-bg"></div>
      
      <Navbar />
      
      <main>
        <Hero />
        
        <TornPaper className="text-brand-paper bg-brand-black" />
        <About />
        <TornPaperTop className="text-brand-paper bg-brand-black" />
        
        <Skills />
        
        <TornPaper className="text-brand-paper bg-brand-black" />
        <Projects />
        
        <TornPaperTop className="text-brand-paper bg-brand-black" />
        <UnrealShowcase />
        
        <TornPaper className="text-brand-paper bg-brand-black" />
        <BeyondCode />
        
        <TornPaperTop className="text-brand-paper bg-brand-black" />
        <Certificates />
        <Badges />

        <TornPaper className="text-brand-paper bg-brand-black" />
        <Experience />
        
        <TornPaper className="text-brand-paper bg-brand-black" />
        <Services />
        
        <TornPaperTop className="text-brand-paper bg-brand-black" />
        <Contact />
      </main>

      <Footer />
    </div>
    </SmoothScroll>
  );
}

