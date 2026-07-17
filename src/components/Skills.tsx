import { motion } from "motion/react";
import { data } from "../data";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  const categories = Object.entries(data.skills);

  return (
    <section id="skills" className="bg-brand-black text-brand-white px-6 py-24 md:py-32 relative">
      <div className="max-w-[1140px] mx-auto relative z-10">
        <SectionHeading>Tech Arsenal</SectionHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-16">
          {categories.map(([title, items], idx) => (
            <motion.div
              key={title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-brand-dark p-8 border-l-4 border-brand-orange"
            >
              <h3 className="font-heading text-3xl uppercase mb-6 tracking-wide text-brand-white">
                {title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-bold uppercase tracking-wider bg-brand-black px-3 py-2 text-brand-gray border border-brand-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
