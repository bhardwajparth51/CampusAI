"use client";

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-gray-500 text-sm">Deep dive into campus performance data</p>
      </div>
      
      <div className="glass rounded-[10px] p-12 flex flex-col items-center justify-center border border-white/[0.05] min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h2>
        <p className="text-gray-500 text-center max-w-md">
          Explore complex data patterns, student satisfaction trends, and resolution velocity metrics in this view.
        </p>
      </div>
    </div>
  );
}
