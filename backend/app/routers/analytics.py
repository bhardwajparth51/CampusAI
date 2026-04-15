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
        func.strftime('%Y-%m-%d', complaint_models.Complaint.created_at).label('day'),
        func.count(complaint_models.Complaint.id)
    ).filter(complaint_models.Complaint.created_at >= start_date) \
     .group_by('day') \
     .order_by('day') \
     .all()
    
    trends = []
    for day_str, count in results:
        trends.append({
            "date": day_str,
            "count": count
        })
    
    return trends

@router.get("/insights", response_model=analytics_schemas.AnalyticsDashboard)
def get_ai_insights(db: Session = Depends(get_db)):
    summary = get_stats_summary(db)
    categories = get_category_breakdown(db)
    trends = get_complaint_trends(db)
    
    # --- New Hourly Activity Logic ---
    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)
    hourly_results = db.query(
        func.strftime('%H', complaint_models.Complaint.created_at).label('hour'),
        func.count(complaint_models.Complaint.id)
    ).filter(complaint_models.Complaint.created_at >= last_24h) \
     .group_by('hour') \
     .all()
    
    hourly_activity = [{"hour": int(h), "count": c} for h, c in hourly_results]
    # Fill gaps for current dashboard look
    if not hourly_activity:
        hourly_activity = [{"hour": h, "count": 0} for h in range(0, 24, 4)]

    # --- New Status Distribution Logic ---
    status_results = db.query(
        complaint_models.Complaint.status,
        func.count(complaint_models.Complaint.id)
    ).group_by(complaint_models.Complaint.status).all()
    
    STATUS_COLORS = {
        "pending": "#6b7280",
        "classified": "#a78bfa",
        "assigned": "#f59e0b",
        "in_progress": "#3b82f6",
        "pending_confirmation": "#10b981",
        "resolved": "#10b981",
    }
    
    status_distribution = [
        {
            "status": s.value if hasattr(s, 'value') else str(s), 
            "count": c, 
            "color": STATUS_COLORS.get(s.value if hasattr(s, 'value') else str(s), "#6b7280")
        } 
        for s, c in status_results
    ]
    
    # --- Proactive Anomaly Detection ---
    anomalies = []
    # 1. Get counts per category for the last 24h
    today_counts = db.query(
        complaint_models.Complaint.category,
        func.count(complaint_models.Complaint.id)
    ).filter(complaint_models.Complaint.created_at >= last_24h) \
     .group_by(complaint_models.Complaint.category).all()
    
    # 2. Get historical counts (prev 7 days)
    week_ago = last_24h - timedelta(days=7)
    hist_counts = db.query(
        complaint_models.Complaint.category,
        func.count(complaint_models.Complaint.id)
    ).filter(complaint_models.Complaint.created_at >= week_ago, 
            complaint_models.Complaint.created_at < last_24h) \
     .group_by(complaint_models.Complaint.category).all()
    
    hist_map = {cat: count / 7 for cat, count in hist_counts}
    
    for cat, count in today_counts:
        avg = hist_map.get(cat, 1) # default 1 to avoid div zero and detect new spikes
        if count > (avg * 2.5): # 250% surge
            spike = ((count - avg) / avg) * 100
            anomalies.append({
                "category": cat or "General",
                "spike_percentage": round(spike, 1),
                "severity": "high" if spike > 300 else "medium",
                "message": f"{cat or 'General'} volume surged {round(spike)}% above normal."
            })

    # --- Sentinel Pulse (Tension & Sentiment) ---
    # Aggregate priority_score (0-100) into Tension (0-10)
    tension_result = db.query(func.avg(complaint_models.Complaint.priority_score)) \
                       .filter(complaint_models.Complaint.status != "resolved").scalar()
    tension_score = (tension_result / 10.0) if tension_result else 2.5 # baseline 2.5
    
    # Determine velocity by comparing today vs yesterday
    yesterday = last_24h - timedelta(hours=24)
    today_tension = db.query(func.avg(complaint_models.Complaint.priority_score)) \
                       .filter(complaint_models.Complaint.created_at >= last_24h).scalar() or 0
    prev_tension = db.query(func.avg(complaint_models.Complaint.priority_score)) \
                       .filter(complaint_models.Complaint.created_at >= yesterday,
                               complaint_models.Complaint.created_at < last_24h).scalar() or 0
    
    velocity = "stable"
    if today_tension > prev_tension + 5: velocity = "deteriorating"
    elif today_tension < prev_tension - 5: velocity = "improving"

    # --- AI Efficiency ---
    classified_count = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.status != "pending").count()
    hours_saved = classified_count * 0.45 # 27 mins per complaint (classification + routing)

    return {
        "summary": summary,
        "categories": categories,
        "trends": trends,
        "hourly_activity": hourly_activity,
        "status_distribution": status_distribution,
        "anomalies": anomalies,
        "pulse": {
            "tension_score": round(tension_score, 1),
            "sentiment_velocity": velocity,
            "hours_saved": round(hours_saved, 1)
        }
    }
