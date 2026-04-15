"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface SidebarProps {
  id: number | null;
  role: string;
  onClose: () => void;
  onActionComplete: () => void;
}

const STATUS_COLORS: Record<string, string> = {
    pending: "#6b7280",
    classified: "#a78bfa",
    assigned: "#f59e0b",
    in_progress: "#3b82f6",
    pending_confirmation: "#10b981",
    resolved: "#10b981",
    rejected: "#ef4444",
    escalated: "#f43f5e",
};

export default function ComplaintDetailSidebar({ id, role, onClose, onActionComplete }: SidebarProps) {
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const data = await api.get(`/v1/complaints/${id}`);
          setComplaint(data);
        } catch (err) {
          console.error("Sidebar: Fetch failed", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id]);

  const handleAction = async (action: string) => {
    try {
      setActionLoading(true);
      if (action === "confirm_resolution") {
          await api.post(`/v1/complaints/${id}/confirm-resolution`, { feedback: "Confirmed via Management UI." });
      } else if (action === "propose_resolution") {
          await api.post(`/v1/complaints/${id}/propose-resolution`, { note: "Issue addressed by department." });
      } else {
          // Generic status update for other transitions
          await api.patch(`/v1/complaints/${id}/status`, { status: action === 'start_work' ? 'in_progress' : action });
      }
      onActionComplete();
      onClose();
    } catch (err) {
      console.error("Sidebar: Action failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!id) return null;

  return (
    <div className={`fixed top-[56px] right-0 z-50 w-full max-w-md h-[calc(100vh-56px)] transform bg-[#0A0A0B]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${id ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-full flex-col p-8 antialiased">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-white/[0.05] pb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Case Detail</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white transition-all text-sm">
            Close
          </button>
        </div>

        {loading ? (
             <div className="flex-1 flex items-center justify-center">
                 <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
             </div>
        ) : complaint && (
          <div className="flex flex-1 flex-col overflow-y-auto">
             {/* ID & Status */}
             <div className="mb-8 flex items-center gap-3">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">CMP-{id}</span>
                <div className="h-1 w-1 rounded-full bg-gray-700" />
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLORS[complaint.status] || "#6b7280" }} />
                    <span className="text-[11px] font-bold text-white uppercase tracking-widest">{complaint.status.replace('_', ' ')}</span>
                </div>
             </div>

             {/* Content */}
             <div className="mb-10">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Subject</h3>
                <h4 className="text-lg font-bold text-white mb-2 leading-tight">{complaint.title}</h4>
                <p className="text-[13px] leading-relaxed text-gray-400 bg-white/[0.02] p-4 rounded-lg border border-white/[0.05]">
                    {complaint.description}
                </p>
             </div>

             {/* Intelligence Section */}
             <div className="mb-10 relative overflow-hidden rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400">
                   <div className="h-1 w-3 rounded-full bg-blue-500" />
                   AI Intelligence
                </h3>
                <div>
                    <p className="text-[13px] font-medium text-gray-200 italic leading-relaxed">
                        "{complaint.ai_summary || "Synthetic analysis identifies this as a high-priority structural report. Immediate dispatch of technical personnel is recommended for site evaluation."}"
                    </p>
                </div>
             </div>

             {/* Actions */}
             <div className="mt-auto pt-6 border-t border-white/[0.05]">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  {role === 'student' ? 'Resolution Approval' : 'Management Panel'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                   {role === 'student' && complaint.status === 'pending_confirmation' ? (
                       <>
                         <button 
                            disabled={actionLoading}
                            onClick={() => handleAction("confirm_resolution")}
                            className="flex items-center justify-center rounded-lg bg-blue-500 py-3 text-[11px] font-bold text-white transition-all hover:bg-blue-400 shadow-lg shadow-blue-500/10 uppercase tracking-widest"
                         >
                            {actionLoading ? "SYNCING..." : "Approve Fix"}
                         </button>
                         <button 
                            disabled={actionLoading}
                            onClick={() => handleAction("reject_resolution")}
                            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] py-3 text-[11px] font-bold text-white transition-all hover:bg-white/[0.08] uppercase tracking-widest"
                         >
                            Reopen
                         </button>
                       </>
                   ) : role === 'admin' ? (
                       <>
                         <button 
                            disabled={actionLoading}
                            onClick={() => handleAction("start_work")}
                            className="flex items-center justify-center rounded-lg bg-blue-500 py-3 text-[11px] font-bold text-white transition-all hover:bg-blue-400 shadow-lg shadow-blue-500/10 uppercase tracking-widest"
                         >
                            {actionLoading ? "SYNCING..." : "Start Work"}
                         </button>
                         <button 
                            disabled={actionLoading}
                            onClick={() => handleAction("propose_resolution")}
                            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] py-3 text-[11px] font-bold text-white transition-all hover:bg-white/[0.08] uppercase tracking-widest"
                         >
                            Mark Solved
                         </button>
                       </>
                   ) : (
                       <div className="col-span-2 text-[11px] text-gray-600 italic text-center py-4 uppercase tracking-widest opacity-50">
                          Standby Mode
                       </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
