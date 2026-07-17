import { useState } from "react";
import { motion } from "motion/react";
import { data } from "../data";
import { SectionHeading } from "./SectionHeading";
import { Award, ExternalLink, Shield, X } from "lucide-react";

export function Certificates() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="certificates" className="bg-brand-paper text-brand-black px-6 py-24 md:py-32 relative overflow-hidden">

      {/* Background oversized watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none w-full text-center">
        <h1 className="font-heading text-[20vw] uppercase leading-none">CERTIFIED</h1>
      </div>

      <div className="max-w-[1140px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeading className="text-brand-black mb-0">
            Certificates
          </SectionHeading>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base font-bold uppercase tracking-widest text-brand-black/50 max-w-xs"
          >
            Verified credentials & professional certifications
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.certificates.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative"
            >
              {/* Card */}
              <div
                className={`relative h-full flex flex-col p-8 border-2 transition-all duration-500 overflow-hidden cursor-default
                  ${cert.color === "orange"
                    ? "bg-brand-black border-brand-black text-brand-white group-hover:bg-brand-orange group-hover:border-brand-orange"
                    : "bg-brand-white border-brand-black text-brand-black group-hover:bg-brand-black group-hover:text-brand-white"
                  }`}
              >
                {/* Decorative corner bracket */}
                <div className={`absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 transition-colors duration-500
                  ${cert.color === "orange"
                    ? "border-brand-orange group-hover:border-brand-white"
                    : "border-brand-black group-hover:border-brand-orange"
                  }`} />
                <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 transition-colors duration-500
                  ${cert.color === "orange"
                    ? "border-brand-orange group-hover:border-brand-white"
                    : "border-brand-black group-hover:border-brand-orange"
                  }`} />

                {/* Image or Icon */}
                {(cert as any).image && (cert as any).image !== "" ? (
                  <div className="-mx-8 -mt-8 mb-6 h-48 overflow-hidden border-b-2 border-inherit relative">
                    <img src={(cert as any).image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className={`w-12 h-12 flex items-center justify-center mb-6 transition-colors duration-500
                    ${cert.color === "orange"
                      ? "bg-brand-orange group-hover:bg-brand-white"
                      : "bg-brand-black group-hover:bg-brand-orange"
                    }`}
                  >
                    <Award
                      size={24}
                      className={`transition-colors duration-500
                        ${cert.color === "orange"
                          ? "text-brand-white group-hover:text-brand-black"
                          : "text-brand-white group-hover:text-brand-white"
                        }`}
                    />
                  </div>
                )}

                {/* Year badge */}
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 transition-colors duration-500
                  ${cert.color === "orange"
                    ? "text-brand-orange group-hover:text-brand-white/70"
                    : "text-brand-orange group-hover:text-brand-orange"
                  }`}
                >
                  {cert.date}
                </span>

                {/* Title */}
                <h3 className="font-heading text-3xl uppercase leading-tight mb-3 tracking-tight">
                  {cert.title}
                </h3>

                {/* Issuer */}
                <p className={`text-xs font-bold uppercase tracking-widest mb-6 transition-colors duration-500
                  ${cert.color === "orange"
                    ? "text-brand-gray group-hover:text-brand-white/70"
                    : "text-brand-black/50 group-hover:text-brand-white/60"
                  }`}
                >
                  Issued by {cert.issuer}
                </p>

                {/* Divider */}
                <div className={`w-full h-px mb-6 transition-colors duration-500
                  ${cert.color === "orange"
                    ? "bg-brand-white/20 group-hover:bg-brand-white/30"
                    : "bg-brand-black/20 group-hover:bg-brand-white/20"
                  }`} />

                {/* Credential Row */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Shield size={12} className={`transition-colors duration-500
                      ${cert.color === "orange"
                        ? "text-brand-orange group-hover:text-brand-white"
                        : "text-brand-orange"
                      }`}
                    />
                    <span className={`text-[10px] font-mono tracking-wider transition-colors duration-500
                      ${cert.color === "orange"
                        ? "text-brand-gray group-hover:text-brand-white/60"
                        : "text-brand-black/40 group-hover:text-brand-white/50"
                      }`}
                    >
                      {cert.credentialId}
                    </span>
                  </div>

                  {/* Verify button */}
                  <button
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 transition-all duration-300
                      ${cert.color === "orange"
                        ? "border-brand-white/30 text-brand-white hover:bg-brand-white hover:text-brand-black"
                        : "border-brand-black text-brand-black group-hover:border-brand-white group-hover:text-brand-white hover:bg-brand-orange hover:border-brand-orange hover:text-brand-white"
                      } ${!(cert as any).image ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={(e) => { 
                      e.preventDefault();
                      if ((cert as any).image) {
                        setSelectedImage((cert as any).image);
                      }
                    }}
                  >
                    Verify <ExternalLink size={10} />
                  </button>
                </div>
              </div>

              {/* Drop shadow effect */}
              <div className={`absolute inset-0 translate-x-2 translate-y-2 -z-10 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3
                ${cert.color === "orange" ? "bg-brand-orange/30" : "bg-brand-black/20"}`}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom stat bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex items-center gap-8 border-t-2 border-brand-black/10 pt-8"
        >
          <div className="flex flex-col">
            <span className="font-heading text-5xl text-brand-orange">{data.certificates.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Certifications</span>
          </div>
          <div className="w-px h-12 bg-brand-black/20" />
          <div className="flex flex-col">
            <span className="font-heading text-5xl">{data.certificates.filter(c => c.color === "orange").length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Technical</span>
          </div>
          <div className="w-px h-12 bg-brand-black/20" />
          <p className="text-sm text-brand-black/50 font-bold uppercase tracking-wider ml-auto hidden md:block">
            All credentials verified via issuer platforms
          </p>
        </motion.div>

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
            <img src={selectedImage} alt="Certificate" className="max-w-full max-h-[85vh] object-contain border border-brand-white/10" />
          </div>
        </div>
      )}

    </section>
  );
}
