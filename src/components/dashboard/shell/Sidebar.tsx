"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/Icons";

// --- Navigation Metadata ---

const NAV_ITEMS = [
  { icon: Icons.Dashboard, label: "Overview", href: "/dashboard" },
  { icon: Icons.Complaints, label: "Complaints", href: "/dashboard/complaints" },
  { icon: Icons.Analytics, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Icons.Sparkles, label: "AI Insights", href: "/dashboard/ai-insights" },
  { icon: Icons.FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: Icons.Bell, label: "Alerts", href: "/dashboard/alerts" },
] as const;

const FOOTER_ITEMS = [
  { icon: Icons.Settings, label: "Settings", href: "/dashboard/settings" },
] as const;

// --- Sub-components ---

interface NavLinkProps {
  item: typeof NAV_ITEMS[number] | typeof FOOTER_ITEMS[number];
  isActive: boolean;
}

const NavLink = ({ item, isActive }: NavLinkProps) => (
  <Link
    href={item.href}
    className={`
      group relative flex h-10 w-full items-center gap-3 px-3 transition-all duration-200
      ${isActive 
        ? "bg-white/[0.08] text-white shadow-sm" 
        : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"}
    `}
    style={{
      borderLeft: isActive ? "3px solid #0062FF" : "3px solid transparent",
      borderRadius: isActive ? "0 8px 8px 0" : "8px",
    }}
  >
    <span className={`transition-colors ${isActive ? "text-blue-500" : "group-hover:text-gray-300"}`}>
      <item.icon className="h-[18px] w-[18px]" />
    </span>
    <span className="text-[13.5px] font-medium tracking-tight">
      {item.label}
    </span>
  </Link>
);

// --- Main Sidebar Component ---

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="glass sticky top-0 z-20 flex h-full w-[240px] shrink-0 flex-col border-r border-white/[0.05] py-6"
      aria-label="Sidebar navigation"
    >
      {/* Top Section: Main Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink 
            key={item.label} 
            item={item} 
            isActive={pathname === item.href} 
          />
        ))}
      </nav>

      {/* Bottom Section: Support & Settings */}
      <div className="mt-auto border-t border-white/[0.05] px-3 pt-4">
        {FOOTER_ITEMS.map((item) => (
          <NavLink 
            key={item.label} 
            item={item} 
            isActive={pathname === item.href} 
          />
        ))}
      </div>
    </aside>
  );
}
