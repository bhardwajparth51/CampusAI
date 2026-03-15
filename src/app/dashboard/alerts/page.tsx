"use client";

export default function AlertsPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Alerts</h1>
        <p className="text-gray-500 text-sm">Real-time notification management</p>
      </div>
      
      <div className="glass rounded-[10px] p-12 flex flex-col items-center justify-center border border-white/[0.05] min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">System Alerts</h2>
        <p className="text-gray-500 text-center max-w-md">
          Monitor active high-priority alerts and configure notification triggers for administrative responders.
        </p>
      </div>
    </div>
  );
}
