"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
  type: "work" | "education";
  tech?: string[];
}

const items: TimelineItem[] = [
  {
    year: "2024 - Present",
    role: "Senior UX/UI & Product Designer",
    company: "Artixor Studio",
    description: "Directing high-fidelity mobile & desktop interactive user experience layouts. Managed brand architecture projects for international clients, designed comprehensive enterprise dashboard grids, and oversaw 3D visual campaigns.",
    type: "work",
    tech: ["Figma", "FigJam", "Web Design", "Brand Identity", "Interaction Design"],
  },
  {
    year: "2021 - 2024",
    role: "Lead 3D CG Artist & Graphic Designer",
    company: "Apex Vision Agency",
    description: "Designed realistic 3D CGI product environments and cinematic models. Authored visual layouts for advertising networks, generated lighting/texture visual maps, and constructed optimized real-time visual modules in Blender/Unreal Engine.",
    type: "work",
    tech: ["Blender", "Cinema 4D", "Unreal Engine 5", "After Effects", "Photoshop"],
  },
  {
    year: "2018 - 2021",
    role: "Product & Interface Designer",
    company: "Creative Flow Labs",
    description: "Engineered responsive website mockups, visual graphics, and typography libraries. Collaborated with front-end developers to transition Figma mockups to pixel-perfect responsive HTML/CSS structures.",
    type: "work",
    tech: ["Figma", "Adobe Illustrator", "HTML/CSS", "Typography", "Wireframing"],
  },
  {
    year: "2014 - 2018",
    role: "B.A. in Visual Communication & Digital Art",
    company: "National Academy of Arts",
    description: "Graduated with first-class honors. Specialized coursework in typography layout theories, human-centered UI principles, 3D graphics rendering, and cinema production.",
    type: "education",
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dbExperience, setDbExperience] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("experience")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbExperience(data);
        }
      });
  }, []);

  const activeItemsList = dbExperience.length > 0 ? dbExperience : items;
  
  // Track scroll inside the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="experience"
      className="relative py-28 overflow-hidden bg-obsidian-900/20"
    >
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-30" />
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-[30rem] h-[30rem] bg-neon-purple/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            My Journey & Milestones
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            Work & <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue">Education</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-full mt-4" />
        </div>

        {/* Timeline wrapper */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto mt-16 px-4 sm:px-0">
          
          {/* Central Guide Line (Desktop) */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-white/[0.06] -translate-x-[50%]" />
          
          {/* Scroll-animated Indicator Line */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-purple via-neon-pink to-neon-blue -translate-x-[50%]"
          />

          {/* Timeline Items */}
          <div className="space-y-16">
            {activeItemsList.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = item.type === "work" ? Briefcase : GraduationCap;
              
              return (
                <div
                  key={`${item.company}-${idx}`}
                  className="flex flex-col sm:flex-row relative items-start sm:items-center w-full"
                >
                  
                  {/* Glowing Node Button */}
                  <div className="absolute left-8 sm:left-1/2 -translate-x-[50%] flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-10 h-10 rounded-full bg-obsidian-800 border border-white/[0.1] flex items-center justify-center shadow-lg group hover:border-neon-purple/50 transition-colors duration-300"
                    >
                      <Icon className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
                    </motion.div>
                  </div>

                  {/* Desktop Content Grid spacing layout */}
                  <div className={`w-full sm:w-1/2 pl-16 sm:pl-0 ${isEven ? "sm:pr-12 text-left sm:text-right" : "sm:pl-12 sm:order-2 text-left"}`}>
                    
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                      className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300 relative group"
                    >
                      {/* Glow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-2xl -z-10" />

                      {/* Year badge */}
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-neon-purple bg-neon-purple/10 border border-neon-purple/20 mb-4 uppercase">
                        {item.year}
                      </span>

                      {/* Role title */}
                      <h3 className="text-lg font-bold font-display text-white mb-1 group-hover:text-neon-purple transition-colors duration-300">
                        {item.role}
                      </h3>

                      {/* Company name */}
                      <h4 className="text-sm font-semibold text-gray-400 mb-4">
                        {item.company}
                      </h4>

                      {/* Narrative description */}
                      <p className="text-xs sm:text-sm font-light text-gray-500 leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Technology Chips */}
                      {item.tech && (
                        <div className={`flex flex-wrap gap-2 ${isEven ? "sm:justify-end" : "justify-start"}`}>
                          {item.tech.map((t: string) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-gray-400 bg-white/[0.03] border border-white/[0.05]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                    </motion.div>

                  </div>

                  {/* Empty Spacer column for even items in Desktop */}
                  <div className="hidden sm:block sm:w-1/2" />

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
