import axios from 'axios'
import { 
  ResumeData, 
  SkillGapAnalysis, 
  LearningResource, 
  RolesResponse, 
  RecommendationsResponse,
  SavePlanRequest,
  UserDataResponse,
  LearningPlan
} from '../types/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.statusText
      throw new Error(`API Error (${error.response.status}): ${message}`)
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network error: Unable to connect to server. Make sure the backend is running on http://localhost:8000')
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`)
    }
  }
)

// API Methods
export const apiService = {
  // Upload and parse resume
  async uploadResume(file: File, targetRole: string): Promise<ResumeData> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_role', targetRole)
    
    const response = await api.post<ResumeData>('/upload_resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },

  // Analyze skill gaps
  async analyzeSkills(userId: string, targetRole: string): Promise<SkillGapAnalysis> {
    const response = await api.post<SkillGapAnalysis>('/analyze_skills', null, {
      params: { user_id: userId, target_role: targetRole }
    })
    
    return response.data
  },

  // Get available job roles
  async getRoles(): Promise<string[]> {
    const response = await api.get<RolesResponse>('/roles')
    return response.data.roles
  },

  // Get learning recommendations
  async getRecommendations(missingSkills: string[], userId?: string): Promise<LearningResource[]> {
    const response = await api.post<RecommendationsResponse>('/recommendations', {
      missing_skills: missingSkills,
      user_id: userId
    })
    
    return response.data.recommendations
  },

  // Save learning plan
  async saveLearningPlan(userId: string, plan: LearningPlan): Promise<void> {
    const request: SavePlanRequest = {
      user_id: userId,
      plan
    }
    
    await api.post('/save_plan', request)
  },

  // Get user data and learning plans
  async getUserData(userId: string): Promise<UserDataResponse> {
    const response = await api.get<UserDataResponse>(`/user/${userId}`)
    return response.data
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health')
      return true
    } catch {
      return false
    }
  }
}

export default apiService