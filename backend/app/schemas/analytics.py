from pydantic import BaseModel
from typing import List, Dict

class StatsSummary(BaseModel):
    total_complaints: int
    resolved_count: int
    pending_count: int
    resolution_rate: float
    avg_resolution_time_days: float

class CategoryBreakdown(BaseModel):
    category: str
    count: int
    percentage: float

class TrendItem(BaseModel):
    date: str
    count: int

class HourlyActivity(BaseModel):
    hour: int
    count: int

class StatusBreakdownItem(BaseModel):
    status: str
    count: int
    color: str

class AnomalyAlert(BaseModel):
    category: str
    spike_percentage: float
    severity: str # low, medium, high
    message: str

class SentinelPulse(BaseModel):
    tension_score: float # 0.0 to 10.0
    sentiment_velocity: str # improving, stable, deteriorating
    hours_saved: float

class AnalyticsDashboard(BaseModel):
    summary: StatsSummary
    categories: List[CategoryBreakdown]
    trends: List[TrendItem]
    hourly_activity: List[HourlyActivity]
    status_distribution: List[StatusBreakdownItem]
    anomalies: List[AnomalyAlert]
    pulse: SentinelPulse
