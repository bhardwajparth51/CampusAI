"use client";

import React from "react";
import { motion } from "framer-motion";

interface CategoryItem {
  category: string;
  count: number;
  percentage: number;
  trend?: "up" | "down" | "stable";
}

export default function CategoryLeaderboard({ data = [] }: { data?: CategoryItem[] }) {
  const displayData = data;
  const isDemo = false;
  
  // Sort by count descending
  const sorted = [...displayData].sort((a, b) => b.count - a.count);

  return (
    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]">
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent)" }} 
      />
      
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Departmental Impact</h3>
          <p className="text-[11px] font-medium text-gray-500 tracking-wider mt-0.5">High-Pressure Categories</p>
        </div>
        {isDemo && (
          <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-white/50 tracking-widest uppercase">Demo</span>
        )}
      </header>

      <div className="flex-1 flex flex-col gap-5">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-600 text-[10px] uppercase font-black tracking-widest italic py-10">
            Awaiting Data...
          </div>
        ) : (
          sorted.map((item, i) => (
            <motion.div 
              key={item.category} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col gap-2 group/item"
            >
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-700 w-4 tracking-tighter">#{i+1}</span>
                    <span className="text-[13px] font-bold text-gray-300 group-hover/item:text-white transition-colors capitalize">{item.category}</span>
                    {item.trend === "up" && <span className="text-[10px] text-rose-500 animate-pulse">▲</span>}
                    {item.trend === "down" && <span className="text-[10px] text-emerald-500">▼</span>}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-black tracking-widest text-blue-500">{item.count}</span>
                    <span className="text-[9px] font-bold text-gray-600 uppercase">Cases</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1.2, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] relative z-10" 
                />
                <div className="absolute inset-0 bg-white/5" />
              </div>
            </motion.div>
          )
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/[0.03]">
          <p className="text-[9px] font-bold text-gray-600 italic uppercase tracking-widest text-center">Top pressure points identified by Sentinel</p>
      </div>
    </div>
  );
}
