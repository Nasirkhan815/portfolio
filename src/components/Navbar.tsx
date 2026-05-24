"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import Image from "next/image";


interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Process", href: "#process" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Reviews", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { scrollY } = useScroll();

  // Scroll visibility threshold
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Scrolled styling
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Dynamic visibility check (hide on scroll down, show on scroll up)
    if (latest > 300 && latest > previous) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  // Highlight active section on scroll
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // triggers when element is roughly in middle of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.href.replace("#", ""));
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const targetEl = document.getElementById(href.replace("#", ""));
    if (targetEl) {
      const navbarHeight = 80;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Magnetic>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => handleNavClick("#home")}
              className="cursor-pointer font-display text-xl font-bold tracking-tight text-white flex items-center gap-2 group"
            >
              <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Nasir Khan Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-display tracking-wide text-white font-bold">Nasir<span className="text-neon-purple">Khan</span></span>
            </motion.div>
          </Magnetic>

          {/* Desktop Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border border-white/[0.06] bg-obsidian-900/40 backdrop-blur-xl transition-all duration-300 ${
              isScrolled ? "shadow-lg shadow-black/30 border-white/[0.08]" : ""
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full cursor-pointer hover:text-white ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 bg-white/[0.07] border border-white/[0.08] shadow-inner rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </button>
              );
            })}
          </motion.nav>

          {/* Desktop Connect Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="hidden md:block"
          >
            <Magnetic>
              <button
                onClick={() => handleNavClick("#contact")}
                className="relative group overflow-hidden px-5 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.02] text-sm font-medium text-white flex items-center gap-1.5 cursor-pointer hover:border-neon-purple/50 transition-colors duration-300"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Let's Talk
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-neon-purple" />
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Magnetic>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-white/[0.08] bg-obsidian-900/50 backdrop-blur-md text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 md:hidden flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-6 text-center">
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`text-2xl font-display font-semibold cursor-pointer ${
                        isActive
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  </motion.div>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navItems.length * 0.05, type: "spring" }}
                className="mt-8 self-center"
              >
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold text-lg shadow-lg shadow-neon-purple/20 cursor-pointer hover:shadow-neon-purple/40 transition-shadow duration-300"
                >
                  Get in Touch
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
