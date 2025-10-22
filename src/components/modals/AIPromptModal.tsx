import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { InlineLoading } from '../ui/loading';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  type: 'rewrite' | 'regenerate';
  questionNumber?: number;
  isLoading?: boolean;
}

const PROMPT_SUGGESTIONS = {
  rewrite: [
    "Make this question more challenging",
    "Simplify the language for beginners",
    "Focus on practical application",
    "Add more context to the scenario",
    "Make it more specific to the topic"
  ],
  regenerate: [
    "Focus more on practical applications",
    "Include more advanced concepts",
    "Make questions more scenario-based",
    "Emphasize critical thinking skills",
    "Add more real-world examples"
  ]
};

export const AIPromptModal: React.FC<AIPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  questionNumber,
  isLoading = false
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const maxLength = 300;
  const remainingChars = maxLength - prompt.length;

  useEffect(() => {
    if (!isOpen) {
      setPrompt('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (prompt.length > maxLength) {
      setError(`Prompt must be ${maxLength} characters or less`);
      return;
    }

    setError('');
    onSubmit(prompt.trim());
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (error) setError('');
  };

  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    if (error) setError('');
  };

  const getTitle = () => {
    if (type === 'rewrite') {
      return `AI Rewrite Question ${questionNumber}`;
    }
    return 'AI Regenerate Quiz';
  };

  const getDescription = () => {
    if (type === 'rewrite') {
      return `Provide instructions for how you'd like to improve or modify question ${questionNumber}. The AI will rewrite the question based on your guidance.`;
    }
    return 'Provide instructions for how you\'d like to regenerate the entire quiz. The AI will create new questions based on your guidance and the original transcript.';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Your Instructions</Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={`Tell the AI how you want to ${type === 'rewrite' ? 'modify this question' : 'regenerate the quiz'}...`}
              rows={4}
              className={error ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Be specific about what you want to change or improve
              </span>
              <Badge 
                variant={remainingChars < 0 ? 'destructive' : remainingChars < 50 ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {remainingChars} chars left
              </Badge>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <Label className="text-sm font-medium">Quick Suggestions</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS[type].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => useSuggestion(suggestion)}
                  disabled={isLoading}
                  className="text-xs h-7"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {type === 'rewrite' 
                ? 'The AI will modify the current question while keeping the same general topic and difficulty level.'
                : 'The AI will generate completely new questions based on the original transcript and your instructions.'
              }
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim() || prompt.length > maxLength}
          >
            {isLoading ? (
              <>
                <InlineLoading className="mr-2" />
                {type === 'rewrite' ? 'Rewriting...' : 'Regenerating...'}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {type === 'rewrite' ? 'Rewrite Question' : 'Regenerate Quiz'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};