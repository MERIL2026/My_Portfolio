import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Star } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  rotation: number;
  shape: "circle" | "square" | "triangle";
}

const LABEL_MAP: Record<number, string> = {
  1: "Not quite there…",
  2: "Could be better",
  3: "Pretty good!",
  4: "Really impressed!",
  5: "Absolutely amazing! 🔥",
};

const COLORS = [
  "#FF5722", "#FFC107", "#4CAF50", "#2196F3",
  "#E91E63", "#9C27B0", "#00BCD4", "#FFEB3B", "#FF9800",
];

// ── Confetti Canvas ────────────────────────────────────────────────────────────
function ConfettiCanvas({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{
    x: number; y: number; vx: number; vy: number; color: string;
    size: number; rotation: number; vr: number; opacity: number;
  }[]>([]);
  const animRef = useRef<number>(0);

  const launch = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Burst from center-bottom
    particlesRef.current = Array.from({ length: 160 }, () => {
      const angle = (Math.random() * Math.PI * 1.4) - (Math.PI * 0.7); // upward spread
      const velocity = 6 + Math.random() * 10;
      return {
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.72,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 9,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        opacity: 1,
      };
    });

    const ctx = canvas.getContext("2d")!;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.vx *= 0.99;
        p.rotation += p.vr;
        p.opacity -= 0.012;
        if (p.opacity <= 0) continue;
        alive = true;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 1.4);
        ctx.restore();
      }
      if (alive) animRef.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (trigger) launch();
    return () => cancelAnimationFrame(animRef.current);
  }, [trigger, launch]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
}

// ── Floating Emoji burst ───────────────────────────────────────────────────────
const EMOJIS = ["🎉", "✨", "🔥", "⭐", "🚀", "💫", "🎊", "💥", "🌟"];

