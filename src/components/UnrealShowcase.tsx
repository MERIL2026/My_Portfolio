import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import {
  TreePine,
  Sparkles,
  Play,
  Pause,
  Sliders,
  Layers,
  Eye,
  Maximize2,
  Workflow,
  CheckCircle2,
  Flame,
  ExternalLink
} from "lucide-react";

export function UnrealShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const steps = [
    {
      title: "Empty Landscape",
      desc: "Creating a 2x2 km landscape level with an optimized grid heightmap. Establishing the basic terrain boundaries.",
      image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Terrain Sculpting",
      desc: "Using the UE5 Landscape Tool to sculpt valleys, ridges, and dramatic mountains. Sculpting smooth slopes for the riverbed.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Grass Painting",
      desc: "Applying multi-layered landscape materials. Auto-painting procedurally blended grass and gravel textures based on slope angles.",
      image: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Trees Placement",
      desc: "Using the Foliage Tool to paint diverse Quixel Megascans tree models, maintaining realistic cluster density and natural grouping.",
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "River/Lake Creation",
      desc: "Integrating the Unreal Water System. Sculpting river physics splines with interactive water foam, flows, and depth colors.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Lighting Setup",
      desc: "Configuring Lumen global illumination, directional sun light, and indirect skylight bounce to replicate photorealistic ambient rays.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Atmospheric Effects",
      desc: "Adding Sky Atmosphere, volumetric fog, dynamic wind particles, and sun flare lens effects to amplify forest depth.",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Final Cinematic Render",
      desc: "Animating dynamic cameras in Sequencer. Exporting photorealistic, super-sampled cinematic renders with Unreal Engine 5's Movie Render Queue.",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  const galleryImages = [
    { url: "/deep_forest_patway.png", caption: "Deep Forest Pathway" },
    { url: "/Forest-Hill.png", caption: "Forest Hill" },
    { url: "/Jungle_Mountain_View.png", caption: "Jungle Mountain View" },
    { url: "/Volumetric_Mountain_Ranges.png", caption: "Volumetric Mountain Ranges" },
    { url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop", caption: "Macro Mossy Ground Detail" },
    { url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1200&auto=format&fit=crop", caption: "Golden Hour Mountain Lake" },
    { url: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1200&auto=format&fit=crop", caption: "Pine Forest Canopy View" },
    { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop", caption: "Highlands Landscape Boundary" }
  ];

  const challenges = [
    {
      title: "Foliage Realism & Alignment",
      problem: "Floating foliage instances and unnatural alignment against steep sculpted cliffs.",
      solution: "Implemented precise slope-based alignment formulas inside the foliage material shader and utilized raycasted trace placement parameters to snap models naturally."
    },
    {
      title: "Real-time Lighting Performance",
      problem: "Heavy frame rate drops when simulating dynamic Lumen Global Illumination in dense forest canopies.",
      solution: "Optimized mesh Distance Fields, set up aggressive Level of Detail (LOD) hierarchies, and activated virtual shadow maps to strike an optimal balance between quality and 60 FPS performance."
    },
    {
      title: "Photorealistic Water Blending",
      problem: "Sharp, visible intersection edges where sculpted landscape met the riverbed water plane.",
      solution: "Authored a vertex-blended water material with depth-fade opacity, custom foam generators at obstacles, and localized volumetric fog density modifiers."
    }
  ];

  const skills = [
    "Environment Art", "Level Design", "Terrain Sculpting", "Lighting (Lumen)",
    "Nanite & LOD Optimization", "Quixel Assets Integration", "Water Simulation",
    "Cinematic Composition", "Sequencer Animation", "Post Processing Profiles"
  ];

  return (
    <section id="unreal-engine" className="bg-brand-black text-brand-white px-6 py-24 md:py-32 relative overflow-hidden border-t border-brand-white/10">
      <div className="noise-bg"></div>

      {/* Top Background Spotlight */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-[1140px] mx-auto relative z-10">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4 text-brand-orange text-sm font-mono tracking-widest uppercase">
              <TreePine className="w-5 h-5 animate-pulse" />
              <span>3D & Game Development</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl uppercase tracking-tighter italic leading-none text-brand-white">
              Real-Time Forest <span className="text-brand-orange">Environment</span>
            </h2>
          </div>
          <div className="max-w-md text-brand-gray/80 text-sm md:text-base leading-relaxed">
            Designed and developed a photorealistic open-world forest environment in <strong>Unreal Engine 5</strong> using advanced lighting, vegetation systems, landscape sculpting, water simulation, and cinematic rendering techniques.
          </div>
        </div>

        {/* Cinematic Hero Video/Mock Player */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-brand-dark border border-brand-white/10 relative overflow-hidden group mb-20 shadow-2xl">
          {isPlayingVideo ? (
            <div className="w-full h-full relative">
              {/* Autoplay Ambient Forest Video Embed */}
              <iframe
                className="w-full h-full object-cover scale-105 pointer-events-none absolute inset-0"
                src="https://www.youtube.com/embed/gH-E73p_nC4?autoplay=1&mute=1&controls=0&loop=1&playlist=gH-E73p_nC4"
                title="Unreal Engine Cinematic Flythrough"
                allow="autoplay; encrypted-media"
                frameBorder="0"
              ></iframe>
              <div className="absolute inset-0 bg-brand-black/30 pointer-events-none"></div>

              {/* Video Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10 bg-brand-black/60 p-4 border border-brand-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping"></span>
                  <p className="font-mono text-xs uppercase tracking-widest text-brand-white">UE5 Live Cinematic Sequence Preview</p>
                </div>
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="bg-brand-white hover:bg-brand-orange text-brand-black hover:text-brand-white px-4 py-1.5 text-xs font-bold uppercase transition-all duration-300"
                >
                  Stop Sequence
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1800&auto=format&fit=crop"
                alt="Unreal Engine Forest Landscape"
                className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-20 h-20 rounded-full bg-brand-orange hover:bg-brand-orange-light text-brand-white flex items-center justify-center border-4 border-brand-white/20 shadow-lg cursor-pointer transition-colors duration-300"
                >
                  <Play className="w-8 h-8 fill-brand-white ml-1 text-brand-white" />
                </motion.button>
                <p className="mt-4 font-heading text-lg tracking-widest uppercase text-brand-white">Play Cinematic Flythrough Sequence</p>
                <p className="text-xs text-brand-gray max-w-sm mt-1">Experience the dynamic day-to-night transitions, volumetric winds, and Lumen rendering.</p>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-brand-black/80 px-3 py-1 border border-brand-white/20 font-mono text-[10px] tracking-widest uppercase text-brand-orange z-10">
            Unreal Engine 5.4 Project
          </div>
        </div>

        {/* Before & After Interactive Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-wider uppercase">
              <Sliders className="w-4 h-4" />
              <span>Interactive Comparison</span>
            </div>
            <h3 className="font-heading text-4xl uppercase tracking-tight italic leading-none">
              Landscape <span className="text-brand-orange">Sculpting</span> vs Final Render
            </h3>
            <p className="text-brand-gray text-sm md:text-base leading-relaxed">
              Drag the interactive slider to compare the initial custom-sculpted grid heightmap model (before painting foliage and materials) with the final photorealistic lighting environment rendered in real-time.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="text-xs font-mono bg-brand-white/5 border border-brand-white/10 px-3 py-1 rounded text-brand-gray">Left: Wireframe Topography</span>
              <span className="text-xs font-mono bg-brand-white/5 border border-brand-white/10 px-3 py-1 rounded text-brand-gray">Right: Complete Lumen Render</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              className="relative w-full aspect-[16/10] border border-brand-white/10 overflow-hidden select-none cursor-ew-resize"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, x)));
              }}
              onTouchMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.touches[0]) {
                  const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, x)));
                }
              }}
            >
              {/* After: Color Render (Full Width Background) */}
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop"
                alt="Final Render"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Before: Wireframe Landscape (Clipped Width overlay) */}
              <div
                className="absolute inset-0 border-r-2 border-brand-orange z-10 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop"
                  alt="Wireframe Map"
                  className="absolute inset-0 w-full h-full object-cover filter saturate-0 contrast-125 pointer-events-none mix-blend-difference"
                  style={{ width: "100%", maxWidth: "none" }}
                />
                <div className="absolute inset-0 bg-brand-orange/5 mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 bg-brand-black/90 text-brand-white px-2 py-1 text-[10px] font-mono border border-brand-white/10 uppercase">
                  Wireframe Terrain
                </div>
              </div>

              {/* Slider Control Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-brand-orange z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-orange border-2 border-brand-white flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5">
                    <span className="w-0.5 h-3 bg-brand-white opacity-60"></span>
                    <span className="w-0.5 h-3 bg-brand-white opacity-60"></span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-brand-black/90 text-brand-orange px-2 py-1 text-[10px] font-mono border border-brand-orange/20 uppercase">
                Rendered Foliage
              </div>
            </div>
          </div>
        </div>

        {/* Development Process Stepper */}
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-4 text-brand-orange text-xs font-mono tracking-wider uppercase">
            <Workflow className="w-4 h-4" />
            <span>Development Process</span>
          </div>
          <h3 className="font-heading text-4xl uppercase tracking-tight italic leading-none mb-12">
            How The Environment Was <span className="text-brand-orange">Built</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Step Navigation / Selector */}
            <div className="lg:col-span-5 flex flex-col space-y-3 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-4 border transition-all duration-300 relative overflow-hidden group ${activeStep === idx
                    ? 'bg-brand-white/5 border-brand-orange text-brand-white'
                    : 'border-brand-white/10 hover:border-brand-white/20 text-brand-gray/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border ${activeStep === idx ? 'bg-brand-orange border-brand-orange text-brand-white' : 'border-brand-white/20'
                      }`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm uppercase tracking-wide">{step.title}</span>
                  </div>
                  {activeStep === idx && (
                    <motion.div
                      layoutId="step-indicator"
                      className="absolute right-0 top-0 bottom-0 w-1 bg-brand-orange"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Active Step Content Showcase */}
            <div className="lg:col-span-7 bg-brand-dark/50 border border-brand-white/10 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl pointer-events-none"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Image */}
                  <div className="w-full aspect-[16/9] overflow-hidden bg-brand-black border border-brand-white/5">
                    <img
                      src={steps[activeStep].image}
                      alt={steps[activeStep].title}
                      className="w-full h-full object-cover filter brightness-90 saturate-75"
                    />
                  </div>

                  {/* Step details */}
                  <div>
                    <span className="font-mono text-xs text-brand-orange font-bold uppercase tracking-widest">
                      Step {activeStep + 1} of 8
                    </span>
                    <h4 className="font-heading text-2xl uppercase tracking-wide text-brand-white mt-1">
                      {steps[activeStep].title}
                    </h4>
                    <p className="text-brand-gray text-sm md:text-base leading-relaxed mt-3">
                      {steps[activeStep].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-wider uppercase mb-3">
                <Eye className="w-4 h-4" />
                <span>Cinematic Gallery</span>
              </div>
              <h3 className="font-heading text-4xl uppercase tracking-tight italic leading-none">
                High-Resolution <span className="text-brand-orange">Screenshots</span>
              </h3>
            </div>
            <p className="text-brand-gray text-xs hidden md:block max-w-xs text-right">
              A detailed inspection of close-ups, landscape boundaries, and volumetric day/night lighting setups. Click to expand.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(img.url)}
                className="relative aspect-[4/3] bg-brand-dark border border-brand-white/10 overflow-hidden cursor-pointer group"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 filter brightness-90 group-hover:brightness-100 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-[10px] font-mono text-brand-orange uppercase tracking-widest mb-0.5">Capture {i + 1}</p>
                  <p className="text-xs font-bold text-brand-white truncate">{img.caption}</p>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-brand-white/10 z-10">
                  <Maximize2 className="w-3.5 h-3.5 text-brand-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Challenges & Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {challenges.map((c, idx) => (
            <div
              key={idx}
              className="bg-brand-dark/40 border border-brand-white/10 p-8 flex flex-col justify-between relative group hover:border-brand-orange/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-2 h-2 bg-brand-orange/20 rounded-full m-4"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-orange text-[10px] font-mono tracking-widest uppercase">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Unreal Challenge {idx + 1}</span>
                </div>
                <h4 className="font-heading text-xl uppercase tracking-wide text-brand-white">
                  {c.title}
                </h4>
                <div className="space-y-3 pt-2">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-brand-orange/80 tracking-wider">Problem Context:</p>
                    <p className="text-xs text-brand-gray/80 leading-relaxed mt-1">{c.problem}</p>
                  </div>
                  <div className="border-t border-brand-white/5 pt-3">
                    <p className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Technical Solution:</p>
                    <p className="text-xs text-brand-gray/90 leading-relaxed mt-1">{c.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills & Technologies Bento Foot */}
        <div className="border border-brand-white/10 p-8 md:p-12 bg-gradient-to-r from-brand-dark/50 to-brand-black relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4">
              <h4 className="font-heading text-3xl uppercase tracking-tight text-brand-white">
                Skills <span className="text-brand-orange">Demonstrated</span>
              </h4>
              <p className="text-xs md:text-sm text-brand-gray/80 leading-relaxed">
                By designing this Unreal Engine Forest Environment, I demonstrated deep proficiency in real-time graphic physics, cinematic pacing, and engine optimization.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 bg-brand-white/5 border border-brand-white/10 px-4 py-2.5 hover:bg-brand-orange hover:border-brand-orange hover:text-brand-white transition-all duration-300 text-xs font-mono font-bold uppercase tracking-wider text-brand-gray"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange group-hover:text-brand-white" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox / Modal for Expanded Gallery Screenshots */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-brand-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              className="absolute top-6 right-6 text-brand-white/60 hover:text-brand-white font-mono text-sm tracking-widest uppercase bg-brand-white/5 border border-brand-white/10 px-4 py-2"
              onClick={() => setSelectedImage(null)}
            >
              Close [ESC]
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl max-h-[85vh] overflow-hidden border border-brand-white/10 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Expanded Landscape View"
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-brand-black/80 p-3 text-center border-t border-brand-white/10">
                <p className="text-xs font-mono text-brand-orange uppercase tracking-widest">Unreal Engine 5 Real-Time Landscape</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
