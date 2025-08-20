import spacy
import re
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class NLPProcessor:
    """Service for processing resume text using NLP techniques"""
    
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.error("spaCy model 'en_core_web_sm' not found. Please install it with: python -m spacy download en_core_web_sm")
            raise
        
        # Common technical skills (expandable)
        self.skill_keywords = {
            "python", "java", "javascript", "typescript", "react", "angular", "vue",
            "node.js", "express", "django", "flask", "fastapi", "spring", "laravel",
            "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab",
            "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
            "data analysis", "pandas", "numpy", "matplotlib", "seaborn", "plotly",
            "html", "css", "sass", "bootstrap", "tailwind", "jquery",
            "git", "github", "bitbucket", "agile", "scrum", "kanban",
            "linux", "bash", "shell scripting", "powershell", "ci/cd",
            "rest api", "graphql", "microservices", "oauth", "jwt"
        }
    
    def extract_resume_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from resume text"""
        try:
            doc = self.nlp(text)
            
            # Extract name (first person name found)
            name = self._extract_name(doc, text)
            
            # Extract contact information
            contact = self._extract_contact_info(text)
            
            # Extract skills
            skills = self._extract_skills(text)
            
            # Extract experience
            experience = self._extract_experience(doc, text)
            
            return {
                "name": name,
                "contact": contact,
                "skills": skills,
                "experience": experience
            }
            
        except Exception as e:
            logger.error(f"Error processing resume text: {str(e)}")
            return {
                "name": "Unknown",
                "contact": {},
                "skills": [],
                "experience": []
            }
    
    def _extract_name(self, doc, text: str) -> str:
        """Extract person's name from resume"""
        # Look for person entities first
        for ent in doc.ents:
            if ent.label_ == "PERSON" and len(ent.text.split()) >= 2:
                return ent.text
        
        # Fallback: look for name patterns in first few lines
        lines = text.split('\n')[:5]
        name_patterns = [
            r'^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',  # Title case names
            r'^([A-Z\s]{2,50})\s*$'  # All caps names
        ]
        
        for line in lines:
            line = line.strip()
            for pattern in name_patterns:
                match = re.search(pattern, line)
                if match:
                    return match.group(1).title()
        
        return "Unknown"
    
    def _extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information"""
        contact = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact["email"] = emails[0]
        
        # Phone patterns
        phone_patterns = [
            r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',  # US
            r'\+?91[-.\s]?([0-9]{10})',  # India
            r'\+?([0-9]{1,4})[-.\s]?([0-9]{6,14})'  # International
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Format the first match found
                if pattern == phone_patterns[0]:  # US format
                    contact["phone"] = f"({matches[0][0]}) {matches[0][1]}-{matches[0][2]}"
                else:
                    contact["phone"] = matches[0] if isinstance(matches[0], str) else ''.join(matches[0])
                break
        
        # LinkedIn
        linkedin_pattern = r'(?:linkedin\.com/in/|linkedin\.com/profile/view\?id=)([A-Za-z0-9-]+)'
        linkedin_matches = re.findall(linkedin_pattern, text.lower())
        if linkedin_matches:
            contact["linkedin"] = f"linkedin.com/in/{linkedin_matches[0]}"
        
        return contact
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from resume text"""
        text_lower = text.lower()
        found_skills = []
        
        # Look for skills in the predefined list
        for skill in self.skill_keywords:
            if skill.lower() in text_lower:
                # Add proper capitalization
                found_skills.append(self._capitalize_skill(skill))
        
        # Remove duplicates and sort
        found_skills = list(set(found_skills))
        found_skills.sort()
        
        return found_skills
    
    def _capitalize_skill(self, skill: str) -> str:
        """Properly capitalize skill names"""
        skill_map = {
            "javascript": "JavaScript",
            "typescript": "TypeScript",
            "node.js": "Node.js",
            "mysql": "MySQL",
            "postgresql": "PostgreSQL",
            "mongodb": "MongoDB",
            "aws": "AWS",
            "gcp": "GCP",
            "html": "HTML",
            "css": "CSS",
            "sql": "SQL",
            "api": "API",
            "rest api": "REST API",
            "graphql": "GraphQL",
            "ci/cd": "CI/CD",
            "oauth": "OAuth",
            "jwt": "JWT"
        }
        
        return skill_map.get(skill.lower(), skill.title())
    
    def _extract_experience(self, doc, text: str) -> List[Dict[str, Any]]:
        """Extract work experience information"""
        experience = []
        
        # Look for organization entities
        organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
        
        # Simple pattern matching for experience sections
        exp_patterns = [
            r'(?:experience|work|employment)[\s\S]*?(?=education|skills|projects|$)',
            r'(?:^|\n)(.+?)(?:\n|$)(?:.*?)(\d{4})\s*[-–]\s*(\d{4}|present)',
        ]
        
        # This is a simplified extraction - in a real app, you'd want more sophisticated parsing
        if organizations:
            for i, org in enumerate(organizations[:3]):  # Limit to first 3 organizations
                experience.append({
                    "company": org,
                    "role": f"Position {i+1}",  # Placeholder - would need more sophisticated extraction
                    "years": 2.0,  # Placeholder
                    "start_date": "2021-01-01",
                    "end_date": "2023-01-01"
                })
        
        return experience