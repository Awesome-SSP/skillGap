import json
import os
from filelock import FileLock
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class DataStore:
    """Simple JSON file-based data storage with file locking"""
    
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        self.users_file = os.path.join(self.data_dir, "users.json")
        self.lock_file = self.users_file + ".lock"
        
        # Ensure directory and file exist
        os.makedirs(self.data_dir, exist_ok=True)
        if not os.path.exists(self.users_file):
            with open(self.users_file, 'w') as f:
                json.dump({}, f)
    
    def save_user_data(self, user_id: str, data: Dict[str, Any]) -> bool:
        """Save user data with file locking"""
        try:
            with FileLock(self.lock_file):
                # Read existing data
                users_data = {}
                if os.path.exists(self.users_file):
                    with open(self.users_file, 'r') as f:
                        try:
                            users_data = json.load(f)
                        except json.JSONDecodeError:
                            users_data = {}
                
                # Update with new data
                users_data[user_id] = data
                
                # Write back to file
                with open(self.users_file, 'w') as f:
                    json.dump(users_data, f, indent=2)
                
                return True
                
        except Exception as e:
            logger.error(f"Error saving user data for {user_id}: {str(e)}")
            return False
    
    def get_user_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user data with file locking"""
        try:
            with FileLock(self.lock_file):
                if not os.path.exists(self.users_file):
                    return None
                
                with open(self.users_file, 'r') as f:
                    try:
                        users_data = json.load(f)
                        return users_data.get(user_id)
                    except json.JSONDecodeError:
                        return None
                        
        except Exception as e:
            logger.error(f"Error getting user data for {user_id}: {str(e)}")
            return None
    
    def get_all_users(self) -> Dict[str, Any]:
        """Get all users data"""
        try:
            with FileLock(self.lock_file):
                if not os.path.exists(self.users_file):
                    return {}
                
                with open(self.users_file, 'r') as f:
                    try:
                        return json.load(f)
                    except json.JSONDecodeError:
                        return {}
                        
        except Exception as e:
            logger.error(f"Error getting all users data: {str(e)}")
            return {}
    
    def delete_user_data(self, user_id: str) -> bool:
        """Delete user data"""
        try:
            with FileLock(self.lock_file):
                if not os.path.exists(self.users_file):
                    return False
                
                with open(self.users_file, 'r') as f:
                    try:
                        users_data = json.load(f)
                    except json.JSONDecodeError:
                        return False
                
                if user_id in users_data:
                    del users_data[user_id]
                    
                    with open(self.users_file, 'w') as f:
                        json.dump(users_data, f, indent=2)
                    
                    return True
                
                return False
                
        except Exception as e:
            logger.error(f"Error deleting user data for {user_id}: {str(e)}")
            return False