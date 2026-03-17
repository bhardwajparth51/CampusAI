from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import complaint as complaint_models
from ..schemas import complaint as complaint_schemas
from .reasoning import analyze_complaint_with_llm

router = APIRouter(prefix="/v1/agent", tags=["agent"])

@router.post("/analyze/{complaint_id}", response_model=complaint_schemas.Complaint)
def analyze_complaint(complaint_id: int, db: Session = Depends(get_db)):
    db_complaint = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Run AI Agent reasoning
    analysis = analyze_complaint_with_llm(db_complaint.description)
    
    # Update complaint with AI results
    db_complaint.category = analysis.category
    db_complaint.priority = analysis.priority
    db_complaint.priority_score = analysis.priority_score
    db_complaint.ai_summary = analysis.summary
    db_complaint.ai_suggested_action = analysis.suggested_action
    db_complaint.status = "classified"
    
    db.commit()
    db.refresh(db_complaint)
    return db_complaint
