"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Nasir Khan's capability to orchestrate high-fidelity interface systems in Figma while modeling cinematic 3D CGI renderings in Blender has completely transformed our product visual signature. He blends functional UX with stunning graphics.",
    name: "Sarah Jenkins",
    role: "Creative Design Director",
    company: "Apex Creative Agencies",
    initials: "SJ",
    color: "from-neon-purple to-neon-pink",
  },
  {
    quote: "Working with Nasir on our SaaS dashboard redesign was exceptionally fluid. His wireframing methodology, typography hierarchy systems, and comprehensive hand-off guidelines saved our engineering team weeks of implementation time.",
    name: "David Chen",
    role: "Product Co-Founder",
    company: "VibeFlow Tech Systems",
    initials: "DC",
    color: "from-neon-blue to-neon-purple",
  },
  {
    quote: "The 3D product rendering loops Nasir modeled in Unreal Engine 5 were stunning. He has an absolute eye for lighting, texture, and procedural shading. He is a multi-disciplinary design force who respects project hand-off guidelines.",
    name: "Marcus Vance",
    role: "Creative Visual Lead",
    company: "CyberLabs Studio Agency",
    initials: "MV",
    color: "from-neon-pink to-neon-blue",
  },
];

export default function Testimonials() {
  const [dbTestimonials, setDbTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbTestimonials(data);
        }
      });
  }, []);

  const activeTestimonialsList = dbTestimonials.length > 0 ? dbTestimonials : testimonials;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? activeTestimonialsList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === activeTestimonialsList.length - 1 ? 0 : prev + 1));
  };

  // Safe bounds guard if length changes
  const safeActiveIndex = activeIndex >= activeTestimonialsList.length ? 0 : activeIndex;

  if (activeTestimonialsList.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative py-28 overflow-hidden bg-obsidian-900/40"
    >
      <div className="absolute inset-0 bg-dot-pattern -z-10 opacity-30" />
      
      {/* Background orbs */}
      <div className="absolute bottom-1/10 left-1/10 w-[30rem] h-[30rem] bg-neon-purple/5 rounded-full blur-[130px] -z-10" />

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            Client Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            What Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">Say</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mt-4" />
        </div>

        {/* Testimonials Slider */}
        <div className="relative mt-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={safeActiveIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl border border-white/[0.08] p-8 sm:p-14 text-left relative bg-obsidian-950/20 backdrop-blur-xl shadow-2xl"
            >
              
              {/* Backglow panel inside */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-3xl -z-10" />

              {/* Quote icon floating */}
              <div className="absolute top-8 right-8 text-white/[0.03]">
                <Quote className="w-20 h-20 rotate-180" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-base sm:text-lg font-light text-gray-300 leading-relaxed mb-8 relative z-10 italic">
                "{activeTestimonialsList[safeActiveIndex].quote}"
              </p>

              {/* User Bio Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-6 mt-8">
                <div className="flex items-center gap-4">
                  {/* Initials Badge */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${activeTestimonialsList[safeActiveIndex].color} p-0.5 shadow-lg`}>
                    <div className="w-full h-full rounded-full bg-obsidian-900 flex items-center justify-center text-xs font-black text-white">
                      {activeTestimonialsList[safeActiveIndex].initials}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">
                      {activeTestimonialsList[safeActiveIndex].name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">
                      {activeTestimonialsList[safeActiveIndex].role} at <strong className="text-gray-400 font-medium">{activeTestimonialsList[safeActiveIndex].company}</strong>
                    </p>
                  </div>
                </div>

                {/* Slider Nav Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {activeTestimonialsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  safeActiveIndex === idx ? "w-6 bg-neon-purple" : "w-2 bg-white/[0.12]"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
