"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  ArrowRight, Mail, Code, Sparkles, Terminal, FileText, ChevronDown, Check,
  Globe, HelpCircle 
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Magnetic from "./Magnetic";
import SpotlightCard from "./SpotlightCard";
import { createClient } from "@/utils/supabase/client";

const roles = ["Senior UI/UX Designer", "Product Designer", "Graphic Designer", "3D CG Artist"];

const defaultCardsConfig = {
  scene_layers: {
    visible: true,
    title: "Scene Layers",
    item1_text: "CGI_Render_Final",
    item1_label: "3D",
    item2_text: "UI_Layer_Kit",
    item2_label: "Figma"
  },
  visual_score: {
    visible: true,
    title: "Visual Score",
    value: "5.0",
    growth: "+4.2%"
  },
  studio: {
    visible: true,
    title: "Axis Craft Studio",
    badge: "10+ Years Certified",
    reviews_label: "REVIEWS",
    reviews_value: "5.0 ⭐",
    projects_label: "PROJECTS",
    projects_value: "150+"
  }
};

const defaultSocialLinks = [
  { icon: "globe", url: "https://Axis-Craft.com", visible: true },
  { icon: "linkedin", url: "https://www.linkedin.com/in/nasirkhan-uiux/", visible: true },
  { icon: "mail", url: "mailto:nasir.khan815@gmail.com", visible: true }
];

const renderSocialIcon = (iconName: string) => {
  const className = "w-5 h-5";
  switch (iconName) {
    case "globe": return <Globe className={className} />;
    case "mail": return <Mail className={className} />;
    case "linkedin": return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    );
    case "github": return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
    );
    case "twitter": return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
    );
    case "instagram": return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    );
    case "youtube": return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
    );
    default: return <HelpCircle className={className} />;
  }
};

