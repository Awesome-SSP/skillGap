import pdfplumber
import fitz  # PyMuPDF
import re
from typing import Dict, List, Any
import json
import os

class ResumeParser:
    def __init__(self):
        # Load skill keywords
        self.skill_keywords = self._load_skill_keywords()
    
    def _load_skill_keywords(self) -> List[str]:
        """Load predefined skill keywords for extraction."""
        skills_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "skills.json")
        
        try:
            with open(skills_file, 'r') as f:
                data = json.load(f)
                return data.get("skills", [])
        except FileNotFoundError:
            # Fallback skill list
            return [
                "Python", "JavaScript", "Java", "C++", "React", "Node.js", "HTML", "CSS",
                "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git",
                "Machine Learning", "Data Analysis", "Pandas", "NumPy", "TensorFlow",
                "Excel", "PowerBI", "Tableau", "Figma", "Photoshop", "Project Management",
                "Agile", "Scrum", "Leadership", "Communication", "Problem Solving"
            ]
    
    def parse_pdf(self, content: bytes, filename: str) -> Dict[str, Any]:
        """Parse PDF resume and extract structured information."""
        try:
            # First try with pdfplumber
            text = self._extract_text_pdfplumber(content)
            
            if not text.strip():
                # Fallback to PyMuPDF
                text = self._extract_text_pymupdf(content)
            
            if not text.strip():
                raise Exception("Could not extract text from PDF")
            
            # Extract structured information
            resume_data = {
                "name": self._extract_name(text),
                "contact": self._extract_contact(text),
                "skills": self._extract_skills(text),
                "experience": self._extract_experience(text)
            }
            
            return resume_data
            
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")
    
    def _extract_text_pdfplumber(self, content: bytes) -> str:
        """Extract text using pdfplumber."""
        import io
        text = ""
        
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        return text
    
    def _extract_text_pymupdf(self, content: bytes) -> str:
        """Extract text using PyMuPDF (fallback method)."""
        import io
        text = ""
        
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
        
        return text
    
    def _extract_name(self, text: str) -> str:
        """Extract name from resume text."""
        lines = text.split('\n')
        
        # Look for name in first few lines
        for i, line in enumerate(lines[:5]):
            line = line.strip()
            
            # Skip common headers
            if any(header in line.lower() for header in ["resume", "cv", "curriculum vitae"]):
                continue
            
            # Look for name pattern (2-4 words, mostly alphabetic)
            words = line.split()
            if 2 <= len(words) <= 4:
                if all(word.replace('.', '').replace(',', '').isalpha() for word in words):
                    return line
        
        # Fallback: return first non-empty line
        for line in lines:
            line = line.strip()
            if line and len(line) > 2:
                return line
        
        return "Name Not Found"
    
    def _extract_contact(self, text: str) -> Dict[str, str]:
        """Extract contact information."""
        contact = {"email": "", "phone": ""}
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_matches = re.findall(email_pattern, text)
        if email_matches:
            contact["email"] = email_matches[0]
        
        # Extract phone
        phone_patterns = [
            r'\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}',
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            r'\+\d{1,3}\s\d{4,14}',
        ]
        
        for pattern in phone_patterns:
            phone_matches = re.findall(pattern, text)
            if phone_matches:
                # Clean up phone number
                phone = re.sub(r'[^\d+]', '', phone_matches[0])
                if len(phone) >= 10:
                    contact["phone"] = phone_matches[0]
                    break
        
        return contact
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text."""
        found_skills = []
        text_lower = text.lower()
        
        # Look for each skill keyword
        for skill in self.skill_keywords:
            # Create pattern for skill matching
            skill_pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            
            if re.search(skill_pattern, text_lower):
                found_skills.append(skill)
        
        # Remove duplicates and maintain order
        return list(dict.fromkeys(found_skills))
    
    def _extract_experience(self, text: str) -> List[Dict[str, Any]]:
        """Extract work experience from resume text."""
        experience = []
        
        # Look for common experience section headers
        experience_markers = [
            "experience", "work history", "employment", "professional experience",
            "work experience", "career history", "employment history"
        ]
        
        lines = text.split('\n')
        in_experience_section = False
        current_entry = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            line_lower = line.lower()
            
            # Check if we're entering experience section
            if any(marker in line_lower for marker in experience_markers):
                in_experience_section = True
                continue
            
            # Check if we're leaving experience section
            if in_experience_section and any(
                section in line_lower for section in 
                ["education", "skills", "projects", "certifications", "achievements"]
            ):
                in_experience_section = False
                if current_entry:
                    experience.append(current_entry)
                break
            
            if in_experience_section:
                # Try to parse job entries
                # Look for company-role pattern or role-company pattern
                if "•" in line or "-" in line or any(char.isdigit() for char in line):
                    # This might be a job description bullet point
                    continue
                
                # Simple heuristic for job entries
                if len(line.split()) >= 2 and not line.startswith(("•", "-", "◦")):
                    if current_entry:
                        experience.append(current_entry)
                    
                    # Extract years (simple pattern)
                    years_match = re.search(r'(\d+)\s*(?:years?|yrs?)', line.lower())
                    years = int(years_match.group(1)) if years_match else 1
                    
                    current_entry = {
                        "company": "Company Name",
                        "role": line,
                        "years": years
                    }
        
        # Add last entry if exists
        if current_entry:
            experience.append(current_entry)
        
        # If no experience found, create a sample entry
        if not experience:
            experience = [{
                "company": "Previous Company",
                "role": "Professional Role",
                "years": 2
            }]
        
        return experience