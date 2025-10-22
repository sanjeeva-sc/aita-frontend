import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  Brain, 
  Settings, 
  Sparkles, 
  Clock,
  Target,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  List,
  ToggleLeft,
  ToggleRight,
  Zap
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
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcriptId: string;
  transcriptTitle: string;
  onSuccess?: (quizId: string) => void;
}

interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  questionTypes: string[];
  difficulty: string;
  estimatedTime: string;
  recommendedQuestions: number;
}

const quizTemplates: QuizTemplate[] = [
  {
    id: 'comprehensive',
    name: 'Comprehensive Assessment',
    description: 'Mixed question types covering all key concepts',
    icon: <BookOpen className="h-5 w-5" />,
    questionTypes: ['Multiple Choice', 'True/False', 'Short Answer'],
    difficulty: 'Mixed',
    estimatedTime: '15-20 min',
    recommendedQuestions: 15
  },
  {
    id: 'quick_check',
    name: 'Quick Knowledge Check',
    description: 'Fast assessment of basic understanding',
    icon: <Clock className="h-5 w-5" />,
    questionTypes: ['Multiple Choice', 'True/False'],
    difficulty: 'Easy',
    estimatedTime: '5-10 min',
    recommendedQuestions: 8
  },
  {
    id: 'deep_understanding',
    name: 'Deep Understanding',
    description: 'Challenging questions testing critical thinking',
    icon: <Brain className="h-5 w-5" />,
    questionTypes: ['Short Answer', 'Essay', 'Multiple Choice'],
    difficulty: 'Hard',
    estimatedTime: '20-30 min',
    recommendedQuestions: 10
  },
  {
    id: 'practice_test',
    name: 'Practice Test',
    description: 'Exam-style questions for test preparation',
    icon: <Target className="h-5 w-5" />,
    questionTypes: ['Multiple Choice', 'True/False', 'Short Answer'],
    difficulty: 'Mixed',
    estimatedTime: '25-35 min',
    recommendedQuestions: 20
  },
  {
    id: 'interactive',
    name: 'Interactive Quiz',
    description: 'Engaging questions with immediate feedback',
    icon: <Zap className="h-5 w-5" />,
    questionTypes: ['Multiple Choice', 'True/False', 'Drag & Drop'],
    difficulty: 'Easy-Medium',
    estimatedTime: '10-15 min',
    recommendedQuestions: 12
  }
];

const questionTypes = [
  { id: 'multiple_choice', name: 'Multiple Choice', description: 'Questions with 4 answer options' },
  { id: 'true_false', name: 'True/False', description: 'Simple true or false questions' },
  { id: 'short_answer', name: 'Short Answer', description: 'Brief written responses' },
  { id: 'essay', name: 'Essay', description: 'Longer written responses' },
  { id: 'fill_blank', name: 'Fill in the Blank', description: 'Complete the missing words' },
  { id: 'matching', name: 'Matching', description: 'Match items from two lists' }
];

