"use client";

import React, { useState, useEffect } from "react";
import AlertBanner from "@/components/dashboard/shell/AlertBanner";
import StatsRow from "@/components/dashboard/overview/StatsRow";
import TrendChart from "@/components/dashboard/overview/TrendChart";
import StatusDonut from "@/components/dashboard/overview/StatusDonut";
import ComplaintsTable from "@/components/dashboard/overview/ComplaintsTable";
import AIInsightsPanel from "@/components/dashboard/overview/AIInsightsPanel";
import { Reveal } from "@/components/ui/Reveal";
import { account } from "@/lib/appwrite";
import { api } from "@/lib/api";

// --- Layout Configuration ---

const ALL_WIDGETS = [
  { id: "alert", component: AlertBanner, span: "md:col-span-12", delay: "0s", roles: ["student", "admin", "dispatcher"] },
  { id: "stats", component: StatsRow, span: "md:col-span-12", delay: "100ms", roles: ["admin", "dispatcher"] },
  { id: "chart", component: TrendChart, span: "md:col-span-8 md:row-span-2", delay: "200ms", roles: ["admin"] },
  { id: "donut", component: StatusDonut, span: "md:col-span-4", delay: "300ms", roles: ["admin"] },
  { id: "insights", component: AIInsightsPanel, span: "md:col-span-4 md:row-span-2", delay: "500ms", roles: ["admin"] },
  { id: "table", component: ComplaintsTable, span: "md:col-span-8", delay: "400ms", roles: ["student", "admin", "dispatcher"] },
] as const;

/**
 * Main Dashboard Entry Page.
 * Uses a modular grid layout with reveal-on-scroll animations.
 */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        // 1. Get Appwrite User
        const currentUser = await account.get();
        setUser(currentUser);

        // 2. Sync with Backend Role
        try {
          const dbUser = await api.get(`/v1/users/me?email=${currentUser.email}&name=${encodeURIComponent(currentUser.name)}`);
          setRole(dbUser.role);
          console.log("DashboardPage: Role synced from backend:", dbUser.role);
        } catch (dbErr) {
          console.warn("DashboardPage: Failed to sync role, defaulting to student", dbErr);
          setRole("student");
        }
      } catch (err) {
        console.error("DashboardPage: Auth failed", err);
        window.location.href = "/login?error=unauthenticated";
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Filter widgets based on current role
  const visibleWidgets = ALL_WIDGETS.filter((w: any) => w.roles.includes(role));

  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 p-1 md:grid-cols-12">
      <div className="md:col-span-12 mb-2">
        <Reveal delay="0s">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-blue-400">{user?.name || "User"}</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {role === 'admin' 
              ? "Here's the campus overview for today." 
              : "Track and manage your submitted complaints here."}
          </p>
        </Reveal>
      </div>

      {visibleWidgets.map((widget) => {
        const Component = widget.component;
        return (
          <div key={widget.id} className={`${widget.span} h-full`}>
            <Reveal delay={widget.delay} className="h-full">
              <Component />
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
