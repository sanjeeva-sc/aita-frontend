import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  id: string;
  title?: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  showAnswers?: boolean;
  shuffleQuestions?: boolean;
}

interface StudentInfo {
  name: string;
  uid: string;
}

const StudentQuizTake: React.FC = () => {
  const { link, token } = useParams<{ link?: string; token?: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    const stored = sessionStorage.getItem('studentInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { name: parsed.name || '', uid: parsed.registrationNumber || parsed.uid || '' };
      } catch {
        return { name: '', uid: '' };
      }
    }
    return { name: '', uid: '' };
  });
  const [showStudentForm, setShowStudentForm] = useState(() => {
    // Show student form if no name is stored
    return !studentInfo.name.trim();
  });

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const shareToken = token || link || '';

  useEffect(() => {
    // Fetch quiz data by share token from backend
    const fetchQuiz = async () => {
      console.log('Fetching quiz with shareToken:', shareToken);
      console.log('URL params - link:', link, 'token:', token);
      
      if (!shareToken) {
        console.error('No shareToken available');
        setError('Invalid quiz link - no token provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Making API request to:', `${API_BASE}/quiz/shared/${shareToken}`);
        const res = await axios.get(`${API_BASE}/quiz/shared/${shareToken}`);
        console.log('API response:', res.data);
        
        // Response shape: { id, questions: { questions: [...] }, created_at, share_token, expires_at }
        const fetchedQuestions = res.data?.questions?.questions || [];
        console.log('Fetched questions:', fetchedQuestions);
        
        if (!Array.isArray(fetchedQuestions) || fetchedQuestions.length === 0) {
          console.error('Invalid questions data:', fetchedQuestions);
          setError('Quiz has no questions or invalid format');
          setLoading(false);
          return;
        }
        
        const mappedQuestions: Question[] = fetchedQuestions.map((q: any, idx: number) => ({
          id: String(idx),
          question: q.question,
          options: q.options || [],
          explanation: q.explanation,
          // correctAnswer will be filled after submission
          correctAnswer: undefined as unknown as number
        }));

        const fetchedQuiz: QuizData = {
          id: String(res.data?.id || ''),
          title: 'Quiz',
          description: '',
          questions: mappedQuestions,
        };

        console.log('Final quiz data:', fetchedQuiz);
        setQuiz(fetchedQuiz);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching quiz:', error);
        console.error('Error response:', error?.response?.data);
        setError(error?.response?.data?.error || 'Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [shareToken, link, token]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Submit answers to backend and navigate to results
    if (!quiz) return;
    if (!shareToken) return;

    // Ensure student info
    const name = studentInfo.name.trim();
    const uid = studentInfo.uid.trim();
    if (!name) {
      setError('Please enter your name before submitting');
      return;
    }

    // Build answers as letters in question order (backend expects A, B, C, or D)
    const answersStrings = quiz.questions.map((q) => {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined) {
        return ['A', 'B', 'C', 'D'][selectedIndex];
      }
      return '';
    });

    axios.post(`${API_BASE}/quiz/shared/${shareToken}/submit`, {
      student_name: name,
      student_uid: uid || null,
      answers: answersStrings
    }).then((res) => {
      const submission = res.data;
      console.log('Submission response:', submission);
      
      // Map correct answers back to indices and store detailed results
      const updatedQuestions = quiz.questions.map((q, i) => {
        const resultData = submission?.results?.[i];
        if (resultData) {
          // Find the correct answer index from the options
          const correctAnswerIndex = q.options.findIndex(option => 
            option === resultData.correctAnswer || 
            ['A', 'B', 'C', 'D'][q.options.indexOf(option)] === resultData.correctAnswer
          );
          return { 
            ...q, 
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0
          };
        }
        return q;
      });

      // Store comprehensive results data including detailed question results
      const resultsForSession = {
        success: submission?.success ?? false,
        score: submission?.correctAnswers ?? 0,
        totalQuestions: submission?.totalQuestions ?? quiz.questions.length,
        percentage: submission?.percentage ?? 0,
        submissionId: submission?.submissionId,
        answers,
        quiz: { 
          ...quiz, 
          questions: updatedQuestions,
          showAnswers: true // Enable answer review
        },
        // Store detailed results for question-by-question review
        detailedResults: submission?.results || []
      };

      sessionStorage.setItem('quizResults', JSON.stringify(resultsForSession));
      // Persist student info if not stored
      sessionStorage.setItem('studentInfo', JSON.stringify({ name, registrationNumber: uid }));
      navigate(`/quiz/${shareToken}/results`);
    }).catch((err) => {
      console.error('Error submitting quiz:', err);
      setError(err?.response?.data?.error || 'Failed to submit quiz');
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error || 'Quiz not found or has expired.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // If no current question is available, show loading or error
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">Loading question...</div>
          <div className="text-sm text-gray-600 mt-2">Please wait while we load the quiz content.</div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeRemaining < 300 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Student Info Capture if missing */}
        {showStudentForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
              <p className="text-sm text-gray-600">Please enter your information before starting the quiz.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student-name">Full Name</Label>
                  <input
                    id="student-name"
                    type="text"
                    className="mt-2 w-full border rounded px-3 py-2"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="student-uid">UID / Registration Number (optional)</Label>
                  <input
                    id="student-uid"
                    type="text"
                    className="mt-2 w-full border rounded px-3 py-2"
                    value={studentInfo.uid}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, uid: e.target.value }))}
                    placeholder="Enter your UID"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
              <div className="mt-4">
                <Button
                  onClick={() => {
                    const name = studentInfo.name.trim();
                    if (!name) {
                      setError('Please enter your name to continue');
                      return;
                    }
                    // Persist now so refresh doesn't lose it
                    sessionStorage.setItem('studentInfo', JSON.stringify({ name, registrationNumber: studentInfo.uid }));
                    setShowStudentForm(false);
                    setError(null);
                  }}
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <RadioGroup
                    value={answers[currentQuestion.id]?.toString() || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-red-600">No options available for this question.</div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-4">
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button onClick={handleSubmitQuiz} className="px-8">
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentQuizTake;