import { motion } from "motion/react";
import { data } from "../data";
import { 
  Globe, 
  Cpu, 
  Zap, 
  Radio, 
  Gamepad, 
  Palette, 
  Brain, 
  Rocket, 
  Users, 
  Compass, 
  Sparkles,
  ArrowUpRight 
} from "lucide-react";

// Helper map to dynamically resolve the icons configured in data.ts
const iconMap: Record<string, any> = {
  Globe: Globe,
  Cpu: Cpu,
  Zap: Zap,
  Radio: Radio,
  Gamepad: Gamepad,
  Palette: Palette,
  Brain: Brain,
  Rocket: Rocket,
  Users: Users
};

export function BeyondCode() {
  return (
    <section id="beyond-code" className="bg-brand-paper text-brand-black px-6 py-24 md:py-32 relative border-t border-brand-black/10">
      <div className="max-w-[1140px] mx-auto">
        
        {/* Beyond Code Grid */}
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-4 text-brand-orange text-xs font-mono tracking-widest uppercase">
            <Compass className="w-4 h-4 text-brand-orange" />
            <span>Multi-Disciplinary Expertise</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <h2 className="font-heading text-5xl md:text-7xl uppercase tracking-tighter italic leading-none">
              Beyond <span className="text-stroke !-webkit-text-stroke-brand-black" style={{ WebkitTextStroke: "2px #0F0F10" }}>Coding</span>
            </h2>
            <p className="max-w-md text-brand-dark/80 text-sm md:text-base leading-relaxed">
              True innovation happens at the intersection of disciplines. Here are the core domains where I actively build, lead, and explore beyond traditional software engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.beyondCode.map((item, idx) => {
              const IconComp = iconMap[item.icon] || Compass;
              return (
                <motion.div
                  key={item.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-brand-white border border-brand-black/10 p-8 flex flex-col justify-between group hover:border-brand-orange hover:bg-brand-black hover:text-brand-white transition-all duration-500 ease-in-out relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand-orange/5 group-hover:bg-brand-orange/10 rounded-bl-full transition-colors duration-500"></div>
                  
                  <div>
                    <div className="w-12 h-12 bg-brand-black text-brand-white group-hover:bg-brand-orange group-hover:text-brand-white flex items-center justify-center mb-6 transition-all duration-500">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide mb-3 group-hover:text-brand-orange transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm opacity-80 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest font-black text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Active Domain</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future Projects Section */}
        <div className="border-t border-brand-black/10 pt-20 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-paper px-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-orange animate-spin-slow" />
            <span className="font-mono text-xs uppercase tracking-widest font-black text-brand-black">Looking Ahead</span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="font-heading text-4xl md:text-5xl uppercase tracking-tight italic text-brand-black">
              Future <span className="text-brand-orange">Initiatives</span> & Targets
            </h3>
            <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed mt-4">
              I am constantly drafting new concepts, researching upcoming frameworks, and expanding physical prototypes. Here is what is on the engineering pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.futureProjects.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-brand-white/40 border border-brand-black/5 p-6 hover:border-brand-black/20 hover:bg-brand-white transition-all duration-300 relative group"
              >
                {/* Visual outline decoration */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange/20 group-hover:bg-brand-orange transition-colors duration-300"></div>
                
                <span className="font-mono text-[10px] text-brand-orange uppercase tracking-wider font-bold">Concept #{idx + 1}</span>
                <h4 className="font-bold text-base md:text-lg text-brand-black uppercase tracking-wide mt-1 group-hover:text-brand-orange transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-xs text-brand-dark/80 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
