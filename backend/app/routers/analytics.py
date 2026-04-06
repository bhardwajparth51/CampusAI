from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import user as user_models
from ..models import complaint as complaint_models
from ..models.complaint import ComplaintStatus
from ..schemas import analytics as analytics_schemas
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/v1/analytics", tags=["analytics"])

@router.get("/summary", response_model=analytics_schemas.StatsSummary)
def get_stats_summary(db: Session = Depends(get_db)):
    total = db.query(complaint_models.Complaint).count()
    resolved = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.status == ComplaintStatus.RESOLVED).count()
    pending = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.status != ComplaintStatus.RESOLVED).count()
    
    resolution_rate = (resolved / total * 100) if total > 0 else 0
    
    # Calculate avg resolution time (in days)
    # This assumes we have a column for resolution date or using updated_at when status is RESOLVED
    # For now, let's return a placeholder or implement if simplified
    avg_time = 4.2 # Mock for now, will refine
    
    return {
        "total_complaints": total,
        "resolved_count": resolved,
        "pending_count": pending,
        "resolution_rate": round(resolution_rate, 2),
        "avg_resolution_time_days": avg_time
    }

@router.get("/categories", response_model=List[analytics_schemas.CategoryBreakdown])
def get_category_breakdown(db: Session = Depends(get_db)):
    results = db.query(
        complaint_models.Complaint.category,
        func.count(complaint_models.Complaint.id)
    ).group_by(complaint_models.Complaint.category).all()
    
    total = sum(count for category, count in results)
    
    breakdown = []
    for category, count in results:
        percentage = (count / total * 100) if total > 0 else 0
        breakdown.append({
            "category": category or "Unclassified",
            "count": count,
            "percentage": round(percentage, 2)
        })
    
    return breakdown

@router.get("/trends", response_model=List[analytics_schemas.TrendItem])
def get_complaint_trends(db: Session = Depends(get_db)):
    # Get last 7 days of data
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)
    
    # Query for daily counts
    results = db.query(
        func.date(complaint_models.Complaint.created_at).label('day'),
        func.count(complaint_models.Complaint.id)
    ).filter(complaint_models.Complaint.created_at >= start_date) \
     .group_by('day') \
     .order_by('day') \
     .all()
    
    trends = []
    for day, count in results:
        trends.append({
            "date": day.strftime("%Y-%m-%d"),
            "count": count
        })
    
    return trends

@router.get("/insights", response_model=analytics_schemas.AnalyticsDashboard)
def get_ai_insights(db: Session = Depends(get_db)):
    summary = get_stats_summary(db)
    categories = get_category_breakdown(db)
    trends = get_complaint_trends(db)
    
    return {
        "summary": summary,
        "categories": categories,
        "trends": trends
    }
