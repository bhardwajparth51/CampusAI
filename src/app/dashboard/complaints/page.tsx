"use client";

export default function ComplaintsPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Complaints</h1>
        <p className="text-gray-500 text-sm">Manage and review student formal complaints</p>
      </div>
      
      <div className="glass rounded-[10px] p-12 flex flex-col items-center justify-center border border-white/[0.05] min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0062FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Complaints Management</h2>
        <p className="text-gray-500 text-center max-w-md">
          This section will house the detailed complaints management system, including filtering, sorting, and priority assignment.
        </p>
      </div>
    </div>
  );
}
