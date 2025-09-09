import React from 'react';

// FIX: Wrapped component with React.forwardRef to allow passing refs to the underlying input element.
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 sm:text-sm transition-all duration-200 
                 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
