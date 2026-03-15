/**
 * Shared Type Definitions for CampusAI
 */

export interface Complaint {
  id: string;
  subject: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: string;
  statusColor: string;
}

export interface Prediction {
  category: string;
  value: number;
  color: string;
}

export interface Anomaly {
  icon: string;
  text: string;
  time: string;
}

export interface StatItem {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: string;
}
