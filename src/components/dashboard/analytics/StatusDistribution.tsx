"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatusItem {
  status: string;
  count: number;
  color: string;
}

export default function StatusDistribution({ data = [] }: { data?: StatusItem[] }) {
  const total = data.reduce((acc, s) => acc + s.count, 0);
  const size = 180;
  const strokeWidth = 16;
  const gap = 2; // Degrees gap between segments for sharpness
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]">
      {/* Top Accent Line */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(59, 130, 246, 0.4), transparent)" }} 
      />
      
      <header className="mb-8">
        <h3 className="text-[15px] font-semibold tracking-tight text-white">Status Health</h3>
        <p className="text-[11px] font-medium text-gray-500 tracking-wider mt-0.5">Resolution Lifecycle</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
        {/* Subtle, non-blurry glow */}
        <div className="absolute w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="relative transform -rotate-90">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background Ring */}
            <circle 
              cx={center} cy={center} r={radius} 
              fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} 
            />
            
            {data.map((seg, i) => {
              const sharePercentage = (seg.count / total) * 100;
              const shareDash = (sharePercentage / 100) * circumference;
              
              const startRotation = (currentOffset / total) * 360;
              currentOffset += seg.count;
              
              return (
                <motion.circle 
                  key={seg.status}
                  cx={center} cy={center} r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${shareDash} ${circumference}`}
                  strokeDashoffset={0}
                  strokeLinecap="butt" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                  style={{ 
                    transformOrigin: "center",
                    transform: `rotate(${startRotation}deg)`,
                    filter: `drop-shadow(0 0 4px ${seg.color}33)` 
                  }}
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90 scale-125">
             <motion.span 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-4xl font-black text-white tracking-widest"
             >
                {total}
             </motion.span>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 opacity-60">Cases</span>
          </div>
        </div>
      </div>

      {/* Modern, cleaned-up legend */}
      <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 px-2">
        {data.map((s) => (
          <div key={s.status} className="flex flex-col gap-1 group/item">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}88` }} />
                    <span className="text-[10px] font-bold text-gray-400 group-hover/item:text-gray-200 transition-colors uppercase tracking-tight truncate max-w-[80px]">
                        {s.status.replace(/_/g, ' ')}
                    </span>
                </div>
                <span className="text-[13px] font-black text-white">{s.count}</span>
             </div>
             <div className="h-0.5 w-full bg-white/[0.02] rounded-full overflow-hidden">
                <div className="h-full bg-current opacity-10" style={{ width: `${(s.count / total) * 100}%`, color: s.color }} />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
