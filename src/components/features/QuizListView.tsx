import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Share2, 
  BarChart3,
  MoreHorizontal,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SectionLoading, InlineLoading } from '../ui/loading';
import { toast } from 'sonner';

export const QuizListView: React.FC = () => {
  const { quizzes, loading } = useAppContext();
  const { getToken } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'responses'>('date');
  const [shareLoading, setShareLoading] = useState<number | null>(null);

  const handleShareQuiz = async (quiz: any) => {
    setShareLoading(quiz.id);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication failed. Please sign in again.');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/${quiz.id}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const shareableUrl = `${window.location.origin}/quiz/take/${response.data.shareToken}`;
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Quiz link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing quiz:', error);
      toast.error('Failed to share quiz. Please try again.');
    } finally {
      setShareLoading(null);
    }
  };

  const getQuestionCount = (quiz: any) => {
    try {
      let questions = [];
      if (typeof quiz.questions === 'string') {
        const parsed = JSON.parse(quiz.questions);
        questions = parsed.questions || parsed;
      } else if (Array.isArray(quiz.questions)) {
        questions = quiz.questions;
      } else if (quiz.questions?.questions) {
        questions = quiz.questions.questions;
      }
      return Array.isArray(questions) ? questions.length : 0;
    } catch {
      return 0;
    }
  };

  const filteredAndSortedQuizzes = React.useMemo(() => {
    if (!Array.isArray(quizzes)) return [];
    
    let filtered = quizzes.filter(quiz => {
      const searchLower = searchTerm.toLowerCase();
      const questionCount = getQuestionCount(quiz);
      return (
        searchLower === '' ||
        `quiz ${quizzes.indexOf(quiz) + 1}`.toLowerCase().includes(searchLower) ||
        questionCount.toString().includes(searchLower) ||
        (quiz.created_at && new Date(quiz.created_at).toLocaleDateString().includes(searchLower))
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'title':
          const aIndex = quizzes.indexOf(a) + 1;
          const bIndex = quizzes.indexOf(b) + 1;
          return aIndex - bIndex;
        case 'responses':
          const aResponses = a.statistics?.total_responses || 0;
          const bResponses = b.statistics?.total_responses || 0;
          return bResponses - aResponses;
        default:
          return 0;
      }
    });
  }, [quizzes, searchTerm, sortBy]);

  if (loading) {
    return <SectionLoading message="Loading your quizzes..." height="h-64" />;
  }

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No Quizzes Yet</h3>
            <p className="text-muted-foreground">
              Upload a transcript to generate your first interactive quiz
            </p>
            <Button asChild>
              <Link to="/transcripts">
                <Plus className="h-4 w-4 mr-2" />
                Upload Transcript
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quiz Management</h1>
          <p className="text-muted-foreground">
            Manage and share your AI-generated quizzes
          </p>
        </div>
        <Button asChild>
          <Link to="/transcripts">
            <Plus className="h-4 w-4 mr-2" />
            Create New Quiz
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="responses">Sort by Responses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quiz List */}
      <div className="grid gap-6">
        {filteredAndSortedQuizzes.map((quiz, index) => {
          const questionCount = getQuestionCount(quiz);
          const originalIndex = quizzes.indexOf(quiz) + 1;
          
          return (
            <Card key={quiz.id || index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      Quiz {originalIndex}
                      <Badge variant="secondary">
                        {questionCount} question{questionCount !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {quiz.created_at 
                          ? new Date(quiz.created_at).toLocaleDateString()
                          : 'Unknown date'
                        }
                      </span>
                      {quiz.statistics && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {quiz.statistics.total_responses || 0} response{quiz.statistics.total_responses !== 1 ? 's' : ''}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/quizzes/${quiz.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/quizzes/${quiz.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Quiz
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/quizzes/${quiz.id}/results`}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Results
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleShareQuiz(quiz)}
                        disabled={shareLoading === quiz.id}
                      >
                        {shareLoading === quiz.id ? (
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
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Statistics */}
                {quiz.statistics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        {quiz.statistics.total_responses || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Responses</div>
                    </div>
                    {quiz.statistics.average_score !== null && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">
                          {quiz.statistics.average_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Score</div>
                      </div>
                    )}
                    {quiz.statistics.highest_score !== null && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">
                          {quiz.statistics.highest_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Highest</div>
                      </div>
                    )}
                    {quiz.statistics.lowest_score !== null && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-semibold text-orange-600">
                          {quiz.statistics.lowest_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Lowest</div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/quizzes/${quiz.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/quizzes/${quiz.id}/results`}>
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Results
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShareQuiz(quiz)}
                    disabled={shareLoading === quiz.id}
                  >
                    {shareLoading === quiz.id ? (
                      <InlineLoading size="sm" />
                    ) : (
                      <>
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredAndSortedQuizzes.length} of {Array.isArray(quizzes) ? quizzes.length : 0} quiz{Array.isArray(quizzes) && quizzes.length !== 1 ? 'es' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};