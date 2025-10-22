import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Target } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  competencies?: string[];
}

interface QuizData {
  questions: QuizQuestion[];
}

interface StudentInfo {
  name: string;
  uid: string;
}

interface QuizResults {
  success: boolean;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  results: Array<{
    questionIndex: number;
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
  submissionId: number;
}

interface StudentQuizInterfaceProps {
  quiz: QuizData;
  studentInfo: StudentInfo;
  onSubmit: (answers: { [key: number]: string }) => Promise<void>;
  submitting: boolean;
  quizResults?: QuizResults | null;
}

interface QuizResult {
  score: number;
  total: number;
  answers: { [key: number]: string };
}

const StudentQuizInterface: React.FC<StudentQuizInterfaceProps> = ({
  quiz,
  studentInfo,
  onSubmit,
  submitting,
  quizResults
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);

  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const currentAnswer = answers[currentQuestion];

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(answers);
      // Results will be set when quizResults prop is updated
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  // Update results when quizResults prop changes
  React.useEffect(() => {
    if (quizResults) {
      setResults({
        score: quizResults.correctAnswers,
        total: quizResults.totalQuestions,
        answers
      });
      setSubmitted(true);
    }
  }, [quizResults, answers]);

  const getAnswerStatus = (questionIndex: number, optionIndex: number) => {
    if (!submitted || !quizResults) return null;
    
    const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
    const apiResult = quizResults.results.find(r => r.questionIndex === questionIndex);
    
    if (!apiResult) return null;
    
    const isCorrect = optionLetter === apiResult.correctAnswer;
    const isSelected = optionLetter === apiResult.studentAnswer;

    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return null;
  };

  const renderResults = () => {
    if (!results || !quizResults) return null;
    

    const percentage = quizResults.percentage;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Results Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Quiz Complete!
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Student:</span> {studentInfo.name} | 
                <span className="font-medium"> UID:</span> {studentInfo.uid}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold mb-4">
                {results.score}/{results.total}
              </div>
              <div className="text-2xl text-gray-600 mb-4">
                {percentage}% Correct
              </div>
              <div className="text-lg text-gray-600">
                {percentage === 100 
                  ? "Perfect score! Excellent work!" 
                  : percentage >= 80 
                  ? "Great job! Well done!" 
                  : percentage >= 60 
                  ? "Good effort! Keep studying!" 
                  : "Keep practicing and you'll improve!"
                }
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              // const userAnswer = answers[index];
              const apiResult = quizResults?.results.find(r => r.questionIndex === index);
              const isCorrect = apiResult?.isCorrect || false;
              
              return (
                <Card key={index} className="border-l-4 border-l-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    </div>
                    <CardDescription>{question.question}</CardDescription>
                    {question.competencies && question.competencies.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Competencies:</span>
                        <div className="flex flex-wrap gap-1">
                          {question.competencies.map((competency, compIndex) => (
                            <Badge key={compIndex} variant="secondary" className="text-xs">
                              {competency}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => {
                        const status = getAnswerStatus(index, optionIndex);
                        let className = "p-3 rounded-lg border ";
                        
                        if (status === 'correct') {
                          className += "bg-green-100 border-green-500 text-green-800";
                        } else if (status === 'incorrect') {
                          className += "bg-red-100 border-red-500 text-red-800";
                        } else {
                          className += "bg-gray-50 border-gray-200";
                        }

                        return (
                          <div key={optionIndex} className={className}>
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                            {status === 'correct' && (
                              <CheckCircle className="inline h-4 w-4 ml-2" />
                            )}
                            {status === 'incorrect' && (
                              <XCircle className="inline h-4 w-4 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-blue-800">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (submitted) {
    return renderResults();
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header with Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl">Quiz</CardTitle>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Student:</span> {studentInfo.name} | 
              <span className="font-medium"> UID:</span> {studentInfo.uid}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-lg">{question.question}</CardDescription>
            {question.competencies && question.competencies.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Competencies:</span>
                <div className="flex flex-wrap gap-1">
                  {question.competencies.map((competency, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {competency}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {question.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                return (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="quiz-option"
                    value={optionLetter}
                    checked={currentAnswer === optionLetter}
                    onChange={() => handleAnswerChange(optionLetter)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-base"
                  >
                    <span className="font-medium mr-2">
                      {optionLetter}.
                    </span>
                    {option}
                  </Label>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {currentAnswer ? "Answer selected" : "Please select an answer"}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!currentAnswer || submitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quiz
                  <CheckCircle className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Answer Required Alert */}
        {!currentAnswer && (
          <Alert className="mt-4">
            <AlertDescription>
              Please select an answer before proceeding to the next question.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default StudentQuizInterface;