"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Constants & Types ---

interface Complaint {
  id: number;
  title: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  status: string;
}

const PRIORITY_COLORS = {
  critical: "text-rose-500",
  high: "text-orange-400",
  medium: "text-blue-400",
  low: "text-gray-500",
};

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

// --- Sub-components ---

const StatusBadge = ({ status }: { status: string }) => {
  const color = STATUS_COLORS[status] || "#6b7280";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <span className="text-[12px] font-medium text-gray-300 capitalize">{status.replace('_', ' ')}</span>
    </div>
  );
};

// --- Main ComplaintsTable Component ---

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await api.get("/v1/complaints/");
        setComplaints(data);
      } catch (err) {
        console.error("ComplaintsTable: Failed to fetch complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="glass relative flex-[7] overflow-hidden rounded-[10px] p-6 antialiased h-full">
      {/* Top Border Shine */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)" }} 
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">Recent Activity</h3>
        <button className="text-xs font-bold text-blue-500 transition-colors hover:text-blue-400">
          Search All
        </button>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
           <div className="flex h-40 w-full items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
           </div>
        ) : complaints.length === 0 ? (
            <div className="flex h-40 w-full flex-col items-center justify-center text-gray-500 gap-2">
                <p className="text-xs font-medium italic opacity-50 uppercase tracking-widest">No complaints found</p>
            </div>
        ) : (
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Identifier", "Subject", "Priority", "Status"].map((header) => (
                    <th 
                      key={header} 
                      className="px-2 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-gray-500"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {complaints.map((row) => (
                  <tr 
                    key={row.id} 
                    className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
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
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${PRIORITY_COLORS[row.priority as keyof typeof PRIORITY_COLORS] || "text-gray-500"}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-2 py-4">
                      <StatusBadge status={row.status} />
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
