"use client";

import Sidebar from "@/components/dashboard/shell/Sidebar";
import Topbar from "@/components/dashboard/shell/Topbar";
import AlertBanner from "@/components/dashboard/shell/AlertBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col h-screen bg-[#000000] overflow-hidden relative"
      style={{
        fontFamily: "'Geist', 'Inter', sans-serif",
        backgroundImage: 'url(/bg-black.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 1. Topbar (Full Width) */}
      <div className="animate-fade-in relative z-30" style={{ '--animation-delay': '0.1s' } as React.CSSProperties}>
        <Topbar />
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* 2. Sidebar - Below Topbar */}
        <div className="hidden md:block animate-fade-in" style={{ '--animation-delay': '0.2s' } as React.CSSProperties}>
          <Sidebar />
        </div>

        {/* 3. Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-[24px_28px] relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
