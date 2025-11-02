import {
  ArrowRight,
  FileText,
  HelpCircle,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppContext } from "../../context/AppContext";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loading } from "../ui/loading";

export const Dashboard: React.FC = () => {
  const { notes, quizzes, templates, loading } = useAppContext();

  useEffect(() => {
    // Show a welcome toast only once per session
    const hasShownWelcome = sessionStorage.getItem('aita-welcome-shown');
    
    if (!hasShownWelcome) {
      toast.success("Welcome to AiTA!", {
        description: "Your AI-powered transcript analysis tool is ready to use.",
      });
      sessionStorage.setItem('aita-welcome-shown', 'true');
    }
  }, []);

  if (loading) {
    return (
      <Loading
        message="Loading your dashboard..."
        variant="card"
        className="mx-auto max-w-md"
      />
    );
  }

  // Ensure notes, quizzes, and templates are arrays before using array methods
  const notesArray = Array.isArray(notes) ? notes : [];
  const quizzesArray = Array.isArray(quizzes) ? quizzes : [];
  const templatesArray = Array.isArray(templates) ? templates : [];

  const recentNotes = notesArray.slice(0, 5);
  const recentQuizzes = quizzesArray.slice(0, 5);
  const hasNoContent = notesArray.length === 0 && quizzesArray.length === 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to AiTA</CardTitle>
          <CardDescription className="text-lg">
            Transform your transcripts into comprehensive notes and interactive
            quizzes using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/transcripts">
                <Plus className="h-4 w-4 mr-2" />
                Upload New Transcript
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/notes">
                <FileText className="h-4 w-4 mr-2" />
                View All Notes
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/quizzes">
                <HelpCircle className="h-4 w-4 mr-2" />
                View All Quizzes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Empty State for New Users */}
      {hasNoContent && (
        <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="text-center py-16">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">
                  Get Started with AiTA
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Upload your first transcript to experience the power of
                  AI-generated notes and interactive quizzes
                </p>
              </div>

              <div className="space-y-4">
                <Button asChild size="lg" className="w-full max-w-xs">
                  <Link
                    to="/transcripts"
                    className="flex items-center justify-center"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Your First Transcript
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p>✨ AI-powered note generation</p>
                  <p>🎯 Interactive quiz creation</p>
                  <p>📊 Student progress tracking</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards - Only show when user has content */}
      {!hasNoContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notesArray.length}</div>
              <p className="text-xs text-muted-foreground">
                Generated from transcripts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quizzes
              </CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzesArray.length}</div>
              <p className="text-xs text-muted-foreground">
                Interactive quiz questions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templatesArray.length}</div>
              <p className="text-xs text-muted-foreground">
                Available note formats
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity - Only show when user has content */}
      {!hasNoContent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
              <CardDescription>Your latest generated notes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentNotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No notes yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/transcripts">Create Your First Notes</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{note.title || `Notes #${note.id}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/notes/${note.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  {notesArray.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/notes">View All Notes</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Quizzes</CardTitle>
              <CardDescription>Your latest generated quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No quizzes yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/transcripts">Create Your First Quiz</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{quiz.title || `Quiz #${quiz.id}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                        {quiz.statistics && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {quiz.statistics.total_responses} responses
                            {quiz.statistics.average_score !== null &&
                              ` • Avg: ${quiz.statistics.average_score}%`}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/quizzes/${quiz.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  {quizzesArray.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/quizzes">View All Quizzes</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4" asChild>
              <Link
                to="/transcripts?tab=upload"
                className="flex flex-col items-center space-y-2"
              >
                <Plus className="h-6 w-6" />
                <span>Upload Transcript</span>
                <span className="text-xs text-muted-foreground text-center">
                  Generate new notes and quiz from transcript
                </span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4" asChild>
              <Link
                to="/notes"
                className="flex flex-col items-center space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>Browse Notes</span>
                <span className="text-xs text-muted-foreground text-center">
                  View and download your generated notes
                </span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4" asChild>
              <Link
                to="/quizzes"
                className="flex flex-col items-center space-y-2"
              >
                <HelpCircle className="h-6 w-6" />
                <span>Manage Quizzes</span>
                <span className="text-xs text-muted-foreground text-center">
                  Share quizzes and view student responses
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
