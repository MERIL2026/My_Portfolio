import { motion } from "motion/react";
import { data } from "../data";
import { SectionHeading } from "./SectionHeading";
import { Timeline, TimelineItem } from "./Timeline";

export function About() {
  return (
    <section id="about" className="bg-brand-paper text-brand-black px-6 py-24 md:py-32">
      <div className="max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

          <div className="flex flex-col gap-8">
            <SectionHeading className="text-brand-black mb-0">Who is Meril?</SectionHeading>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <div className="w-full h-[500px] relative overflow-hidden bg-brand-dark/10 group">
                {/* 
                  Please upload your photo to the 'public' folder and name it 'meril.jpg'.
                  The code will look for it at /meril.jpg 
                */}
                <img
                  src="/meril.jpg"
                  alt="Meril"
                  className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-orange/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 border border-brand-black/10 m-4 z-10 pointer-events-none"></div>
              </div>

              <div className="prose prose-lg text-brand-dark">
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                  {data.about.intro}
                </p>
                <p className="text-base md:text-lg opacity-80 leading-relaxed">
                  {data.about.story}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <Timeline className="border-brand-black">
              {data.about.timeline.map((item, i) => (
                <TimelineItem
                  key={i}
                  index={i}
                  title={item.event}
                  subtitle="Milestone"
                  date={item.year}
                />
              ))}
            </Timeline>
          </div>

        </div>
      </div>
    </section>
  );
}
