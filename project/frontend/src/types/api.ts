// API Response Types matching backend Pydantic models

export interface ContactInfo {
  email?: string
  phone?: string
  linkedin?: string
  location?: string
}

export interface Experience {
  company: string
  role: string
  start_date?: string
  end_date?: string
  years?: number
  description?: string
}

export interface ResumeData {
  user_id: string
  name: string
  contact: ContactInfo
  skills: string[]
  experience: Experience[]
  parsed_text_snippet: string
  target_role?: string
  upload_timestamp: string
}

export interface SkillGapAnalysis {
  user_id: string
  target_role: string
  required_skills: string[]
  user_skills: string[]
  matched_skills: string[]
  missing_skills: string[]
  match_percentage: number
}

export interface LearningResource {
  skill?: string
  title: string
  description: string
  url: string
  duration: string
  difficulty: string // "Beginner" | "Intermediate" | "Advanced"
  type: string // "Course" | "Article" | "Video" | "Book" | etc.
}

export interface LearningPlan {
  name: string
  target_role: string
  missing_skills: string[]
  resources: LearningResource[]
  estimated_duration: string
}

export interface RecommendationRequest {
  missing_skills: string[]
  user_id?: string
}

export interface SavePlanRequest {
  user_id: string
  plan: LearningPlan
}

// API Response wrappers
export interface RolesResponse {
  roles: string[]
}

export interface RecommendationsResponse {
  recommendations: LearningResource[]
}

export interface UserDataResponse extends ResumeData {
  learning_plans?: LearningPlan[]
}

// UI State Types
export interface UploadState {
  isUploading: boolean
  isDragActive: boolean
  uploadProgress: number
  error: string | null
}

export interface AnalysisState {
  isAnalyzing: boolean
  error: string | null
}

export interface RecommendationState {
  isLoading: boolean
  isSaving: boolean
  error: string | null
}