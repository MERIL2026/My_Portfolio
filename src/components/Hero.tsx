import { motion } from "motion/react";
import { data } from "../data";
import { useEffect, useState } from "react";
import { SplineScene } from "./ui/spline";
import { Spotlight } from "./ui/spotlight";
import { AnimatedNumber } from "./AnimatedNumber";

export function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % data.roles.length);
    }, 2000);
    
    return () => {
      clearInterval(roleInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-brand-black pt-20 lg:pt-[89px]">
      
      {/* Top Main Section: Name on Left, Bot on Right */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 items-stretch">
        
        {/* Left Column: Branding & Identity */}
        <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-brand-white/10">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          
          <div className="hidden xl:block absolute -left-20 top-1/2 -rotate-90 origin-left text-brand-orange text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 z-20">
            AI Developer / Full Stack / IoT Engineer
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col z-10"
          >
            <h1 className="font-heading uppercase italic tracking-tighter leading-[0.82]">
              <span className="block text-7xl sm:text-[100px] lg:text-[140px] text-transparent text-stroke">
                {data.name.split(" ")[0]}
              </span>
              <span className="block text-8xl sm:text-[120px] lg:text-[160px] text-brand-orange">
                {data.name.split(" ")[1]}
              </span>
            </h1>

            <div className="mt-8 flex gap-6 items-start">
              <div className="hidden md:block w-px h-24 bg-brand-white/20 mt-2"></div>
              <div>
                <div className="h-10 overflow-hidden mb-4">
                  <motion.p
                    key={currentRoleIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono text-xl md:text-2xl text-brand-gray uppercase font-bold"
                  >
                    {data.roles[currentRoleIndex]} <span className="animate-pulse">|</span>
                  </motion.p>
                </div>

                <p className="text-lg leading-relaxed text-brand-gray max-w-md hidden md:block">
                  {data.about.story.substring(0, 150)}...
                </p>
                
                <div className="flex gap-4 mt-6">
                  <a href="#projects" className="bg-brand-white text-brand-black px-8 py-3 text-xs font-black uppercase tracking-tighter hover:bg-brand-orange hover:text-brand-white transition-colors duration-300 inline-block">
                    View Work
                  </a>
                  <a href="#contact" className="border border-brand-white/20 px-8 py-3 text-xs font-black uppercase tracking-tighter hover:bg-brand-white hover:text-brand-black transition-colors duration-300 inline-block">
                    Hire Me
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Bot */}
        <div className="w-full lg:w-1/2 min-h-[500px] lg:min-h-full relative pointer-events-auto flex flex-col items-center justify-center bg-brand-dark overflow-hidden">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full absolute inset-0"
          />
        </div>
        
      </div>

      {/* Bottom Column: Numbering System / Stats */}
      <div className="w-full relative z-20 border-t border-brand-white/10 bg-brand-black">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {data.stats.map((stat, i) => (
            <div 
              key={i} 
              className={`border-brand-white/10 flex flex-col justify-center items-center p-8 
                ${i !== 3 ? 'border-r' : ''} 
                ${i < 2 ? 'border-b lg:border-b-0' : ''}
                ${i === 3 ? 'bg-brand-orange text-brand-black' : 'text-brand-white hover:bg-brand-white/5 transition-colors duration-300'}
              `}
            >
              <span className={`text-[40px] md:text-[48px] lg:text-[56px] font-black leading-none flex ${i === 1 ? 'italic' : ''} ${i === 3 ? 'tracking-tighter' : ''}`}>
                <AnimatedNumber value={stat.value} />
                {stat.value.includes('+') && <span className={i === 3 ? 'text-brand-black' : 'text-brand-orange'}>+</span>}
              </span>
              <span className={`text-[10px] md:text-xs uppercase tracking-widest mt-3 ${i === 3 ? 'font-bold' : 'opacity-50'}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
