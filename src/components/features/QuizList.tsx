import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QuizResponse } from "../../types";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { InlineLoading } from "../ui/loading";

interface QuizListProps {
  quizzes: QuizResponse[];
  loading?: boolean;
}

export const QuizList: React.FC<QuizListProps> = ({ quizzes, loading }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [shareLoading, setShareLoading] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  // Ensure quizzes is an array before using array methods
  const quizzesArray = Array.isArray(quizzes) ? quizzes : [];

  const handleShareQuiz = async (quiz: QuizResponse) => {
    try {
      setShareLoading(quiz._id);
      setShareError(null);
      setShareSuccess(null);

      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/${quiz._id}/share`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const shareUrl = `${window.location.origin}/quiz/${response.data.shareLink}`;
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(`Quiz shared! Link copied to clipboard: ${shareUrl}`);
        toast.success("Quiz link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing quiz:", error);
      setShareError("Failed to share quiz. Please try again.");
      toast.error("Failed to share quiz");
    } finally {
      setShareLoading(null);
    }
  };

  const handleViewQuiz = (quizId: string) => {
    navigate(`/quizzes/${quizId}`);
  };

  const handleViewResults = (quizId: string) => {
    navigate(`/quizzes/${quizId}/results`);
  };

  const getQuestionCount = (quiz: QuizResponse): number => {
    try {
      if (typeof quiz.questions === "string") {
        const parsed = JSON.parse(quiz.questions);
        return parsed.questions?.length || parsed.length || 0;
      } else if (Array.isArray(quiz.questions)) {
        return quiz.questions.length;
      } else if (quiz.questions && quiz.questions.questions) {
        return quiz.questions.questions.length;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Quizzes Available</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any quizzes yet. Upload a transcript to generate
            your first quiz.
          </p>
          <Button onClick={() => navigate("/transcripts")}>
            Upload Transcript
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Quizzes</h1>
          <p className="text-muted-foreground">
            Manage and share your AI-generated quizzes
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {Array.isArray(quizzes) ? quizzes.length : 0} quiz
          {Array.isArray(quizzes) && quizzes.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      {/* Success/Error Messages */}
      {shareSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {shareSuccess}
          </AlertDescription>
        </Alert>
      )}

      {shareError && (
        <Alert variant="destructive">
          <AlertDescription>{shareError}</AlertDescription>
        </Alert>
      )}

      {/* Quiz List */}
      <div className="space-y-4">
        {quizzesArray.map((quiz, index) => {
          const questionCount = getQuestionCount(quiz);
          const hasStats =
            quiz.statistics && quiz.statistics.total_responses > 0;

          return (
            <Card
              key={quiz._id || index}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleViewQuiz(quiz._id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {quiz.title || `Quiz ${index + 1}`}
                      <ChevronRight className="h-5 w-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription className="mt-2">
                      AI-generated quiz from your transcript content
                    </CardDescription>
                  </div>
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResults(quiz._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Results
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareQuiz(quiz)}
                      disabled={shareLoading === quiz._id}
                    >
                      {shareLoading === quiz._id ? (
                        <>
                          <InlineLoading size="sm" />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Quiz Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>
                      {questionCount} question{questionCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(quiz.created_at)}</span>
                  </div>

                  {hasStats && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {quiz.statistics!.total_responses} response
                          {quiz.statistics!.total_responses !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {quiz.statistics!.average_score !== null && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          <span>{quiz.statistics!.average_score}% avg</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Statistics Summary */}
                {hasStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-blue-700">
                        {quiz.statistics!.total_responses}
                      </div>
                      <div className="text-xs text-blue-600">
                        Total Responses
                      </div>
                    </div>

                    {quiz.statistics!.average_score !== null && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-green-700">
                          {quiz.statistics!.average_score}%
                        </div>
                        <div className="text-xs text-green-600">
                          Average Score
                        </div>
                      </div>
                    )}

                    {quiz.statistics!.highest_score !== null && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-yellow-700">
                          {quiz.statistics!.highest_score}%
                        </div>
                        <div className="text-xs text-yellow-600">
                          Highest Score
                        </div>
                      </div>
                    )}

                    {quiz.statistics!.lowest_score !== null && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-orange-700">
                          {quiz.statistics!.lowest_score}%
                        </div>
                        <div className="text-xs text-orange-600">
                          Lowest Score
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No Statistics Message */}
                {!hasStats && (
                  <div className="bg-muted/30 border border-muted rounded-lg p-4 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No student responses yet. Share this quiz to start
                      collecting data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
