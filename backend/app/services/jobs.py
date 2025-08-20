import json
import os
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class JobService:
    """Service for managing job roles and their required skills"""
    
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        self.roles_file = os.path.join(self.data_dir, "roles.json")
        self._ensure_roles_file()
    
    def _ensure_roles_file(self):
        """Ensure roles.json file exists with default data"""
        if not os.path.exists(self.roles_file):
            default_roles = {
                "Data Analyst": [
                    "Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", 
                    "NumPy", "Matplotlib", "Statistics", "Data Visualization"
                ],
                "Python Developer": [
                    "Python", "Django", "Flask", "FastAPI", "PostgreSQL", 
                    "Git", "REST API", "Docker", "Linux", "Unit Testing"
                ],
                "Frontend Developer": [
                    "JavaScript", "TypeScript", "React", "HTML", "CSS", 
                    "Tailwind", "Git", "REST API", "Webpack", "Node.js"
                ],
                "Machine Learning Engineer": [
                    "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", 
                    "NumPy", "SQL", "Docker", "Kubernetes", "MLOps", "Statistics"
                ],
                "Full Stack Developer": [
                    "JavaScript", "TypeScript", "React", "Node.js", "Express", 
                    "MongoDB", "PostgreSQL", "Git", "Docker", "AWS", "REST API"
                ],
                "DevOps Engineer": [
                    "Linux", "Docker", "Kubernetes", "AWS", "Jenkins", "Git", 
                    "Bash", "Python", "Terraform", "Ansible", "CI/CD"
                ],
                "Data Scientist": [
                    "Python", "R", "Machine Learning", "Deep Learning", "Statistics", 
                    "Pandas", "NumPy", "Matplotlib", "Jupyter", "SQL", "TensorFlow"
                ],
                "Mobile Developer": [
                    "React Native", "Flutter", "iOS", "Android", "Swift", 
                    "Kotlin", "JavaScript", "Firebase", "REST API", "Git"
                ]
            }
            
            os.makedirs(self.data_dir, exist_ok=True)
            with open(self.roles_file, 'w') as f:
                json.dump(default_roles, f, indent=2)
    
    def get_available_roles(self) -> List[str]:
        """Get list of available job roles"""
        try:
            with open(self.roles_file, 'r') as f:
                roles_data = json.load(f)
            return list(roles_data.keys())
        except Exception as e:
            logger.error(f"Error reading roles file: {str(e)}")
            return []
    
    def get_role_skills(self, role: str) -> List[str]:
        """Get required skills for a specific role"""
        try:
            with open(self.roles_file, 'r') as f:
                roles_data = json.load(f)
            return roles_data.get(role, [])
        except Exception as e:
            logger.error(f"Error getting skills for role {role}: {str(e)}")
            return []
    
    def add_role(self, role: str, skills: List[str]) -> bool:
        """Add a new role with skills"""
        try:
            with open(self.roles_file, 'r') as f:
                roles_data = json.load(f)
            
            roles_data[role] = skills
            
            with open(self.roles_file, 'w') as f:
                json.dump(roles_data, f, indent=2)
            
            return True
        except Exception as e:
            logger.error(f"Error adding role {role}: {str(e)}")
            return False