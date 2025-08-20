import json
import os
from typing import Dict, List, Any

class SkillAnalyzer:
    def __init__(self):
        # Load job roles data
        self.job_roles = self._load_job_roles()
    
    def _load_job_roles(self) -> Dict[str, Any]:
        """Load job roles and their required skills."""
        job_roles_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "job_roles.json")
        
        try:
            with open(job_roles_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Fallback job roles data
            return {
                "data-scientist": {
                    "title": "Data Scientist",
                    "category": "Data & Analytics",
                    "required_skills": ["Python", "Machine Learning", "SQL", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Statistics", "Data Visualization", "R"]
                },
                "software-engineer": {
                    "title": "Software Engineer", 
                    "category": "Engineering",
                    "required_skills": ["JavaScript", "React", "Node.js", "Git", "SQL", "API Development", "Testing", "Agile", "TypeScript", "AWS"]
                },
                "product-manager": {
                    "title": "Product Manager",
                    "category": "Product", 
                    "required_skills": ["Product Strategy", "User Research", "Analytics", "Roadmapping", "Agile", "Wireframing", "A/B Testing", "Stakeholder Management", "SQL", "Figma"]
                },
                "ui-ux-designer": {
                    "title": "UI/UX Designer",
                    "category": "Design",
                    "required_skills": ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Wireframing", "Design Systems", "Usability Testing", "HTML/CSS", "Interaction Design", "Visual Design"]
                },
                "digital-marketing": {
                    "title": "Digital Marketing Specialist",
                    "category": "Marketing",
                    "required_skills": ["Google Analytics", "SEO", "SEM", "Social Media Marketing", "Content Marketing", "Email Marketing", "PPC", "Conversion Optimization", "Marketing Automation", "A/B Testing"]
                },
                "devops-engineer": {
                    "title": "DevOps Engineer",
                    "category": "Engineering",
                    "required_skills": ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux", "Python", "Git", "Monitoring", "CI/CD"]
                }
            }
    
    def get_job_requirements(self, job_role_id: str) -> Dict[str, Any]:
        """Get job requirements for a specific role."""
        return self.job_roles.get(job_role_id)
    
    def analyze_skill_gap(self, resume_skills: List[str], required_skills: List[str]) -> Dict[str, Any]:
        """Analyze skill gap between resume and job requirements."""
        
        # Normalize skills for comparison (case-insensitive)
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        required_skills_lower = [skill.lower() for skill in required_skills]
        
        # Find matching skills
        matching_skills = []
        missing_skills = []
        
        for required_skill in required_skills:
            if required_skill.lower() in resume_skills_lower:
                matching_skills.append(required_skill)
            else:
                missing_skills.append(required_skill)
        
        # Calculate match percentage
        match_percentage = (len(matching_skills) / len(required_skills)) * 100 if required_skills else 0
        
        return {
            "requiredSkills": required_skills,
            "resumeSkills": resume_skills,
            "matchingSkills": matching_skills,
            "missingSkills": missing_skills,
            "matchPercentage": round(match_percentage, 1)
        }