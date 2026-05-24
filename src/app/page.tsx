"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ArrowUp, Terminal } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isIntroLoading, setIsIntroLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroLoading(false);
    }, 1800);

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Dynamic Splash Loading Screen */}
      <AnimatePresence mode="wait">
        {isIntroLoading && (
          <motion.div
            key="splash-loader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-[100] bg-[#050508] flex flex-col items-center justify-center text-white"
          >
            {/* Spinning background glow */}
            <div className="absolute w-[20rem] h-[20rem] bg-neon-purple/10 rounded-full blur-[80px]" />
            
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 120,
              }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Brand Logo badge */}
              <div className="relative w-16 h-16 flex items-center justify-center shadow-2xl shadow-neon-purple/20 p-1 bg-obsidian-950/40 rounded-2xl border border-white/[0.06]">
                <Image
                  src="/logo.png"
                  alt="Nasir Khan Logo"
                  fill
                  sizes="64px"
                  className="object-contain p-1.5 animate-pulse"
                  priority
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display text-lg font-bold tracking-widest uppercase">
                  Nasir Khan
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neon-blue mt-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 animate-pulse" /> BOOTING SYSTEMS...
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Landing App */}
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        
        {/* Glowing global orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-neon-purple/5 to-transparent blur-[120px] -z-20 pointer-events-none" />

        {/* Global Navigation */}
        <Navbar />

        {/* Sections Assemblage */}
        <main className="flex-1 w-full">
          <Hero />
          <About />
          <Skills />
          <Services />
          <Process />
          <Experience />
          <Projects />
          <Testimonials />
          <Contact />
        </main>

        {/* Standalone Premium Footer */}
        <Footer />

        {/* Floating Scroll-To-Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={handleScrollToTop}
              className="fixed bottom-6 right-6 z-40 p-3 rounded-full border border-white/[0.08] bg-obsidian-900/60 backdrop-blur-xl text-gray-400 hover:text-white hover:border-white/20 shadow-lg shadow-black/40 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}


