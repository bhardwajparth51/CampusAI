from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class ComplaintStatus(str, enum.Enum):
    PENDING = "pending"
    CLASSIFIED = "classified"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    PENDING_CONFIRMATION = "pending_confirmation"
    RESOLVED = "resolved"
    REJECTED = "rejected"
    ESCALATED = "escalated"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True, nullable=True) # AI Classified category
    priority = Column(String, index=True, default="low") # low, medium, high, critical
    priority_score = Column(Integer, default=0)
    status = Column(String, default=ComplaintStatus.PENDING)
    
    # Resolution Tracking
    rejection_count = Column(Integer, default=0)
    pending_confirmation_at = Column(DateTime(timezone=True), nullable=True)
    admin_resolution_note = Column(Text, nullable=True)
    student_feedback = Column(Text, nullable=True)
    
    student_id = Column(Integer, ForeignKey("users.id"))
    student = relationship("User", backref="complaints")
    
    ai_summary = Column(Text, nullable=True)
    ai_suggested_action = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
