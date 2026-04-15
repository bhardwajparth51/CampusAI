"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

// --- Constants & Types ---

interface Complaint {
  id: string | number;
  subject: string;
  category: string;
  priority: string;
  status: string;
  statusColor: string;
}

const PRIORITY_COLORS: Record<string, string> = {
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

const StatusBadge = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
    <span className="text-[12px] font-medium text-gray-300 capitalize">{text.replace('_', ' ')}</span>
  </div>
);

// --- Main ComplaintsTable Component ---

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await api.get("/v1/complaints/");
        // Limit to 4 for the overview
        const formatted = data.slice(0, 4).map((c: any) => ({
          id: `CMP-${c.id}`,
          subject: c.title,
          category: c.category || "Unclassified",
          priority: c.priority || "Medium",
          status: c.status,
          statusColor: STATUS_COLORS[c.status] || "#6b7280",
        }));
        setComplaints(formatted);
      } catch (err) {
        console.warn("ComplaintsTable: Failed to fetch, using simulation", err);
        setComplaints([
          { id: "CMP-1042", subject: "Library Wifi Intermittent", category: "IT Support", priority: "high", status: "in_progress", statusColor: STATUS_COLORS["in_progress"] },
          { id: "CMP-1041", subject: "Canteen Hygiene Report", category: "Facilities", priority: "medium", status: "resolved", statusColor: STATUS_COLORS["resolved"] },
          { id: "CMP-1040", subject: "Water Shortage", category: "Infrastructure", priority: "critical", status: "pending", statusColor: STATUS_COLORS["pending"] },
          { id: "CMP-1039", subject: "Gym AC Repair Request", category: "Maintenance", priority: "low", status: "resolved", statusColor: STATUS_COLORS["resolved"] },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="glass relative flex-[7] overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Top Border Shine */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)" }} 
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">Recent Activity</h3>
          <button className="text-xs font-bold text-blue-500 transition-colors hover:text-blue-400">
            View All
        </button>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto">
        {loading ? (
             <div className="h-40 w-full flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
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
                {complaints.map((row: any) => (
                    <tr 
                    key={row.id} 
                    className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    >
                    <td className="px-2 py-4 text-[12px] font-bold text-blue-500 transition-colors group-hover:text-blue-400">
                        {row.id}
                    </td>
                    <td className="px-2 py-4">
                        <div className="text-[13px] font-semibold text-gray-200 group-hover:text-white transition-colors">
                            {row.subject}
                        </div>
                        <div className="mt-0.5 text-[11px] font-medium text-gray-500">
                            {row.category}
                        </div>
                    </td>
                    <td className="px-2 py-4">
                        <span className={`text-[11px] font-bold uppercase tracking-tight ${PRIORITY_COLORS[row.priority.toLowerCase()] || 'text-gray-500'}`}>
                            {row.priority}
                        </span>
                    </td>
                    <td className="px-2 py-4">
                        <StatusBadge color={row.statusColor} text={row.status} />
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
