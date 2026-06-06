"use client";

import { motion } from "framer-motion";
import { Award, Layers, Users, Zap, Compass, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface StatItem {
  icon: string;
  value: string;
  label: string;
  color: string;
  desc: string;
}

const defaultStats: StatItem[] = [
  { icon: "Award", value: "10+", label: "Years Experience", color: "text-neon-purple", desc: "Crafting digital systems since 2016." },
  { icon: "Layers", value: "150+", label: "Projects Finished", color: "text-neon-pink", desc: "UX interfaces, 3D CGI & graphics." },
  { icon: "Users", value: "100+", label: "Happy Clients", color: "text-neon-blue", desc: "Corporate agencies & startups globally." },
  { icon: "Zap", value: "99%", label: "Client Satisfaction", color: "text-neon-emerald", desc: "Consistently highly rated ratings." },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Layers,
  Users,
  Zap
};

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("about_settings")
      .select("*")
      .eq("id", "about_settings")
      .single()
      .then(({ data }) => {
        if (data) setAboutData(data);
      });
  }, []);

  const statsList = aboutData?.stats || defaultStats;

  return (
    <section
      id="about"
      className="relative py-28 overflow-hidden bg-obsidian-900/10"
    >
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-30" />
      
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 w-[30rem] h-[30rem] bg-neon-purple/5 rounded-full blur-[130px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[25rem] h-[25rem] bg-neon-blue/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            {aboutData?.subtitle || "Visual Architect"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            {
              (() => {
                const heading = aboutData?.section_heading || "Creative Story & Branding Philosophy";
                const marker = "Branding Philosophy";
                if (heading.includes(marker)) {
                  const parts = heading.split(marker);
                  return (
                    <>
                      {parts[0]}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">{marker}</span>
                      {parts[1]}
                    </>
                  );
                }

                return heading;
              })()
            }
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Narrative Story */}
          <div className="lg:col-span-6 flex flex-col justify-between text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-black font-display text-white tracking-tight">
                {aboutData?.title || "Bridging Artistic CGI Expression with Pixel-Perfect Product UX"}
              </h3>
              
              {aboutData?.paragraphs && aboutData.paragraphs.length > 0 ? (
                aboutData.paragraphs.map((p: string, idx: number) => (
                  <p key={idx} className="text-gray-400 font-light leading-relaxed">
                    {p}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-gray-400 font-light leading-relaxed">
                    Hi, I'm <strong className="text-white font-medium">Nasir Khan</strong>. Over the past 10 years, I've functioned as a Senior UI/UX Designer, Product Designer, Graphic Layout Architect, and 3D CG Artist. I established my visual studio brand <strong className="text-neon-purple font-medium">Artixor</strong> to build spatial interactive digital models and responsive software frameworks.
                  </p>

                  <p className="text-gray-400 font-light leading-relaxed">
                    My creative philosophy relies on two cores: absolute functional simplicity in user experience and hyper-realistic aesthetic rendering in visual branding. I believe a digital interface must be as responsive and accessible as it is stunning to look at.
                  </p>

                  <p className="text-gray-400 font-light leading-relaxed">
                    From formulating extensive typography guides and interactive design systems in Figma to building complex lighting schemas, texturing visual maps, and rendering real-time cinematic cinematics in Blender and Unreal Engine 5—I deliver a unified visual signature.
                  </p>
                </>
              )}

              {/* High-end mini list */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Spatial UI Architecture</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-pink/10 flex items-center justify-center text-neon-pink">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Cinematic CGI Production</span>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Right Column: Large 2x2 Stats Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {statsList.map((stat: any, idx: number) => {
                const Icon = iconMap[stat.icon] || Award;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
                    className="glass-card p-6 rounded-2xl border border-white/[0.06] text-left hover:border-neon-purple/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.1)] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] transition-colors ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-3xl font-black font-display text-white leading-none block">
                          {stat.value}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mt-0.5">
                          {stat.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-light text-gray-400 leading-relaxed">
                      {stat.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
