export interface ResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  skills: string[];
  experience: Experience[];
}

export interface Experience {
  company: string;
  role: string;
  years: number;
  description?: string;
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  requiredSkills: string[];
}

export interface SkillGap {
  requiredSkills: string[];
  resumeSkills: string[];
  missingSkills: string[];
  matchingSkills: string[];
}

export interface Recommendation {
  skill: string;
  description: string;
  resources: LearningResource[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
}

export interface LearningResource {
  title: string;
  url: string;
  type: 'Course' | 'Article' | 'Video' | 'Book';
  provider: string;
  duration: string;
  rating?: number;
}

export interface LearningPlan {
  id: string;
  targetRole: string;
  recommendations: Recommendation[];
  createdAt: string;
  progress: {
    [skillName: string]: number;
  };
}