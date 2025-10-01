'use client';
import React from 'react';

const Spinner = ({ 
  size = 'md', 
  color = 'red', 
  overlay = false, 
  text = null,
  className = '' 
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Color configurations
  const colorClasses = {
    red: 'border-[rgb(206,32,39,255)]',
    white: 'border-white',
    gray: 'border-gray-500',
    blue: 'border-blue-500'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div 
        className={`
          animate-spin rounded-full border-t-2 border-b-2 border-transparent
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
      />
      {text && (
        <p className={`text-sm font-medium ${
          color === 'white' ? 'text-white' : 
          color === 'red' ? 'text-[rgb(206,32,39,255)]' : 
          'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );

  // If overlay is true, wrap in a full-screen overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default Spinner;