import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgressStepper, Step } from '../components/ProgressStepper'
import { PageLoadingSpinner } from '../components/LoadingSpinner'
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  Save,
  CheckCircle,
  Star,
  Filter
} from 'lucide-react'
import { apiService } from '../services/api'
import { SkillGapAnalysis, LearningResource, LearningPlan } from '../types/api'

interface RecommendationsPageProps {
  analysisData: SkillGapAnalysis | null
  recommendations: LearningResource[]
  onRecommendationsLoaded: (recommendations: LearningResource[]) => void
  userId: string | null
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  analysisData,
  recommendations,
  onRecommendationsLoaded,
  userId
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const steps: Step[] = [
    { id: 'upload', title: 'Upload', description: 'Upload your resume' },
    { id: 'analyze', title: 'Analyze', description: 'Compare skills' },
    { id: 'learn', title: 'Learn', description: 'Get recommendations' }
  ]

  useEffect(() => {
    if (!analysisData) {
      navigate('/upload')
      return
    }

    const fetchRecommendations = async () => {
      if (recommendations.length > 0) return // Already loaded

      try {
        setIsLoading(true)
        setError(null)

        const recs = await apiService.getRecommendations(
          analysisData.missing_skills,
          userId || undefined
        )

        onRecommendationsLoaded(recs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [analysisData, recommendations.length, onRecommendationsLoaded, userId, navigate])

  const handleSavePlan = async () => {
    if (!analysisData || !userId || recommendations.length === 0) return

    try {
      setIsSaving(true)

      const plan: LearningPlan = {
        name: `${analysisData.target_role} Learning Plan`,
        target_role: analysisData.target_role,
        missing_skills: analysisData.missing_skills,
        resources: recommendations,
        estimated_duration: calculateTotalDuration(recommendations)
      }

      await apiService.saveLearningPlan(userId, plan)
      setSavedSuccess(true)

      // Show success message for a few seconds
      setTimeout(() => setSavedSuccess(false), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save learning plan')
    } finally {
      setIsSaving(false)
    }
  }

  const calculateTotalDuration = (resources: LearningResource[]): string => {
    // Simple duration calculation - in a real app, you'd parse the duration strings properly
    const totalHours = resources.length * 10 // Rough estimate
    return `~${totalHours} hours`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'course': return <TrendingUp className="h-4 w-4" />
      case 'book': return <BookOpen className="h-4 w-4" />
      case 'video': return <Star className="h-4 w-4" />
      default: return <ExternalLink className="h-4 w-4" />
    }
  }

  const filteredRecommendations = recommendations.filter(rec => {
    const difficultyMatch = selectedDifficulty === 'All' || rec.difficulty === selectedDifficulty
    const typeMatch = selectedType === 'All' || rec.type === selectedType
    return difficultyMatch && typeMatch
  })

  const uniqueSkills = Array.from(new Set(recommendations.map(rec => rec.skill).filter(Boolean)))
  const uniqueDifficulties = Array.from(new Set(recommendations.map(rec => rec.difficulty)))
  const uniqueTypes = Array.from(new Set(recommendations.map(rec => rec.type)))

  if (!analysisData) {
    return <PageLoadingSpinner message="Loading analysis data..." />
  }

  if (isLoading) {
    return <PageLoadingSpinner message="Finding the best learning resources for you..." />
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Recommendations</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/analysis')}
            className="btn-primary"
          >
            Back to Analysis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProgressStepper
        steps={steps}
        currentStep="learn"
        completedSteps={['upload', 'analyze', 'learn']}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Learning Recommendations
        </h1>
        <p className="text-lg text-gray-600">
          Curated resources to help you master the skills needed for {analysisData.target_role}
        </p>
        
        {savedSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Learning plan saved successfully!</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-primary-50 border-primary-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {analysisData.missing_skills.length}
            </div>
            <p className="font-medium text-gray-900">Skills to Learn</p>
          </div>
        </div>

        <div className="card bg-secondary-50 border-secondary-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-2">
              {recommendations.length}
            </div>
            <p className="font-medium text-gray-900">Learning Resources</p>
          </div>
        </div>

        <div className="card bg-accent-50 border-accent-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-600 mb-2">
              {calculateTotalDuration(recommendations)}
            </div>
            <p className="font-medium text-gray-900">Estimated Time</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="All">All Levels</option>
            {uniqueDifficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="All">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="ml-auto">
            <button
              onClick={handleSavePlan}
              disabled={isSaving || !userId}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Learning Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations by Skill */}
      <div className="space-y-8">
        {uniqueSkills.map(skill => {
          const skillResources = filteredRecommendations.filter(rec => rec.skill === skill)
          
          if (skillResources.length === 0) return null

          return (
            <div key={skill} className="space-y-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-semibold text-gray-900">{skill}</h2>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium">
                  {skillResources.length} resource{skillResources.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillResources.map((resource, index) => (
                  <div key={index} className="card hover:shadow-xl transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(resource.type)}
                        <span className="text-sm font-medium text-gray-600">{resource.type}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{resource.duration}</span>
                      </div>
                    </div>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium group-hover:underline"
                    >
                      <span>View Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredRecommendations.length === 0 && recommendations.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No resources match the selected filters.</p>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-12 card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Start Learning?</h3>
          <p className="text-gray-600 mb-6">
            Save your learning plan and track your progress as you work towards becoming job-ready for {analysisData.target_role}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              View Dashboard
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="btn-outline"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}