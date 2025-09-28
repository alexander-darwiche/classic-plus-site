# app/routers/pins.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import List
from sqlalchemy import Column, Integer, String, Float

router = APIRouter(
    prefix="/pins",
    tags=["pins"]
)

# --- Database Model ---
class Pin(Base):
    __tablename__ = "pins"
    id = Column(Integer, primary_key=True, index=True)
    x = Column(Float, nullable=False)   # relative x coordinate (0-1)
    y = Column(Float, nullable=False)   # relative y coordinate (0-1)
    description = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)

# --- Pydantic Schema ---
class PinSchema(BaseModel):
    id: int | None = None
    x: float
    y: float
    description: str

    class Config:
        orm_mode = True

# --- DB Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Routes ---
@router.post("/", response_model=PinSchema)
def add_pin(pin: PinSchema, db: Session = Depends(get_db)):
    db_pin = Pin(x=pin.x, y=pin.y, description=pin.description)
    db.add(db_pin)
    db.commit()
    db.refresh(db_pin)
    return db_pin

@router.get("/", response_model=List[PinSchema])
def get_pins(db: Session = Depends(get_db)):
    return db.query(Pin).all()
