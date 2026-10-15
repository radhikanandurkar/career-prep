import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-blue-600 mb-3`} />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};

export default Loader;
