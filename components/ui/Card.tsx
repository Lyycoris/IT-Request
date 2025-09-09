
import React from 'react';

// FIX: Updated Card component to accept and forward standard div HTML attributes for better flexibility.
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// FIX: Updated CardHeader to accept and forward standard div HTML attributes, resolving an error where 'onClick' was not a valid prop. This makes the component usable as a clickable accordion header.
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// FIX: Updated CardTitle component to accept and forward standard heading HTML attributes.
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

// FIX: Updated CardContent to accept and forward standard div HTML attributes, resolving an error where 'id' was not a valid prop. This allows it to be linked with aria-controls for accessibility.
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`p-4 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);
