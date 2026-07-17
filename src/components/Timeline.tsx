import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  index: number;
  key?: number | string;
}

export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative border-l-4 border-brand-orange pl-8 md:pl-12 py-4", className)}>
      <div className="flex flex-col gap-12">
        {children}
      </div>
    </div>
  );
}

export function TimelineItem({ title, subtitle, date, index }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative group"
    >
      {/* Timeline Node */}
      <div className="absolute -left-[42px] md:-left-[58px] top-1.5 w-6 h-6 bg-brand-black border-4 border-brand-orange rotate-45 group-hover:rotate-90 group-hover:bg-brand-orange transition-all duration-500 z-10" />
      
      {/* Content */}
      <div className="bg-brand-dark p-6 border border-brand-white/10 hover:border-brand-orange/50 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-white/5 -rotate-45 translate-x-12 -translate-y-12 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h3 className="font-heading text-3xl uppercase tracking-wide text-brand-white leading-none">
              {title}
            </h3>
            <p className="font-bold text-brand-gray uppercase tracking-widest text-xs mt-2">
              {subtitle}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-brand-black bg-brand-orange px-3 py-1 uppercase self-start whitespace-nowrap">
            {date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