const particles = [
  { size: 2, top: "20%", left: "15%", duration: 18, delay: 0 },
  { size: 3, top: "35%", left: "80%", duration: 22, delay: 2 },
  { size: 1.5, top: "70%", left: "25%", duration: 25, delay: 1 },
  { size: 2, top: "60%", left: "75%", duration: 20, delay: 3 },
  { size: 3, top: "15%", left: "55%", duration: 30, delay: 0 },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeRoles, setActiveRoles] = useState(roles);
  const [currentRole, setCurrentRole] = useState(roles[0]);
  const [imageError, setImageError] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch Hero settings from Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("hero_settings")
      .select("*")
      .eq("id", "hero_settings")
      .single()
      .then(({ data }) => {
        if (data) {
          setHeroData(data);
          if (data.roles && data.roles.length > 0) {
            setActiveRoles(data.roles);
          }
        }
      });
  }, []);

  // Parallax mouse movements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  // Floating card offsets for distinct parallax depth
  const card1X = useTransform(springX, (x) => x * 0.4);
  const card1Y = useTransform(springY, (y) => y * 0.4);
  const card2X = useTransform(springX, (x) => x * -0.6);
  const card2Y = useTransform(springY, (y) => y * -0.6);
  const card3X = useTransform(springX, (x) => x * 0.8);
  const card3Y = useTransform(springY, (y) => y * 0.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % activeRoles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRoles]);

  useEffect(() => {
    setCurrentRole(activeRoles[roleIndex]);
  }, [roleIndex, activeRoles]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Map mouse position to range of -25px to 25px
    mouseX.set((clientX - width / 2) * 0.05);
    mouseY.set((clientY - height / 2) * 0.05);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const targetPos = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPos,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#050508]"
    >
      {/* Background Gradients and Glowing Mesh Orbs */}
      <div className="absolute inset-0 bg-dot-pattern -z-20 opacity-50 animate-grid-shift" />

      {/* Moving background particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -100, 0],
            x: [0, 30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: "#fff",
            borderRadius: "50%",
            top: p.top,
            left: p.left,
            pointerEvents: "none",
            zIndex: -15,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Dynamic Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.9, 1],
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/10 w-[30rem] h-[30rem] bg-[#8b5cf6] rounded-full blur-[130px] -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 0.85, 1.1, 1],
          x: [0, -90, 60, 0],
          y: [0, 50, -40, 0],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/10 w-[28rem] h-[28rem] bg-[#ec4899] rounded-full blur-[120px] -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 0.95, 1],
          x: [40, -50, 30, 40],
          y: [-50, 40, -30, -50],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-1/3 w-[25rem] h-[25rem] bg-[#06b6d4] rounded-full blur-[110px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10">

        {/* Hero Left Content */}
        <div className="lg:col-span-6 flex flex-col items-start text-left relative">

          {/* Soft radial light behind main content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-neon-purple/5 rounded-full blur-[140px] -z-10 pointer-events-none" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] font-bold uppercase tracking-wider text-neon-blue mb-6 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            {heroData?.badge || "Senior Designer & Creative Director"}
          </motion.div>

          {/* Heading with staggered word blur-to-clear reveals */}
          <motion.h1
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.15,
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white mb-6 leading-[1.08] flex flex-wrap gap-x-3 gap-y-1"
          >
            {(heroData?.name as string || "Nasir Khan").split(" ").map((word: string, idx: number) => (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
            <span className="block w-full mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue leading-[1.15] flex flex-wrap gap-x-3">
              {["UI/UX", "Products"].map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Rotating Role Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="h-8 mb-6 overflow-hidden flex items-center gap-2 text-lg sm:text-xl font-medium text-gray-300"
          >
            <span className="text-gray-500">I am a</span>
            <span className="text-neon-purple font-semibold">
              {currentRole}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl font-light leading-relaxed"
          >
            {heroData?.description || (
              <>
                Hi, I'm <strong className="text-white font-medium">Nasir Khan</strong>. Over the past 10 years, I've designed digital products and immersive CG visual assets at <strong className="text-neon-purple font-medium">Axis Craft</strong>. I bridge the boundary between artistic CGI rendering and functional UX architecture.
              </>
            )}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-4 w-full sm:w-auto items-center"
          >
            <Magnetic>
              <button
                onClick={() => handleScrollTo("projects")}
                className="relative group overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/50 active:scale-[0.98] transition-all duration-300 cursor-pointer w-full sm:w-auto"
              >
                {/* Glowing border highlight */}
                <div className="absolute inset-0 rounded-full border border-white/20 opacity-50 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm -z-10 group-hover:scale-105" />

                <span className="relative z-10 flex items-center gap-2">
                  View Case Studies
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Magnetic>

            <Magnetic>
              <button
                onClick={() => handleScrollTo("contact")}
                className="px-8 py-4 rounded-full border border-white/[0.12] bg-white/[0.02] text-white font-medium flex items-center justify-center gap-2 hover:border-white/30 hover:bg-white/[0.05] active:scale-[0.98] transition-all duration-300 cursor-pointer w-full sm:w-auto"
              >
                Consult Studio
              </button>
            </Magnetic>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-5 mt-12 text-gray-500"
          >
            {(heroData?.social_links || defaultSocialLinks)
              .filter((link: any) => link.visible)
              .map((link: any, idx: number) => (
                <Magnetic key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-300 block p-1"
                  >
                    {renderSocialIcon(link.icon)}
                  </a>
                </Magnetic>
              ))}
          </motion.div>

        </div>

        {/* Hero Right Visuals - Image container & orbiting cards */}
        <div className="lg:col-span-6 relative w-full h-[550px] flex items-center justify-center">

          {/* Radial Glowing Background Aura */}
          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-neon-purple/20 via-neon-pink/10 to-transparent blur-[80px] -z-30 pointer-events-none animate-pulse duration-[8000ms]" />

          {/* Orbiting Rotating Dashed Ring (Outer) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-white/[0.06] flex items-center justify-center pointer-events-none -z-20"
          />

          {/* Orbiting Rotating Glowing Ring (Inner) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full p-[1.5px] bg-gradient-to-r from-neon-purple/20 via-transparent to-neon-blue/20 opacity-80 pointer-events-none -z-20"
          >
            <div className="w-full h-full rounded-full bg-transparent border border-dashed border-white/[0.04]" />
          </motion.div>

          {/* Main Portrait Frame with Parallax and Float */}
          <motion.div
            style={{
              x: springX,
              y: springY,
            }}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-[320px] h-[368px] sm:w-[440px] sm:h-[506px] md:w-[480px] md:h-[552px] flex items-center justify-center"
          >
            {/* Backdrop glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/25 via-neon-blue/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 animate-pulse duration-[6000ms]" />

            {/* Smooth Floating Visual Container */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full relative flex items-center justify-center select-none"
            >
              {!imageError ? (
                <>
                  {/* Subtle soft circular ambient backlight behind silhouette */}
                  <div className="absolute inset-10 rounded-full bg-obsidian-950/40 backdrop-blur-sm -z-10 shadow-2xl" />

                  {/* The Transparent Portrait */}
                  <Image
                    src={heroData?.image_url || "/images/nasir-portrait.png"}
                    alt="Nasir Khan Portrait"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain opacity-95 transition-opacity duration-300 drop-shadow-[0_20px_50px_rgba(200,243,29,0.15)]"
                    onError={() => setImageError(true)}
                    priority
                  />
                </>
              ) : (
                // Beautiful futuristic wireframe fallback if image is not yet loaded
                <div className="w-full h-full relative rounded-3xl border border-white/[0.08] bg-obsidian-900/35 overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neon-purple to-neon-pink p-0.5 animate-spin duration-[8000ms]">
                    <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center text-white text-xs font-black">
                      NK
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="font-display font-semibold text-white text-sm block">Design Engine Model</span>
                    <span className="text-[10px] font-mono text-neon-blue tracking-widest block uppercase animate-pulse">Waiting for Signal...</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-sans max-w-[200px]">
                    Place your transparent portrait PNG file inside <code className="text-gray-400 font-mono text-[9px]">public/images/nasir-portrait.png</code> to load it instantly.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Card 1: Main Figma Layers Card (Floating, parallax layer 1) */}
          {(heroData?.cards_config?.scene_layers?.visible ?? defaultCardsConfig.scene_layers.visible) && (
            <motion.div
              style={{
                x: card1X,
                y: card1Y,
              }}
              className="absolute top-12 left-0 sm:-left-12 z-20"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <SpotlightCard className="w-[180px] p-3.5 border-white/[0.08] shadow-2xl">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] w-full">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-neon-purple/20 flex items-center justify-center text-[8px] text-neon-purple font-bold font-mono">F</div>
                      <span className="text-[9px] font-bold text-white tracking-wide">
                        {heroData?.cards_config?.scene_layers?.title ?? defaultCardsConfig.scene_layers.title}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="space-y-1.5 text-left w-full">
                    <div className="flex items-center justify-between p-1 rounded bg-white/[0.01] border border-white/[0.02] text-[9px] w-full">
                      <span className="text-gray-300 font-medium font-mono">
                        {heroData?.cards_config?.scene_layers?.item1_text ?? defaultCardsConfig.scene_layers.item1_text}
                      </span>
                      <span className="text-[8px] text-neon-blue font-bold tracking-wider bg-neon-blue/15 px-1 py-0.5 rounded">
                        {heroData?.cards_config?.scene_layers?.item1_label ?? defaultCardsConfig.scene_layers.item1_label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 rounded bg-white/[0.01] border border-white/[0.02] text-[9px] w-full">
                      <span className="text-gray-400 font-medium font-mono">
                        {heroData?.cards_config?.scene_layers?.item2_text ?? defaultCardsConfig.scene_layers.item2_text}
                      </span>
                      <span className="text-[8px] text-neon-pink font-bold tracking-wider bg-neon-pink/15 px-1 py-0.5 rounded">
                        {heroData?.cards_config?.scene_layers?.item2_label ?? defaultCardsConfig.scene_layers.item2_label}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          )}

          {/* Card 2: Floating Retention Analytics Chart Card (Floating, parallax layer 2) */}
          {(heroData?.cards_config?.visual_score?.visible ?? defaultCardsConfig.visual_score.visible) && (
            <motion.div
              style={{
                x: card2X,
                y: card2Y,
              }}
              className="absolute top-4 right-0 sm:-right-8 z-20"
            >
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <SpotlightCard className="w-[170px] p-3.5 border-white/[0.08] shadow-xl text-left">
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                    {heroData?.cards_config?.visual_score?.title ?? defaultCardsConfig.visual_score.title}
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-lg font-black font-display text-white leading-none">
                      {heroData?.cards_config?.visual_score?.value ?? heroData?.rating_badge ?? defaultCardsConfig.visual_score.value}
                    </span>
                    <span className="text-[9px] font-bold text-neon-emerald">
                      {heroData?.cards_config?.visual_score?.growth ?? defaultCardsConfig.visual_score.growth}
                    </span>
                  </div>

                  {/* SVG Interactive Line Chart mockup */}
                  <div className="h-8 w-full flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 40">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,40 L0,30 Q25,12 50,22 T100,5 L100,40 Z" fill="url(#chartGlow)" />
                      <path d="M0,30 Q25,12 50,22 T100,5" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                      <circle cx="100" cy="5" r="2.5" fill="#8b5cf6" />
                    </svg>
                  </div>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          )}

          {/* Card 3: Floating Profiler Metrics Card (Floating, parallax layer 3) */}
          {(heroData?.cards_config?.studio?.visible ?? defaultCardsConfig.studio.visible) && (
            <motion.div
              style={{
                x: card3X,
                y: card3Y,
              }}
              className="absolute bottom-10 right-4 sm:-right-6 z-20"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <SpotlightCard className="w-[190px] p-3.5 border-white/[0.08] shadow-xl text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple to-neon-pink p-0.5 flex items-center justify-center shadow-lg">
                      <div className="w-full h-full rounded-full bg-obsidian-900 flex items-center justify-center text-[10px] font-black text-white">
                        {heroData?.name ? heroData.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "NK"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-none">
                        {heroData?.cards_config?.studio?.title ?? defaultCardsConfig.studio.title}
                      </div>
                      <div className="text-[8px] text-gray-500 mt-0.5 font-mono">
                        {heroData?.cards_config?.studio?.badge ?? heroData?.experience_badge ?? defaultCardsConfig.studio.badge}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-center w-full">
                    <div>
                      <div className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">
                        {heroData?.cards_config?.studio?.reviews_label ?? defaultCardsConfig.studio.reviews_label}
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {heroData?.cards_config?.studio?.reviews_value ?? heroData?.rating_badge ?? defaultCardsConfig.studio.reviews_value}
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">
                        {heroData?.cards_config?.studio?.projects_label ?? defaultCardsConfig.studio.projects_label}
                      </div>
                      <div className="text-xs font-bold text-neon-pink mt-0.5">
                        {heroData?.cards_config?.studio?.projects_value ?? heroData?.projects_badge ?? defaultCardsConfig.studio.projects_value}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          )}

        </div>

      </div>

      {/* Custom Mouse Scroll Wheel Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => handleScrollTo("about")}
        className="absolute bottom-6 left-1/2 -translate-x-[50%] flex flex-col items-center gap-2 cursor-pointer z-30 group"
      >
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
          Scroll Down
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/[0.12] group-hover:border-neon-purple/50 flex justify-center p-1.5 transition-colors duration-300">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-neon-purple"
          />
        </div>
      </motion.div>

    </section>
  );
}
