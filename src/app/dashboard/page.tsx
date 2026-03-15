"use client";

import React from "react";
import AlertBanner from "@/components/dashboard/shell/AlertBanner";
import StatsRow from "@/components/dashboard/overview/StatsRow";
import TrendChart from "@/components/dashboard/overview/TrendChart";
import StatusDonut from "@/components/dashboard/overview/StatusDonut";
import ComplaintsTable from "@/components/dashboard/overview/ComplaintsTable";
import AIInsightsPanel from "@/components/dashboard/overview/AIInsightsPanel";
import { Reveal } from "@/components/ui/Reveal";

// --- Layout Configuration ---

const DASHBOARD_WIDGETS = [
  { id: "alert", component: AlertBanner, span: "md:col-span-12", delay: "0s" },
  { id: "stats", component: StatsRow, span: "md:col-span-12", delay: "100ms" },
  { id: "chart", component: TrendChart, span: "md:col-span-8 md:row-span-2", delay: "200ms" },
  { id: "donut", component: StatusDonut, span: "md:col-span-4", delay: "300ms" },
  { id: "insights", component: AIInsightsPanel, span: "md:col-span-4 md:row-span-2", delay: "500ms" },
  { id: "table", component: ComplaintsTable, span: "md:col-span-8", delay: "400ms" },
] as const;

/**
 * Main Dashboard Entry Page.
 * Uses a modular grid layout with reveal-on-scroll animations.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 p-1 md:grid-cols-12">
      {DASHBOARD_WIDGETS.map((widget) => (
        <div key={widget.id} className={`${widget.span} h-full`}>
          <Reveal delay={widget.delay} className="h-full">
            <widget.component />
          </Reveal>
        </div>
      ))}
    </div>
  );
}
