import json
import os
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    """Service for providing learning recommendations based on missing skills"""
    
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        self.resources_file = os.path.join(self.data_dir, "resources.json")
        self._ensure_resources_file()
    
    def _ensure_resources_file(self):
        """Ensure resources.json file exists with default data"""
        if not os.path.exists(self.resources_file):
            default_resources = {
                "Python": [
                    {
                        "title": "Python Crash Course",
                        "description": "A comprehensive introduction to Python programming",
                        "url": "https://nostarch.com/python-crash-course-3rd-edition",
                        "duration": "40 hours",
                        "difficulty": "Beginner",
                        "type": "Book"
                    },
                    {
                        "title": "Automate the Boring Stuff with Python",
                        "description": "Learn Python by automating common tasks",
                        "url": "https://automatetheboringstuff.com/",
                        "duration": "30 hours",
                        "difficulty": "Beginner",
                        "type": "Book"
                    },
                    {
                        "title": "Python for Everybody Specialization",
                        "description": "University of Michigan's Python course series",
                        "url": "https://www.coursera.org/specializations/python",
                        "duration": "32 hours",
                        "difficulty": "Beginner",
                        "type": "Course"
                    }
                ],
                "JavaScript": [
                    {
                        "title": "JavaScript: The Definitive Guide",
                        "description": "Comprehensive guide to modern JavaScript",
                        "url": "https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/",
                        "duration": "50 hours",
                        "difficulty": "Intermediate",
                        "type": "Book"
                    },
                    {
                        "title": "JavaScript30",
                        "description": "30 Day Vanilla JS Coding Challenge",
                        "url": "https://javascript30.com/",
                        "duration": "30 hours",
                        "difficulty": "Intermediate",
                        "type": "Course"
                    }
                ],
                "React": [
                    {
                        "title": "React - The Complete Guide",
                        "description": "Learn React from basics to advanced topics",
                        "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                        "duration": "48 hours",
                        "difficulty": "Intermediate",
                        "type": "Course"
                    },
                    {
                        "title": "Official React Documentation",
                        "description": "Comprehensive React documentation with tutorials",
                        "url": "https://react.dev/",
                        "duration": "20 hours",
                        "difficulty": "Beginner",
                        "type": "Documentation"
                    }
                ],
                "SQL": [
                    {
                        "title": "SQL in 10 Minutes, Sams Teach Yourself",
                        "description": "Quick and practical introduction to SQL",
                        "url": "https://www.amazon.com/SQL-Minutes-Sams-Teach-Yourself/dp/0135182794",
                        "duration": "15 hours",
                        "difficulty": "Beginner",
                        "type": "Book"
                    },
                    {
                        "title": "SQLBolt Interactive Tutorial",
                        "description": "Learn SQL with simple, interactive exercises",
                        "url": "https://sqlbolt.com/",
                        "duration": "10 hours",
                        "difficulty": "Beginner",
                        "type": "Interactive"
                    }
                ],
                "Machine Learning": [
                    {
                        "title": "Machine Learning Course by Andrew Ng",
                        "description": "Stanford's famous machine learning course",
                        "url": "https://www.coursera.org/learn/machine-learning",
                        "duration": "60 hours",
                        "difficulty": "Intermediate",
                        "type": "Course"
                    },
                    {
                        "title": "Hands-On Machine Learning",
                        "description": "Practical guide to machine learning with Python",
                        "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
                        "duration": "40 hours",
                        "difficulty": "Intermediate",
                        "type": "Book"
                    }
                ],
                "Docker": [
                    {
                        "title": "Docker Deep Dive",
                        "description": "Comprehensive guide to Docker containers",
                        "url": "https://www.pluralsight.com/courses/docker-deep-dive-update",
                        "duration": "12 hours",
                        "difficulty": "Intermediate",
                        "type": "Course"
                    }
                ],
                "AWS": [
                    {
                        "title": "AWS Cloud Practitioner Essentials",
                        "description": "Introduction to AWS cloud services",
                        "url": "https://aws.amazon.com/training/course-descriptions/cloud-practitioner-essentials/",
                        "duration": "24 hours",
                        "difficulty": "Beginner",
                        "type": "Course"
                    }
                ]
            }
            
            os.makedirs(self.data_dir, exist_ok=True)
            with open(self.resources_file, 'w') as f:
                json.dump(default_resources, f, indent=2)
    
    def get_recommendations(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        """Get learning recommendations for missing skills"""
        try:
            with open(self.resources_file, 'r') as f:
                resources_data = json.load(f)
            
            recommendations = []
            
            for skill in missing_skills:
                skill_resources = resources_data.get(skill, [])
                if skill_resources:
                    # Add skill name to each resource
                    for resource in skill_resources:
                        resource_with_skill = resource.copy()
                        resource_with_skill["skill"] = skill
                        recommendations.append(resource_with_skill)
                else:
                    # Generic recommendation if specific skill not found
                    recommendations.append({
                        "skill": skill,
                        "title": f"Learn {skill}",
                        "description": f"Search for {skill} tutorials and courses online",
                        "url": f"https://www.google.com/search?q={skill}+tutorial",
                        "duration": "Variable",
                        "difficulty": "Beginner",
                        "type": "Search"
                    })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return []
    
    def add_resource(self, skill: str, resource: Dict[str, str]) -> bool:
        """Add a new learning resource for a skill"""
        try:
            with open(self.resources_file, 'r') as f:
                resources_data = json.load(f)
            
            if skill not in resources_data:
                resources_data[skill] = []
            
            resources_data[skill].append(resource)
            
            with open(self.resources_file, 'w') as f:
                json.dump(resources_data, f, indent=2)
            
            return True
        except Exception as e:
            logger.error(f"Error adding resource for skill {skill}: {str(e)}")
            return False