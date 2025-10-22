import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  Upload, 
  Download,
  Brain,
  FileText,
  Trash2,
  Share2,
  Copy,
  X
} from 'lucide-react';
import { Button } from './button';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

export interface EnhancedToastOptions {
  title?: string;
  description?: string;
  action?: ToastAction;
  duration?: number;
  dismissible?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const getIcon = (type: 'success' | 'error' | 'warning' | 'info' | 'loading') => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-600" />;
    case 'loading':
      return <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
    default:
      return null;
  }
};

const createToast = (
  type: 'success' | 'error' | 'warning' | 'info' | 'loading',
  message: string,
  options: EnhancedToastOptions = {}
) => {
  const { title, description, action, duration = 4000, dismissible = true } = options;
  
  return sonnerToast.custom(
    (t) => (
      <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[300px] max-w-[500px]">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(type)}
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-gray-900 mb-1">
              {title}
            </div>
          )}
          <div className="text-sm text-gray-700">
            {message}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-1">
              {description}
            </div>
          )}
          
          {action && (
            <div className="mt-3">
              <Button
                size="sm"
                variant={action.variant || 'default'}
                onClick={() => {
                  action.onClick();
                  sonnerToast.dismiss(t);
                }}
                className="h-8 px-3 text-xs"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    ),
    {
      duration: type === 'loading' ? Infinity : duration,
      position: options.position || 'top-right',
    }
  );
};

// Enhanced toast functions with better UX
export const enhancedToast = {
  success: (message: string, options?: EnhancedToastOptions) => 
    createToast('success', message, options),
    
  error: (message: string, options?: EnhancedToastOptions) => 
    createToast('error', message, { duration: 6000, ...options }),
    
  warning: (message: string, options?: EnhancedToastOptions) => 
    createToast('warning', message, { duration: 5000, ...options }),
    
  info: (message: string, options?: EnhancedToastOptions) => 
    createToast('info', message, options),
    
  loading: (message: string, options?: EnhancedToastOptions) => 
    createToast('loading', message, { dismissible: false, ...options }),

  // Specialized toasts for common actions
  upload: {
    start: (filename: string) => 
      enhancedToast.loading(`Uploading ${filename}...`, {
        title: 'Upload Started',
        description: 'Please wait while we process your file'
      }),
      
    success: (filename: string, action?: ToastAction) => 
      enhancedToast.success(`${filename} uploaded successfully!`, {
        title: 'Upload Complete',
        action
      }),
      
    error: (filename: string, error?: string) => 
      enhancedToast.error(`Failed to upload ${filename}`, {
        title: 'Upload Failed',
        description: error || 'Please try again or contact support'
      })
  },

  generation: {
    start: (type: 'notes' | 'quiz') => 
      enhancedToast.loading(`Generating ${type}...`, {
        title: 'AI Generation in Progress',
        description: 'This may take a few moments'
      }),
      
    success: (type: 'notes' | 'quiz', action?: ToastAction) => 
      enhancedToast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`, {
        title: 'Generation Complete',
        action
      }),
      
    error: (type: 'notes' | 'quiz', error?: string) => 
      enhancedToast.error(`Failed to generate ${type}`, {
        title: 'Generation Failed',
        description: error || 'Please try again with different settings'
      })
  },

  share: {
    success: (type: 'link' | 'quiz') => 
      enhancedToast.success(
        type === 'link' ? 'Link copied to clipboard!' : 'Quiz shared successfully!',
        {
          title: 'Shared',
          description: type === 'link' ? 'You can now paste the link anywhere' : 'Students can now access the quiz'
        }
      ),
      
    error: () => 
      enhancedToast.error('Failed to share', {
        title: 'Share Failed',
        description: 'Please try again or check your permissions'
      })
  },

  delete: {
    confirm: (itemType: string, itemName: string, onConfirm: () => void) => 
      enhancedToast.warning(`Are you sure you want to delete "${itemName}"?`, {
        title: `Delete ${itemType}`,
        description: 'This action cannot be undone',
        action: {
          label: 'Delete',
          onClick: onConfirm,
          variant: 'destructive'
        },
        duration: 8000
      }),
      
    success: (itemType: string) => 
      enhancedToast.success(`${itemType} deleted successfully`, {
        title: 'Deleted'
      }),
      
    error: (itemType: string) => 
      enhancedToast.error(`Failed to delete ${itemType}`, {
        title: 'Delete Failed',
        description: 'Please try again or check your permissions'
      })
  },

  download: {
    start: (filename: string) => 
      enhancedToast.loading(`Preparing ${filename} for download...`, {
        title: 'Download Starting'
      }),
      
    success: (filename: string) => 
      enhancedToast.success(`${filename} downloaded successfully!`, {
        title: 'Download Complete'
      }),
      
    error: (filename: string) => 
      enhancedToast.error(`Failed to download ${filename}`, {
        title: 'Download Failed',
        description: 'Please try again or check your connection'
      })
  },

  // Utility function to dismiss all toasts
  dismissAll: () => sonnerToast.dismiss(),
  
  // Utility function to dismiss a specific toast
  dismiss: (toastId: string | number) => sonnerToast.dismiss(toastId)
};

// Progress toast for long-running operations
export const createProgressToast = (
  title: string,
  initialMessage: string
) => {
  let currentToastId: string | number;
  
  const start = () => {
    currentToastId = enhancedToast.loading(initialMessage, {
      title,
      dismissible: false
    });
    return currentToastId;
  };
  
  const update = (message: string, progress?: number) => {
    if (currentToastId) {
      sonnerToast.dismiss(currentToastId);
    }
    
    const progressText = progress ? ` (${Math.round(progress)}%)` : '';
    currentToastId = enhancedToast.loading(`${message}${progressText}`, {
      title,
      dismissible: false
    });
  };
  
  const complete = (message: string, action?: ToastAction) => {
    if (currentToastId) {
      sonnerToast.dismiss(currentToastId);
    }
    enhancedToast.success(message, { title, action });
  };
  
  const error = (message: string, description?: string) => {
    if (currentToastId) {
      sonnerToast.dismiss(currentToastId);
    }
    enhancedToast.error(message, { title, description });
  };
  
  return { start, update, complete, error };
};