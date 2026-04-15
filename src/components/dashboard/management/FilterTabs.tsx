"use client";

import React from "react";

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "all", label: "All Cases", color: "transparent" },
  { id: "critical", label: "Critical", color: "#F43F5E" },
  { id: "pending", label: "Pending", color: "#F59E0B" },
  { id: "resolved", label: "Resolved", color: "#10B981" },
];

export default function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1.5 border border-white/5 shadow-2xl">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative flex items-center gap-2.5 px-4 py-2 text-[11px] font-bold tracking-wider transition-all duration-300
            ${activeTab === tab.id 
              ? "bg-[#0062FF] text-white rounded-[10px] shadow-[0_0_20px_rgba(0,98,255,0.4)]" 
              : "text-gray-500 hover:text-gray-300"}
          `}
        >
          {tab.id !== "all" && (
            <div 
              className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all ${activeTab === tab.id ? "bg-white scale-75" : ""}`}
              style={{ 
                backgroundColor: activeTab === tab.id ? "white" : tab.color 
              }} 
            />
          )}
          
          <span className="relative z-10">{tab.label}</span>
          
          {activeTab === tab.id && (
            <div className="absolute -bottom-1.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-white/20 blur-[1px] animate-pulse-soft" />
          )}

          {/* Inner Gloss for Active Tab to match CTAButton feel */}
          {activeTab === tab.id && (
            <div className="absolute inset-0 rounded-[10px] pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-white/30" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
