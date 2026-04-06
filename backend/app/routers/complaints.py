from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import complaint as complaint_models
from ..models import user as user_models
from ..models.complaint import ComplaintStatus
from ..schemas import complaint as complaint_schemas
from typing import List
from datetime import datetime

router = APIRouter(prefix="/v1/complaints", tags=["complaints"])

@router.post("/", response_model=complaint_schemas.Complaint)
def create_complaint(complaint: complaint_schemas.ComplaintCreate, db: Session = Depends(get_db)):
    new_complaint = complaint_models.Complaint(
        title=complaint.title,
        description=complaint.description,
        student_id=complaint.student_id,
        status=ComplaintStatus.PENDING
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

@router.get("/me", response_model=List[complaint_schemas.Complaint])
def read_my_complaints(email: str, db: Session = Depends(get_db)):
    # 1. Get User by Email
    db_user = db.query(user_models.User).filter(user_models.User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 2. Get Complaints by User ID
    complaints = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.student_id == db_user.id).all()
    return complaints

@router.get("/", response_model=List[complaint_schemas.Complaint])
def read_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    complaints = db.query(complaint_models.Complaint).offset(skip).limit(limit).all()
    return complaints

@router.get("/{complaint_id}", response_model=complaint_schemas.Complaint)
def read_complaint(complaint_id: int, db: Session = Depends(get_db)):
    db_complaint = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.id == complaint_id).first()
    if db_complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return db_complaint

@router.post("/{complaint_id}/propose-resolution", response_model=complaint_schemas.Complaint)
def propose_resolution(complaint_id: int, proposal: complaint_schemas.ResolutionProposal, db: Session = Depends(get_db)):
    db_complaint = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Validation: Only in_progress or assigned can move to pending_confirmation
    allowed_statuses = [ComplaintStatus.IN_PROGRESS, ComplaintStatus.ASSIGNED, ComplaintStatus.CLASSIFIED]
    if db_complaint.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Cannot propose resolution for complaint in status: {db_complaint.status}")

    db_complaint.status = ComplaintStatus.PENDING_CONFIRMATION
    db_complaint.admin_resolution_note = proposal.note
    db_complaint.pending_confirmation_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.patch("/{complaint_id}/status", response_model=complaint_schemas.Complaint)
def update_complaint_status(complaint_id: int, status_update: dict = Body(...), db: Session = Depends(get_db)):
    db_complaint = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    new_status = status_update.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status must be provided")
    
    db_complaint.status = new_status
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.post("/{complaint_id}/confirm-resolution", response_model=complaint_schemas.Complaint)
def confirm_resolution(complaint_id: int, response: complaint_schemas.StudentResponse, db: Session = Depends(get_db)):
    db_complaint = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if db_complaint.status != ComplaintStatus.PENDING_CONFIRMATION:
        raise HTTPException(status_code=400, detail="Student can only confirm complaints pending resolution confirmation")

    db_complaint.status = ComplaintStatus.RESOLVED
    db_complaint.student_feedback = response.feedback
    
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.post("/{complaint_id}/reject-resolution", response_model=complaint_schemas.Complaint)
def reject_resolution(complaint_id: int, response: complaint_schemas.StudentResponse, db: Session = Depends(get_db)):
    db_complaint = db.query(complaint_models.Complaint).filter(complaint_models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if db_complaint.status != ComplaintStatus.PENDING_CONFIRMATION:
        raise HTTPException(status_code=400, detail="Student can only reject complaints pending resolution confirmation")

    db_complaint.rejection_count += 1
    db_complaint.student_feedback = response.feedback
    
    if db_complaint.rejection_count >= 3:
        db_complaint.status = ComplaintStatus.ESCALATED
    else:
        db_complaint.status = ComplaintStatus.IN_PROGRESS # Send back to admin
    
    db.commit()
    db.refresh(db_complaint)
    return db_complaint
