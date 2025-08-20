import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Briefcase, CheckCircle, X, AlertTriangle, Target } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ResumeData, JobRole, SkillGap } from '../types';
import { api, APIError } from '../utils/api';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [targetRole, setTargetRole] = useState<JobRole | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const steps = ['Upload Resume', 'Analyze Skills', 'Get Recommendations'];

  useEffect(() => {
    // Load data from sessionStorage
    const storedResumeData = sessionStorage.getItem('resumeData');
    const storedTargetRole = sessionStorage.getItem('targetRole');

    if (!storedResumeData || !storedTargetRole) {
      navigate('/upload');
      return;
    }

    const parsedResumeData = JSON.parse(storedResumeData);
    const parsedTargetRole = JSON.parse(storedTargetRole);

    setResumeData(parsedResumeData);
    setTargetRole(parsedTargetRole);

    // Perform skill analysis
    performSkillAnalysis(parsedTargetRole, parsedResumeData);
  }, [navigate]);

  const performSkillAnalysis = async (role: JobRole, resume: ResumeData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for now since backend might not be running
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock analysis based on the data
      const analysis: SkillGap = {
        requiredSkills: role.requiredSkills,
        resumeSkills: resume.skills,
        matchingSkills: resume.skills.filter(skill => 
          role.requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
        ),
        missingSkills: role.requiredSkills.filter(req => 
          !resume.skills.some(skill => skill.toLowerCase() === req.toLowerCase())
        )
      };
      
      setSkillGap(analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to analyze skills. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = () => {
    if (skillGap) {
      sessionStorage.setItem('skillGap', JSON.stringify(skillGap));
      navigate('/recommendations');
    }
  };

  if (!resumeData || !targetRole) {
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
              onClick={() => navigate('/upload')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Upload</span>
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
          <ProgressBar currentStep={2} steps={steps} />

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Skill Gap Analysis
            </h1>
            <p className="text-lg text-gray-600">
              Here's your detailed skill comparison for the {targetRole.title} role
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Resume Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                <User className="inline-block h-5 w-5 mr-2" />
                Your Profile
              </h2>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{resumeData.name}</p>
                    <p className="text-sm text-gray-500">Professional</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{resumeData.contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{resumeData.contact.phone}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-900">{exp.role}</p>
                        <p className="text-sm text-gray-600">{exp.company} • {exp.years} years</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Current Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Role Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                <Target className="inline-block h-5 w-5 mr-2" />
                Target Role
              </h2>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{targetRole.title}</h3>
                  <p className="text-purple-600 font-medium">{targetRole.category}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Skills ({targetRole.requiredSkills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {targetRole.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6 border-b border-blue-400 pb-4">
                Quick Overview
              </h2>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{resumeData.skills.length}</div>
                  <div className="text-blue-100 text-sm">Your Skills</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{targetRole.requiredSkills.length}</div>
                  <div className="text-blue-100 text-sm">Required Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {skillGap ? Math.round((skillGap.matchingSkills.length / skillGap.requiredSkills.length) * 100) : '...'}%
                  </div>
                  <div className="text-blue-100 text-sm">Match Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Comparison */}
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-pulse">
              <LoadingSpinner size="lg" />
              <p className="mt-6 text-lg text-gray-600">Analyzing your skill gap...</p>
              <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => performSkillAnalysis(targetRole, resumeData)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : skillGap ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                📊 Detailed Analysis Results
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {skillGap.matchingSkills.length}
                  </div>
                  <div className="text-sm text-green-700 font-semibold">Skills You Have</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <X className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {skillGap.missingSkills.length}
                  </div>
                  <div className="text-sm text-red-700 font-semibold">Skills to Learn</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.round((skillGap.matchingSkills.length / skillGap.requiredSkills.length) * 100)}%
                  </div>
                  <div className="text-sm text-blue-700 font-semibold">Match Rate</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round((skillGap.matchingSkills.length / skillGap.requiredSkills.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.round((skillGap.matchingSkills.length / skillGap.requiredSkills.length) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {skillGap.matchingSkills.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Skills You Already Have ({skillGap.matchingSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.matchingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white text-green-800 text-sm rounded-full font-medium border border-green-200 shadow-sm"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                  </div>
                )}

                {skillGap.missingSkills.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                    <X className="h-5 w-5 mr-2" />
                    Skills You Need to Learn ({skillGap.missingSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white text-red-800 text-sm rounded-full font-medium border border-red-200 shadow-sm"
                      >
                        • {skill}
                      </span>
                    ))}
                  </div>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-gray-200 mt-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready for the Next Step?</h3>
                    <p className="text-gray-600">Get personalized learning recommendations to bridge your skill gap</p>
                  </div>
                  <button
                    onClick={handleGetRecommendations}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 whitespace-nowrap"
                  >
                    <span>Get Learning Plan</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AnalysisPage;