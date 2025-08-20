import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePDFFile, formatFileSize } from '../utils/fileValidation';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, error }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragError, setDragError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragError('');
    
    if (rejectedFiles.length > 0) {
      setDragError('Invalid file type. Please upload a PDF file only.');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validation = validatePDFFile(file);
      
      if (!validation.isValid) {
        setDragError(validation.error || 'Invalid file');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  const removeFile = () => {
    setSelectedFile(null);
    setDragError('');
  };

  const displayError = error || dragError;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 hover:scale-[1.02] transform
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : selectedFile 
              ? 'border-green-500 bg-green-50' 
              : displayError 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {selectedFile ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 animate-in fade-in duration-300" />
          ) : displayError ? (
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 animate-in fade-in duration-300" />
          ) : (
            <Upload className={`mx-auto h-12 w-12 transition-colors duration-300 ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
          )}
          
          <div>
            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-green-700">File Ready!</p>
                <p className="text-sm text-gray-600">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-semibold text-blue-600">Drop your resume here!</p>
            ) : (
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {isLoading ? 'Processing...' : 'Upload Your Resume'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag and drop your PDF resume here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{selectedFile.name}</p>
                <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-green-100 rounded-full transition-colors duration-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{displayError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;