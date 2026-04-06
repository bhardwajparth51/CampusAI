"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Constants & Types ---

interface Prediction {
  category: string;
  value: number;
  color: string;
}

interface Anomaly {
  icon: string;
  text: string;
  time: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Network": "#0062FF",
  "Maintenance": "#10b981",
  "Academic": "#6366f1",
  "Hostel": "#f59e0b",
  "Security": "#ef4444",
  "Administrative": "#a78bfa",
};

// --- Sub-components ---

const PredictionBar = ({ item }: { item: Prediction }) => (
  <div className="group">
    <div className="mb-1.5 flex justify-between">
      <span className="text-xs text-gray-400 transition-colors group-hover:text-gray-300">{item.category}</span>
      <span className="text-xs font-bold text-[#E8EAF0]">{item.value}%</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full rounded-full opacity-80 transition-all duration-1000 group-hover:opacity-100"
        style={{ width: `${item.value}%`, background: item.color }}
      />
    </div>
  </div>
);

const AnomalyItem = ({ item }: { item: Anomaly }) => (
  <div className="flex gap-3 items-start p-1 rounded-lg transition-colors hover:bg-white/[0.02]">
    <span className="mt-1 text-[10px] grayscale-[0.2]" aria-hidden="true">{item.icon}</span>
    <div className="flex-1">
      <p className="text-[12.5px] leading-relaxed text-gray-300">{item.text}</p>
      <p className="mt-0.5 text-[10px] font-medium text-gray-500">{item.time}</p>
    </div>
  </div>
);

// --- Main AIInsightsPanel Component ---

export default function AIInsightsPanel() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const data = await api.get("/v1/analytics/insights");
        
        // Map real categories to predictions
        const mapped = data.categories.map((c: any) => ({
          category: c.category,
          value: c.percentage,
          color: CATEGORY_COLORS[c.category] || "#6b7280"
        }));
        setPredictions(mapped);

        // Generate semi-dynamic anomalies based on total count
        if (data.summary.total_complaints > 0) {
           setAnomalies([
             { icon: "🟢", text: `System successfully processed ${data.summary.total_complaints} reports.`, time: "Live" },
             { icon: "🔵", text: `${data.summary.resolution_rate}% of issues have been cleared.`, time: "Weekly" }
           ]);
        } else {
           setAnomalies([
             { icon: "⚪", text: "Awaiting campus activity to begin anomaly detection.", time: "IDLE" }
           ]);
        }

      } catch (err) {
        console.error("AIInsightsPanel: Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Visual Accent */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(167, 139, 250, 0.2), transparent)" }} 
      />

      {/* Header */}
      <header className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/10 text-[11px] text-purple-400">
            ✦
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-[#E8EAF0]">AI Sentinel</h3>
        </div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Live anomaly monitoring</p>
      </header>

      {/* Predictions Section */}
      <section className="mb-8 flex flex-col gap-4">
        {loading ? (
             <div className="h-40 w-full flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
             </div>
        ) : predictions.length === 0 ? (
            <div className="text-[11px] text-gray-600 italic">No category data available yet.</div>
        ) : (
            predictions.map((p) => (
                <PredictionBar key={p.category} item={p} />
            ))
        )}
      </section>

      {/* Vertical Divider */}
      <div className="mb-8 h-px w-full bg-white/5" />

      {/* Anomalies Section */}
      <section>
        <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.05em] text-gray-600">
          Smart Alerts
        </h4>
        <div className="flex flex-col gap-4">
          {anomalies.map((a, i) => (
            <AnomalyItem key={i} item={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
