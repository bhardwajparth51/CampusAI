"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Constants & Types ---

const CATEGORY_COLORS: Record<string, string> = {
  "Network": "#0062FF",
  "Maintenance": "#10b981",
  "Academic": "#6366f1",
  "Hostel": "#f59e0b",
  "Security": "#ef4444",
  "Administrative": "#a78bfa",
  "General": "#6b7280",
  "Unclassified": "#334155"
};

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

// --- Main StatusDonut Component ---

export default function StatusDonut() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await api.get("/v1/analytics/categories");
        setCategories(data);
      } catch (err) {
        console.error("StatusDonut: Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const total = categories.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Visual Accent */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(59, 130, 246, 0.1), transparent)" }} 
      />

      {/* Header */}
      <h3 className="mb-8 text-sm font-semibold tracking-tight text-white md:text-base">Categorization</h3>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col items-center justify-center">
        {loading ? (
             <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
        ) : categories.length === 0 ? (
            <div className="flex flex-col items-center gap-3 opacity-30 px-4 text-center">
               <div className="text-2xl">📦</div>
               <p className="text-[11px] font-bold uppercase tracking-widest text-white italic">
                 Awaiting classification data
               </p>
            </div>
        ) : (
            <div className="w-full space-y-6">
                {/* Simplified List View for categorized data */}
                <div className="space-y-4">
                  {categories.map((item) => (
                    <div key={item.category} className="group/item flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" 
                            style={{ color: CATEGORY_COLORS[item.category] || CATEGORY_COLORS["General"] }} 
                          />
                          <span className="text-xs font-bold text-gray-400 group-hover/item:text-gray-200 transition-colors">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-white/50">{item.percentage}%</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
                        <div 
                           className="h-full rounded-full transition-all duration-1000"
                           style={{ 
                             width: `${item.percentage}%`, 
                             backgroundColor: CATEGORY_COLORS[item.category] || CATEGORY_COLORS["General"] 
                           }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        )}
      </div>

      {/* Footer Info */}
      {categories.length > 0 && !loading && (
        <div className="mt-8 border-t border-white/[0.03] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Distribution</span>
            <span className="text-[13px] font-bold text-white">{total} Items</span>
          </div>
        </div>
      )}
    </div>
  );
}
