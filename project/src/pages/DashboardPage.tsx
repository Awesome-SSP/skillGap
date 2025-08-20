import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, RotateCcw, TrendingUp, Calendar, Target, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { LearningPlan } from '../types';
import { api, APIError } from '../utils/api';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadLearningPlans();
  }, []);

  const loadLearningPlans = async () => {
    setIsLoading(true);
    setError('');

    try {
      const plans = await api.getLearningPlans();
      setLearningPlans(plans);
    } catch (err) {
      console.error('Load plans error:', err);
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to load learning plans. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallProgress = (plan: LearningPlan) => {
    const totalSkills = plan.recommendations.length;
    const completedSkills = Object.values(plan.progress).filter(progress => progress >= 100).length;
    return totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learning Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track your progress and manage your learning plans
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => navigate('/upload')}
              className="group p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2">Analyze New Resume</h3>
                  <p className="text-blue-100">Upload a new resume for fresh analysis</p>
                </div>
                <RotateCcw className="h-8 w-8 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </button>

            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{learningPlans.length}</div>
                  <div className="text-sm text-gray-500">Learning Plans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {learningPlans.reduce((total, plan) => 
                      total + plan.recommendations.length, 0
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Total Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Plans */}
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading your learning plans...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadLearningPlans}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : learningPlans.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No Learning Plans Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Create your first learning plan by uploading your resume and selecting a target role.
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Plans</h2>
              
              {learningPlans.map((plan, index) => {
                const progress = calculateOverallProgress(plan);
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Target className="h-6 w-6 text-blue-600" />
                          <h3 className="text-xl font-bold text-gray-900">{plan.targetRole}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(plan.createdAt)}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {plan.recommendations.length} skills to master
                          </div>
                          <div className="text-sm text-gray-500">
                            {progress}% complete
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {plan.recommendations.slice(0, 3).map((rec, recIndex) => (
                            <span
                              key={recIndex}
                              className={`px-3 py-1 text-xs rounded-full font-medium ${
                                (plan.progress[rec.skill] || 0) >= 100
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}
                            >
                              {rec.skill}
                            </span>
                          ))}
                          {plan.recommendations.length > 3 && (
                            <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              +{plan.recommendations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            // Store plan data and navigate to recommendations page
                            sessionStorage.setItem('currentPlan', JSON.stringify(plan));
                            navigate('/recommendations');
                          }}
                          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
                        >
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;