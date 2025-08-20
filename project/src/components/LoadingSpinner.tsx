import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'green';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    green: 'border-green-600'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        border-2 ${colorClasses[color]} border-t-transparent
        rounded-full animate-spin
      `}
    />
  );
};

export default LoadingSpinner;