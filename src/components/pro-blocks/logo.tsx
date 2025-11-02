import React from 'react';
import { Brain } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Brain className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900 text-black">
        AiTA
      </span>
    </div>
  );
};
