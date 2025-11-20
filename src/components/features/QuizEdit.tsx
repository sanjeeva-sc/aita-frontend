import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { AlertCircle, ArrowLeft, Plus, Save, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIPromptModal } from "../modals/AIPromptModal";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InlineLoading, SectionLoading } from "../ui/loading";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { QuestionEditor } from "./QuestionEditor";

interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

interface QuizData {
  _id: string;
  title?: string;
  description?: string;
  timeLimit?: number;
  showAnswers?: boolean;
  shuffleQuestions?: boolean;
  questions: QuizQuestion[];
  created_at?: string;
}

export const QuizEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // AI Modal states
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalType, setAIModalType] = useState<"rewrite" | "regenerate">(
    "rewrite"
  );
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [aiLoading, setAILoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${API_BASE}/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.questions) {
        setQuiz({
          _id: id!,
          title: response.data.title || `Quiz ${id}`,
          description: response.data.description || "",
          timeLimit: response.data.time_limit || 0,
          showAnswers: response.data.show_answers || false,
          shuffleQuestions: response.data.shuffle_questions || false,
          questions: response.data.questions,
          created_at: response.data.created_at,
        });
      } else {
        setError("Invalid quiz data received");
      }
    } catch (err: any) {
      console.error("Error fetching quiz:", err);
      setError(err.response?.data?.error || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!quiz) return;

    try {
      setSaving(true);
      const token = await getToken();

      await axios.put(
        `${API_BASE}/quiz/${id}`,
        {
          questions: quiz.questions,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          showAnswers: quiz.showAnswers,
          shuffleQuestions: quiz.shuffleQuestions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHasChanges(false);
      toast.success("Quiz saved successfully!");
    } catch (err: any) {
      console.error("Error saving quiz:", err);
      toast.error(err.response?.data?.error || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleQuestionChange = (
    index: number,
    updatedQuestion: QuizQuestion
  ) => {
    if (!quiz) return;

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = updatedQuestion;

    setQuiz({ ...quiz, questions: updatedQuestions });
    setHasChanges(true);
  };

  const handleAddQuestion = () => {
    if (!quiz) return;

    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correct_answer: "A",
      explanation: "",
    };

    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    });
    setHasChanges(true);
  };

  const handleDeleteQuestion = (index: number) => {
    if (!quiz) return;

    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
    setHasChanges(true);
  };

  const handleAIRewrite = (questionIndex: number) => {
    setSelectedQuestionIndex(questionIndex);
    setAIModalType("rewrite");
    setShowAIModal(true);
  };

  // const handleAIRegenerate = () => {
  //   setSelectedQuestionIndex(null);
  //   setAIModalType("regenerate");
  //   setShowAIModal(true);
  // };

  const handleAISubmit = async (prompt: string) => {
    if (!quiz) return;

    try {
      setAILoading(true);
      const token = await getToken();

      if (aiModalType === "rewrite" && selectedQuestionIndex !== null) {
        // Rewrite single question
        const response = await axios.post(
          `${API_BASE}/quiz/${id}/question/${selectedQuestionIndex}/rewrite`,
          { prompt },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedQuestions = [...quiz.questions];
        updatedQuestions[selectedQuestionIndex] = response.data.question;

        setQuiz({ ...quiz, questions: updatedQuestions });
        setHasChanges(true);
        toast.success("Question rewritten successfully!");
      } else if (aiModalType === "regenerate") {
        // Regenerate entire quiz
        const response = await axios.post(
          `${API_BASE}/quiz/${id}/regenerate`,
          { prompt },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setQuiz({ ...quiz, questions: response.data.questions });
        setHasChanges(true);
        toast.success(
          `Quiz regenerated with ${response.data.questionsCount} questions!`
        );
      }

      setShowAIModal(false);
    } catch (err: any) {
      console.error("Error with AI operation:", err);
      toast.error(err.response?.data?.error || "AI operation failed");
    } finally {
      setAILoading(false);
    }
  };

  const handleQuizSettingsChange = (field: keyof QuizData, value: any) => {
    if (!quiz) return;
    setQuiz({ ...quiz, [field]: value });
    setHasChanges(true);
  };

  if (loading) {
    return (
      <SectionLoading message="Loading quiz for editing..." height="h-64" />
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
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
              The quiz you're trying to edit doesn't exist or has been removed.
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
            <h1 className="text-2xl font-bold">Edit Quiz</h1>
            <p className="text-muted-foreground">
              {quiz.created_at
                ? `Created ${new Date(quiz.created_at).toLocaleDateString()}`
                : "Quiz Editor"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="mr-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
          )}
          {/* <Button
            variant="outline"
            onClick={handleAIRegenerate}
            disabled={aiLoading}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Regenerate
          </Button> */}
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <InlineLoading className="mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="questions">
            Questions ({quiz.questions.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Quiz Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          {/* Questions List */}
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <QuestionEditor
                key={question.id || index}
                question={question}
                questionNumber={index + 1}
                onChange={(updatedQuestion) =>
                  handleQuestionChange(index, updatedQuestion)
                }
                onDelete={() => handleDeleteQuestion(index)}
                onAIRewrite={() => handleAIRewrite(index)}
                aiLoading={aiLoading && selectedQuestionIndex === index}
              />
            ))}

            {quiz.questions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">
                    No Questions Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first question to get started.
                  </p>
                  <Button onClick={handleAddQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>
            )}

            {quiz.questions.length > 0 && (
              <Card className="border-dashed">
                <CardContent className="text-center py-8">
                  <Button onClick={handleAddQuestion} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quiz Settings
              </CardTitle>
              <CardDescription>
                Configure general quiz settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={quiz.title || ""}
                    onChange={(e) =>
                      handleQuizSettingsChange("title", e.target.value)
                    }
                    placeholder="Enter quiz title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={quiz.timeLimit || ""}
                    onChange={(e) =>
                      handleQuizSettingsChange(
                        "timeLimit",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0 for no limit"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quiz.description || ""}
                  onChange={(e) =>
                    handleQuizSettingsChange("description", e.target.value)
                  }
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Quiz Behavior</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showAnswers">
                        Show Answers After Completion
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Students will see correct answers and explanations
                      </p>
                    </div>
                    <input
                      id="showAnswers"
                      type="checkbox"
                      checked={quiz.showAnswers || false}
                      onChange={(e) =>
                        handleQuizSettingsChange(
                          "showAnswers",
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shuffleQuestions">
                        Shuffle Questions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Questions will appear in random order for each student
                      </p>
                    </div>
                    <input
                      id="shuffleQuestions"
                      type="checkbox"
                      checked={quiz.shuffleQuestions || false}
                      onChange={(e) =>
                        handleQuizSettingsChange(
                          "shuffleQuestions",
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Prompt Modal */}
      <AIPromptModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onSubmit={handleAISubmit}
        type={aiModalType}
        isLoading={aiLoading}
        questionNumber={
          selectedQuestionIndex !== null ? selectedQuestionIndex + 1 : undefined
        }
      />
    </div>
  );
};
