import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageLoadingSpinner } from '../components/LoadingSpinner'
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Upload,
  BarChart3,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { apiService } from '../services/api'
import { UserDataResponse, LearningPlan } from '../types/api'

interface DashboardProps {
  userId: string | null
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [userData, setUserData] = useState<UserDataResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        setError(null)
        const data = await apiService.getUserData(userId)
        setUserData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (isLoading) {
    return <PageLoadingSpinner message="Loading your dashboard..." />
  }

  if (!userId || !userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Found</h2>
          <p className="text-gray-600 mb-6">
            Upload a resume to start analyzing your skills and create learning plans.
          </p>
          <Link to="/upload" className="btn-primary flex items-center space-x-2 mx-auto w-fit">
            <Upload className="h-4 w-4" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link to="/upload" className="btn-primary">
            Start Over
          </Link>
        </div>
      </div>
    )
  }

  const learningPlans = userData.learning_plans || []
  const totalResources = learningPlans.reduce((sum, plan) => sum + plan.resources.length, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userData.name}!
        </h1>
        <p className="text-lg text-gray-600">
          Track your learning progress and manage your skill development plans.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{userData.skills.length}</p>
              <p className="text-sm font-medium text-gray-600">Current Skills</p>
            </div>
          </div>
        </div>

        <div className="card bg-secondary-50 border-secondary-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-600">{learningPlans.length}</p>
              <p className="text-sm font-medium text-gray-600">Learning Plans</p>
            </div>
          </div>
        </div>

        <div className="card bg-accent-50 border-accent-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-600">{totalResources}</p>
              <p className="text-sm font-medium text-gray-600">Learning Resources</p>
            </div>
          </div>
        </div>

        <div className="card bg-orange-50 border-orange-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {userData.upload_timestamp ? new Date(userData.upload_timestamp).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm font-medium text-gray-600">Last Analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {/* Learning Plans */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Learning Plans</h2>
              <Link 
                to="/upload" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Create New Plan
              </Link>
            </div>

            {learningPlans.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No learning plans yet</p>
                <Link to="/upload" className="btn-primary">
                  Create Your First Plan
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {learningPlans.map((plan: LearningPlan, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">Target Role: {plan.target_role}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{plan.estimated_duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {plan.missing_skills.slice(0, 3).map((skill: string) => (
                        <span 
                          key={skill}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {plan.missing_skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                          +{plan.missing_skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600">
                      {plan.resources.length} learning resources
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{userData.name}</h3>
              {userData.contact.email && (
                <p className="text-gray-600">{userData.contact.email}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Target Role</h4>
                <p className="text-gray-600">{userData.target_role || 'Not set'}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skills ({userData.skills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {userData.skills.slice(0, 6).map((skill: string) => (
                    <span 
                      key={skill}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {userData.skills.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                      +{userData.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {userData.experience && userData.experience.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recent Experience</h4>
                  <div className="space-y-2">
                    {userData.experience.slice(0, 2).map((exp, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-gray-900">{exp.role}</p>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                to="/upload" 
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>New Analysis</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Resources */}
      {totalResources > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningPlans
              .flatMap(plan => plan.resources)
              .slice(0, 6)
              .map((resource, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{resource.difficulty}</span>
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}