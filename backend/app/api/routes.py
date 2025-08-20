from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
import uuid
import logging
from datetime import datetime

from ..models.resume import ResumeData, SkillGapAnalysis, RecommendationRequest, LearningPlan, SavePlanRequest
from ..services.parser import ResumeParser
from ..services.nlp import NLPProcessor
from ..services.jobs import JobService
from ..services.recommend import RecommendationService
from ..storage.data_store import DataStore

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
resume_parser = ResumeParser()
nlp_processor = NLPProcessor()
job_service = JobService()
recommendation_service = RecommendationService()
data_store = DataStore()

@router.post("/upload_resume")
async def upload_resume(
    file: UploadFile = File(...),
    target_role: str = Form(...)
):
    """Upload and parse a PDF resume"""
    try:
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        if file.size and file.size > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="File size must be less than 5MB")
        
        # Read file content
        content = await file.read()
        
        # Parse PDF
        parsed_text = resume_parser.extract_text(content)
        if not parsed_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Extract structured data using NLP
        structured_data = nlp_processor.extract_resume_data(parsed_text)
        
        # Generate unique user ID
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        
        # Create resume data object
        resume_data = ResumeData(
            user_id=user_id,
            name=structured_data.get("name", "Unknown"),
            contact=structured_data.get("contact", {}),
            skills=structured_data.get("skills", []),
            #experience=structured_data.get("experience", []),
            parsed_text_snippet=parsed_text[:200] + "..." if len(parsed_text) > 200 else parsed_text,
            target_role=target_role,
            upload_timestamp=datetime.now().isoformat()
        )
        
        # Save to storage
        data_store.save_user_data(user_id, resume_data.dict())
        
        return resume_data.dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process resume")

@router.post("/analyze_skills")
async def analyze_skills(user_id: str, target_role: str):
    """Analyze skill gaps for a user"""
    try:
        # Get user data
        user_data = data_store.get_user_data(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get required skills for role
        required_skills = job_service.get_role_skills(target_role)
        if not required_skills:
            raise HTTPException(status_code=404, detail="Role not found")
        
        user_skills = user_data.get("skills", [])
        
        # Perform analysis
        matched_skills = []
        missing_skills = []
        
        for skill in required_skills:
            if any(user_skill.lower() == skill.lower() for user_skill in user_skills):
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)
        
        analysis = SkillGapAnalysis(
            user_id=user_id,
            target_role=target_role,
            required_skills=required_skills,
            user_skills=user_skills,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            match_percentage=len(matched_skills) / len(required_skills) * 100 if required_skills else 0
        )
        
        return analysis.dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing skills: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze skills")

@router.get("/roles")
async def get_roles():
    """Get available job roles"""
    try:
        roles = job_service.get_available_roles()
        return {"roles": roles}
    except Exception as e:
        logger.error(f"Error getting roles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get roles")

@router.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Get learning recommendations for missing skills"""
    try:
        recommendations = recommendation_service.get_recommendations(request.missing_skills)
        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")

@router.post("/save_plan")
async def save_learning_plan(request: SavePlanRequest):
    """Save a learning plan for a user"""
    try:
        # Get existing user data
        user_data = data_store.get_user_data(request.user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Add learning plan to user data
        if "learning_plans" not in user_data:
            user_data["learning_plans"] = []
        
        plan_data = request.plan.dict()
        plan_data["created_at"] = datetime.now().isoformat()
        user_data["learning_plans"].append(plan_data)
        
        # Save updated data
        data_store.save_user_data(request.user_id, user_data)
        
        return {"message": "Learning plan saved successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving plan: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save learning plan")

@router.get("/user/{user_id}")
async def get_user_data(user_id: str):
    """Get user data and learning plans"""
    try:
        user_data = data_store.get_user_data(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get user data")