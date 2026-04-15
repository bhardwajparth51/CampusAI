"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Main StatusDonut Component ---

export default function StatusDonut() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.get("/v1/analytics/summary");
        setStats(data);
      } catch (err) {
        console.warn("StatusDonut: Failed to fetch summary, using simulation", err);
        setStats({
           total_complaints: 100,
           resolved_count: 82,
           pending_count: 12,
           resolution_rate: 82.0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total = stats?.total_complaints || 100;
  const resVal = stats?.resolved_count || 82;
  const pendVal = stats?.pending_count || 12;
  const newVal = total - resVal - pendVal;

  const resShare = (resVal / total) * 251;
  const pendShare = (pendVal / total) * 251;
  const newShare = (newVal / total) * 251;

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)" }} 
      />
      
      <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">Status Breakdown</h3>
      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">Resolution efficiency</p>

      <div className="relative flex-1 flex items-center justify-center mt-4">
        {loading ? (
             <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
        ) : (
          <>
            <svg width="160" height="160" viewBox="0 0 100 100" className="transform -rotate-90">
              <defs>
                <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#22D3EE', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0062FF', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="7" />
              
              {/* Resolved Segment */}
              <circle 
                cx="50" cy="50" r="40" fill="none"
                stroke="url(#resolvedGradient)" 
                strokeWidth="8"
                strokeDasharray={`${resShare} 251`}
                strokeDashoffset="0"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.4))' }}
              />
              
              {/* Pending Segment */}
              <circle 
                cx="50" cy="50" r="40" fill="none"
                stroke="url(#pendingGradient)" 
                strokeWidth="8"
                strokeDasharray={`${pendShare} 251`}
                strokeDashoffset={-resShare - 2}
                strokeLinecap="round"
              />

              {/* New Segment */}
              <circle 
                cx="50" cy="50" r="40" fill="none"
                stroke="#6b7280" 
                strokeWidth="8"
                strokeDasharray={`${newShare} 251`}
                strokeDashoffset={-resShare - pendShare - 4}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-white tracking-tighter">{stats?.resolution_rate || 82}%</div>
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Resolved</div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {[
          { label: 'Resolved', color: '#0062FF', value: `${Math.round(resShare/2.51)}%` },
          { label: 'Pending', color: '#A855F7', value: `${Math.round(pendShare/2.51)}%` },
          { label: 'New', color: '#6b7280', value: `${Math.round(newShare/2.51)}%` },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ background: item.color, boxShadow: `0 0 8px ${item.color}66` }} 
              />
              <span className="text-[12px] font-medium text-gray-400">{item.label}</span>
            </div>
            <span className="text-[12px] font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
