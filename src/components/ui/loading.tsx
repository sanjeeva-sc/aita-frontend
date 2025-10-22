import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'card';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const LoadingSpinner: React.FC<{ size: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size, 
  className 
}) => (
  <Loader2 
    className={cn(
      'animate-spin text-primary',
      sizeClasses[size],
      className
    )} 
  />
);

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  variant = 'default',
  className,
}) => {
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <LoadingSpinner size={size} />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-slate-200',
        className
      )}>
        <LoadingSpinner size={size} className="mb-3" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center min-h-[200px]',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size={size} className="mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Inline loading component for buttons and small spaces
export const InlineLoading: React.FC<{ 
  size?: 'sm' | 'md'; 
  className?: string;
}> = ({ 
  size = 'sm', 
  className 
}) => (
  <LoadingSpinner size={size} className={className} />
);

// Page-level loading component
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = 'Loading page...' 
}) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-slate-600">{message}</p>
    </div>
  </div>
);

// Section loading component
export const SectionLoading: React.FC<{ 
  message?: string;
  height?: string;
}> = ({ 
  message = 'Loading...', 
  height = 'h-32' 
}) => (
  <div className={cn('flex items-center justify-center', height)}>
    <div className="text-center">
      <LoadingSpinner size="md" className="mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);