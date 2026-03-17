from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ComplaintBase(BaseModel):
    title: str
    description: str

class ComplaintCreate(ComplaintBase):
    student_id: int

class ComplaintUpdate(BaseModel):
    category: Optional[str] = None
    priority: Optional[str] = None
    priority_score: Optional[int] = None
    status: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_suggested_action: Optional[str] = None

class Complaint(ComplaintBase):
    id: int
    category: Optional[str]
    priority: str
    priority_score: int
    status: str
    student_id: int
    ai_summary: Optional[str]
    ai_suggested_action: Optional[str]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
