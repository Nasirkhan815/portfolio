"use client";

import { motion } from "framer-motion";
import { Search, Compass, Palette, Sparkles, Send } from "lucide-react";

interface Step {
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  glow: string;
}

const steps: Step[] = [
  {
    num: "01",
    icon: Search,
    title: "Discover & Research",
    subtitle: "Discovery Phase",
    description: "Aligning on core business goals, auditing competitor frameworks, and mapping target user demographics to outline detailed accessibility flowcharts.",
    glow: "group-hover:border-neon-purple/40 group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)]",
  },
  {
    num: "02",
    icon: Compass,
    title: "Define & Wireframe",
    subtitle: "Structure Phase",
    description: "Formulating cohesive user journey loops, establishing responsive screen structural blocks, and testing dynamic interactive low-fidelity layouts.",
    glow: "group-hover:border-neon-pink/40 group-hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.15)]",
  },
  {
    num: "03",
    icon: Palette,
    title: "High-Fidelity Design",
    subtitle: "Styling Phase",
    description: "Creating comprehensive, responsive design libraries, managing dynamic visual typography systems, and establishing complete vector layouts in Figma.",
    glow: "group-hover:border-neon-blue/40 group-hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]",
  },
  {
    num: "04",
    icon: Sparkles,
    title: "CGI & 3D Rendering",
    subtitle: "Artistic Enhancement",
    description: "Modeling bespoke 3D products, composing lighting and texture coordinates, and rendering cinematic visual assets to elevate brand presentation.",
    glow: "group-hover:border-neon-emerald/40 group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]",
  },
  {
    num: "05",
    icon: Send,
    title: "Hand-Off & Delivery",
    subtitle: "Deployment Phase",
    description: "Delivering unified design tokens, organized component libraries, developer documentation, and overseeing code-verification alignments.",
    glow: "group-hover:border-neon-purple/40 group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)]",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative py-28 overflow-hidden bg-obsidian-900/20"
    >
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-30" />
      
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-neon-purple/5 rounded-full blur-[140px] -z-10" />

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
            How I Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            Creative Design & <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">CGI Process</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mt-4" />
        </div>

        {/* Workflow Horizontal timeline cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16 relative">
          
          {/* Connector guide line behind cards in Desktop */}
          <div className="hidden lg:block absolute left-4 right-4 top-[48px] h-0.5 bg-white/[0.04] -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className={`glass-card rounded-2xl border border-white/[0.06] p-6 text-left flex flex-col justify-between relative group hover:bg-obsidian-900/50 transition-all duration-300 ${step.glow}`}
              >
                <div>
                  
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink group-hover:scale-105 transition-transform duration-300">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-neon-purple group-hover:scale-105 group-hover:bg-white/[0.06] transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-bold font-display text-white mb-1 group-hover:text-neon-purple transition-colors duration-300">
                    {step.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">
                    {step.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-xs font-light text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                </div>

                {/* Bottom line glow decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
