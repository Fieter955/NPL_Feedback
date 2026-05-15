from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class SubscoreDetail(BaseModel):
    score: int
    reason: str

class DetailedFeedback(BaseModel):
    aspect: str
    problem: str
    improvement: str

class Subscores(BaseModel):
    structure: SubscoreDetail
    argumentation: SubscoreDetail
    coherence: SubscoreDetail
    analysis: SubscoreDetail
    grammar: SubscoreDetail
    relevance: SubscoreDetail

class EvaluationResult(BaseModel):
    final_score: int
    grade: str
    summary: str
    subscores: Subscores | Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    detailed_feedback: List[DetailedFeedback] | List[Dict[str, Any]]

class EssayResponse(BaseModel):
    id: int
    user_id: int
    original_filename: str
    final_score: int
    grade: str
    summary: str
    subscores: dict
    strengths: list
    weaknesses: list
    suggestions: list
    detailed_feedback: list
    created_at: datetime

    class Config:
        from_attributes = True

class EssayHistoryItem(BaseModel):
    id: int
    original_filename: str
    final_score: int
    grade: str
    created_at: datetime

    class Config:
        from_attributes = True
