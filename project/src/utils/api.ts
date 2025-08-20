const API_BASE_URL = 'http://localhost:8000';

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(
      `API Error: ${response.status} - ${errorText}`,
      response.status
    );
  }
  
  return response.json();
}

export const api = {
  uploadResume: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload_resume`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },

  analyzeSkills: async (targetRole: string, resumeData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/analyze_skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_role: targetRole, resume_data: resumeData }),
    });
    
    return handleResponse(response);
  },

  getRecommendations: async (missingSkills: string[]): Promise<any> => {
    const params = new URLSearchParams();
    missingSkills.forEach(skill => params.append('skills', skill));
    
    const response = await fetch(`${API_BASE_URL}/recommendations?${params.toString()}`);
    
    return handleResponse(response);
  },

  saveLearningPlan: async (planData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/save_learning_plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    
    return handleResponse(response);
  },

  getLearningPlans: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/learning_plans`);
    
    return handleResponse(response);
  }
};