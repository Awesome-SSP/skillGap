import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import FileUpload from '../components/FileUpload';
import JobRoleSelector from '../components/JobRoleSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { JobRole, ResumeData } from '../types';
import { api, APIError } from '../utils/api';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const steps = ['Upload Resume', 'Analyze Skills', 'Get Recommendations'];

  const handleSubmit = async () => {
    if (!selectedFile || !selectedRole) return;

    setIsLoading(true);
    setError('');

    try {
      // Upload resume and get extracted data
      const resumeData: ResumeData = await api.uploadResume(selectedFile);
      
      // Store data in sessionStorage for the next page
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      sessionStorage.setItem('targetRole', JSON.stringify(selectedRole));
      
      // Navigate to analysis page
      navigate('/analysis');
    } catch (err) {
      console.error('Upload error:', err);
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to process your resume. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = selectedFile && selectedRole && !isLoading;

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
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={1} steps={steps} />

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Let's Analyze Your Skills
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your resume and select your target job role to get started with your personalized skill gap analysis.
              </p>
            </div>

            <div className="space-y-8">
              {/* File Upload Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Step 1: Upload Your Resume
                </h3>
                <FileUpload
                  onFileSelect={setSelectedFile}
                  isLoading={isLoading}
                  error={error}
                />
              </div>

              {/* Job Role Selection */}
              <div className={`transition-all duration-500 ${
                selectedFile ? 'opacity-100' : 'opacity-50 pointer-events-none'
              }`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Step 2: Select Your Target Job Role
                </h3>
                <JobRoleSelector
                  selectedRole={selectedRole}
                  onRoleSelect={setSelectedRole}
                />
              </div>

              {/* Submit Section */}
              <div className={`pt-8 border-t border-gray-200 transition-all duration-500 ${
                canProceed ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {selectedFile && selectedRole ? (
                      <span className="text-green-600 font-medium">
                        ✓ Ready to analyze your skills
                      </span>
                    ) : (
                      'Complete both steps above to proceed'
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed}
                    className={`
                      group px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300
                      inline-flex items-center space-x-2 transform
                      ${canProceed 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Skills</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;