from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..models.complaint import Complaint, ComplaintStatus

def auto_resolve_stale_complaints(db: Session):
    """
    Automatically resolves complaints that have been in PENDING_CONFIRMATION 
    for more than 48 hours.
    """
    threshold = datetime.utcnow() - timedelta(hours=48)
    
    stale_complaints = db.query(Complaint).filter(
        Complaint.status == ComplaintStatus.PENDING_CONFIRMATION,
        Complaint.pending_confirmation_at <= threshold
    ).all()
    
    count = 0
    for complaint in stale_complaints:
        complaint.status = ComplaintStatus.RESOLVED
        complaint.student_feedback = "Auto-resolved after 48h inactivity (System)."
        count += 1
    
    if count > 0:
        db.commit()
        
    return count
