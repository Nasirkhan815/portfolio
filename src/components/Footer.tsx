"use client";

import { Cpu, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full py-12 border-t border-white/[0.05] bg-obsidian-900/50 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Left side info */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleScrollToTop}
            className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center cursor-pointer hover:bg-white/[0.06] transition-colors relative p-1.5"
          >
            <Image
              src="/logo.png"
              alt="Nasir Khan Logo"
              fill
              sizes="32px"
              className="object-contain p-1"
            />
          </button>
          <div>
            <p className="text-sm font-bold text-white leading-none">Nasir Khan</p>
            <p className="text-[11px] font-mono text-gray-500 flex items-center gap-1 mt-1">
              <Cpu className="w-3.5 h-3.5 text-neon-blue" /> artixor.com | UI/UX & CG Art
            </p>
          </div>
        </div>

        {/* Middle Nav tags */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 font-medium">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Right side credits */}
        <p className="text-xs text-gray-600 flex items-center gap-1 justify-center md:justify-end">
          © {new Date().getFullYear()} Nasir Khan. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> & Next.js
        </p>

      </div>
    </footer>
  );
}
