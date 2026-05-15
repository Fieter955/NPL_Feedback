import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class EssayEvaluation(Base):
    __tablename__ = "essay_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_filename = Column(String)
    extracted_text = Column(Text)
    final_score = Column(Integer)
    grade = Column(String)
    summary = Column(Text)
    
    # JSON columns for structured feedback
    subscores = Column(JSON)
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    suggestions = Column(JSON)
    detailed_feedback = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User")
