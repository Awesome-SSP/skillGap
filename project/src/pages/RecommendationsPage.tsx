import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Star, ExternalLink, Download, Save, CheckCircle } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { SkillGap, Recommendation, JobRole } from '../types';
import { api, APIError } from '../utils/api';

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [targetRole, setTargetRole] = useState<JobRole | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const steps = ['Upload Resume', 'Analyze Skills', 'Get Recommendations'];

  useEffect(() => {
    // Load data from sessionStorage
    const storedSkillGap = sessionStorage.getItem('skillGap');
    const storedTargetRole = sessionStorage.getItem('targetRole');

    if (!storedSkillGap || !storedTargetRole) {
      navigate('/upload');
      return;
    }

    const parsedSkillGap = JSON.parse(storedSkillGap);
    const parsedTargetRole = JSON.parse(storedTargetRole);

    setSkillGap(parsedSkillGap);
    setTargetRole(parsedTargetRole);

    // Get recommendations
    getRecommendations(parsedSkillGap.missingSkills);
  }, [navigate]);

  const getRecommendations = async (missingSkills: string[]) => {
    setIsLoading(true);
    setError('');

    try {
      const recs = await api.getRecommendations(missingSkills);
      setRecommendations(recs);
    } catch (err) {
      console.error('Recommendations error:', err);
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to get recommendations. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!recommendations.length || !targetRole) return;

    setIsSaving(true);
    try {
      const planData = {
        targetRole: targetRole.title,
        recommendations,
        createdAt: new Date().toISOString()
      };

      await api.saveLearningPlan(planData);
      setSaved(true);
      
      // Show success message for a moment then navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Save plan error:', err);
      setError('Failed to save learning plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = () => {
    // This would integrate with a PDF generation service
    // For now, we'll just show an alert
    alert('PDF download feature will be available soon!');
  };

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 border-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Advanced': 'bg-red-100 text-red-800 border-red-200'
  };

  if (!skillGap || !targetRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/analysis')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Analysis</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-xl font-bold text-gray-900">SkillBridge</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ProgressBar currentStep={3} steps={steps} />

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Learning Plan
            </h1>
            <p className="text-lg text-gray-600">
              Curated resources to help you become a {targetRole.title}
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">{skillGap.missingSkills.length}</div>
                <div className="text-blue-100">Skills to Master</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">
                  {recommendations.reduce((total, rec) => total + rec.estimatedHours, 0)}
                </div>
                <div className="text-blue-100">Total Study Hours</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">
                  {recommendations.filter(r => r.difficulty === 'Beginner').length}
                </div>
                <div className="text-blue-100">Beginner Friendly</div>
              </div>
            </div>
          </div>

          {/* Learning Recommendations */}
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Generating your personalized learning plan...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => getRecommendations(skillGap.missingSkills)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{recommendation.skill}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                              difficultyColors[recommendation.difficulty]
                            }`}>
                              {recommendation.difficulty}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {recommendation.estimatedHours} hours
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {recommendation.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Recommended Resources:</h4>
                        <div className="grid gap-3">
                          {recommendation.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className="px-2 py-1 text-xs font-medium bg-white rounded border">
                                    {resource.type}
                                  </span>
                                  <h5 className="font-medium text-gray-900">{resource.title}</h5>
                                </div>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                  <span>{resource.provider}</span>
                                  <span>{resource.duration}</span>
                                  {resource.rating && (
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                      <span>{resource.rating}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Ready to start your learning journey?
                    </h3>
                    <p className="text-gray-600">
                      Save this plan to track your progress or download as PDF
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={downloadPDF}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      onClick={handleSavePlan}
                      disabled={isSaving || saved}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-2 ${
                        saved
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <LoadingSpinner size="sm" color="white" />
                          <span>Saving...</span>
                        </>
                      ) : saved ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save to Dashboard</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;