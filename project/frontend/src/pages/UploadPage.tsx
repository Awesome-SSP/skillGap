import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUpload } from '../components/FileUpload'
import { RoleSelect } from '../components/RoleSelect'
import { ProgressStepper, Step } from '../components/ProgressStepper'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Upload, ArrowRight, CheckCircle } from 'lucide-react'
import { apiService } from '../services/api'
import { ResumeData } from '../types/api'

interface UploadPageProps {
  onResumeUploaded: (data: ResumeData) => void
}

export const UploadPage: React.FC<UploadPageProps> = ({ onResumeUploaded }) => {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  const steps: Step[] = [
    {
      id: 'upload',
      title: 'Upload',
      description: 'Upload your resume'
    },
    {
      id: 'analyze',
      title: 'Analyze',
      description: 'Compare skills'
    },
    {
      id: 'learn',
      title: 'Learn',
      description: 'Get recommendations'
    }
  ]

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setUploadError(null)
    setResumeData(null)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadError(null)
    setResumeData(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedRole) {
      setUploadError('Please select a file and target role')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const data = await apiService.uploadResume(selectedFile, selectedRole)
      
      setResumeData(data)
      onResumeUploaded(data)
      
      // Navigate after a brief delay to show success
      setTimeout(() => {
        navigate('/analysis')
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const canUpload = selectedFile && selectedRole && !isUploading

  if (resumeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProgressStepper
          steps={steps}
          currentStep="upload"
          completedSteps={['upload']}
        />
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Resume Processed Successfully!
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto mb-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{resumeData.name}</h3>
            <p className="text-gray-600 mb-3">{resumeData.contact.email}</p>
            <div className="text-sm text-gray-500">
              <p>Skills found: {resumeData.skills.length}</p>
              <p>Target role: {resumeData.target_role}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Redirecting to analysis...
          </p>
          
          <LoadingSpinner size="md" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProgressStepper
        steps={steps}
        currentStep="upload"
        completedSteps={[]}
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Resume
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your PDF resume and select your target job role. Our AI will analyze your skills 
          and compare them against industry requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary-600" />
              Step 1: Upload Resume
            </h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
              isUploading={isUploading}
              error={uploadError}
            />
          </div>

          {selectedFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">
                  Resume ready for processing
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ArrowRight className="h-5 w-5 mr-2 text-primary-600" />
              Step 2: Select Target Role
            </h2>
            <RoleSelect
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
          </div>

          {selectedRole && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-blue-800 font-medium">
                  Target role selected: {selectedRole}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleUpload}
          disabled={!canUpload}
          className={`
            inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-lg
            transition-all duration-200 shadow-lg hover:shadow-xl
            ${canUpload
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Processing Resume...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Analyze Resume</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {!canUpload && !isUploading && (
          <p className="text-sm text-gray-500 mt-2">
            Please upload a resume and select a target role to continue
          </p>
        )}
      </div>
    </div>
  )
}