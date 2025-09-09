import React from 'react';

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => {
  return (
    <textarea
      className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/60 focus:border-transparent 
                 sm:text-sm transition-all duration-200 
                 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};