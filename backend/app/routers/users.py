from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import user as user_models
from ..schemas import user as user_schemas
from typing import List

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.post("/", response_model=user_schemas.User)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(user_models.User).filter(user_models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # In a real app, hash the password here
    new_user = user_models.User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=user.password, # Plain text for placeholder/demo unless hashing added
        role=user.role,
        college_id=user.college_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/", response_model=List[user_schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(user_models.User).offset(skip).limit(limit).all()
    return users
