import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Clock,
  Download,
  Target,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface AnalyticsData {
  // Teaching & Learning KPIs
  quizTurnaroundTime: {
    average: number;
    trend: number;
    timeSaved: number;
  };
  curriculumCoverage: {
    totalCompetencies: number;
    coveredCompetencies: number;
    percentage: number;
    bySubject: Array<{
      subject: string;
      covered: number;
      total: number;
      percentage: number;
    }>;
  };
  assessmentFrequency: {
    quizzesPerWeek: number;
    lessonsWithQuizzes: number;
    totalLessons: number;
    alignmentPercentage: number;
  };

  // Student Outcomes KPIs
  engagement: {
    completionRate: number;
    averageTimeSpent: number;
    retakeRate: number;
    dropoffPoints: Array<{
      questionNumber: number;
      dropoffRate: number;
    }>;
  };
  performance: {
    averageScore: number;
    scoreDistribution: Array<{
      range: string;
      count: number;
    }>;
    improvementTrend: Array<{
      week: string;
      score: number;
    }>;
    masteryTracking: Array<{
      competency: string;
      masteryRate: number;
      attempts: number;
    }>;
  };
  equity: {
    performanceByGroup: Array<{
      group: string;
      averageScore: number;
      completionRate: number;
      gapFromAverage: number;
    }>;
    accessibilityMetrics: {
      mobileUsage: number;
      deviceTypes: Array<{
        device: string;
        usage: number;
      }>;
    };
  };

  // School-Level KPIs
  schoolMetrics: {
    totalTeachers: number;
    activeTeachers: number;
    totalStudents: number;
    totalQuizzes: number;
    timeSavedHours: number;
    consistencyScore: number;
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const AnalyticsDashboard: React.FC = () => {
  const { getToken } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedView, setSelectedView] = useState("overview");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("Authentication failed");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/analytics/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange },
        }
      );

      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/analytics/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange, format: "pdf" },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `aita-analytics-${timeRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  if (loading) {
    return (
      <SectionLoading message="Loading analytics dashboard..." height="h-96" />
    );
  }

  if (error || !analyticsData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">
            {error || "No analytics data available"}
          </p>
          <Button onClick={fetchAnalyticsData} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into teaching effectiveness and student
            outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quiz Turnaround
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.quizTurnaroundTime.average}min
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                ↓ {analyticsData.quizTurnaroundTime.timeSaved}h saved
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Engagement
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.engagement.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Quiz completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Curriculum Coverage
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.curriculumCoverage.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.curriculumCoverage.coveredCompetencies}/
              {analyticsData.curriculumCoverage.totalCompetencies} competencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Performance
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.performance.averageScore}%
            </div>
            <p className="text-xs text-muted-foreground">Class average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs
        value={selectedView}
        onValueChange={setSelectedView}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="equity">Equity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Student scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.performance.improvementTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>How students are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.performance.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teaching" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Curriculum Coverage by Subject */}
            <Card>
              <CardHeader>
                <CardTitle>Curriculum Coverage by Subject</CardTitle>
                <CardDescription>
                  Competencies covered across subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.curriculumCoverage.bySubject.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <Badge variant="outline">
                          {subject.covered}/{subject.total} (
                          {subject.percentage}%)
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assessment Frequency */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Frequency</CardTitle>
                <CardDescription>
                  Quiz creation and lesson alignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Quizzes per Week</p>
                      <p className="text-2xl font-bold text-primary">
                        {analyticsData.assessmentFrequency.quizzesPerWeek}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Lesson-Quiz Alignment</p>
                      <p className="text-2xl font-bold text-green-600">
                        {analyticsData.assessmentFrequency.alignmentPercentage}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mastery Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Competency Mastery</CardTitle>
                <CardDescription>Student mastery by competency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.performance.masteryTracking.map(
                    (competency) => (
                      <div key={competency.competency} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {competency.competency}
                          </span>
                          <Badge
                            variant={
                              competency.masteryRate >= 80
                                ? "default"
                                : "secondary"
                            }
                          >
                            {competency.masteryRate}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              competency.masteryRate >= 80
                                ? "bg-green-600"
                                : competency.masteryRate >= 60
                                ? "bg-yellow-600"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${competency.masteryRate}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {competency.attempts} attempts
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>
                  Completion and interaction patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.engagement.dropoffPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="questionNumber" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="dropoffRate"
                      stroke="#ff7300"
                      fill="#ff7300"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance by Group */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Equity</CardTitle>
                <CardDescription>
                  Performance gaps across student groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.equity.performanceByGroup.map((group) => (
                    <div key={group.group} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{group.group}</span>
                        <Badge
                          variant={
                            Math.abs(group.gapFromAverage) <= 5
                              ? "default"
                              : "destructive"
                          }
                        >
                          {group.gapFromAverage > 0 ? "+" : ""}
                          {group.gapFromAverage}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Avg Score</p>
                          <p className="font-bold">{group.averageScore}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completion</p>
                          <p className="font-bold">{group.completionRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Metrics</CardTitle>
                <CardDescription>
                  Device usage and accessibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={
                        analyticsData.equity.accessibilityMetrics.deviceTypes
                      }
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, usage }) => `${device}: ${usage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usage"
                    >
                      {analyticsData.equity.accessibilityMetrics.deviceTypes.map(
                        (_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Mobile Usage:{" "}
                    {analyticsData.equity.accessibilityMetrics.mobileUsage}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
