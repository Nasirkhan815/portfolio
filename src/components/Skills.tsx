"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Sparkles, Layout, Palette, Code, CheckCircle,
  Folder, Layers, Command, Award, Monitor
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";


interface SkillCardItem {
  name: string;
  category: string;
  level: string;
  desc: string;
  glow: string;
  iconBg: string;
  tagColor: string;
}

const skillsList: SkillCardItem[] = [
  // UI/UX & Graphic Design
  {
    name: "Figma",
    category: "design",
    level: "Master",
    desc: "UI Systems, Auto-Layout, Variables & Prototyping",
    glow: "group-hover:border-[#0ACF83]/40 group-hover:shadow-[0_0_30px_-5px_rgba(10,207,131,0.15)]",
    iconBg: "bg-[#0ACF83]/10 text-[#0ACF83]",
    tagColor: "text-[#0ACF83] bg-[#0ACF83]/10 border-[#0ACF83]/20",
  },
  {
    name: "Photoshop",
    category: "design",
    level: "Expert",
    desc: "High-end CGI texturing, masking, & graphic compositing",
    glow: "group-hover:border-[#31A8FF]/40 group-hover:shadow-[0_0_30px_-5px_rgba(49,168,255,0.15)]",
    iconBg: "bg-[#31A8FF]/10 text-[#31A8FF]",
    tagColor: "text-[#31A8FF] bg-[#31A8FF]/10 border-[#31A8FF]/20",
  },
  {
    name: "Illustrator",
    category: "design",
    level: "Expert",
    desc: "Bespoke vector illustrations, logo assets & guides",
    glow: "group-hover:border-[#FF9A00]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,154,0,0.15)]",
    iconBg: "bg-[#FF9A00]/10 text-[#FF9A00]",
    tagColor: "text-[#FF9A00] bg-[#FF9A00]/10 border-[#FF9A00]/20",
  },
  {
    name: "InDesign",
    category: "design",
    level: "Advanced",
    desc: "Editorial layout, typography scales, & print standards",
    glow: "group-hover:border-[#FF1493]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,20,147,0.15)]",
    iconBg: "bg-[#FF1493]/10 text-[#FF1493]",
    tagColor: "text-[#FF1493] bg-[#FF1493]/10 border-[#FF1493]/20",
  },
  {
    name: "Adobe XD",
    category: "design",
    level: "Expert",
    desc: "Vector layouts, wireframes & customer interaction maps",
    glow: "group-hover:border-[#FF26BE]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,38,190,0.15)]",
    iconBg: "bg-[#FF26BE]/10 text-[#FF26BE]",
    tagColor: "text-[#FF26BE] bg-[#FF26BE]/10 border-[#FF26BE]/20",
  },
  {
    name: "CorelDRAW",
    category: "design",
    level: "Advanced",
    desc: "Precision vector grids, vector tracing & layout tools",
    glow: "group-hover:border-[#00B050]/40 group-hover:shadow-[0_0_30px_-5px_rgba(0,176,80,0.15)]",
    iconBg: "bg-[#00B050]/10 text-[#00B050]",
    tagColor: "text-[#00B050] bg-[#00B050]/10 border-[#00B050]/20",
  },

  // 3D CGI & Motion
  {
    name: "Blender 3D",
    category: "cgi",
    level: "Master",
    desc: "3D hard-surface modeling, CGI texturing & lighting",
    glow: "group-hover:border-[#EA7600]/40 group-hover:shadow-[0_0_30px_-5px_rgba(234,118,0,0.15)]",
    iconBg: "bg-[#EA7600]/10 text-[#EA7600]",
    tagColor: "text-[#EA7600] bg-[#EA7600]/10 border-[#EA7600]/20",
  },
  {
    name: "Unity 3D",
    category: "cgi",
    level: "Advanced",
    desc: "Real-time visual setups, shaders, & XR simulations",
    glow: "group-hover:border-[#222c37]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.08)]",
    iconBg: "bg-white/10 text-white",
    tagColor: "text-white bg-white/5 border-white/10",
  },
  {
    name: "After Effects",
    category: "cgi",
    level: "Expert",
    desc: "Keyframe motion choreography & dynamic UI animations",
    glow: "group-hover:border-[#cf96fd]/40 group-hover:shadow-[0_0_30px_-5px_rgba(207,150,253,0.15)]",
    iconBg: "bg-[#cf96fd]/10 text-[#cf96fd]",
    tagColor: "text-[#cf96fd] bg-[#cf96fd]/10 border-[#cf96fd]/20",
  },
  {
    name: "Premiere Pro",
    category: "cgi",
    level: "Expert",
    desc: "Cinematic cuts, sound tracks, & video presentation",
    glow: "group-hover:border-[#ea7bfa]/40 group-hover:shadow-[0_0_30px_-5px_rgba(234,123,250,0.15)]",
    iconBg: "bg-[#ea7bfa]/10 text-[#ea7bfa]",
    tagColor: "text-[#ea7bfa] bg-[#ea7bfa]/10 border-[#ea7bfa]/20",
  },

  // Web Development
  {
    name: "HTML",
    category: "web",
    level: "Expert",
    desc: "Semantic structures, SEO layouts & DOM standards",
    glow: "group-hover:border-[#E34F26]/40 group-hover:shadow-[0_0_30px_-5px_rgba(227,79,38,0.15)]",
    iconBg: "bg-[#E34F26]/10 text-[#E34F26]",
    tagColor: "text-[#E34F26] bg-[#E34F26]/10 border-[#E34F26]/20",
  },
  {
    name: "CSS",
    category: "web",
    level: "Expert",
    desc: "Responsive CSS variable architectures & animations",
    glow: "group-hover:border-[#1572B6]/40 group-hover:shadow-[0_0_30px_-5px_rgba(21,114,182,0.15)]",
    iconBg: "bg-[#1572B6]/10 text-[#1572B6]",
    tagColor: "text-[#1572B6] bg-[#1572B6]/10 border-[#1572B6]/20",
  },

  // Productivity & Collaboration
  {
    name: "Notion",
    category: "collab",
    level: "Expert",
    desc: "Database setup, project tracking, & design templates",
    glow: "group-hover:border-[#ffffff]/20 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)]",
    iconBg: "bg-white/10 text-white",
    tagColor: "text-white bg-white/5 border-white/10",
  },
  {
    name: "Trello",
    category: "collab",
    level: "Expert",
    desc: "Kanban task boards, design workflow, & team hand-offs",
    glow: "group-hover:border-[#0079BF]/40 group-hover:shadow-[0_0_30px_-5px_rgba(0,121,191,0.15)]",
    iconBg: "bg-[#0079BF]/10 text-[#0079BF]",
    tagColor: "text-[#0079BF] bg-[#0079BF]/10 border-[#0079BF]/20",
  },
  {
    name: "Google Slides",
    category: "collab",
    level: "Master",
    desc: "High-end corporate layouts, pitch decks & guidelines",
    glow: "group-hover:border-[#FBBC05]/40 group-hover:shadow-[0_0_30px_-5px_rgba(251,188,5,0.15)]",
    iconBg: "bg-[#FBBC05]/10 text-[#FBBC05]",
    tagColor: "text-[#FBBC05] bg-[#FBBC05]/10 border-[#FBBC05]/20",
  },
  {
    name: "Miro",
    category: "collab",
    level: "Expert",
    desc: "User journey flowcharts, mind maps & brainstorming",
    glow: "group-hover:border-[#FFD02F]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,208,47,0.15)]",
    iconBg: "bg-[#FFD02F]/10 text-[#FFD02F]",
    tagColor: "text-[#FFD02F] bg-[#FFD02F]/10 border-[#FFD02F]/20",
  },
];

