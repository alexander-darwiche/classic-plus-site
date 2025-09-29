# app/routers/pins.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import List
from sqlalchemy import Column, Integer, String, Float, Enum, UniqueConstraint, ForeignKey
import enum
from sqlalchemy.orm import relationship, Session

router = APIRouter(
    prefix="/pins",
    tags=["pins"]
)


# optional: define categories as an Enum
class PinCategory(str, enum.Enum):
    Lore = "Lore"
    Quest = "Quest"
    Raid = "Raid"
    Dungeon = "Dungeon"

class Pin(Base):
    __tablename__ = "pins"
    id = Column(Integer, primary_key=True, index=True)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)  # NEW FIELD
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    votes = relationship("Vote", back_populates="pin")

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    pin_id = Column(Integer, ForeignKey("pins.id"))
    user_id = Column(String)  # This could be a user identifier
    vote_type = Column(String)  # 'up' or 'down'

    pin = relationship("Pin", back_populates="votes")

    __table_args__ = (UniqueConstraint('pin_id', 'user_id', name='_pin_user_uc'),)


Base.metadata.create_all(bind=engine)

# --- Pydantic Schema ---
class PinSchema(BaseModel):
    id: int | None = None
    x: float
    y: float
    name: str
    description: str
    category: PinCategory  # NEW FIELD

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
    db_pin = Pin(
        x=pin.x,
        y=pin.y,
        name=pin.name,
        description=pin.description,
        category=pin.category  # <-- assign it!
    )
    db.add(db_pin)
    db.commit()
    db.refresh(db_pin)
    return db_pin

@router.get("/", response_model=List[PinSchema])
def get_pins(db: Session = Depends(get_db)):
    return db.query(Pin).all()


def vote_on_pin(db: Session, pin_id: int, user_id: str, vote_type: str):
    # Ensure the vote_type is valid
    if vote_type not in ['up', 'down']:
        raise ValueError("Invalid vote type. Must be 'up' or 'down'.")

    # Retrieve the pin and the user's existing vote
    pin = db.query(Pin).filter(Pin.id == pin_id).first()
    existing_vote = db.query(Vote).filter(Vote.pin_id == pin_id, Vote.user_id == user_id).first()

    if existing_vote:
        # Update existing vote
        if existing_vote.vote_type != vote_type:
            # Adjust vote counts
            if existing_vote.vote_type == 'up':
                pin.upvotes -= 1
            else:
                pin.downvotes -= 1

            if vote_type == 'up':
                pin.upvotes += 1
            else:
                pin.downvotes += 1

            existing_vote.vote_type = vote_type
    else:
        # Create new vote
        new_vote = Vote(pin_id=pin_id, user_id=user_id, vote_type=vote_type)
        db.add(new_vote)
        if vote_type == 'up':
            pin.upvotes += 1
        else:
            pin.downvotes += 1

    db.commit()
    db.refresh(pin)
    return pin

from fastapi import HTTPException

class VoteSchema(BaseModel):
    pin_id: int
    user_id: str  # could be email, username, or session token
    vote_type: str  # 'up' or 'down'

@router.post("/vote")
def vote_pin(vote: VoteSchema, db: Session = Depends(get_db)):

    try:
        pin = vote_on_pin(db, vote.pin_id, vote.user_id, vote.vote_type)
        return {
            "pin_id": pin.id,
            "upvotes": pin.upvotes,
            "downvotes": pin.downvotes
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/votes/{user_id}")
def get_votes(user_id: str, db: Session = Depends(get_db)):
    votes = db.query(Vote).filter(Vote.user_id == user_id).all()
    return [{"pin_id": v.pin_id, "vote_type": v.vote_type} for v in votes]