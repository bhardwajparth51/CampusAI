"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

/**
 * Dashboard Preview component with high-end 3D tilt and shadows for the landing page.
 */
export const DashboardPreview = () => (
  <motion.div 
    variants={fadeUp}
    className="relative w-full max-w-5xl mx-auto perspective-1000"
  >
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 12 }}
      transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
      className="relative group"
    >
      {/* Volumetric Glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-[80px] -z-10"
      />

      {/* High-intensity Float Shadow */}
      <div 
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[92%] h-32 bg-black/60 blur-[70px] -z-20 rounded-[100%] pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="relative rounded-2xl border border-white/5 bg-[#0A0A0B]/80 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Subtle glass gloss */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent pointer-events-none" aria-hidden="true" />
        
        <Image
          src="/dashboard.png"
          alt="CampusAI Executive Dashboard Interface"
          width={1920}
          height={1080}
          priority
          className="w-full h-auto object-cover transform scale-[1.005] transition-transform duration-1000 group-hover:scale-100 opacity-95 group-hover:opacity-100"
        />
      </div>
    </motion.div>
  </motion.div>
);
