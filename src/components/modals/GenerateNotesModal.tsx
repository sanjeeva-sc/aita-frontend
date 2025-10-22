import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  FileText, 
  Settings, 
  Sparkles, 
  Clock,
  BookOpen,
  Target,
  Users,
  Lightbulb,
  CheckCircle,
  X
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
import { toast } from 'sonner';

interface GenerateNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcriptId: string;
  transcriptTitle: string;
  onSuccess?: (notesId: string) => void;
}

interface NotesTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sections: string[];
  estimatedTime: string;
}

const notesTemplates: NotesTemplate[] = [
  {
    id: 'comprehensive',
    name: 'Comprehensive Notes',
    description: 'Detailed notes with all key concepts, examples, and explanations',
    icon: <BookOpen className="h-5 w-5" />,
    sections: ['Key Concepts', 'Detailed Explanations', 'Examples', 'Summary', 'Action Items'],
    estimatedTime: '3-5 min'
  },
  {
    id: 'summary',
    name: 'Quick Summary',
    description: 'Concise overview of main points and takeaways',
    icon: <Clock className="h-5 w-5" />,
    sections: ['Main Points', 'Key Takeaways', 'Next Steps'],
    estimatedTime: '1-2 min'
  },
  {
    id: 'study_guide',
    name: 'Study Guide',
    description: 'Structured notes optimized for student review and study',
    icon: <Target className="h-5 w-5" />,
    sections: ['Learning Objectives', 'Key Terms', 'Concepts', 'Practice Questions', 'Review Points'],
    estimatedTime: '2-4 min'
  },
  {
    id: 'lesson_plan',
    name: 'Lesson Plan Format',
    description: 'Notes formatted as a teaching lesson plan',
    icon: <Users className="h-5 w-5" />,
    sections: ['Objectives', 'Materials', 'Activities', 'Assessment', 'Homework'],
    estimatedTime: '3-4 min'
  },
  {
    id: 'insights',
    name: 'Key Insights',
    description: 'Focus on important insights, connections, and implications',
    icon: <Lightbulb className="h-5 w-5" />,
    sections: ['Key Insights', 'Connections', 'Implications', 'Questions for Further Study'],
    estimatedTime: '2-3 min'
  }
];

export const GenerateNotesModal: React.FC<GenerateNotesModalProps> = ({
  isOpen,
  onClose,
  transcriptId,
  transcriptTitle,
  onSuccess
}) => {
  const { getToken } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive');
  const [customInstructions, setCustomInstructions] = useState('');
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const availableFocusAreas = [
    'Key Concepts',
    'Practical Applications',
    'Examples and Case Studies',
    'Definitions and Terminology',
    'Process and Procedures',
    'Best Practices',
    'Common Mistakes',
    'Further Reading'
  ];

  const handleFocusAreaToggle = (area: string) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenerationStep('Analyzing transcript...');

      const token = await getToken();
      if (!token) {
        toast.error('Authentication failed. Please sign in again.');
        return;
      }

      const selectedTemplateData = notesTemplates.find(t => t.id === selectedTemplate);

      const requestData = {
        transcriptId,
        template: selectedTemplate,
        customInstructions: customInstructions.trim(),
        options: {
          includeTimestamps,
          includeQuestions,
          focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
          sections: selectedTemplateData?.sections
        }
      };

      setGenerationStep('Generating notes...');

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notes/generate`,
        requestData,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 120000 // 2 minute timeout for generation
        }
      );

      setGenerationStep('Finalizing...');

      toast.success('Notes generated successfully!');
      
      if (onSuccess) {
        onSuccess(response.data.notesId);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error generating notes:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Generation timed out. Please try again with a shorter transcript.');
      } else if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to generate notes. Please try again.');
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const selectedTemplateData = notesTemplates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Generate Notes
              </DialogTitle>
              <DialogDescription>
                Create structured notes from "{transcriptTitle}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="template" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">Template & Style</TabsTrigger>
            <TabsTrigger value="options">Options & Focus</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Choose Notes Template</Label>
              <div className="grid gap-3">
                {notesTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedTemplate === template.id 
                            ? 'bg-blue-100 text-blue-600' 
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
                          <div className="flex flex-wrap gap-1">
                            {template.sections.map((section, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-instructions" className="text-base font-medium">
                Custom Instructions (Optional)
              </Label>
              <Textarea
                id="custom-instructions"
                placeholder="Add any specific requirements or focus areas for the notes..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Provide additional context or specific requirements for the AI to consider
              </p>
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Generation Options</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="timestamps"
                      checked={includeTimestamps}
                      onCheckedChange={(checked) => setIncludeTimestamps(checked === true)}
                    />
                    <Label htmlFor="timestamps" className="text-sm font-medium">
                      Include timestamps
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Add time references to help locate content in the original transcript
                  </p>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="questions"
                      checked={includeQuestions}
                      onCheckedChange={(checked) => setIncludeQuestions(checked === true)}
                    />
                    <Label htmlFor="questions" className="text-sm font-medium">
                      Include study questions
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Generate relevant questions to help with comprehension and review
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Focus Areas</Label>
                <p className="text-sm text-muted-foreground">
                  Select specific areas to emphasize in the notes
                </p>
                <div className="grid grid-cols-2 gap-2">
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
            </div>
          </TabsContent>
        </Tabs>

        {isGenerating && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <div>
                  <p className="font-medium text-blue-900">Generating Notes</p>
                  <p className="text-sm text-blue-700">{generationStep}</p>
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
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Notes
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};