from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    location: Optional[str] = None

class Experience(BaseModel):
    company: str
    role: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    years: Optional[float] = None
    description: Optional[str] = None

class ResumeData(BaseModel):
    user_id: str
    name: str
    contact: ContactInfo = ContactInfo()
    skills: List[str] = []
    experience: List[Experience] = []
    parsed_text_snippet: str
    target_role: Optional[str] = None
    upload_timestamp: str

class SkillGapAnalysis(BaseModel):
    user_id: str
    target_role: str
    required_skills: List[str]
    user_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    match_percentage: float

class LearningResource(BaseModel):
    title: str
    description: str
    url: str
    duration: str
    difficulty: str  # Beginner, Intermediate, Advanced
    type: str  # Course, Article, Video, Book

class RecommendationRequest(BaseModel):
    missing_skills: List[str]
    user_id: Optional[str] = None

class LearningPlan(BaseModel):
    name: str
    target_role: str
    missing_skills: List[str]
    resources: List[LearningResource]
    estimated_duration: str

class SavePlanRequest(BaseModel):
    user_id: str
    plan: LearningPlan