"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SLAGauge({ value = 82 }: { value?: number }) {
  const getColor = () => {
    if (value >= 90) return "#10b981"; 
    if (value >= 70) return "#3b82f6"; 
    if (value >= 50) return "#f59e0b"; 
    return "#ef4444"; 
  };

  const statusLabel = value >= 90 ? "Optimal" : value >= 75 ? "Excellent" : value >= 50 ? "Stable" : "Improving";

  return (
    <div className="glass group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[10px] p-6 antialiased shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]">
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: `linear-gradient(to right, transparent, ${getColor()}44, transparent)` }} 
      />
      
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-white">SLA Compliance</h3>
        <p className="text-[11px] font-medium text-gray-500 tracking-wider mt-0.5">Resolution Performance</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative translate-y-[-10px]">
        {/* Subtler non-smudgy glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 blur-[100px] rounded-full pointer-events-none opacity-20" 
          style={{ background: getColor() }}
        />
        
        <div className="relative w-full flex items-center justify-center">
            <svg width="220" height="130" viewBox="0 0 200 120" className="overflow-visible">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                
                {/* Track */}
                <path
                    d="M 30,100 A 70,70 0 0,1 170,100"
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="15"
                    strokeLinecap="round"
                />
                
                {/* Progress */}
                <motion.path
                    d="M 30,100 A 70,70 0 0,1 170,100"
                    fill="none"
                    stroke={value < 40 ? "#ef4444" : "url(#gaugeGradient)"}
                    strokeWidth="15"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: Math.min(value / 100, 1) }}
                    transition={{ duration: 2, ease: "circOut" }}
                    filter="url(#crispGlow)"
                />
            </svg>

            {/* Centered Metric Overlay - now correctly inside the arc's enclosure */}
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl font-black text-white tracking-tighter"
                >
                    {Math.round(value)}%
                </motion.div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] mt-1" style={{ color: getColor() }}>
                    {statusLabel}
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-auto flex justify-between px-2 pt-5 border-t border-white/[0.04]">
          <div className="flex flex-col">
             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Avg response</span>
             <span className="text-[16px] font-black text-white">4.2m</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">SLA goal</span>
             <span className="text-[16px] font-black text-emerald-500">95%</span>
          </div>
      </div>
    </div>
  );
}
