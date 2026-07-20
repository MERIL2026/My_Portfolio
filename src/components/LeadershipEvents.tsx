import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import {
  Trophy,
  MapPin,
  Calendar,
  Users,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Crown,
  Target,
  Layers,
  CheckCircle2,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const photos = [
  {
    src: "/photo1.jpeg",
    caption: "OMEN Valorant Campus Quest Season 3 — Official event poster, Parul University",
    label: "Event Poster",
    objectPosition: "center top",
  },
  {
    src: "/photo2.jpeg",
    caption: "Gaming stations powered by OMEN laptops — live Valorant matches in action",
    label: "Tournament Setup",
    objectPosition: "center center",
  },
  {
    src: "/photo3.jpeg",
    caption: "OMEN gaming hardware displayed at the venue — Intel × OMEN collaboration",
    label: "OMEN Hardware",
    objectPosition: "center top",
  },
  {
    src: "/photo4.jpeg",
    caption: "Intel × OMEN representatives briefing participants before the tournament",
    label: "Participant Briefing",
    objectPosition: "center center",
  },
  {
    src: "/photo5.jpeg",
    caption: "OMEN MAX 16 — the flagship gaming laptop showcased at the championship",
    label: "OMEN MAX 16",
    objectPosition: "center center",
  },
];

const stats = [
  { value: 300, suffix: "+", label: "Participants", icon: Users },
  { value: 2, suffix: "", label: "Major Games", icon: Gamepad2 },
  { value: 50, suffix: "+", label: "Volunteers", icon: Crown },
  { value: 100, suffix: "%", label: "Successful", icon: CheckCircle2 },
];

const highlights = [
  "Led complete planning & execution of the championship",
  "Coordinated volunteers and 300+ participants",
  "Managed event logistics & on-ground operations",
  "Worked directly with Intel × OMEN representatives",
  "Successfully conducted Valorant & Asphalt tournaments",
  "Oversaw registrations, scheduling & stage operations",
];

const skills = [
  "Leadership",
  "Event Management",
  "Team Coordination",
  "Communication",
  "Problem Solving",
  "Operations",
  "Project Planning",
  "Community Building",
  "Gaming Events",
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 2.2, ease: "easeOut" });
    return controls.stop;
  }, [inView, value]);

  return (
    <>
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

type PhotoItem = { src: string; caption: string; label: string; objectPosition: string };

function Lightbox({
  photos,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  photos: PhotoItem[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/95 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Counter badge */}
      <div className="absolute top-6 left-6 font-mono text-xs uppercase tracking-widest text-brand-white/50">
        {index + 1} / {photos.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-brand-white/60 hover:text-brand-orange transition-colors"
        aria-label="Close"
      >
        <X size={32} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 text-brand-white/60 hover:text-brand-orange transition-colors p-2 border border-brand-white/10 hover:border-brand-orange"
        aria-label="Previous"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.96, x: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.src}
            alt={photo.caption}
            className="max-w-full max-h-[75vh] object-contain border border-brand-white/10"
          />
          <div className="text-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-orange">
              {photo.label}
            </span>
            <p className="text-sm text-brand-white/70 mt-1">{photo.caption}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 text-brand-white/60 hover:text-brand-orange transition-colors p-2 border border-brand-white/10 hover:border-brand-orange"
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LeadershipEvents() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [statsInView, setStatsInView] = useState(false);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextPhoto = useCallback(() =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % photos.length)), []);
  const prevPhoto = useCallback(() =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length)), []);

  // Masonry-style grid sizing map
  const galleryLayout = [
    "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto",   // photo1 – big
    "aspect-[3/4]",                                                // photo2 – tall
    "aspect-[3/4]",                                                // photo3 – tall
    "md:col-span-2 aspect-[16/9]",                                 // photo4 – wide
    "aspect-[3/4]",                                                // photo5 – tall
  ];

  return (
    <section id="leadership" className="bg-brand-paper text-brand-black px-6 py-24 md:py-32 relative overflow-hidden">

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025] pointer-events-none select-none w-full text-center">
        <h1 className="font-heading text-[18vw] uppercase leading-none">LEADER</h1>
      </div>

      <div className="max-w-[1140px] mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-4 text-brand-orange text-xs font-mono tracking-widest uppercase"
            >
              <Crown className="w-4 h-4" />
              <span>Club President · Tech Tronix</span>
            </motion.div>
            <SectionHeading className="text-brand-black mb-0">
              Leadership &amp;<br />Events
            </SectionHeading>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm font-bold uppercase tracking-widest text-brand-black/50 max-w-xs"
          >
            Leading one of the largest gaming &amp; technology events at Parul University
          </motion.p>
        </div>

        {/* ── Event Card ── */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="bg-brand-black text-brand-white p-8 md:p-12 mb-16 relative overflow-hidden border-l-4 border-brand-orange"
        >
          {/* Corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-brand-orange/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-brand-orange/20 pointer-events-none" />

          {/* Background glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            {/* Left: Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-brand-orange flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-brand-white" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-orange">
                    Featured Event
                  </p>
                  <h3 className="font-heading text-2xl md:text-3xl uppercase leading-tight">
                    Intel × OMEN<br />Gaming Championship
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-brand-gray/70">
                  <Crown className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span className="font-bold uppercase tracking-wider">
                    President, Tech Tronix Club
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-gray/70">
                  <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span>Parul University, Vadodara</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-gray/70">
                  <Calendar className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span>25 &amp; 26 August 2025</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-gray/70">
                  <Gamepad2 className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span>Valorant · Asphalt Legends</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-gray/70">
                  <Target className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span>Prize Pool: ₹5,00,000</span>
                </div>
              </div>

              <p className="text-sm text-brand-gray/60 leading-relaxed">
                As the President of Tech Tronix Club, I led the planning, coordination, and
                successful execution of the Intel × OMEN Gaming Championship at Parul University.
                The event featured competitive tournaments including Valorant and Asphalt, bringing
                together hundreds of students for a large-scale esports experience.
              </p>
            </div>

            {/* Right: Highlights */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Layers className="w-4 h-4 text-brand-orange" />
                <span className="font-mono text-xs uppercase tracking-widest text-brand-orange">
                  Key Responsibilities
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {highlights.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                    className="flex items-start gap-3 text-sm text-brand-gray/70"
                  >
                    <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              {/* Skills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-white/10 px-2.5 py-1 text-brand-gray/60 hover:border-brand-orange hover:text-brand-orange transition-colors duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setStatsInView(true)}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-black/10 border border-brand-black/10 mb-20"
        >
          {stats.map(({ value, suffix, label, icon: Icon }, i) => (
            <div
              key={label}
              className="bg-brand-paper px-6 py-8 flex flex-col items-center text-center group hover:bg-brand-black hover:text-brand-white transition-colors duration-500"
            >
              <Icon className="w-5 h-5 text-brand-orange mb-3 group-hover:text-brand-orange" />
              <span className="font-heading text-5xl md:text-6xl text-brand-black group-hover:text-brand-orange transition-colors duration-300">
                <Counter value={value} suffix={suffix} inView={statsInView} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-black/50 group-hover:text-brand-white/60 mt-2 transition-colors duration-300">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Gallery ── */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-orange mb-1">
                Photo Gallery
              </p>
              <h4 className="font-heading text-3xl uppercase tracking-tight text-brand-black">
                Event Moments
              </h4>
            </div>
            <span className="hidden md:block text-xs font-mono uppercase tracking-widest text-brand-black/40">
              Click to zoom
            </span>
          </div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative group overflow-hidden cursor-pointer bg-brand-black border border-brand-black/10 hover:border-brand-orange transition-all duration-500 ${galleryLayout[i]}`}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: photo.objectPosition }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/60 transition-all duration-500 flex flex-col items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-brand-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100" />
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-brand-orange">
                    {photo.label}
                  </p>
                  <p className="text-xs text-brand-white/80 mt-0.5 line-clamp-2">{photo.caption}</p>
                </div>

                {/* Index tag */}
                <div className="absolute top-3 left-3 bg-brand-black/70 text-brand-orange font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-brand-orange/30">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t-2 border-brand-black/10 pt-8"
        >
          <div className="flex flex-col">
            <span className="font-heading text-5xl text-brand-orange">2025</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">
              Year of Event
            </span>
          </div>
          <div className="w-px h-12 bg-brand-black/20 hidden sm:block" />
          <div className="flex flex-col">
            <span className="font-heading text-5xl">OMEN</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">
              Brand Partner
            </span>
          </div>
          <div className="w-px h-12 bg-brand-black/20 hidden sm:block" />
          <div className="flex flex-col">
            <span className="font-heading text-5xl">Intel</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">
              Technology Partner
            </span>
          </div>
          <p className="text-sm text-brand-black/50 font-bold uppercase tracking-wider ml-auto hidden lg:block max-w-xs text-right">
            NODWIN Gaming × Parul University<br />Campus Quest Season 3
          </p>
        </motion.div>

      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextPhoto}
            onPrev={prevPhoto}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
