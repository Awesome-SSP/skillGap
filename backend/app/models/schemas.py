from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

class Contact(BaseModel):
    email: str
    phone: str

class Experience(BaseModel):
    company: str
    role: str
    years: int
    description: Optional[str] = None

class ResumeData(BaseModel):
    name: str
    contact: Contact
    skills: List[str]
    experience: List[Experience]

class AnalyzeSkillsRequest(BaseModel):
    target_role: str
    resume_data: Dict[str, Any]

class LearningResource(BaseModel):
    title: str
    url: str
    type: str
    provider: str
    duration: str
    rating: Optional[float] = None

class Recommendation(BaseModel):
    skill: str
    description: str
    resources: List[LearningResource]
    difficulty: str
    estimatedHours: int

class SaveLearningPlanRequest(BaseModel):
    targetRole: str
    recommendations: List[Recommendation]
    createdAt: str