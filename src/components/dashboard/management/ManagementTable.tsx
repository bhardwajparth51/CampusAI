"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Complaint {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

interface ManagementTableProps {
  role: string;
  userEmail: string;
  onSelectComplaint: (id: number) => void;
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

const PRIORITY_COLORS: Record<string, string> = {
  critical: "text-rose-500",
  high: "text-orange-400",
  medium: "text-blue-400",
  low: "text-gray-500",
};

export default function ManagementTable({ role, userEmail, onSelectComplaint }: ManagementTableProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const endpoint = role === "student" 
          ? `/v1/complaints/me?email=${userEmail}` 
          : "/v1/complaints/";
        
        const data = await api.get(endpoint);
        setComplaints(data);
      } catch (err) {
        console.error("ManagementTable: Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [role, userEmail]);

  const filtered = complaints.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="glass relative flex flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Top Border Shine */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)" }} 
      />

      {/* Header / Search */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">System Backlog</h3>
        <div className="relative flex-1 max-w-xs">
          <input 
            type="text" 
            placeholder="Search reports..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/30 transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
           <div className="flex h-40 w-full items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
           </div>
        ) : filtered.length === 0 ? (
            <div className="flex h-40 w-full flex-col items-center justify-center text-gray-500 gap-2">
                <p className="text-xs font-medium italic opacity-50 uppercase tracking-widest">No matching results</p>
            </div>
        ) : (
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-2 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-gray-500">ID</th>
                  <th className="px-2 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-gray-500">Subject</th>
                  <th className="px-2 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-gray-500">Priority</th>
                  <th className="px-2 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-2 py-3 text-right text-[11px] font-bold uppercase tracking-widest text-gray-500">Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filtered.map((row) => (
                  <tr 
                    key={row.id} 
                    className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    onClick={() => onSelectComplaint(row.id)}
                  >
                    <td className="px-2 py-4 text-[12px] font-bold text-blue-500 transition-colors group-hover:text-blue-400">
                      CMP-{row.id}
                    </td>
                    <td className="px-2 py-4">
                      <div className="text-[13px] font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {row.title}
                      </div>
                      <div className="mt-0.5 text-[11px] font-medium text-gray-500">
                        {row.category || "Unclassified"}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${PRIORITY_COLORS[row.priority] || "text-gray-500"}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-1.5 w-1.5 rounded-full" 
                          style={{ 
                            background: STATUS_COLORS[row.status] || "#6b7280", 
                            boxShadow: `0 0 8px ${STATUS_COLORS[row.status] || "#6b7280"}` 
                          }} 
                        />
                        <span className="text-[12px] font-medium text-gray-300 capitalize">
                          {row.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-right">
                       <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-500 transition-colors uppercase tracking-widest">View Detail</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
