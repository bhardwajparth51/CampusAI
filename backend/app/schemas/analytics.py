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

class AnalyticsDashboard(BaseModel):
    summary: StatsSummary
    categories: List[CategoryBreakdown]
    trends: List[TrendItem]
