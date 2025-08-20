import json
import os
import uuid
from typing import Dict, List, Any
from datetime import datetime

class DatabaseManager:
    def __init__(self):
        # Initialize JSON storage directory
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "storage")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize storage files
        self.resumes_file = os.path.join(self.data_dir, "resumes.json")
        self.learning_plans_file = os.path.join(self.data_dir, "learning_plans.json")
        
        # Ensure files exist
        self._ensure_file_exists(self.resumes_file, [])
        self._ensure_file_exists(self.learning_plans_file, [])
    
    def _ensure_file_exists(self, file_path: str, default_content: Any):
        """Ensure a JSON file exists with default content."""
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                json.dump(default_content, f, indent=2)
    
    def _load_json(self, file_path: str) -> Any:
        """Load data from JSON file."""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return [] if file_path.endswith('.json') else {}
    
    def _save_json(self, file_path: str, data: Any):
        """Save data to JSON file."""
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    def store_resume_data(self, resume_data: Dict[str, Any]) -> str:
        """Store resume data and return unique ID."""
        # Load existing resumes
        resumes = self._load_json(self.resumes_file)
        
        # Generate unique ID
        resume_id = str(uuid.uuid4())
        
        # Add metadata
        resume_entry = {
            "id": resume_id,
            "timestamp": datetime.now().isoformat(),
            "data": resume_data
        }
        
        # Add to list
        resumes.append(resume_entry)
        
        # Save back to file
        self._save_json(self.resumes_file, resumes)
        
        return resume_id
    
    def get_resume_data(self, resume_id: str) -> Dict[str, Any]:
        """Retrieve resume data by ID."""
        resumes = self._load_json(self.resumes_file)
        
        for resume in resumes:
            if resume["id"] == resume_id:
                return resume["data"]
        
        return {}
    
    def store_learning_plan(self, plan_data: Dict[str, Any]) -> str:
        """Store learning plan and return unique ID."""
        # Load existing plans
        plans = self._load_json(self.learning_plans_file)
        
        # Generate unique ID
        plan_id = str(uuid.uuid4())
        
        # Add metadata
        plan_entry = {
            "id": plan_id,
            "timestamp": datetime.now().isoformat(),
            "data": plan_data
        }
        
        # Add progress tracking
        plan_entry["data"]["progress"] = {}
        
        # Add to list
        plans.append(plan_entry)
        
        # Save back to file
        self._save_json(self.learning_plans_file, plans)
        
        return plan_id
    
    def get_learning_plans(self) -> List[Dict[str, Any]]:
        """Retrieve all learning plans."""
        plans = self._load_json(self.learning_plans_file)
        
        # Return plan data with IDs
        result = []
        for plan in plans:
            plan_data = plan["data"].copy()
            plan_data["id"] = plan["id"]
            result.append(plan_data)
        
        return result
    
    def update_learning_progress(self, plan_id: str, skill: str, progress: int) -> bool:
        """Update progress for a specific skill in a learning plan."""
        plans = self._load_json(self.learning_plans_file)
        
        for plan in plans:
            if plan["id"] == plan_id:
                if "progress" not in plan["data"]:
                    plan["data"]["progress"] = {}
                
                plan["data"]["progress"][skill] = progress
                self._save_json(self.learning_plans_file, plans)
                return True
        
        return False