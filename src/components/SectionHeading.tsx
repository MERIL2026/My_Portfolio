import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { ReactNode } from "react";

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {

  return (
    <motion.h2
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "font-heading text-6xl md:text-8xl lg:text-[100px] uppercase leading-[0.82] text-brand-white mb-10 tracking-tighter italic",
        className
      )}
    >
      {children}
    </motion.h2>
  );
}
