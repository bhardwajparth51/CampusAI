"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Constants & Types ---

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
  activeFilter: string;
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

// --- Sub-components ---

const StatusBadge = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-1 w-1 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter capitalize">{text.replace('_', ' ')}</span>
  </div>
);

// --- Main ManagementTable Component ---

export default function ManagementTable({ role, userEmail, activeFilter, onSelectComplaint }: ManagementTableProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || (c.category && c.category.toLowerCase().includes(search.toLowerCase()));
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "critical") return matchesSearch && c.priority.toLowerCase() === "critical";
    if (activeFilter === "pending") return matchesSearch && c.status.toLowerCase() === "pending";
    if (activeFilter === "resolved") return matchesSearch && c.status.toLowerCase() === "resolved";
    return matchesSearch;
  });

  return (
    <div className="glass relative flex flex-col overflow-hidden rounded-[10px] p-6 antialiased mt-6">
      {/* Search Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex flex-col">
              <h3 className="text-[13px] font-black tracking-[0.2em] uppercase text-white/40">Audit Ledger</h3>
              <p className="text-[9px] font-bold text-gray-600 uppercase">Interactive Case Tracking</p>
          </div>
          <div className="relative flex-1 max-w-sm">
            <input 
              type="text" 
              placeholder="Filter by subject or category..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2 text-[11px] font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/30 transition-all uppercase tracking-tight"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
             <div className="flex h-40 w-full items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
             </div>
        ) : filtered.length === 0 ? (
            <div className="flex h-40 w-full flex-col items-center justify-center text-gray-500 gap-2">
                <p className="text-[10px] font-black italic opacity-50 uppercase tracking-widest">Zero results in this scope</p>
            </div>
        ) : (
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["System ID", "Substantive Report", "Risk Level", "Current State", "Created At"].map((h) => (
                      <th key={h} className="px-2 py-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-gray-700">
                          {h}
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filtered.map((row) => (
                  <tr 
                    key={row.id} 
                    className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    onClick={() => onSelectComplaint(row.id)}
                  >
                    <td className="px-2 py-5 text-[10px] font-black text-blue-500/60 uppercase tracking-tight">
                      CMP-{row.id}
                    </td>
                    <td className="px-2 py-5">
                      <div className="text-[12px] font-bold text-gray-300 group-hover:text-white transition-colors">
                        {row.title}
                      </div>
                      <div className="mt-1 text-[9px] font-black text-gray-600 uppercase tracking-wider">
                        {row.category || "Unclassified"}
                      </div>
                    </td>
                    <td className="px-2 py-5">
                      <span className={`text-[10px] font-black uppercase tracking-tight ${PRIORITY_COLORS[row.priority.toLowerCase()] || "text-gray-500"}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-2 py-5">
                      <StatusBadge color={STATUS_COLORS[row.status] || "#6b7280"} text={row.status} />
                    </td>
                    <td className="px-2 py-5">
                        <span className="text-[10px] font-bold text-gray-600 uppercase">
                            {new Date(row.created_at).toLocaleDateString()}
                        </span>
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
