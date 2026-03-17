"use client";

import React from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Process", href: "#process" },
  { name: "GitHub", href: "https://github.com/bhardwajparth51/CampusAI", external: true }
] as const;

const GLOW_LINE_WIDTH = 259;

interface NavbarProps {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  glowLineX: number;
  navRef: React.RefObject<any>;
  linkRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
}

/**
 * Responsive Navigation component with animated glow line for the landing page.
 */
export const Navbar = ({ 
  activeIndex, 
  setActiveIndex, 
  glowLineX, 
  navRef, 
  linkRefs 
}: NavbarProps) => {
  const handleNavClick = (e: React.MouseEvent, index: number, isExternal?: boolean) => {
    if (isExternal) return;
    e.preventDefault();
    setActiveIndex(index);
    const href = NAV_LINKS[index].href;
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4"
    >
      <nav
        ref={navRef}
        className="flex items-center justify-between rounded-[0.625rem] px-8 py-3 relative overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: "#17191C",
          border: "1px solid transparent",
          backgroundImage: "linear-gradient(#17191C, #17191C), linear-gradient(to bottom, rgba(55, 57, 60, 0.4), rgba(55, 57, 60, 0))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "0px 1px 4px 0px rgba(38, 40, 46, 0.4)"
        }}
        aria-label="Primary navigation"
      >
        {/* Animated Active Indicator */}
        <motion.div
          className="absolute top-0 h-[1px] pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: glowLineX }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ width: GLOW_LINE_WIDTH, zIndex: 10 }}
        />

        <Link href="/" className="text-base font-normal text-white font-mono select-none tracking-tight">CampusAI ®</Link>
        
        <ul className="hidden gap-10 text-sm font-normal tracking-wide sm:flex relative" role="list">
          {NAV_LINKS.map((link, index) => (
            <li key={link.name}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                ref={el => { linkRefs.current[index] = el; }}
                onClick={(e) => handleNavClick(e, index, link.external)}
                className={`relative py-1 transition-colors duration-200 hover:text-white ${activeIndex === index ? "text-white" : "text-white/60"}`}
                aria-current={activeIndex === index ? "page" : undefined}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <CTAButton>Sign Up Now</CTAButton>
      </nav>
    </motion.header>
  );
};
