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
import { PortfolioRating } from "./components/PortfolioRating";
import { TornPaper, TornPaperTop } from "./components/TornPaper";
import { SEO } from "./components/SEO";
import { SmoothScroll } from "./components/SmoothScroll";
import { Toaster } from "sonner";

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

      <PortfolioRating />
      <Footer />
    </div>
    <Toaster
      theme="dark"
      position="top-right"
      richColors
      toastOptions={{
        style: {
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          fontFamily: "monospace",
          fontSize: "13px",
        },
      }}
    />
    </SmoothScroll>
  );
}

