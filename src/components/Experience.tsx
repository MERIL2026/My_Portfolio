import { motion } from "motion/react";
import { data } from "../data";
import { SectionHeading } from "./SectionHeading";
import { Timeline, TimelineItem } from "./Timeline";

export function Experience() {
  return (
    <section id="experience" className="bg-brand-black text-brand-white px-6 py-24 md:py-32">
      <div className="max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          
          <div>
            <SectionHeading>Experience</SectionHeading>
            <div className="mt-12">
              <Timeline>
                {data.experience.map((exp, i) => (
                  <TimelineItem 
                    key={i}
                    index={i}
                    title={exp.role}
                    subtitle={exp.company}
                    date={exp.date}
                  />
                ))}
              </Timeline>
            </div>
          </div>

          <div>
            <SectionHeading>Services</SectionHeading>
            <div className="flex flex-col gap-8 mt-12">
              {data.services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-brand-dark p-8 group hover:bg-brand-white hover:text-brand-black transition-colors duration-300"
                >
                  <h3 className="font-heading text-3xl uppercase mb-4 tracking-wide group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {service.features.map((feature, j) => (
                      <li key={j} className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-brand-orange group-hover:bg-brand-black"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
