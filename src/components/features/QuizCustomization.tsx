import React, { useState } from "react";
import { HelpCircle, Target, Users, Brain, Settings, CheckCircle2, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CompetencySelector } from "./CompetencySelector";

export interface QuizCustomizationOptions {
  // Basic Settings
  numberOfQuestions: number;
  questionTypes: ('multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'fill-blank')[];
  
  // Difficulty & Complexity
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'mixed';
  bloomsTaxonomy: ('remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create')[];
  
  // Content Focus
  focusAreas: string[];
  keyTopics: string[];
  avoidTopics: string[];
  
  // Question Distribution
  questionDistribution: {
    'multiple-choice': number;
    'true-false': number;
    'short-answer': number;
    'essay': number;
    'fill-blank': number;
  };
  
  // Academic Settings
  academicLevel: 'elementary' | 'middle-school' | 'high-school' | 'undergraduate' | 'graduate';
  subject: string;
  gradeLevel: string;
  
  // Quiz Features
  includeExplanations: boolean;
  includeHints: boolean;
  includeReferences: boolean;
  timeLimit: number; // in minutes, 0 for no limit
  allowRetakes: boolean;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  
  // Feedback & Assessment
  showCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  includeDetailedFeedback: boolean;
  passingScore: number; // percentage
  
  // Advanced Options
  questionWeighting: 'equal' | 'difficulty-based' | 'topic-based';
  includeMultimedia: boolean;
  adaptiveDifficulty: boolean;
  customInstructions: string;
  
  // Learning Objectives
  learningObjectives: string[];
  assessmentGoals: string[];
  
  // Curriculum Standards
  selectedCompetencies: Array<{
    id: string;
    name: string;
    description: string;
    subject: string;
    category: string;
  }>;
}

interface QuizCustomizationProps {
  options: QuizCustomizationOptions;
  onChange: (options: QuizCustomizationOptions) => void;
  onReset: () => void;
}

export const QuizCustomization: React.FC<QuizCustomizationProps> = ({
  options,
  onChange,
  onReset
}) => {
  const [newFocusArea, setNewFocusArea] = useState("");
  const [newKeyTopic, setNewKeyTopic] = useState("");
  const [newAvoidTopic, setNewAvoidTopic] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const updateOptions = (updates: Partial<QuizCustomizationOptions>) => {
    onChange({ ...options, ...updates });
  };

  const updateQuestionDistribution = (type: keyof QuizCustomizationOptions['questionDistribution'], value: number) => {
    updateOptions({
      questionDistribution: {
        ...options.questionDistribution,
        [type]: Math.max(0, value)
      }
    });
  };

  const toggleQuestionType = (type: QuizCustomizationOptions['questionTypes'][0]) => {
    const currentTypes = options.questionTypes;
    if (currentTypes.includes(type)) {
      updateOptions({
        questionTypes: currentTypes.filter(t => t !== type)
      });
    } else {
      updateOptions({
        questionTypes: [...currentTypes, type]
      });
    }
  };

  const toggleBloomsTaxonomy = (level: QuizCustomizationOptions['bloomsTaxonomy'][0]) => {
    const currentLevels = options.bloomsTaxonomy;
    if (currentLevels.includes(level)) {
      updateOptions({
        bloomsTaxonomy: currentLevels.filter(l => l !== level)
      });
    } else {
      updateOptions({
        bloomsTaxonomy: [...currentLevels, level]
      });
    }
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

  const addAvoidTopic = () => {
    if (newAvoidTopic.trim()) {
      updateOptions({
        avoidTopics: [...options.avoidTopics, newAvoidTopic.trim()]
      });
      setNewAvoidTopic("");
    }
  };

  const removeAvoidTopic = (index: number) => {
    updateOptions({
      avoidTopics: options.avoidTopics.filter((_, i) => i !== index)
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

  const addGoal = () => {
    if (newGoal.trim()) {
      updateOptions({
        assessmentGoals: [...options.assessmentGoals, newGoal.trim()]
      });
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    updateOptions({
      assessmentGoals: options.assessmentGoals.filter((_, i) => i !== index)
    });
  };

  const totalDistributedQuestions = Object.values(options.questionDistribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quiz Generation Settings
          </CardTitle>
          <CardDescription>
            Customize how AI generates quiz questions from your transcript to create effective assessments
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Basic Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Quiz Settings
          </CardTitle>
          <CardDescription>
            Configure the fundamental aspects of your quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateOptions({ numberOfQuestions: Math.max(1, options.numberOfQuestions - 1) })}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={options.numberOfQuestions}
                  onChange={(e) => updateOptions({ numberOfQuestions: parseInt(e.target.value) || 1 })}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateOptions({ numberOfQuestions: Math.min(50, options.numberOfQuestions + 1) })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <select
                value={options.difficultyLevel}
                onChange={(e) => updateOptions({ difficultyLevel: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed Difficulty</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                min="0"
                placeholder="0 for no limit"
                value={options.timeLimit || ""}
                onChange={(e) => updateOptions({ timeLimit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Types & Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Question Types & Distribution
          </CardTitle>
          <CardDescription>
            Select question types and specify how many of each type to include
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Question Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { type: 'multiple-choice', label: 'Multiple Choice' },
                { type: 'true-false', label: 'True/False' },
                { type: 'short-answer', label: 'Short Answer' },
                { type: 'essay', label: 'Essay' },
                { type: 'fill-blank', label: 'Fill in Blank' }
              ].map(({ type, label }) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.questionTypes.includes(type as any)}
                    onChange={() => toggleQuestionType(type as any)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Question Distribution</Label>
              <span className="text-sm text-muted-foreground">
                Total: {totalDistributedQuestions} / {options.numberOfQuestions}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { type: 'multiple-choice', label: 'Multiple Choice' },
                { type: 'true-false', label: 'True/False' },
                { type: 'short-answer', label: 'Short Answer' },
                { type: 'essay', label: 'Essay' },
                { type: 'fill-blank', label: 'Fill in Blank' }
              ].map(({ type, label }) => (
                <div key={type} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={options.questionDistribution[type as keyof typeof options.questionDistribution]}
                    onChange={(e) => updateQuestionDistribution(
                      type as keyof typeof options.questionDistribution,
                      parseInt(e.target.value) || 0
                    )}
                    disabled={!options.questionTypes.includes(type as any)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Focus
          </CardTitle>
          <CardDescription>
            Define what content should be emphasized or avoided in quiz questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Focus Areas */}
          <div className="space-y-2">
            <Label>Focus Areas</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Key concepts, Problem-solving..."
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
            <Label>Key Topics to Include</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Photosynthesis, Algebra..."
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

          {/* Avoid Topics */}
          <div className="space-y-2">
            <Label>Topics to Avoid</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Advanced calculus, Controversial topics..."
                value={newAvoidTopic}
                onChange={(e) => setNewAvoidTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAvoidTopic()}
              />
              <Button onClick={addAvoidTopic} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.avoidTopics.map((topic, index) => (
                <Badge key={index} variant="destructive" className="cursor-pointer" onClick={() => removeAvoidTopic(index)}>
                  {topic} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloom's Taxonomy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Bloom's Taxonomy Levels
          </CardTitle>
          <CardDescription>
            Select the cognitive levels you want to assess
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { level: 'remember', label: 'Remember', description: 'Recall facts' },
              { level: 'understand', label: 'Understand', description: 'Explain ideas' },
              { level: 'apply', label: 'Apply', description: 'Use knowledge' },
              { level: 'analyze', label: 'Analyze', description: 'Break down info' },
              { level: 'evaluate', label: 'Evaluate', description: 'Make judgments' },
              { level: 'create', label: 'Create', description: 'Produce new work' }
            ].map(({ level, label, description }) => (
              <label key={level} className="flex flex-col space-y-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.bloomsTaxonomy.includes(level as any)}
                    onChange={() => toggleBloomsTaxonomy(level as any)}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{description}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Academic Settings
          </CardTitle>
          <CardDescription>
            Configure settings based on your students' academic level
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
              <Label>Subject</Label>
              <Input
                placeholder="e.g., Biology, History, Mathematics"
                value={options.subject}
                onChange={(e) => updateOptions({ subject: e.target.value })}
              />
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
        </CardContent>
      </Card>

      {/* Quiz Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Quiz Features & Feedback
          </CardTitle>
          <CardDescription>
            Configure how students interact with the quiz and receive feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeExplanations}
                onChange={(e) => updateOptions({ includeExplanations: e.target.checked })}
              />
              <span className="text-sm">Include Explanations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeHints}
                onChange={(e) => updateOptions({ includeHints: e.target.checked })}
              />
              <span className="text-sm">Include Hints</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeReferences}
                onChange={(e) => updateOptions({ includeReferences: e.target.checked })}
              />
              <span className="text-sm">Include References</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.allowRetakes}
                onChange={(e) => updateOptions({ allowRetakes: e.target.checked })}
              />
              <span className="text-sm">Allow Retakes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.randomizeQuestions}
                onChange={(e) => updateOptions({ randomizeQuestions: e.target.checked })}
              />
              <span className="text-sm">Randomize Questions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.randomizeAnswers}
                onChange={(e) => updateOptions({ randomizeAnswers: e.target.checked })}
              />
              <span className="text-sm">Randomize Answers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.showCorrectAnswers}
                onChange={(e) => updateOptions({ showCorrectAnswers: e.target.checked })}
              />
              <span className="text-sm">Show Correct Answers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.showScoreImmediately}
                onChange={(e) => updateOptions({ showScoreImmediately: e.target.checked })}
              />
              <span className="text-sm">Show Score Immediately</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={options.passingScore}
                onChange={(e) => updateOptions({ passingScore: parseInt(e.target.value) || 70 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Question Weighting</Label>
              <select
                value={options.questionWeighting}
                onChange={(e) => updateOptions({ questionWeighting: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="equal">Equal Weight</option>
                <option value="difficulty-based">Difficulty-Based</option>
                <option value="topic-based">Topic-Based</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives & Assessment Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objectives & Assessment Goals
          </CardTitle>
          <CardDescription>
            Define what you want to assess and achieve with this quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Students will be able to..."
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

          {/* Assessment Goals */}
          <div className="space-y-2">
            <Label>Assessment Goals</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Measure understanding of..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
              <Button onClick={addGoal} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.assessmentGoals.map((goal, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeGoal(index)}>
                  {goal} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Curriculum Standards */}
          <Separator />
          <CompetencySelector
            selectedCompetencies={options.selectedCompetencies}
            onCompetenciesChange={(competencies) => updateOptions({ selectedCompetencies: competencies })}
            subject={options.subject}
          />

          <div className="space-y-2">
            <Label>Custom Instructions</Label>
            <Textarea
              placeholder="Add any specific requirements or instructions for quiz generation..."
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
          Settings will be applied to quiz generation
        </div>
      </div>
    </div>
  );
};

// Default options
export const defaultQuizOptions: QuizCustomizationOptions = {
  numberOfQuestions: 5,
  questionTypes: ['multiple-choice'],
  difficultyLevel: 'medium',
  bloomsTaxonomy: ['remember', 'understand', 'apply'],
  focusAreas: [],
  keyTopics: [],
  avoidTopics: [],
  questionDistribution: {
    'multiple-choice': 5,
    'true-false': 0,
    'short-answer': 0,
    'essay': 0,
    'fill-blank': 0
  },
  academicLevel: 'high-school',
  subject: '',
  gradeLevel: '',
  includeExplanations: true,
  includeHints: false,
  includeReferences: false,
  timeLimit: 0,
  allowRetakes: true,
  randomizeQuestions: false,
  randomizeAnswers: false,
  showCorrectAnswers: true,
  showScoreImmediately: true,
  includeDetailedFeedback: true,
  passingScore: 70,
  questionWeighting: 'equal',
  includeMultimedia: false,
  adaptiveDifficulty: false,
  customInstructions: '',
  learningObjectives: [],
  assessmentGoals: [],
  selectedCompetencies: []
};