const difficultyLevels = [
  { id: 'easy', name: 'Easy', description: 'Basic recall and understanding', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', description: 'Application and analysis', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'hard', name: 'Hard', description: 'Synthesis and evaluation', color: 'bg-red-100 text-red-800' },
  { id: 'mixed', name: 'Mixed', description: 'Combination of all levels', color: 'bg-blue-100 text-blue-800' }
];

export const GenerateQuizModal: React.FC<GenerateQuizModalProps> = ({
  isOpen,
  onClose,
  transcriptId,
  transcriptTitle,
  onSuccess
}) => {
  const { getToken } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive');
  const [questionCount, setQuestionCount] = useState([15]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(['multiple_choice', 'true_false']);
  const [difficulty, setDifficulty] = useState('mixed');
  const [timeLimit, setTimeLimit] = useState([20]);
  const [allowRetakes, setAllowRetakes] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [customInstructions, setCustomInstructions] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const availableFocusAreas = [
    'Key Concepts',
    'Definitions',
    'Processes',
    'Examples',
    'Applications',
    'Best Practices',
    'Common Mistakes',
    'Critical Thinking'
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = quizTemplates.find(t => t.id === templateId);
    if (template) {
      setQuestionCount([template.recommendedQuestions]);
      
      // Set question types based on template
      const typeMapping: { [key: string]: string } = {
        'Multiple Choice': 'multiple_choice',
        'True/False': 'true_false',
        'Short Answer': 'short_answer',
        'Essay': 'essay',
        'Drag & Drop': 'matching',
        'Fill in the Blank': 'fill_blank'
      };
      
      const mappedTypes = template.questionTypes
        .map(type => typeMapping[type])
        .filter(Boolean);
      
      setSelectedQuestionTypes(mappedTypes);
      
      // Set difficulty
      const difficultyMapping: { [key: string]: string } = {
        'Easy': 'easy',
        'Medium': 'medium',
        'Hard': 'hard',
        'Mixed': 'mixed',
        'Easy-Medium': 'medium'
      };
      
      setDifficulty(difficultyMapping[template.difficulty] || 'mixed');
    }
  };

  const handleQuestionTypeToggle = (typeId: string) => {
    setSelectedQuestionTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleFocusAreaToggle = (area: string) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleGenerate = async () => {
    if (selectedQuestionTypes.length === 0) {
      toast.error('Please select at least one question type.');
      return;
    }

    if (questionCount[0] < 1 || questionCount[0] > 50) {
      toast.error('Question count must be between 1 and 50.');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationStep('Analyzing transcript content...');

      const token = await getToken();
      if (!token) {
        toast.error('Authentication failed. Please sign in again.');
        return;
      }

      const requestData = {
        transcriptId,
        template: selectedTemplate,
        questionCount: questionCount[0],
        questionTypes: selectedQuestionTypes,
        difficulty,
        timeLimit: timeLimit[0],
        options: {
          allowRetakes,
          shuffleQuestions,
          showCorrectAnswers,
          focusAreas: focusAreas.length > 0 ? focusAreas : undefined
        },
        customInstructions: customInstructions.trim() || undefined
      };

      setGenerationStep('Generating questions...');

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/generate`,
        requestData,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 180000 // 3 minute timeout for generation
        }
      );

      setGenerationStep('Finalizing quiz...');

      toast.success('Quiz generated successfully!');
      
      if (onSuccess) {
        onSuccess(response.data.quizId);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Generation timed out. Please try again with fewer questions.');
      } else if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to generate quiz. Please try again.');
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const selectedTemplateData = quizTemplates.find(t => t.id === selectedTemplate);
  const selectedDifficulty = difficultyLevels.find(d => d.id === difficulty);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Generate Quiz
              </DialogTitle>
              <DialogDescription>
                Create an interactive quiz from "{transcriptTitle}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="template" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Choose Quiz Template</Label>
              <div className="grid gap-3">
                {quizTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-purple-500 bg-purple-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedTemplate === template.id 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {template.estimatedTime}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {template.questionTypes.map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{template.recommendedQuestions} questions</span>
                            <span>•</span>
                            <span>{template.difficulty} difficulty</span>
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Number of Questions</Label>
                  <div className="px-3">
                    <Slider
                      value={questionCount}
                      onValueChange={setQuestionCount}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1</span>
                      <span className="font-medium">{questionCount[0]} questions</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          <div className="flex items-center gap-2">
                            <Badge className={level.color} variant="secondary">
                              {level.name}
                            </Badge>
                            <span className="text-sm">{level.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Question Types</Label>
                  <div className="space-y-2">
                    {questionTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.id}
                          checked={selectedQuestionTypes.includes(type.id)}
                          onCheckedChange={() => handleQuestionTypeToggle(type.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={type.id} className="text-sm font-medium">
                            {type.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Focus Areas (Optional)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableFocusAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={focusAreas.includes(area)}
                      onCheckedChange={() => handleFocusAreaToggle(area)}
                    />
                    <Label htmlFor={area} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Time Limit (minutes)</Label>
                  <div className="px-3">
                    <Slider
                      value={timeLimit}
                      onValueChange={setTimeLimit}
                      max={120}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5 min</span>
                      <span className="font-medium">{timeLimit[0]} minutes</span>
                      <span>120 min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Quiz Options</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Allow Retakes</Label>
                        <p className="text-xs text-muted-foreground">Students can retake the quiz</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAllowRetakes(!allowRetakes)}
                        className="p-0 h-auto"
                      >
                        {allowRetakes ? (
                          <ToggleRight className="h-6 w-6 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Shuffle Questions</Label>
                        <p className="text-xs text-muted-foreground">Randomize question order</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShuffleQuestions(!shuffleQuestions)}
                        className="p-0 h-auto"
                      >
                        {shuffleQuestions ? (
                          <ToggleRight className="h-6 w-6 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Show Correct Answers</Label>
                        <p className="text-xs text-muted-foreground">Display answers after submission</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCorrectAnswers(!showCorrectAnswers)}
                        className="p-0 h-auto"
                      >
                        {showCorrectAnswers ? (
                          <ToggleRight className="h-6 w-6 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-instructions" className="text-base font-medium">
                    Custom Instructions (Optional)
                  </Label>
                  <Textarea
                    id="custom-instructions"
                    placeholder="Add specific requirements or focus areas for the quiz questions..."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide additional context for question generation
                  </p>
                </div>

                {selectedTemplateData && (
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-purple-900 mb-2">Quiz Preview</h4>
                      <div className="space-y-1 text-sm text-purple-800">
                        <p>• {questionCount[0]} questions</p>
                        <p>• {timeLimit[0]} minute time limit</p>
                        <p>• {selectedDifficulty?.name} difficulty</p>
                        <p>• {selectedQuestionTypes.length} question type{selectedQuestionTypes.length !== 1 ? 's' : ''}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isGenerating && (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                <div>
                  <p className="font-medium text-purple-900">Generating Quiz</p>
                  <p className="text-sm text-purple-700">{generationStep}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || selectedQuestionTypes.length === 0}
            className="flex-1"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Generate Quiz
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};