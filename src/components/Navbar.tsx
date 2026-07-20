import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Leadership", href: "#leadership" },
    { name: "Unreal 3D", href: "#unreal-engine" },
    { name: "Beyond Code", href: "#beyond-code" },
    { name: "Certs", href: "#certificates" },
    { name: "Experience", href: "#experience" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-brand-white/10",
          isScrolled ? "bg-brand-black/95 backdrop-blur-md" : "bg-brand-black"
        )}
      >
        <div className="flex justify-between items-center px-6 md:px-10 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange flex items-center justify-center font-black text-brand-black text-xl">M</div>
            <span className="hidden md:block text-xs tracking-[0.3em] font-bold uppercase text-brand-white">Meril Parmar / Portfolio 2026</span>
            <span className="md:hidden text-xs tracking-[0.3em] font-bold uppercase text-brand-white">Meril.</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-semibold opacity-70">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-brand-white hover:text-brand-orange hover:opacity-100 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-brand-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-brand-orange flex flex-col justify-center items-center px-6"
          >
            <button
              className="absolute top-6 right-6 text-brand-black"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={40} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-heading text-5xl uppercase text-brand-black hover:text-brand-white transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