const categoriesDisplayNames: Record<string, string> = {
  design: "UI/UX & Graphics",
  cgi: "3D & Motion",
  web: "Web Layouts",
  collab: "Collaboration"
};

export default function Skills() {
  const [dbSkills, setDbSkills] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map(item => ({
            name: item.name,
            category: item.category,
            level: item.level,
            desc: item.description,
            glow: item.glow,
            iconBg: item.icon_bg,
            tagColor: item.tag_color
          }));
          setDbSkills(mapped);
        }
      });
  }, []);

  const activeSkillsList = dbSkills.length > 0 ? dbSkills : skillsList;

  // Compile categories dynamically based on loaded skills
  const uniqueCategories = Array.from(new Set(activeSkillsList.map(s => s.category)));
  const dynamicCategories = [
    { id: "all", label: "All Skills" },
    ...uniqueCategories.map(cat => ({
      id: cat,
      label: categoriesDisplayNames[cat] || cat
    }))
  ];

  const filteredSkills = activeSkillsList.filter((skill) => {
    if (selectedFilter === "all") return true;
    return skill.category === selectedFilter;
  });

  return (
    <section
      id="skills"
      className="relative py-28 overflow-hidden bg-obsidian-900/40"
    >
      <div className="absolute inset-0 bg-dot-pattern -z-10 opacity-30" />
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-neon-purple/5 rounded-full blur-[140px] -z-10 animate-pulse duration-[8000ms]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            Studio Core Stack
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            Design & CGI <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">Capabilities</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mt-4" />
        </div>

        {/* Categories Tab selector */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl sm:rounded-full border border-white/[0.06] bg-obsidian-950/50 backdrop-blur-xl max-w-3xl w-full">
            {dynamicCategories.map((cat) => {
              const isSelected = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`flex-1 min-w-[130px] relative px-4 py-3 text-xs font-semibold rounded-xl sm:rounded-full transition-all duration-300 cursor-pointer ${
                    isSelected ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeSkillsFilter"
                      className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-xl sm:rounded-full -z-10 shadow-inner"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Skill Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.02 }}
                className="w-full h-full"
              >
                <SpotlightCard
                  className={`p-6 text-left flex flex-col justify-between hover:bg-obsidian-900/40 transition-all duration-400 group relative w-full h-full ${skill.glow}`}
                >
                  <div>
                    
                    {/* Card Header (Icon indicator and Mastery tag) */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm shadow-inner ${skill.iconBg}`}>
                        {skill.name.substring(0, 2)}
                      </div>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${skill.tagColor}`}>
                        {skill.level}
                      </span>
                    </div>

                    {/* Skill Name */}
                    <h3 className="text-base font-bold font-display text-white mb-2 group-hover:text-neon-purple transition-colors duration-300">
                      {skill.name}
                    </h3>

                    {/* Skill Description */}
                    <p className="text-xs font-light text-gray-500 leading-relaxed mb-4">
                      {skill.desc}
                    </p>

                  </div>

                  {/* Checklist Bullet Icon */}
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                    <CheckCircle className="w-3.5 h-3.5 text-neon-purple" /> Active Capability
                  </div>

                  {/* Interactive border glow decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
