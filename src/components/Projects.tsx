import { motion } from "motion/react";
import { data } from "../data";
import { SectionHeading } from "./SectionHeading";
import { Star, LayoutGrid, TableProperties, ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Projects() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Helper to render priority stars
  const renderStars = (priority: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3.5 h-3.5 ${
              i < priority 
                ? "text-brand-orange fill-brand-orange" 
                : "text-brand-black/20 fill-transparent"
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <section id="projects" className="bg-brand-paper text-brand-black px-6 py-24 md:py-32">
      <div className="max-w-[1140px] mx-auto">
        
        {/* Section Header with View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <SectionHeading className="text-brand-black mb-0">Featured Works</SectionHeading>
            <p className="text-brand-dark/70 text-sm mt-4 max-w-md">
              A curated collection of web platforms, automation systems, IoT products, and immersive 3D environments.
            </p>
          </div>

          <div className="flex bg-brand-black/5 p-1 rounded-sm border border-brand-black/10 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                viewMode === "grid" 
                  ? "bg-brand-black text-brand-white" 
                  : "text-brand-black/60 hover:text-brand-black"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Bento Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                viewMode === "table" 
                  ? "bg-brand-black text-brand-white" 
                  : "text-brand-black/60 hover:text-brand-black"
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Project Matrix</span>
            </button>
          </div>
        </div>

        {/* View Mode: Grid Layout */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {data.projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group relative flex flex-col bg-brand-white border border-brand-black/10 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Container */}
                <div className="overflow-hidden bg-brand-black aspect-[4/3] mb-6 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  {/* Category tag over image */}
                  <div className="absolute top-4 left-4 bg-brand-black/90 text-brand-orange px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-brand-orange/30 z-10">
                    {project.category || "Development"}
                  </div>
                  {/* Decorative border */}
                  <div className="absolute inset-0 border-4 border-brand-paper pointer-events-none z-10 m-2"></div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-brand-orange font-bold uppercase tracking-widest text-[10px]">
                        {project.subtitle}
                      </h4>
                      {renderStars(project.priority || 4)}
                    </div>
                    
                    <h3 className="font-heading text-3xl uppercase leading-none mb-4 group-hover:text-brand-orange transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t) => (
                        <span key={t} className="text-[10px] font-mono font-bold uppercase border border-brand-black/10 px-2 py-0.5 bg-brand-black/5 text-brand-black/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-brand-black/5 pt-4">
                    <a href={project.links.demo} className="font-bold text-xs uppercase tracking-widest border-b border-brand-black pb-0.5 hover:text-brand-orange hover:border-brand-orange transition-colors inline-flex items-center gap-1">
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href={project.links.github} className="font-bold text-xs uppercase tracking-widest border-b border-brand-black pb-0.5 hover:text-brand-orange hover:border-brand-orange transition-colors inline-flex items-center gap-1">
                      <span>GitHub</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* View Mode: Table Matrix Layout */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full overflow-x-auto border border-brand-black/10 bg-brand-white"
          >
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-brand-black text-brand-white font-mono text-[11px] uppercase tracking-wider border-b border-brand-black/10">
                  <th className="p-5 font-bold">Project Name</th>
                  <th className="p-5 font-bold">Category</th>
                  <th className="p-5 font-bold">Tech Stack</th>
                  <th className="p-5 font-bold text-center">Priority</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/10">
                {data.projects.map((project, idx) => (
                  <tr 
                    key={project.title}
                    className="hover:bg-brand-black/5 transition-colors duration-200"
                  >
                    {/* Title */}
                    <td className="p-5">
                      <div className="font-heading text-xl uppercase tracking-wide text-brand-black">{project.title}</div>
                      <div className="text-xs text-brand-dark/60 mt-0.5">{project.subtitle}</div>
                    </td>
                    
                    {/* Category */}
                    <td className="p-5">
                      <span className="font-mono text-xs font-bold uppercase bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-3 py-1 rounded-sm">
                        {project.category || "Development"}
                      </span>
                    </td>
                    
                    {/* Tech */}
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {project.tech.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] font-mono border border-brand-black/10 px-1.5 py-0.5 text-brand-black/70">
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="text-[10px] font-mono bg-brand-black text-brand-white px-1.5 py-0.5">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Priority Stars */}
                    <td className="p-5 text-center">
                      <div className="flex justify-center">
                        {renderStars(project.priority || 4)}
                      </div>
                    </td>

                    {/* Links */}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <a 
                          href={project.links.demo} 
                          className="p-2 border border-brand-black/10 hover:border-brand-orange hover:bg-brand-orange hover:text-brand-white transition-colors duration-300"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a 
                          href={project.links.github} 
                          className="p-2 border border-brand-black/10 hover:border-brand-orange hover:bg-brand-orange hover:text-brand-white transition-colors duration-300"
                          title="GitHub Repository"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

      </div>
    </section>
  );
}
