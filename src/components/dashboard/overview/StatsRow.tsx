"use client";

import React from "react";

// --- Constants & Types ---

interface StatItem {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: string;
}

const STATS_DATA: StatItem[] = [
  { label: "Total Conflicts", value: "42", trend: "+14%", trendUp: true, color: "#0062FF" },
  { label: "Resolved by AI", value: "82%", trend: "+8%", trendUp: true, color: "#10b981" },
  { label: "Critical Response", value: "4.2m", trend: "-12%", trendUp: true, color: "#6366f1" },
  { label: "Student Sentiment", value: "7.8", trend: "-2%", trendUp: false, color: "#f59e0b" },
];

// --- Sub-components ---

const StatCard = ({ stat }: { stat: StatItem }) => (
  <div 
    className="glass group relative overflow-hidden rounded-[10px] p-5 transition-all hover:bg-white/[0.02]"
    style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)" }}
  >
    {/* Decorative Accent Peak (Top Center) */}
    <div 
      className="absolute top-0 left-1/2 h-px w-16 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100"
      style={{
        background: `linear-gradient(to right, transparent, ${stat.color}, transparent)`
      }}
    />

    {/* Header */}
    <div className="mb-4 flex items-center justify-between">
      <span className="text-[13px] font-medium text-gray-400">{stat.label}</span>
      <div className="relative flex h-2.5 w-2.5 items-center justify-center">
        <div 
          className="animate-ripple absolute inset-0 rounded-full"
          style={{ background: stat.color }} 
        />
        <div 
          className="relative h-2.5 w-2.5 rounded-full"
          style={{ 
            background: stat.color,
            boxShadow: `0 0 12px ${stat.color}88` 
          }} 
        />
      </div>
    </div>

    {/* Value & Trend */}
    <div className="flex items-baseline gap-2.5">
      <span className="text-2xl font-bold tracking-tight text-white">{stat.value}</span>
      <div 
        className={`
          flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold
          ${stat.trendUp 
            ? "bg-green-500/10 text-green-500" 
            : "bg-red-500/10 text-red-500"}
        `}
      >
        {stat.trend}
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function StatsRow() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS_DATA.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
