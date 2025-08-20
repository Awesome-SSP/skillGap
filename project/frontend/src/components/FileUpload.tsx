import React, { useCallback, useState, useRef } from 'react'
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onRemoveFile: () => void
  isUploading?: boolean
  error?: string | null
  accept?: string
  maxSize?: number // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  onRemoveFile,
  isUploading = false,
  error = null,
  accept = '.pdf',
  maxSize = 5
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFile = (file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are supported'
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    
    return null
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      const validationError = validateFile(file)
      
      if (!validationError) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect, maxSize])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const validationError = validateFile(file)
      
      if (!validationError) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect, maxSize])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!selectedFile && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragActive 
              ? 'border-primary-400 bg-primary-50 scale-105' 
              : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}
            `}>
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p className="text-sm text-gray-600">
                Drag and drop your PDF file here, or{' '}
                <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PDF only, max {maxSize}MB
              </p>
            </div>
          </div>

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span className="text-sm font-medium text-gray-900">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isUploading && (
                <div className="p-1 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
              
              {!isUploading && (
                <button
                  onClick={onRemoveFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Processing resume...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Upload Error</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}