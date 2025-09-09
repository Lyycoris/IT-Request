
import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // Allow for fade-out transition
    }, 2700);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <XCircleIcon className="h-6 w-6 text-white" />,
    },
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg shadow-lg text-white ${config[type].bg} transition-transform transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      {config[type].icon}
      <p className="ml-3 font-medium">{message}</p>
    </div>
  );
};

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 sm:p-6 space-y-3 z-50">
      {children}
    </div>
  );
};
