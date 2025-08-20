import json
import os
from typing import List, Dict, Any

class RecommendationEngine:
    def __init__(self):
        # Load learning resources data
        self.learning_resources = self._load_learning_resources()
    
    def _load_learning_resources(self) -> Dict[str, Any]:
        """Load learning resources for different skills."""
        resources_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "learning_resources.json")
        
        try:
            with open(resources_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Fallback resources data
            return {
                "Python": {
                    "skill": "Python",
                    "description": "Learn Python programming fundamentals including data structures, functions, and object-oriented programming. Essential for data science, web development, and automation.",
                    "difficulty": "Beginner",
                    "estimatedHours": 40,
                    "resources": [
                        {
                            "title": "Python for Everybody Specialization",
                            "url": "https://www.coursera.org/specializations/python",
                            "type": "Course",
                            "provider": "Coursera",
                            "duration": "8 months",
                            "rating": 4.8
                        },
                        {
                            "title": "Automate the Boring Stuff with Python",
                            "url": "https://automatetheboringstuff.com/",
                            "type": "Book",
                            "provider": "Online Book",
                            "duration": "Self-paced",
                            "rating": 4.7
                        }
                    ]
                },
                "Machine Learning": {
                    "skill": "Machine Learning",
                    "description": "Master machine learning algorithms, model evaluation, and practical implementation using popular libraries like scikit-learn and TensorFlow.",
                    "difficulty": "Intermediate", 
                    "estimatedHours": 60,
                    "resources": [
                        {
                            "title": "Machine Learning Course",
                            "url": "https://www.coursera.org/learn/machine-learning",
                            "type": "Course",
                            "provider": "Coursera",
                            "duration": "11 weeks",
                            "rating": 4.9
                        },
                        {
                            "title": "Hands-On Machine Learning",
                            "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
                            "type": "Book",
                            "provider": "O'Reilly",
                            "duration": "Self-paced",
                            "rating": 4.6
                        }
                    ]
                },
                "React": {
                    "skill": "React",
                    "description": "Learn React.js for building modern, interactive user interfaces with component-based architecture and state management.",
                    "difficulty": "Intermediate",
                    "estimatedHours": 35,
                    "resources": [
                        {
                            "title": "React - The Complete Guide",
                            "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                            "type": "Course", 
                            "provider": "Udemy",
                            "duration": "48.5 hours",
                            "rating": 4.6
                        },
                        {
                            "title": "Official React Tutorial",
                            "url": "https://reactjs.org/tutorial/tutorial.html",
                            "type": "Tutorial",
                            "provider": "React.js",
                            "duration": "2-3 hours",
                            "rating": 4.8
                        }
                    ]
                }
            }
    
    def generate_recommendations(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        """Generate learning recommendations for missing skills."""
        recommendations = []
        
        for skill in missing_skills:
            # Get recommendation for skill
            skill_data = self.learning_resources.get(skill)
            
            if skill_data:
                recommendations.append(skill_data)
            else:
                # Generate generic recommendation for unknown skills
                recommendations.append(self._generate_generic_recommendation(skill))
        
        return recommendations
    
    def _generate_generic_recommendation(self, skill: str) -> Dict[str, Any]:
        """Generate a generic recommendation for skills not in database."""
        return {
            "skill": skill,
            "description": f"Learn {skill} to enhance your professional skills and meet job requirements. This skill is valuable in today's competitive job market.",
            "difficulty": "Intermediate",
            "estimatedHours": 25,
            "resources": [
                {
                    "title": f"{skill} Fundamentals Course",
                    "url": f"https://www.coursera.org/search?query={skill.replace(' ', '%20')}",
                    "type": "Course",
                    "provider": "Coursera",
                    "duration": "4-6 weeks",
                    "rating": 4.5
                },
                {
                    "title": f"Learn {skill} - Free Resources",
                    "url": f"https://www.freecodecamp.org/search?query={skill.replace(' ', '%20')}",
                    "type": "Tutorial",
                    "provider": "FreeCodeCamp",
                    "duration": "Self-paced",
                    "rating": 4.3
                }
            ]
        }