"use client";

import React from "react";
import { useActiveNav } from "@/hooks/useActiveNav";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";

/**
 * Main Landing Page entry point.
 * Orchestrates high-level layout and navigation state via useActiveNav hook.
 */
export default function Home() {
  const { activeIndex, setActiveIndex, glowLineX, navRef, linkRefs } = useActiveNav();

  return (
    <div className="relative min-h-screen w-full max-w-[1440px] mx-auto overflow-hidden text-white antialiased">
      <Navbar 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
        glowLineX={glowLineX} 
        navRef={navRef} 
        linkRefs={linkRefs} 
      />

      <Hero />
    </div>
  );
}
