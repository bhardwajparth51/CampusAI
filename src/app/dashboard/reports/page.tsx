"use client";

export default function ReportsPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
        <p className="text-gray-500 text-sm">Exportable documentation and audits</p>
      </div>
      
      <div className="glass rounded-[10px] p-12 flex flex-col items-center justify-center border border-white/[0.05] min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Automated Reporting</h2>
        <p className="text-gray-500 text-center max-w-md">
          Generate PDF and CSV reports for administrative review, compliance audits, and stakeholder updates.
        </p>
      </div>
    </div>
  );
}
