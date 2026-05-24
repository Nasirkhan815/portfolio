"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Layout, Palette, Sparkles, ArrowRight } from "lucide-react";
import React, { MouseEvent, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  Palette,
  Sparkles
};

interface ServiceItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  glowColor: string;
}

const services: ServiceItem[] = [
  {
    icon: Layout,
    title: "UI/UX & Product Design",
    description: "Crafting beautiful high-fidelity component layouts, interactive micro-animations, design system kits, and accessible digital architectures built to convert.",
    features: ["Figma & FigJam Prototyping", "Design System Development", "User Flows & Wireframing", "Conversion Rate Optimization"],
    glowColor: "group-hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] group-hover:border-neon-purple/40",
  },
  {
    icon: Palette,
    title: "3D CGI & Cinematic Art",
    description: "Designing hyper-realistic 3D CGI visual models, detailed lighting setups, textured environments, and high-impact cinematic rendering outputs.",
    features: ["High-fidelity 3D Modeling (Blender/C4D)", "Advanced Shading & Texturing", "Cinematic CGI Lighting", "Unreal Engine 5 Real-Time Rendering"],
    glowColor: "group-hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] group-hover:border-neon-blue/40",
  },
  {
    icon: Sparkles,
    title: "Brand Identity & Layouts",
    description: "Establishing robust, cohesive brand identity kits, modern typography standards, typography guides, and vector graphic layouts that stand the test of time.",
    features: ["Brand Logo & Style Guides", "Modern Typography Layouts", "Marketing Layouts & Visuals", "Vector Illustration Suites"],
    glowColor: "group-hover:shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] group-hover:border-neon-pink/40",
  },
];

// Interactive 3D Card component
function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = service.icon;
  
  // Motion values for tracking cursor position on card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Extra motion values for radial cursor spotlights
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  // Map mouse positions to rotations (max 15 degrees tilt)
  const rotateX = useTransform(y, [-150, 150], [12, -12]);
  const rotateY = useTransform(x, [-150, 150], [-12, 12]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor coordinate relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
    
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    spotlightX.set(0);
    spotlightY.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`glass-card rounded-2xl border border-white/[0.06] p-8 text-left transition-all duration-300 relative group flex flex-col justify-between ${service.glowColor} cursor-default`}
    >
      <div>
        {/* Spotlight background mask */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none -z-10 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${spotlightX}px ${spotlightY}px, rgba(139, 92, 246, 0.12), transparent 80%)`,
          }}
        />

        {/* Glowing border backup */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-white/[0.04] rounded-2xl -z-10" />

        {/* Icon container */}
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white mb-6 group-hover:scale-105 group-hover:bg-white/[0.06] transition-all duration-300">
          <Icon className="w-6 h-6 text-neon-purple" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-display text-white mb-4 group-hover:text-neon-purple transition-colors duration-300">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm font-light text-gray-400 leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Features bullet list */}
        <ul className="space-y-3 mb-8">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative interactive link tag */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors duration-300">
        Read more capabilities
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>

    </motion.div>
  );
}

export default function Services() {
  const [dbServices, setDbServices] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map(item => ({
            title: item.title,
            description: item.description,
            features: item.features,
            glowColor: item.glow_color,
            icon: iconMap[item.icon] || Layout
          }));
          setDbServices(mapped);
        }
      });
  }, []);

  const activeServicesList = dbServices.length > 0 ? dbServices : services;

  return (
    <section
      id="services"
      className="relative py-28 overflow-hidden bg-obsidian-900/40"
    >
      <div className="absolute inset-0 bg-dot-pattern -z-10 opacity-30" />
      
      {/* Background orbs */}
      <div className="absolute top-1/10 right-1/10 w-[30rem] h-[30rem] bg-neon-blue/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/10 left-1/10 w-[30rem] h-[30rem] bg-neon-pink/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            What I Bring To The Table
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Capabilities</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mt-4" />
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServicesList.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
