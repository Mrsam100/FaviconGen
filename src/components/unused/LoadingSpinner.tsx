import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  progress,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6" role="status" aria-live="polite">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin`} />
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-black text-violet-600">{progress}%</span>
          </div>
        )}
      </div>
      {message && (
        <p className={`${textSizeClasses[size]} font-medium text-slate-600 animate-pulse text-center max-w-xs`}>
          {message}
        </p>
      )}
    </div>
  );
};
