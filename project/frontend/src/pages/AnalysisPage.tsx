import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgressStepper, Step } from '../components/ProgressStepper'
import { PageLoadingSpinner } from '../components/LoadingSpinner'
import { User, Mail, Phone, MapPin, Briefcase, CheckCircle, X, ArrowRight } from 'lucide-react'
import { apiService } from '../services/api'
import { ResumeData, SkillGapAnalysis } from '../types/api'

interface AnalysisPageProps {
  resumeData: ResumeData | null
  onAnalysisComplete: (analysis: SkillGapAnalysis) => void
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  resumeData,
  onAnalysisComplete
}) => {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps: Step[] = [
    { id: 'upload', title: 'Upload', description: 'Upload your resume' },
    { id: 'analyze', title: 'Analyze', description: 'Compare skills' },
    { id: 'learn', title: 'Learn', description: 'Get recommendations' }
  ]

  useEffect(() => {
    if (!resumeData) {
      navigate('/upload')
      return
    }

    const performAnalysis = async () => {
      if (analysis) {
        return
      }

      if (!resumeData.user_id || !resumeData.target_role) {
        console.log("Waiting for user_id and target_role...");
        return
      }

      try {
        setIsAnalyzing(true)
        setError(null)

        const analysisResult = await apiService.analyzeSkills(
          resumeData.user_id,
          resumeData.target_role
        )

        setAnalysis(analysisResult)
        onAnalysisComplete(analysisResult)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed')
      } finally {
        setIsAnalyzing(false)
      }
    }

    performAnalysis()
    
  }, [resumeData?.user_id, resumeData?.target_role, analysis, onAnalysisComplete, navigate])

  if (!resumeData) {
    return <PageLoadingSpinner message="Loading resume data..." />
  }

  if (isAnalyzing) {
    return <PageLoadingSpinner message="Analyzing your skills..." />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // FIX: Restored the UI code to display the analysis results.
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProgressStepper
        steps={steps}
        currentStep="analyze"
        completedSteps={['upload', 'analyze']}
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Skill Gap Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Here's how your skills compare to the requirements for {resumeData.target_role}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{resumeData.name}</h2>
            </div>

            <div className="space-y-4">
              {resumeData.contact.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{resumeData.contact.email}</span>
                </div>
              )}
              
              {resumeData.contact.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{resumeData.contact.phone}</span>
                </div>
              )}
              
              {resumeData.contact.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{resumeData.contact.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Target: {resumeData.target_role}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Your Skills ({resumeData.skills.length})</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {resumeData.experience.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Experience</h3>
                <div className="space-y-3">
                  {resumeData.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900">{exp.role}</p>
                      <p className="text-gray-600">{exp.company}</p>
                      {exp.years && (
                        <p className="text-gray-500">{exp.years} years</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-2">
          {analysis && (
            <div className="space-y-6">
              {/* Match Score */}
              <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {Math.round(analysis.match_percentage)}%
                  </div>
                  <p className="text-lg font-medium text-gray-900">Skill Match</p>
                  <p className="text-gray-600">
                    You have {analysis.matched_skills.length} out of {analysis.required_skills.length} required skills
                  </p>
                </div>
              </div>

              {/* Skills Comparison Table */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills Breakdown</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Required Skills</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Your Skills</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.required_skills.map((skill, index) => {
                        const hasSkill = analysis.matched_skills.includes(skill)
                        return (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {skill}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                hasSkill 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {hasSkill ? skill : 'Not found'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {hasSkill ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Missing Skills */}
              {analysis.missing_skills.length > 0 && (
                <div className="card border-red-200 bg-red-50">
                  <h3 className="text-xl font-semibold text-red-900 mb-4">
                    Skills to Learn ({analysis.missing_skills.length})
                  </h3>
                  <p className="text-red-700 mb-4">
                    Focus on these skills to become job-ready for {analysis.target_role}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {analysis.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-200 text-red-800 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigate('/recommendations')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Get Learning Recommendations</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* All Skills Match */}
              {analysis.missing_skills.length === 0 && (
                <div className="card border-green-200 bg-green-50">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                      Congratulations!
                    </h3>
                    <p className="text-green-700 mb-4">
                      You have all the required skills for {analysis.target_role}
                    </p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="btn-primary"
                    >
                      View Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AnalysisPage