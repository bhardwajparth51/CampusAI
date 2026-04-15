"use client";

import React, { useState, useEffect } from "react";
import HourlyActivityChart from "@/components/dashboard/analytics/HourlyActivityChart";
import StatusDistribution from "@/components/dashboard/analytics/StatusDistribution";
import SLAGauge from "@/components/dashboard/analytics/SLAGauge";
import CategoryLeaderboard from "@/components/dashboard/analytics/CategoryLeaderboard";
import SentinelPulseRibbon from "@/components/dashboard/analytics/SentinelPulseRibbon";
import { Reveal } from "@/components/ui/Reveal";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const insights = await api.get("/v1/analytics/insights");
        setData(insights);
      } catch (err) {
        console.error("AnalyticsPage: Failed to fetch", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 p-1 md:grid-cols-12 relative overflow-hidden">
      
      {/* Optimized Sharp Background - low opacity avoid blur-smudging */}
      <div className="absolute -top-24 left-1/4 w-[800px] h-[800px] bg-blue-600/[0.03] blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-[600px] h-[600px] bg-purple-600/[0.03] blur-[120px] -z-10 pointer-events-none" />

      {/* Header Row */}
      <div className="md:col-span-12 mb-4">
        <Reveal delay="0s">
          <h2 className="text-2xl font-bold text-white">
            Performance Analytics
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Deep-dive metrics and departmental audit.
          </p>
        </Reveal>
      </div>

      {/* Sentinel Pulse Ribbon */}
      <div className="md:col-span-12">
        <Reveal delay="100ms">
            <SentinelPulseRibbon 
              tension={data?.pulse?.tension_score ?? 2.4} 
              velocity={data?.pulse?.sentiment_velocity ?? "stable"}
              efficiency={data?.pulse?.hours_saved ?? 0}
            />
        </Reveal>
      </div>

      {/* Main Analytics Row - Crisp Cards */}
      <div className="md:col-span-4 h-full">
        <Reveal delay="200ms" className="h-full">
          <SLAGauge value={data?.summary?.resolution_rate ?? 0} />
        </Reveal>
      </div>

      <div className="md:col-span-4 h-full">
        <Reveal delay="300ms" className="h-full">
          <StatusDistribution data={data?.status_distribution ?? []} />
        </Reveal>
      </div>

      <div className="md:col-span-4 h-full">
        <Reveal delay="400ms" className="h-full">
          <CategoryLeaderboard data={data?.categories ?? []} />
        </Reveal>
      </div>

      {/* Temporal Analysis Row */}
      <div className="md:col-span-12 mt-4">
        <Reveal delay="500ms">
          <HourlyActivityChart data={data?.hourly_activity ?? []} />
        </Reveal>
      </div>

    </div>
  );
}
