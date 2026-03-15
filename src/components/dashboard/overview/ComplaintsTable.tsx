"use client";

import React from "react";

// --- Constants & Types ---

interface Complaint {
  id: string;
  subject: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: string;
  statusColor: string;
}

const COMPLAINTS_DATA: Complaint[] = [
  { id: "CMP-1042", subject: "Library Wifi Intermittent", category: "IT Support", priority: "High", status: "In Progress", statusColor: "#2563eb" },
  { id: "CMP-1041", subject: "Canteen Hygiene Report", category: "Facilities", priority: "Medium", status: "Resolved", statusColor: "#10b981" },
  { id: "CMP-1040", subject: "Hostel Water Shortage", category: "Infrastructure", priority: "Critical", status: "New", statusColor: "#ef4444" },
  { id: "CMP-1039", subject: "Gym AC Repair Request", category: "Maintenance", priority: "Low", status: "Resolved", statusColor: "#10b981" },
];

const PRIORITY_COLORS = {
  Critical: "text-rose-500",
  High: "text-orange-400",
  Medium: "text-blue-400",
  Low: "text-gray-500",
};

// --- Sub-components ---

const StatusBadge = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
    <span className="text-[12px] font-medium text-gray-300">{text}</span>
  </div>
);

// --- Main ComplaintsTable Component ---

export default function ComplaintsTable() {
  return (
    <div className="glass relative flex-[7] overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Top Border Shine */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)" }} 
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">Recent Complaints</h3>
        <button className="text-xs font-bold text-blue-500 transition-colors hover:text-blue-400">
          View All
        </button>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto">
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
            {COMPLAINTS_DATA.map((row) => (
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
                  <span className={`text-[11px] font-bold uppercase tracking-tight ${PRIORITY_COLORS[row.priority]}`}>
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
      </div>
    </div>
  );
}
