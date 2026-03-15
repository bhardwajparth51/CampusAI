"use client";

export default function AIInsightsPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Insights</h1>
        <p className="text-gray-500 text-sm">Machine learning driven trend analysis</p>
      </div>
      
      <div className="glass rounded-[10px] p-12 flex flex-col items-center justify-center border border-white/[0.05] min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Sentinel Insights</h2>
        <p className="text-gray-500 text-center max-w-md">
          Proactive AI modeling and predictive insights for upcoming semester challenges and student needs.
        </p>
      </div>
    </div>
  );
}
