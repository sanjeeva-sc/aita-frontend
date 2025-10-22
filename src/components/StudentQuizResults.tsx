import { CheckCircle, Clock, RotateCcw, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  showAnswers: boolean;
  shuffleQuestions: boolean;
}

interface DetailedResult {
  questionIndex: number;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizResults {
  success: boolean;
  score: number;
  totalQuestions: number;
  percentage: number;
  submissionId?: number;
  answers: Record<string, number>;
  quiz: QuizData;
  timeTaken?: number;
  detailedResults: DetailedResult[];
}

const StudentQuizResults: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResults | null>(null);

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem("quizResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // If no results found, redirect back to quiz
      navigate(`/quiz/${link}`);
    }
  }, [link, navigate]);

  const handleTakeAgain = () => {
    // Clear previous results and redirect to quiz start
    sessionStorage.removeItem("quizResults");
    navigate(`/quiz/${link}`);
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, percentage, answers, quiz, detailedResults } =
    results;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  // Helper function to convert letter answers to option indices
  const getAnswerIndex = (letterAnswer: string, options: string[]) => {
    console.log(options);
    const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
    return letterToIndex[letterAnswer as keyof typeof letterToIndex] ?? -1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-1">Quiz Results</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div
                className={`text-6xl font-bold mb-4 ${getScoreColor(
                  percentage
                )}`}
              >
                {percentage}%
              </div>
              <div className="text-xl text-gray-600 mb-4">
                You scored {score} out of {totalQuestions} questions correctly
              </div>
              <Badge
                variant={getScoreBadgeVariant(percentage)}
                className="text-sm px-4 py-2"
              >
                {percentage >= 80
                  ? "Excellent!"
                  : percentage >= 60
                  ? "Good Job!"
                  : "Keep Practicing!"}
              </Badge>
              {results.timeTaken && (
                <div className="flex items-center justify-center mt-4 text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Time taken: {Math.floor(results.timeTaken / 60)}:
                    {(results.timeTaken % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
              {results.submissionId && (
                <div className="text-sm text-gray-500 mt-2">
                  Submission ID: {results.submissionId}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        {(quiz.showAnswers || detailedResults.length > 0) && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Answer Review
            </h2>

            {detailedResults.length > 0
              ? // Use detailed results from API if available
                detailedResults.map((result, index) => {
                  const question = quiz.questions[result.questionIndex];
                  const userAnswerIndex = getAnswerIndex(
                    result.studentAnswer,
                    question?.options || []
                  );
                  const correctAnswerIndex = getAnswerIndex(
                    result.correctAnswer,
                    question?.options || []
                  );

                  return (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex-1">
                            <span className="text-gray-500 mr-2">
                              Q{index + 1}.
                            </span>
                            {result.question}
                          </CardTitle>
                          <div className="ml-4">
                            {result.isCorrect ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {question?.options?.map((option, optionIndex) => {
                            const isUserAnswer =
                              userAnswerIndex === optionIndex;
                            const isCorrectAnswer =
                              correctAnswerIndex === optionIndex;

                            let optionClass = "p-3 rounded-lg border ";
                            if (isCorrectAnswer) {
                              optionClass +=
                                "bg-green-50 border-green-200 text-green-800";
                            } else if (isUserAnswer && !result.isCorrect) {
                              optionClass +=
                                "bg-red-50 border-red-200 text-red-800";
                            } else {
                              optionClass +=
                                "bg-gray-50 border-gray-200 text-gray-700";
                            }

                            return (
                              <div key={optionIndex} className={optionClass}>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <span className="font-medium mr-2">
                                      {["A", "B", "C", "D"][optionIndex]}.
                                    </span>
                                    {option}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    {isUserAnswer && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Your answer
                                      </Badge>
                                    )}
                                    {isCorrectAnswer && (
                                      <Badge
                                        variant="default"
                                        className="text-xs bg-green-600"
                                      >
                                        Correct
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }) || (
                            <div className="text-gray-500 italic">
                              No options available for this question
                            </div>
                          )}

                          {question?.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">
                                Explanation:
                              </h4>
                              <p className="text-blue-800 text-sm">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              : // Fallback to original format if detailed results not available
                quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <Card key={question.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex-1">
                            <span className="text-gray-500 mr-2">
                              Q{index + 1}.
                            </span>
                            {question.question}
                          </CardTitle>
                          <div className="ml-4">
                            {isCorrect ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = userAnswer === optionIndex;
                            const isCorrectAnswer =
                              question.correctAnswer === optionIndex;

                            let optionClass = "p-3 rounded-lg border ";
                            if (isCorrectAnswer) {
                              optionClass +=
                                "bg-green-50 border-green-200 text-green-800";
                            } else if (isUserAnswer && !isCorrect) {
                              optionClass +=
                                "bg-red-50 border-red-200 text-red-800";
                            } else {
                              optionClass +=
                                "bg-gray-50 border-gray-200 text-gray-700";
                            }

                            return (
                              <div key={optionIndex} className={optionClass}>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <span className="font-medium mr-2">
                                      {["A", "B", "C", "D"][optionIndex]}.
                                    </span>
                                    {option}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    {isUserAnswer && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Your answer
                                      </Badge>
                                    )}
                                    {isCorrectAnswer && (
                                      <Badge
                                        variant="default"
                                        className="text-xs bg-green-600"
                                      >
                                        Correct
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {question.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">
                                Explanation:
                              </h4>
                              <p className="text-blue-800 text-sm">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 text-center">
          <Button onClick={handleTakeAgain} className="px-8">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizResults;
