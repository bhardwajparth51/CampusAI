"use client";

import React from "react";
import { motion } from "framer-motion";

interface HourlyItem {
  hour: number;
  count: number;
}

export default function HourlyActivityChart({ data }: { data: HourlyItem[] }) {
  const maxVal = Math.max(...data.map(d => d.count), 1);
  
  // Create a full 24h array if data is sparse
  const fullData = Array.from({ length: 24 }, (_, i) => {
    const found = data.find(d => d.hour === i);
    return { hour: i, count: found ? found.count : 0 };
  });

  return (
    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased mt-6"
      style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)" }}>
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(0, 153, 255, 0.3), transparent)" }} 
      />
      
      <header className="mb-8 items-center justify-between flex">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Temporal Activity</h3>
          <p className="text-[11px] font-medium text-gray-500 tracking-wider mt-0.5">Peak Reporting Hours</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1.5 border border-blue-500/20">
            <div className="h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" />
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Detection</span>
        </div>
      </header>

      <div className="flex-1 flex items-end justify-between gap-1 px-2 pb-2 min-h-[160px]">
        {fullData.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-3 group/bar">
            <div className="relative w-full flex flex-col items-center justify-end h-32">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(item.count / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.02 }}
                className="w-full rounded-t-[2px] bg-gradient-to-t from-[#0062FF]/10 to-[#A855F7]/60 group-hover/bar:to-[#06B6D4] group-hover/bar:shadow-[0_0_20px_#06B6D466] transition-all" 
              />
              {item.count > 0 && (
                <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-all bg-[#0A0A0B] border border-white/10 px-1.5 py-0.5 rounded text-[9px] text-white font-bold">
                    {item.count}
                </div>
              )}
            </div>
            <span className={`text-[8px] font-bold uppercase transition-colors ${item.hour % 4 === 0 ? 'text-gray-500' : 'text-gray-800'} group-hover/bar:text-blue-400`}>
              {item.hour}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
