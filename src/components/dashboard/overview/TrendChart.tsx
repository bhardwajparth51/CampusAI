"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Main TrendChart Component ---

export default function TrendChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const trends = await api.get("/v1/analytics/trends");
        // Reformat for the chart: Ensure we have at least 7 days shown
        const formatted = trends.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
          complaints: item.count
        }));
        setData(formatted);
      } catch (err) {
        console.error("TrendChart: Failed to fetch trends", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const maxVal = Math.max(...data.map(d => d.complaints), 5);

  return (
    <div className="glass relative flex h-[340px] flex-[8] flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">System Activity</h3>
          <p className="mt-0.5 text-[12px] font-medium text-gray-500">Complaint volume over the last 7 days</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md bg-white/[0.03] px-2.5 py-1.5 border border-white/[0.05]">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-tight">Live Volume</span>
          </div>
        </div>
      </header>

      {/* Chart Area */}
      <div className="flex-1 w-full relative">
        {loading ? (
             <div className="flex h-full w-full items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
             </div>
        ) : data.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-gray-500 gap-2">
                <div className="text-[20px] opacity-20">📊</div>
                <p className="text-[11px] font-medium italic opacity-50 uppercase tracking-widest text-center px-8">
                  No activity reported in the last 7 days
                </p>
            </div>
        ) : (
            <div className="h-full w-full flex items-end justify-between gap-3 px-2 pb-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                        <div className="relative w-full flex flex-col items-center justify-end h-40">
                           <div 
                             className="w-[85%] max-w-[32px] rounded-t-[4px] bg-gradient-to-t from-blue-600/10 to-blue-500/60 transition-all duration-500 group-hover:to-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                             style={{ height: `${(item.complaints / maxVal) * 100}%` }}
                           />
                           <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 bg-[#0A0A0B] border border-white/10 px-2 py-1 rounded-md text-[10px] text-white font-bold shadow-xl">
                              {item.complaints}
                           </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter transition-colors group-hover:text-blue-400">
                           {item.name}
                        </span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
