import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Edit3, 
  Sparkles, 
  Plus, 
  Minus, 
  AlertCircle,
  CheckCircle2,
  GripVertical
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { InlineLoading } from '../ui/loading';

interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

interface QuestionEditorProps {
  question: QuizQuestion;
  questionNumber: number;
  onChange: (question: QuizQuestion) => void;
  onDelete: () => void;
  onAIRewrite: () => void;
  aiLoading?: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  questionNumber,
  onChange,
  onDelete,
  onAIRewrite,
  aiLoading = false
}) => {
  const [localQuestion, setLocalQuestion] = useState<QuizQuestion>(question);
  const [errors, setErrors] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const validateQuestion = (q: QuizQuestion): string[] => {
    const validationErrors: string[] = [];
    
    if (!q.question.trim()) {
      validationErrors.push('Question text is required');
    }
    
    const nonEmptyOptions = q.options.filter(opt => opt.trim());
    if (nonEmptyOptions.length < 2) {
      validationErrors.push('At least 2 options are required');
    }
    
    if (!q.correct_answer) {
      validationErrors.push('Correct answer must be selected');
    }
    
    const correctIndex = ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(q.correct_answer);
    if (correctIndex >= 0 && correctIndex < q.options.length) {
      if (!q.options[correctIndex].trim()) {
        validationErrors.push('Correct answer option cannot be empty');
      }
    }
    
    return validationErrors;
  };

  const handleChange = (field: keyof QuizQuestion, value: any) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    
    const validationErrors = validateQuestion(updated);
    setErrors(validationErrors);
    
    onChange(updated);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...localQuestion.options];
    updatedOptions[index] = value;
    handleChange('options', updatedOptions);
  };

  const addOption = () => {
    if (localQuestion.options.length < 6) {
      const updatedOptions = [...localQuestion.options, ''];
      handleChange('options', updatedOptions);
    }
  };

  const removeOption = (index: number) => {
    if (localQuestion.options.length > 2) {
      const updatedOptions = localQuestion.options.filter((_, i) => i !== index);
      
      // Adjust correct answer if necessary
      const correctIndex = ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(localQuestion.correct_answer);
      let newCorrectAnswer = localQuestion.correct_answer;
      
      if (correctIndex === index) {
        // If we're removing the correct answer, reset to 'A'
        newCorrectAnswer = 'A';
      } else if (correctIndex > index) {
        // If correct answer is after removed option, shift it up
        newCorrectAnswer = ['A', 'B', 'C', 'D', 'E', 'F'][correctIndex - 1];
      }
      
      setLocalQuestion(prev => ({
        ...prev,
        options: updatedOptions,
        correct_answer: newCorrectAnswer
      }));
      
      onChange({
        ...localQuestion,
        options: updatedOptions,
        correct_answer: newCorrectAnswer
      });
    }
  };

  const getOptionLabel = (index: number) => ['A', 'B', 'C', 'D', 'E', 'F'][index];
  
  const hasErrors = errors.length > 0;
  const isComplete = !hasErrors && localQuestion.question.trim() && 
                   localQuestion.options.filter(opt => opt.trim()).length >= 2;

  return (
    <Card className={`transition-all duration-200 ${hasErrors ? 'border-destructive' : isComplete ? 'border-green-200' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <Badge variant={hasErrors ? 'destructive' : isComplete ? 'default' : 'secondary'}>
                Question {questionNumber}
              </Badge>
            </div>
            {isComplete && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {hasErrors && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAIRewrite}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <InlineLoading className="mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              AI Rewrite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isExpanded ? 'Collapse' : 'Edit'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!isExpanded && (
          <div className="mt-2">
            <p className="text-sm font-medium line-clamp-2">
              {localQuestion.question || 'No question text'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {localQuestion.options.filter(opt => opt.trim()).length} options
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                Correct: {localQuestion.correct_answer}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Error Display */}
          {hasErrors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor={`question-${questionNumber}`}>Question Text</Label>
            <Textarea
              id={`question-${questionNumber}`}
              value={localQuestion.question}
              onChange={(e) => handleChange('question', e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
              className={hasErrors && !localQuestion.question.trim() ? 'border-destructive' : ''}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={localQuestion.options.length >= 6}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {localQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge 
                    variant={localQuestion.correct_answer === getOptionLabel(index) ? 'default' : 'outline'}
                    className="min-w-[24px] justify-center"
                  >
                    {getOptionLabel(index)}
                  </Badge>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${getOptionLabel(index)}`}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={localQuestion.options.length <= 2}
                    className="text-destructive hover:text-destructive"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer Selection */}
          <div className="space-y-2">
            <Label htmlFor={`correct-answer-${questionNumber}`}>Correct Answer</Label>
            <Select
              value={localQuestion.correct_answer}
              onValueChange={(value) => handleChange('correct_answer', value)}
            >
              <SelectTrigger id={`correct-answer-${questionNumber}`}>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {localQuestion.options.map((option, index) => (
                  <SelectItem 
                    key={index} 
                    value={getOptionLabel(index)}
                    disabled={!option.trim()}
                  >
                    {getOptionLabel(index)}: {option.trim() || 'Empty option'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor={`explanation-${questionNumber}`}>
              Explanation (Optional)
            </Label>
            <Textarea
              id={`explanation-${questionNumber}`}
              value={localQuestion.explanation || ''}
              onChange={(e) => handleChange('explanation', e.target.value)}
              placeholder="Explain why this is the correct answer..."
              rows={2}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};