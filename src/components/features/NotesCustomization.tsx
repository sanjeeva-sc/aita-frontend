import React, { useState } from "react";
import { Settings, Target, Users, FileText, Lightbulb, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface NotesCustomizationOptions {
  // Content Focus
  focusAreas: string[];
  keyTopics: string[];
  learningObjectives: string[];
  
  // Structure & Format
  noteStyle: 'detailed' | 'concise' | 'bullet-points' | 'outline' | 'mind-map';
  includeExamples: boolean;
  includeDefinitions: boolean;
  includeSummary: boolean;
  includeKeyTakeaways: boolean;
  
  // Academic Level
  academicLevel: 'elementary' | 'middle-school' | 'high-school' | 'undergraduate' | 'graduate';
  complexity: 'basic' | 'intermediate' | 'advanced';
  
  // Length & Detail
  targetLength: 'short' | 'medium' | 'long' | 'comprehensive';
  detailLevel: number; // 1-5 scale
  
  // Special Requirements
  includeVisualAids: boolean;
  includeQuestions: boolean;
  includeActivities: boolean;
  customInstructions: string;
  
  // Subject-specific
  subject: string;
  gradeLevel: string;
  curriculum: string;
}

interface NotesCustomizationProps {
  options: NotesCustomizationOptions;
  onChange: (options: NotesCustomizationOptions) => void;
  onReset: () => void;
}

export const NotesCustomization: React.FC<NotesCustomizationProps> = ({
  options,
  onChange,
  onReset
}) => {
  const [newFocusArea, setNewFocusArea] = useState("");
  const [newKeyTopic, setNewKeyTopic] = useState("");
  const [newObjective, setNewObjective] = useState("");

  const updateOptions = (updates: Partial<NotesCustomizationOptions>) => {
    onChange({ ...options, ...updates });
  };

  const addFocusArea = () => {
    if (newFocusArea.trim()) {
      updateOptions({
        focusAreas: [...options.focusAreas, newFocusArea.trim()]
      });
      setNewFocusArea("");
    }
  };

  const removeFocusArea = (index: number) => {
    updateOptions({
      focusAreas: options.focusAreas.filter((_, i) => i !== index)
    });
  };

  const addKeyTopic = () => {
    if (newKeyTopic.trim()) {
      updateOptions({
        keyTopics: [...options.keyTopics, newKeyTopic.trim()]
      });
      setNewKeyTopic("");
    }
  };

  const removeKeyTopic = (index: number) => {
    updateOptions({
      keyTopics: options.keyTopics.filter((_, i) => i !== index)
    });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      updateOptions({
        learningObjectives: [...options.learningObjectives, newObjective.trim()]
      });
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    updateOptions({
      learningObjectives: options.learningObjectives.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notes Generation Settings
          </CardTitle>
          <CardDescription>
            Customize how AI generates notes from your transcript to match your teaching style and student needs
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Content Focus Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Focus
          </CardTitle>
          <CardDescription>
            Define what aspects of the transcript should be emphasized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Focus Areas */}
          <div className="space-y-2">
            <Label>Focus Areas</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Mathematical concepts, Historical events..."
                value={newFocusArea}
                onChange={(e) => setNewFocusArea(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFocusArea()}
              />
              <Button onClick={addFocusArea} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.focusAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFocusArea(index)}>
                  {area} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Key Topics */}
          <div className="space-y-2">
            <Label>Key Topics to Highlight</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Photosynthesis, World War II..."
                value={newKeyTopic}
                onChange={(e) => setNewKeyTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyTopic()}
              />
              <Button onClick={addKeyTopic} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.keyTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeKeyTopic(index)}>
                  {topic} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Students will understand..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              />
              <Button onClick={addObjective} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.learningObjectives.map((objective, index) => (
                <Badge key={index} variant="default" className="cursor-pointer" onClick={() => removeObjective(index)}>
                  {objective} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structure & Format Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Structure & Format
          </CardTitle>
          <CardDescription>
            Choose how the notes should be organized and presented
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Note Style</Label>
              <select
                value={options.noteStyle}
                onChange={(e) => updateOptions({ noteStyle: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="detailed">Detailed Paragraphs</option>
                <option value="concise">Concise Summary</option>
                <option value="bullet-points">Bullet Points</option>
                <option value="outline">Structured Outline</option>
                <option value="mind-map">Mind Map Format</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Target Length</Label>
              <select
                value={options.targetLength}
                onChange={(e) => updateOptions({ targetLength: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short (1-2 pages)</option>
                <option value="medium">Medium (3-5 pages)</option>
                <option value="long">Long (6-10 pages)</option>
                <option value="comprehensive">Comprehensive (10+ pages)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Detail Level: {options.detailLevel}/5</Label>
            <input
              type="range"
              min="1"
              max="5"
              value={options.detailLevel}
              onChange={(e) => updateOptions({ detailLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Basic</span>
              <span>Moderate</span>
              <span>Detailed</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeExamples}
                onChange={(e) => updateOptions({ includeExamples: e.target.checked })}
              />
              <span className="text-sm">Include Examples</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeDefinitions}
                onChange={(e) => updateOptions({ includeDefinitions: e.target.checked })}
              />
              <span className="text-sm">Include Definitions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeSummary}
                onChange={(e) => updateOptions({ includeSummary: e.target.checked })}
              />
              <span className="text-sm">Include Summary</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeKeyTakeaways}
                onChange={(e) => updateOptions({ includeKeyTakeaways: e.target.checked })}
              />
              <span className="text-sm">Key Takeaways</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Academic Level Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Academic Level & Audience
          </CardTitle>
          <CardDescription>
            Tailor the content complexity to your students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Academic Level</Label>
              <select
                value={options.academicLevel}
                onChange={(e) => updateOptions({ academicLevel: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="elementary">Elementary</option>
                <option value="middle-school">Middle School</option>
                <option value="high-school">High School</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Complexity</Label>
              <select
                value={options.complexity}
                onChange={(e) => updateOptions({ complexity: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Grade Level</Label>
              <Input
                placeholder="e.g., 9th Grade, College Freshman"
                value={options.gradeLevel}
                onChange={(e) => updateOptions({ gradeLevel: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="e.g., Biology, History, Mathematics"
                value={options.subject}
                onChange={(e) => updateOptions({ subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Curriculum</Label>
              <Input
                placeholder="e.g., Common Core, IB, AP"
                value={options.curriculum}
                onChange={(e) => updateOptions({ curriculum: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Special Features
          </CardTitle>
          <CardDescription>
            Add interactive and engaging elements to your notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeVisualAids}
                onChange={(e) => updateOptions({ includeVisualAids: e.target.checked })}
              />
              <span className="text-sm">Visual Aids Suggestions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeQuestions}
                onChange={(e) => updateOptions({ includeQuestions: e.target.checked })}
              />
              <span className="text-sm">Discussion Questions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeActivities}
                onChange={(e) => updateOptions({ includeActivities: e.target.checked })}
              />
              <span className="text-sm">Learning Activities</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label>Custom Instructions</Label>
            <Textarea
              placeholder="Add any specific requirements or instructions for note generation..."
              value={options.customInstructions}
              onChange={(e) => updateOptions({ customInstructions: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Reset to Defaults
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4" />
          Settings will be applied to note generation
        </div>
      </div>
    </div>
  );
};

// Default options
export const defaultNotesOptions: NotesCustomizationOptions = {
  focusAreas: [],
  keyTopics: [],
  learningObjectives: [],
  noteStyle: 'detailed',
  includeExamples: true,
  includeDefinitions: true,
  includeSummary: true,
  includeKeyTakeaways: true,
  academicLevel: 'high-school',
  complexity: 'intermediate',
  targetLength: 'medium',
  detailLevel: 3,
  includeVisualAids: false,
  includeQuestions: false,
  includeActivities: false,
  customInstructions: '',
  subject: '',
  gradeLevel: '',
  curriculum: ''
};