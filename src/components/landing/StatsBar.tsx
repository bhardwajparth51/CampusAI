"use client";

import React from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Minimalist Stats Bar for the landing page.
 * Displays key metrics between Hero and Features.
 */
export const StatsBar = () => {
  return (
    <div className="w-full relative py-8 flex justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-50" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      
      <Reveal delay="0.2s">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 px-6 text-sm md:text-base font-mono font-medium tracking-tight text-white/50 lowercase italic">
          <span className="flex items-center gap-2">
            <span className="text-white/80 not-italic font-bold">1,284</span> resolved
          </span>
          <span className="hidden md:inline text-white/10 select-none">·</span>
          <span className="flex items-center gap-2">
            <span className="text-white/80 not-italic font-bold">94%</span> accuracy
          </span>
          <span className="hidden md:inline text-white/10 select-none">·</span>
          <span className="flex items-center gap-2">
            <span className="text-white/80 not-italic font-bold">18hr</span> resolution
          </span>
        </div>
      </Reveal>
    </div>
  );
};
