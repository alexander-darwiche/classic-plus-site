from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/survey",
    tags=["survey"]
)

# Survey database model
from sqlalchemy import Column, Integer, String

class SurveyEntry(Base):
    __tablename__ = "survey_entries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    feedback = Column(String)

Base.metadata.create_all(bind=engine)

# Pydantic schema
class SurveyEntrySchema(BaseModel):
    name: str
    email: str
    feedback: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=SurveyEntrySchema)
def submit_survey(entry: SurveyEntrySchema, db: Session = Depends(get_db)):
    db_entry = SurveyEntry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[SurveyEntrySchema])
def get_survey_entries(db: Session = Depends(get_db)):
    return db.query(SurveyEntry).all()
