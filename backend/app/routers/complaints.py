from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import complaint as complaint_models
from ..schemas import complaint as complaint_schemas
from typing import List

router = APIRouter(prefix="/v1/complaints", tags=["complaints"])

@router.post("/", response_model=complaint_schemas.Complaint)
def create_complaint(complaint: complaint_schemas.ComplaintCreate, db: Session = Depends(get_db)):
    new_complaint = complaint_models.Complaint(
        title=complaint.title,
        description=complaint.description,
        student_id=complaint.student_id
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

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