function EmojiBurst({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const newP: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 48 + Math.random() * 4, // centre %
      y: 60,
      color: COLORS[i % COLORS.length],
      size: 22 + Math.random() * 18,
      angle: Math.random() * 360,
      velocity: 60 + Math.random() * 80,
      rotation: Math.random() * 720 - 360,
      shape: "circle",
    }));
    setParticles(newP);
    const t = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: "50%", y: "60%", opacity: 1, scale: 0.4 }}
            animate={{
              x: `${p.x + (Math.random() - 0.5) * 80}%`,
              y: `${p.y - p.velocity}%`,
              opacity: 0,
              scale: 1.2,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute text-2xl select-none"
            style={{ fontSize: p.size }}
          >
            {EMOJIS[p.id % EMOJIS.length]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Main Rating Component ──────────────────────────────────────────────────────
export function PortfolioRating() {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [prevRating, setPrevRating] = useState(0);
  const starControls = useAnimation();

  // Load existing rating from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("portfolio_rating");
    if (stored) {
      const val = parseInt(stored, 10);
      setSelected(val);
      setPrevRating(val);
      setSubmitted(true);
      setAlreadyRated(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selected) return;

    // Animate stars before celebration
    await starControls.start({
      scale: [1, 1.4, 0.9, 1.2, 1],
      rotate: [0, -8, 8, -4, 0],
      transition: { duration: 0.6 },
    });

    // Persist rating to backend (best-effort; UI never blocks on this)
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: selected }),
      });
    } catch {
      // Silent fail — localStorage still records it locally
    }

    localStorage.setItem("portfolio_rating", String(selected));
    setSubmitted(true);
    setCelebrating(true);
    setConfettiTrigger(false);
    // tiny delay so canvas re-triggers
    setTimeout(() => setConfettiTrigger(true), 50);
    setTimeout(() => setCelebrating(false), 3500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAlreadyRated(false);
    setCelebrating(false);
    setConfettiTrigger(false);
    setSelected(prevRating);
  };

  const displayStar = hovered || selected;

  return (
    <section className="relative bg-brand-black text-brand-white overflow-hidden py-24 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,_rgba(255,87,34,0.15),_transparent_60%)] pointer-events-none" />

      {/* Confetti canvas overlay */}
      <ConfettiCanvas trigger={confettiTrigger} />

      {/* Emoji burst */}
      <EmojiBurst active={celebrating} />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-3"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-brand-orange">
            Your Opinion Matters
          </span>
          <h2 className="font-heading text-5xl md:text-6xl uppercase tracking-tighter leading-none">
            Rate This<br />
            <span className="text-brand-orange">Portfolio</span>
          </h2>
          <p className="text-brand-gray text-sm max-w-sm mx-auto leading-relaxed">
            How would you rate your experience browsing this portfolio? Your feedback helps me improve.
          </p>
        </motion.div>

        {/* Rating card */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            /* ── RATING INPUT ───────────────────────────────────────────── */
            <motion.div
              key="rating-input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-brand-dark border border-brand-white/10 p-10 flex flex-col items-center gap-8"
            >
              {/* Stars */}
              <motion.div
                animate={starControls}
                className="flex gap-3"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.25, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(star)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      size={48}
                      className="transition-all duration-150"
                      fill={star <= displayStar ? "#FF5722" : "transparent"}
                      stroke={star <= displayStar ? "#FF5722" : "rgba(255,255,255,0.2)"}
                      strokeWidth={1.5}
                    />
                  </motion.button>
                ))}
              </motion.div>

              {/* Label */}
              <div className="h-6">
                <AnimatePresence mode="wait">
                  {displayStar > 0 && (
                    <motion.p
                      key={displayStar}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-bold text-brand-orange uppercase tracking-widest"
                    >
                      {LABEL_MAP[displayStar]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                disabled={!selected}
                whileHover={selected ? { scale: 1.03 } : {}}
                whileTap={selected ? { scale: 0.97 } : {}}
                className="bg-brand-white text-brand-black px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit Rating
              </motion.button>
            </motion.div>
          ) : (
            /* ── THANK YOU CARD ─────────────────────────────────────────── */
            <motion.div
              key="rating-done"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full bg-brand-dark border border-brand-orange/30 p-10 flex flex-col items-center gap-6"
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
                className="w-20 h-20 rounded-full bg-brand-orange flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M5 12l5 5L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />
                </svg>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-4xl uppercase tracking-tighter"
              >
                {alreadyRated && !celebrating ? "Rating Updated!" : "Thank You!"}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-brand-gray text-sm max-w-xs"
              >
                You rated this portfolio
              </motion.p>

              {/* Displayed stars (read-only) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, type: "spring", stiffness: 300 }}
                className="flex gap-2"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    animate={celebrating ? {
                      y: [0, -12, 0],
                      rotate: [0, -15, 15, 0],
                    } : {}}
                    transition={{
                      delay: celebrating ? 0.1 * star : 0,
                      duration: 0.5,
                      repeat: celebrating ? 2 : 0,
                    }}
                  >
                    <Star
                      size={36}
                      fill={star <= selected ? "#FF5722" : "transparent"}
                      stroke={star <= selected ? "#FF5722" : "rgba(255,255,255,0.15)"}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="text-sm font-bold text-brand-orange uppercase tracking-widest"
              >
                {LABEL_MAP[selected]}
              </motion.p>

              {/* Celebration message */}
              <AnimatePresence>
                {celebrating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-brand-orange/10 border border-brand-orange/30 px-6 py-3 text-center"
                  >
                    <p className="text-brand-orange font-bold text-sm uppercase tracking-widest">
                      {selected === 5
                        ? "You just made my day! 🚀"
                        : selected >= 4
                        ? "I appreciate your kind words! 🙏"
                        : "Thanks for the honest feedback! 💪"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Change rating button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={handleReset}
                className="text-xs font-bold uppercase tracking-widest text-brand-white/30 hover:text-brand-white transition-colors mt-2"
              >
                Change my rating
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-xs font-mono text-brand-white/20 uppercase tracking-widest"
        >
          Built with passion by Meril Parmar
        </motion.p>

      </div>
    </section>
  );
}
