"use client";

import React from "react";
import { motion } from "framer-motion";

export const StatsBar = () => {
  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mb-20">
      <div className="glass backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-mono tracking-tight text-white/40">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-white font-bold">1,284</span>
          <span>resolved</span>
        </motion.div>
        
        <div className="hidden sm:block w-px h-4 bg-white/10" />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <span className="text-white font-bold">94%</span>
          <span>accuracy</span>
        </motion.div>

        <div className="hidden sm:block w-px h-4 bg-white/10" />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <span className="text-white font-bold">18hr</span>
          <span>resolution</span>
        </motion.div>
      </div>
    </div>
  );
};
