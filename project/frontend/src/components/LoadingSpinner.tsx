import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </span>
      )}
    </div>
  )
}

interface PageLoadingSpinnerProps {
  message?: string
}

export const PageLoadingSpinner: React.FC<PageLoadingSpinnerProps> = ({
  message = 'Loading...'
}) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="text-lg font-medium text-gray-900">{message}</span>
      </div>
      <div className="text-sm text-gray-500 animate-pulse">
        Please wait while we process your request...
      </div>
    </div>
  )
}