import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  Trash2, 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  Brain,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export type DeleteItemType = 'transcript' | 'notes' | 'quiz';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: DeleteItemType;
  itemId: string;
  itemTitle: string;
  onSuccess?: () => void;
  additionalInfo?: {
    createdAt?: string;
    responseCount?: number;
    hasNotes?: boolean;
    hasQuizzes?: boolean;
    notesCount?: number;
    quizCount?: number;
  };
}

const getItemConfig = (type: DeleteItemType) => {
  switch (type) {
    case 'transcript':
      return {
        icon: <FileText className="h-6 w-6" />,
        title: 'Delete Transcript',
        description: 'This action cannot be undone. The transcript and all associated data will be permanently deleted.',
        warningColor: 'text-red-600',
        bgColor: 'bg-red-100',
        endpoint: '/transcript'
      };
    case 'notes':
      return {
        icon: <BookOpen className="h-6 w-6" />,
        title: 'Delete Notes',
        description: 'This action cannot be undone. The notes will be permanently deleted.',
        warningColor: 'text-orange-600',
        bgColor: 'bg-orange-100',
        endpoint: '/notes'
      };
    case 'quiz':
      return {
        icon: <Brain className="h-6 w-6" />,
        title: 'Delete Quiz',
        description: 'This action cannot be undone. The quiz and all student responses will be permanently deleted.',
        warningColor: 'text-purple-600',
        bgColor: 'bg-purple-100',
        endpoint: '/quiz'
      };
    default:
      return {
        icon: <Trash2 className="h-6 w-6" />,
        title: 'Delete Item',
        description: 'This action cannot be undone.',
        warningColor: 'text-red-600',
        bgColor: 'bg-red-100',
        endpoint: '/item'
      };
  }
};

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemTitle,
  onSuccess,
  additionalInfo
}) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  
  const config = getItemConfig(itemType);

  const getWarnings = () => {
    const warnings: string[] = [];
    
    if (itemType === 'transcript') {
      if (additionalInfo?.hasNotes) {
        warnings.push(`${additionalInfo.notesCount || 'Associated'} notes will also be deleted`);
      }
      if (additionalInfo?.hasQuizzes) {
        warnings.push(`${additionalInfo.quizCount || 'Associated'} quizzes will also be deleted`);
      }
    }
    
    if (itemType === 'quiz' && additionalInfo?.responseCount) {
      warnings.push(`${additionalInfo.responseCount} student responses will be lost`);
    }
    
    return warnings;
  };

  const handleDelete = async () => {
    if (!confirmChecked) {
      toast.error('Please confirm that you understand this action cannot be undone.');
      return;
    }

    try {
      setIsDeleting(true);
      
      const token = await getToken();
      if (!token) {
        toast.error('Authentication failed. Please sign in again.');
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}${config.endpoint}/${itemId}`,
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully.`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error(`Error deleting ${itemType}:`, error);
      
      if (error.response?.status === 404) {
        toast.error(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found.`);
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this item.');
      } else {
        toast.error(error.response?.data?.message || `Failed to delete ${itemType}. Please try again.`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const warnings = getWarnings();
  const hasWarnings = warnings.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 ${config.bgColor} rounded-lg`}>
              <div className={config.warningColor}>
                {config.icon}
              </div>
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {config.title}
              </DialogTitle>
              <DialogDescription>
                {config.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Details */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  {itemTitle}
                </h4>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {additionalInfo?.createdAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Created {new Date(additionalInfo.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {itemType === 'quiz' && additionalInfo?.responseCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{additionalInfo.responseCount} responses</span>
                    </div>
                  )}
                </div>

                {itemType === 'transcript' && (
                  <div className="flex gap-2">
                    {additionalInfo?.hasNotes && (
                      <Badge variant="secondary" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {additionalInfo.notesCount || 'Has'} Notes
                      </Badge>
                    )}
                    {additionalInfo?.hasQuizzes && (
                      <Badge variant="secondary" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        {additionalInfo.quizCount || 'Has'} Quizzes
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {hasWarnings && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900 mb-2">
                      Additional items will be affected:
                    </h4>
                    <ul className="space-y-1 text-sm text-orange-800">
                      {warnings.map((warning, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-orange-600 rounded-full" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <Checkbox
              id="confirm-delete"
              checked={confirmChecked}
              onCheckedChange={(checked) => setConfirmChecked(checked === true)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label 
                htmlFor="confirm-delete" 
                className="text-sm font-medium text-red-900 cursor-pointer"
              >
                I understand this action cannot be undone
              </Label>
              <p className="text-xs text-red-700 mt-1">
                This will permanently delete the {itemType} and all associated data.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !confirmChecked}
            className="flex-1"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};