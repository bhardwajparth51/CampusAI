"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { Github } from "lucide-react";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-zinc-500/5 blur-[160px] -z-10 rounded-full" />
      
      <div className="max-w-4xl mx-auto text-center">
        <Reveal delay="0.1s">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter leading-[1.1]">
            Ready to modernize <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              your campus?
            </span>
          </h2>
        </Reveal>

        <Reveal delay="0.2s">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/signup" className="w-full sm:w-auto">
              <CTAButton className="w-full px-10 py-4 text-lg">
                Get started for free
              </CTAButton>
            </Link>
            
            <a 
              href="https://github.com/bhardwajparth51/CampusAI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-md group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>View on GitHub</span>
            </a>
          </div>
        </Reveal>
        
        <Reveal delay="0.3s">
          <p className="mt-12 text-white/30 text-sm font-mono tracking-widest uppercase">
            Open Source · Community Driven · AI Powered
          </p>
        </Reveal>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};
