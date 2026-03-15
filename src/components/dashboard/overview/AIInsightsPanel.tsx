"use client";

import React from "react";

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

const PREDICTIONS: Prediction[] = [
  { category: "Network", value: 82, color: "#0062FF" },
  { category: "Cleanliness", value: 45, color: "#6ee7b7" },
  { category: "Academic", value: 60, color: "#a78bfa" },
  { category: "Hostel", value: 38, color: "#f59e0b" },
  { category: "Admin", value: 22, color: "#6b7280" },
];

const ANOMALIES: Anomaly[] = [
  { icon: "🔴", text: "Network complaints up 340% in Block C", time: "2h ago" },
  { icon: "🟡", text: "Hostel cleanliness reports rising since Monday", time: "1d ago" },
  { icon: "🟢", text: "Academic issues resolved 40% faster this week", time: "2d ago" },
];

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
          <h3 className="text-sm font-semibold tracking-tight text-[#E8EAF0]">AI Insights</h3>
        </div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Next-week predictions</p>
      </header>

      {/* Predictions Section */}
      <section className="mb-8 flex flex-col gap-4">
        {PREDICTIONS.map((p) => (
          <PredictionBar key={p.category} item={p} />
        ))}
      </section>

      {/* Vertical Divider */}
      <div className="mb-8 h-px w-full bg-white/5" />

      {/* Anomalies Section */}
      <section>
        <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.05em] text-gray-600">
          Anomaly Alerts
        </h4>
        <div className="flex flex-col gap-4">
          {ANOMALIES.map((a, i) => (
            <AnomalyItem key={i} item={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
