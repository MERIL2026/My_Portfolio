import { useState } from "react";
import { motion } from "motion/react";
import { data } from "../data";
import { ExternalLink, ShieldCheck, X } from "lucide-react";

export function Badges() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="badges" className="bg-brand-black text-brand-white border-b border-brand-white/10 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6 py-12 md:py-16">
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          
          {/* Label side */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0">
            <h2 className="font-heading text-4xl uppercase tracking-tighter text-brand-white mb-2">
              Verified<br /><span className="text-brand-orange">Badge</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-white/50">
              Professional Credential
            </p>
          </div>

          {/* Badges container */}
          <div className="flex-1 w-full flex flex-wrap justify-center md:justify-start gap-6">
            {data.badges.map((badge, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative flex items-center gap-6 bg-brand-dark border border-brand-white/10 p-4 md:p-6 hover:bg-brand-white/5 transition-colors duration-300 w-full max-w-[400px]"
              >
                {/* Badge Image */}
                <div className="w-20 h-20 shrink-0 bg-brand-black border border-brand-white/10 p-2 flex items-center justify-center overflow-hidden">
                   {badge.image ? (
                     <img 
                       src={badge.image} 
                       alt={badge.title} 
                       className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                       onError={(e) => {
                         // Fallback if image not provided yet
                         (e.target as HTMLElement).style.display = 'none';
                         if (e.target && (e.target as HTMLElement).nextSibling) {
                            ((e.target as HTMLElement).nextSibling as HTMLElement).style.display = 'flex';
                         }
                       }}
                     />
                   ) : null}
                   <div className="w-full h-full flex items-center justify-center text-brand-orange/50" style={{display: badge.image ? 'none' : 'flex'}}>
                     <ShieldCheck size={32} />
                   </div>
                </div>

                {/* Badge Details */}
                <div className="flex flex-col justify-center">
                  <h3 className="font-heading text-xl uppercase leading-tight mb-1 group-hover:text-brand-orange transition-colors duration-300">
                    {badge.title}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-white/60 mb-3">
                    Issued by {badge.issuer}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-brand-white/40 bg-brand-black px-2 py-0.5">
                      {badge.date}
                    </span>
                    <button 
                      className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-orange hover:text-brand-white transition-colors ${!badge.image ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (badge.image) {
                          setSelectedImage(badge.image);
                        }
                      }}
                    >
                      Verify <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-brand-white/5 to-transparent pointer-events-none" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-brand-white/70 hover:text-brand-orange transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <img src={selectedImage} alt="Badge" className="max-w-full max-h-[85vh] object-contain border border-brand-white/10" />
          </div>
        </div>
      )}

    </section>
  );
}
