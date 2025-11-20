import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  ArrowLeft,
  BarChart3,
  Copy,
  Edit,
  ExternalLink,
  Share2,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
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
import { Separator } from "../ui/separator";

import { toast } from "sonner";
import { InlineLoading, SectionLoading } from "../ui/loading";

export const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { quizzes, loading } = useAppContext();

  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const quiz = Array.isArray(quizzes)
    ? quizzes.find((q: any) => q._id === (id || ""))
    : undefined;

  const handleShareQuiz = async () => {
    if (!quiz) return;

    setShareLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication failed. Please sign in again.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/${quiz._id}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const url = `${window.location.origin}/quiz/take/${response.data.shareToken}`;
      setShareUrl(url);

      await navigator.clipboard.writeText(url);
      toast.success("Quiz link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing quiz:", error);
      toast.error("Failed to share quiz. Please try again.");
    } finally {
      setShareLoading(false);
    }
  };

  const renderQuizQuestions = (quiz: any) => {
    if (!quiz) return null;

    let questions = [];
    if (typeof quiz.questions === "string") {
      try {
        const parsed = JSON.parse(quiz.questions);
        questions = parsed.questions || parsed;
      } catch (error) {
        return <p className="text-destructive">Error parsing quiz questions</p>;
      }
    } else if (Array.isArray(quiz.questions)) {
      questions = quiz.questions;
    } else if (quiz.questions?.questions) {
      questions = quiz.questions.questions;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return <p className="text-muted-foreground">No questions available</p>;
    }

    return (
      <div className="space-y-6">
        {questions.map((q: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              <CardDescription className="text-base font-medium">
                {q.question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2">Options:</h5>
                <div className="space-y-2">
                  {q.options?.map((option: string, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg border ${
                        q.correct_answer === option ||
                        q.correct_answer === String.fromCharCode(65 + optIndex)
                          ? "bg-green-100 border-green-200"
                          : "bg-muted/50"
                      }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>{" "}
                      {option}
                      {(q.correct_answer === option ||
                        q.correct_answer ===
                          String.fromCharCode(65 + optIndex)) && (
                        <Badge variant="secondary" className="ml-2">
                          Correct Answer
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {q.explanation && (
                <>
                  <Separator />
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                <h6 className="font-semibold text-blue-900 mb-2">
                  Explanation
                </h6>
                <p className="text-blue-700">
                      {q.explanation}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return <SectionLoading message="Loading quiz details..." height="h-64" />;
  }

  if (!quiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/quizzes">View All Quizzes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quiz Details</h1>
            <p className="text-muted-foreground">
              Created{" "}
              {quiz.created_at
                ? new Date(quiz.created_at).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/quizzes/${quiz._id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Quiz
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/quizzes/${quiz._id}/results`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Results
            </Link>
          </Button>
          <Button onClick={handleShareQuiz} disabled={shareLoading}>
            {shareLoading ? (
              <>
                <InlineLoading size="sm" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share Quiz
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Share URL Alert */}
      {shareUrl && (
        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Quiz shared successfully! Students can access it at:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied again!");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Quiz Statistics */}
      {quiz.statistics && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Statistics</CardTitle>
            <CardDescription>
              Performance overview and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {quiz.statistics.total_responses || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Responses
                </div>
              </div>
              {quiz.statistics.average_score !== null && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {quiz.statistics.average_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Score
                  </div>
                </div>
              )}
              {quiz.statistics.highest_score !== null && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {quiz.statistics.highest_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Highest Score
                  </div>
                </div>
              )}
              {quiz.statistics.lowest_score !== null && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {quiz.statistics.lowest_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lowest Score
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Content */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Questions</CardTitle>
          <CardDescription>
            Review all questions, answers, and explanations
          </CardDescription>
        </CardHeader>
        <CardContent>{renderQuizQuestions(quiz)}</CardContent>
      </Card>
    </div>
  );
};
