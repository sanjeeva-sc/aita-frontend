import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  ArrowDownCircle,
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  PieChart,
  Target,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
import { SectionLoading } from "../ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface QuizResult {
  id: number;
  student_name: string;
  student_uid: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
  time_taken?: number;
  answers?: any[];
}

interface QuizAnalytics {
  totalResponses: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completionRate: number;
  averageTimeSpent: number;
  scoreDistribution: { range: string; count: number; score: number }[];
  performanceTrends: {
    date: string;
    averageScore: number;
    responses: number;
  }[];
  questionAnalytics: {
    questionIndex: number;
    question: string;
    correctRate: number;
    commonWrongAnswers: string[];
  }[];
}

export const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [results, setResults] = useState<QuizResult[]>([]);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "date" | "name" | "time">(
    "score"
  );
  const [filterBy, setFilterBy] = useState<"all" | "passed" | "failed">("all");

  useEffect(() => {
    if (id) {
      fetchQuizResults();
      fetchQuizDetails();
    }
  }, [id]);

  const fetchQuizResults = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError("Authentication failed. Please sign in again.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/${id}/results`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const resultsData = response.data || [];
      setResults(resultsData);

      // Calculate analytics
      if (resultsData.length > 0) {
        calculateAnalytics(resultsData);
      }
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      setError("Failed to fetch quiz results. Please try again.");
    }
  };

  const fetchQuizDetails = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuiz(response.data);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (resultsData: QuizResult[]) => {
    const totalResponses = resultsData.length;
    const scores = resultsData.map((r) => r.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalResponses;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    // Score distribution
    const scoreRanges = [
      { range: "90-100%", min: 90, max: 100 },
      { range: "80-89%", min: 80, max: 89 },
      { range: "70-79%", min: 70, max: 79 },
      { range: "60-69%", min: 60, max: 69 },
      { range: "Below 60%", min: 0, max: 59 },
    ];

    const scoreDistribution = scoreRanges.map((range) => {
      const count = scores.filter(
        (score) => score >= range.min && score <= range.max
      ).length;
      return {
        range: range.range,
        count,
        score: Math.round((count / totalResponses) * 100),
      };
    });

    // Performance trends (group by date)
    const trendData = resultsData.reduce((acc: any, result) => {
      const date = new Date(result.completed_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { scores: [], count: 0 };
      }
      acc[date].scores.push(result.score);
      acc[date].count++;
      return acc;
    }, {});

    const performanceTrends = Object.entries(trendData).map(
      ([date, data]: [string, any]) => ({
        date,
        averageScore: Math.round(
          data.scores.reduce((a: number, b: number) => a + b, 0) / data.count
        ),
        responses: data.count,
      })
    );

    setAnalytics({
      totalResponses,
      averageScore: Math.round(averageScore),
      highestScore,
      lowestScore,
      completionRate: 82, // Mock data
      averageTimeSpent: 12, // Mock data
      scoreDistribution,
      performanceTrends,
      questionAnalytics: [], // Would need detailed answer data
    });
  };

  const exportResults = () => {
    const csvContent = [
      [
        "Student Name",
        "UID",
        "Score",
        "score",
        "Completed At",
        "Time Taken (min)",
      ],
      ...results.map((result) => [
        result.student_name,
        result.student_uid,
        `${result.score}/${result.total_questions}`,
        `${result.score}%`,
        new Date(result.completed_at).toLocaleString(),
        result.time_taken ? Math.round(result.time_taken / 60) : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${id}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported successfully!");
  };

  const filteredAndSortedResults = React.useMemo(() => {
    let filtered = results;

    // Apply filter
    if (filterBy === "passed") {
      filtered = results.filter((r) => r.score >= 60);
    } else if (filterBy === "failed") {
      filtered = results.filter((r) => r.score < 60);
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "date":
          return (
            new Date(b.completed_at).getTime() -
            new Date(a.completed_at).getTime()
          );
        case "name":
          return a.student_name.localeCompare(b.student_name);
        case "time":
          return (b.time_taken || 0) - (a.time_taken || 0);
        default:
          return 0;
      }
    });
  }, [results, sortBy, filterBy]);

  if (loading) {
    return <SectionLoading message="Loading quiz results..." height="h-64" />;
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
            <h1 className="text-2xl font-bold">Quiz Results & Analytics</h1>
            <p className="text-muted-foreground">
              {quiz?.created_at
                ? `Created ${new Date(quiz.created_at).toLocaleDateString()}`
                : "Quiz Analytics Dashboard"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportResults}
            disabled={results.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/quizzes/${id}`}>
              <FileText className="h-4 w-4 mr-2" />
              View Quiz
            </Link>
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Responses
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.totalResponses}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.averageScore}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Highest Score
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.highestScore}%
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Lowest Score
                  </p>
                  <p className="text-2xl font-bold">{analytics.lowestScore}%</p>
                </div>
                <ArrowDownCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList>
          <TabsTrigger value="results">Student Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {/* Filters and Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Sort by Score</SelectItem>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="time">Sort by Time</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterBy}
                  onValueChange={(value: any) => setFilterBy(value)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="passed">Passed (≥60%)</SelectItem>
                    <SelectItem value="failed">Failed (&lt;60%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>
                Showing {filteredAndSortedResults.length} of {results.length}{" "}
                results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAndSortedResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No results match your filters
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>UID</TableHead>
                        <TableHead>score</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Time Taken</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {result.student_name}
                          </TableCell>
                          <TableCell>{result.student_uid}</TableCell>
                          {/* <TableCell>
                            {result.score}/{result.total_questions}
                          </TableCell> */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-medium ${
                                  result.score >= 90
                                    ? "text-green-600"
                                    : result.score >= 80
                                    ? "text-blue-600"
                                    : result.score >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {result.score}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(result.completed_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {result.time_taken
                              ? `${Math.round(result.time_taken / 60)}m ${
                                  result.time_taken % 60
                                }s`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                result.score >= 60 ? "default" : "destructive"
                              }
                            >
                              {result.score >= 60 ? "Passed" : "Failed"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Score Distribution
                  </CardTitle>
                  <CardDescription>
                    How students performed across different score ranges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.scoreDistribution.map((range, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded ${
                              index === 0
                                ? "bg-green-500"
                                : index === 1
                                ? "bg-blue-500"
                                : index === 2
                                ? "bg-yellow-500"
                                : index === 3
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="font-medium">{range.range}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {range.count} student{range.count !== 1 ? "s" : ""}
                          </span>
                          <span className="font-medium">{range.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              {analytics.performanceTrends.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Trends
                    </CardTitle>
                    <CardDescription>Average scores over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.performanceTrends.map((trend, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{trend.date}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {trend.responses} response
                              {trend.responses !== 1 ? "s" : ""}
                            </span>
                            <span className="font-medium">
                              {trend.averageScore}% avg
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                Key insights and recommendations based on quiz results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics && (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Overall Performance
                    </h4>
                    <p className="text-blue-800 text-sm">
                      {analytics.averageScore >= 80
                        ? "Excellent performance! Most students are mastering the material."
                        : analytics.averageScore >= 60
                        ? "Good performance overall, with room for improvement in some areas."
                        : "Performance indicates students may need additional support with this material."}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">
                      Engagement
                    </h4>
                    <p className="text-green-800 text-sm">
                      {analytics.totalResponses > 10
                        ? "High engagement! Students are actively participating in assessments."
                        : "Consider strategies to increase quiz participation and engagement."}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      Recommendations
                    </h4>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      {analytics.averageScore < 70 && (
                        <li>
                          • Consider reviewing difficult concepts with
                          additional materials
                        </li>
                      )}
                      {analytics.scoreDistribution[4].count >
                        analytics.totalResponses * 0.3 && (
                        <li>
                          • Provide additional support for struggling students
                        </li>
                      )}
                      <li>
                        • Share quiz results with students for self-reflection
                      </li>
                      <li>• Use insights to inform future lesson planning</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
