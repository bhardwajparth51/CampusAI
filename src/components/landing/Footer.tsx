"use client";

import React from "react";
import Link from "next/link";
import { Github, Cpu, Shield, Zap, Globe } from "lucide-react";

const TECH_STACK = [
  { name: "Next.js", icon: <Globe className="w-3 h-3" />, color: "text-white" },
  { name: "Appwrite", icon: <Shield className="w-3 h-3" />, color: "text-pink-500" },
  { name: "Groq", icon: <Cpu className="w-3 h-3" />, color: "text-orange-400" },
  { name: "Framer", icon: <Zap className="w-3 h-3" />, color: "text-purple-400" },
];

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 relative bg-black/20 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold tracking-tight text-lg">CampusAI</span>
          </Link>
          <p className="text-white/30 text-xs font-medium">
            Modernizing campus management with AI.
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {TECH_STACK.map((tech) => (
            <div 
              key={tech.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] uppercase tracking-wider font-mono text-white/40 hover:text-white/60 hover:border-white/10 transition-colors cursor-default"
            >
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/bhardwajparth51/CampusAI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-[11px] text-white/20 font-medium">
            Built by <span className="text-white/40">Parth Bhardwaj</span>
          </p>
        </div>
      </div>

      {/* Subtle bottom absolute glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </footer>
  );
};
