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
  "Cleanliness": "#10b981", 
  "Academic": "#a78bfa",
  "Housing": "#f59e0b",
  "Admin": "#6b7280",
};

// --- Sub-components ---

const PredictionBar = ({ item }: { item: Prediction }) => (
  <div className="group">
    <div className="mb-1.5 flex justify-between">
      <span className="text-xs text-gray-400 transition-colors group-hover:text-gray-300 uppercase font-bold tracking-tight">{item.category}</span>
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
      <p className="text-[12.5px] leading-relaxed text-gray-300 font-bold">{item.text}</p>
      <p className="mt-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.time}</p>
    </div>
  </div>
);

// --- Main AIInsightsPanel Component ---

export default function AIInsightsPanel() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [pulse, setPulse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const data = await api.get("/v1/analytics/insights");
        
        let mapped: Prediction[] = [];
        if (data.categories && data.categories.length > 0) {
          mapped = data.categories.map((c: any) => ({
            category: c.category,
            value: c.percentage,
            color: CATEGORY_COLORS[c.category] || "#6b7280"
          }));
        } else {
           mapped = [
            { category: "Network", value: 82, color: CATEGORY_COLORS["Network"] },
            { category: "Cleanliness", value: 45, color: CATEGORY_COLORS["Cleanliness"] },
            { category: "Academic", value: 60, color: CATEGORY_COLORS["Academic"] },
            { category: "Housing", value: 38, color: CATEGORY_COLORS["Housing"] },
          ];
        }
        setPredictions(mapped.slice(0, 4));

        if (data.anomalies && data.anomalies.length > 0) {
          setAnomalies(data.anomalies.map((a: any) => ({
             icon: a.severity === "high" ? "🔴" : "🟡",
             text: a.message,
             time: "DETECTION LIVE"
          })));
        } else {
          setAnomalies([
            { icon: "🟢", text: "Sentinel: All campus systems operating within normal parameters.", time: "MONITORING" }
          ]);
        }

        setPulse(data.pulse);

      } catch (err) {
        setPredictions([
          { category: "Network", value: 82, color: CATEGORY_COLORS["Network"] },
          { category: "Cleanliness", value: 45, color: CATEGORY_COLORS["Cleanliness"] },
          { category: "Academic", value: 60, color: CATEGORY_COLORS["Academic"] },
          { category: "Housing", value: 38, color: CATEGORY_COLORS["Housing"] },
        ]);
        setAnomalies([
           { icon: "⚪", text: "Awaiting campus activity to begin anomaly detection.", time: "IDLE" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(167, 139, 250, 0.2), transparent)" }} 
      />

      <header className="mb-8 items-center justify-between flex">
        <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/10 text-[11px] text-purple-400">
                ✦
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-[#E8EAF0]">AI Sentinel</h3>
            </div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Predictive Monitoring</p>
        </div>
        {pulse && (
            <div className="text-right">
                <div className={`text-xs font-black tracking-widest uppercase ${pulse.sentiment_velocity === 'deteriorating' ? 'text-red-500' : 'text-green-500'}`}>
                   {pulse.sentiment_velocity}
                </div>
                <div className="text-[9px] font-bold text-gray-500">TENSION: {pulse.tension_score}/10</div>
            </div>
        )}
      </header>

      <section className="mb-8 flex flex-col gap-4">
        {predictions.map((p) => (
          <PredictionBar key={p.category} item={p} />
        ))}
      </section>

      <div className="mb-8 h-px w-full bg-white/5" />

      <section>
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.05em] text-gray-600">
            Anomaly Alerts
            </h4>
            {pulse && (
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{pulse.hours_saved}h SAVED</span>
            )}
        </div>
        <div className="flex flex-col gap-4">
          {anomalies.map((a, i) => (
            <AnomalyItem key={i} item={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
