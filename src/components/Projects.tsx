"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink, Code } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "./SpotlightCard";


interface Project {
  title: string;
  category: string;
  description: string;
  tools: string[];
  image: string;
  caseStudy: string;
  liveLink: string;
}

const projects: Project[] = [
  {
    title: "Artixor Design Services Website",
    category: "web",
    description: "A premium responsive web application built to showcase design systems, high-fidelity layouts, CGI render portfolios, and responsive interfaces with deep obsidian styles.",
    tools: ["Figma", "Next.js", "Framer Motion", "Tailwind CSS"],
    image: "/images/ai-crm.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "ZNMR.pk Fashion Store",
    category: "web",
    description: "An elegant, luxurious e-commerce storefront for a modern high-end fashion brand. Implements responsive grids, seamless visual transitions, and conversion checkout structures.",
    tools: ["Figma", "Shopify Engine", "Responsive CSS", "Photoshop"],
    image: "/images/spatial-map.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "247_365 Muslim App",
    category: "uiux",
    description: "A serene, highly accessible daily companion mobile application interface featuring prayer tracks, Quranic layout systems, and clean Islamic minimalist elements.",
    tools: ["Figma UI Library", "Adobe Illustrator", "Journey Maps"],
    image: "/images/web3-vault.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "Laundry App UI Design",
    category: "uiux",
    description: "A modern, vibrant mobile interface for an on-demand dry cleaning services application. Incorporates map order tracking, step-progress stages, and micro-animations.",
    tools: ["Figma Prototyping", "Adobe XD", "After Effects Motion"],
    image: "/images/ai-crm.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "AI Background Remover App",
    category: "uiux",
    description: "A utility application mockup displaying automatic neural image cutouts, active crop layers, custom background presets, and vector layout configurations.",
    tools: ["Figma UI Components", "Adobe Photoshop CC", "Visual Grids"],
    image: "/images/spatial-map.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "Real Estate Marketing Designs",
    category: "graphics",
    description: "High-impact visual promotional identity bundles, social media banners, vector print collateral, and advertising structures crafted for real estate projects.",
    tools: ["Adobe Photoshop CC", "Adobe Illustrator", "InDesign Layouts"],
    image: "/images/web3-vault.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "Brand Identity Systems",
    category: "graphics",
    description: "Cohesive brand visual styling kits, responsive logo blueprints, custom stationery mockups, typography palettes, and unified collateral matrices for corporate firms.",
    tools: ["Adobe Illustrator", "Photoshop", "Brand Guidelines"],
    image: "/images/ai-crm.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
  {
    title: "Packaging Design Portfolio",
    category: "graphics",
    description: "Bespoke structural box packaging shapes, textured 3D product rendering coordinates, procedural shaders, and tactile label assets for natural organic items.",
    tools: ["Blender 3D", "Cinema 4D Rendering", "Photoshop Shaders"],
    image: "/images/spatial-map.png",
    caseStudy: "https://artixor.com",
    liveLink: "https://artixor.com",
  },
];

const categoryDisplayNames: Record<string, string> = {
  uiux: "UI/UX & Mobile",
  web: "Web & E-Commerce",
  graphics: "Graphics & Branding",
};

export default function Projects() {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map(item => ({
            title: item.title,
            category: item.category,
            description: item.description,
            tools: item.tools,
            image: item.image_url,
            caseStudy: item.case_study_url,
            liveLink: item.live_url
          }));
          setDbProjects(mapped);
        }
      });
  }, []);

  const activeProjectsList = dbProjects.length > 0 ? dbProjects : projects;

  // Compile categories dynamically based on loaded projects
  const uniqueCategories = Array.from(new Set(activeProjectsList.map(p => p.category)));
  const dynamicCategories = [
    { id: "all", label: "All Works" },
    ...uniqueCategories.map(cat => ({
      id: cat,
      label: categoryDisplayNames[cat] || cat
    }))
  ];

  const filteredProjects = activeProjectsList.filter((project) => {
    if (selectedFilter === "all") return true;
    return project.category === selectedFilter;
  });

  return (
    <section
      id="projects"
      className="relative py-28 overflow-hidden bg-obsidian-900/40"
    >
      <div className="absolute inset-0 bg-dot-pattern -z-10 opacity-30" />
      
      {/* Background Orbs */}
      <div className="absolute bottom-1/5 right-1/10 w-[35rem] h-[35rem] bg-neon-purple/5 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            My Works & Case Studies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">Projects</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mt-4" />
        </div>

        {/* Categories / Filter tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full border border-white/[0.06] bg-obsidian-950/50 backdrop-blur-xl">
            {dynamicCategories.map((cat) => {
              const isSelected = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`relative px-6 py-2.5 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                    isSelected ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-full -z-10 shadow-inner"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <SpotlightCard
                  className="overflow-hidden flex flex-col justify-between hover:bg-obsidian-900/40 w-full h-full relative"
                >
                  <div className="w-full">
                    
                    {/* Project Image Wrapper */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/45 border-b border-white/[0.05]">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        priority
                      />
                      {/* Dark gradient mask */}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent opacity-60" />
                      
                      {/* Category Label Overlay */}
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 border border-white/[0.1] text-gray-300 backdrop-blur-md">
                        <Code className="w-3.5 h-3.5 text-neon-purple" />
                        {categoryDisplayNames[project.category] || project.category}
                      </span>
                    </div>

                    {/* Card Info padding */}
                    <div className="p-6 text-left font-sans">
                      {/* Title */}
                      <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-neon-purple transition-colors duration-300">
                        {project.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm font-light text-gray-400 leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Tech / Tools Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tools.map((t: string) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-md text-[10px] font-bold text-gray-400 bg-white/[0.02] border border-white/[0.04]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Footer Buttons */}
                  <div className="p-6 pt-0 border-t border-white/[0.04] mt-6 flex justify-between items-center bg-white/[0.005] w-full">
                    <a
                      href={project.caseStudy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> Case Study
                    </a>
                    
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-neon-purple hover:text-white hover:underline transition-all duration-300"
                    >
                      View Live <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
