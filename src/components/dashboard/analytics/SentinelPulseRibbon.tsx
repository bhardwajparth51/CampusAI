"use client";

import React from "react";
import { motion } from "framer-motion";

interface PulseProps {
  tension?: number;
  velocity?: "improving" | "stable" | "deteriorating";
  efficiency?: number;
}

const StatCard = ({ label, value, subtext, color, icon, children }: any) => (
  <div 
    className="glass group relative overflow-hidden rounded-[10px] p-5 transition-all hover:bg-white/[0.02]"
    style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)" }}
  >
    <div 
      className="absolute top-0 left-1/2 h-px w-16 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100"
      style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
    />
    <div className="mb-4 flex items-center justify-between">
      <span className="text-[13px] font-medium text-gray-400">{label}</span>
      <div className="relative flex h-2.5 w-2.5 items-center justify-center">
        <div className="animate-ripple absolute inset-0 rounded-full" style={{ background: color }} />
        <div className="relative h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}88` }} />
      </div>
    </div>
    <div className="flex items-baseline gap-2.5">
      <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
      {subtext && (
        <div className={`flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-white/5 ${color === '#ef4444' ? 'text-rose-500' : 'text-emerald-500'}`}>
          {subtext}
        </div>
      )}
    </div>
    {children}
  </div>
);

export default function SentinelPulseRibbon({ tension = 2.4, velocity = "stable", efficiency = 48.5 }: PulseProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Tension Index */}
      <StatCard 
        label="Tension Index" 
        value={`${tension}/10`} 
        subtext={tension > 6 ? "Critical" : "Stable"}
        color={tension > 6 ? "#f43f5e" : "#10b981"}
      >
        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${tension * 10}%` }} 
               className="h-full bg-current" 
               style={{ color: tension > 6 ? "#f43f5e" : "#10b981" }}
            />
        </div>
      </StatCard>

      {/* Sentiment Velocity */}
      <StatCard 
        label="Sentiment Velocity" 
        value={velocity.toUpperCase()} 
        subtext={velocity === "improving" ? "Positive" : "Watching"}
        color={velocity === "improving" ? "#10b981" : "#0062FF"}
      />

      {/* AI Productivity */}
      <StatCard 
        label="AI Productivity" 
        value={`${efficiency}h`} 
        subtext="Saved"
        color="#A855F7"
      />
    </div>
  );
}
