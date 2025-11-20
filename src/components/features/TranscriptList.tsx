import {
  Calendar,
  Download,
  Eye,
  FileText,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Loading } from "../ui/loading";

interface Transcript {
  id: string;
  title: string;
  contentSnippet: string;
  uploadDate: string;
  status: "processing" | "completed" | "failed";
  notesGenerated: boolean;
  quizGenerated: boolean;
  wordCount: number;
  notesId?: string | null;
  quizId?: string | null;
}

export const TranscriptList: React.FC = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");

  useEffect(() => {
    const loadTranscripts = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/transcripts`, { headers });
        setTranscripts(res.data || []);
      } catch (e: any) {
        console.error("Failed to load transcripts:", e);
        setError(e?.response?.data?.error || "Failed to load transcripts.");
      } finally {
        setLoading(false);
      }
    };
    loadTranscripts();
  }, []);

  // Ensure transcripts is an array before using array methods
  const transcriptsArray = Array.isArray(transcripts) ? transcripts : [];
  
  const filteredTranscripts = transcriptsArray
    .filter(
      (transcript) =>
        transcript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transcript.contentSnippet.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        case "date":
        default:
          return (
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          );
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Processing
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transcripts</h1>
          <p className="text-gray-600 mt-1">
            Manage your uploaded transcripts and generate notes & quizzes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              to="/transcripts?tab=record"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Record Class
            </Link>
          </Button>
          <Button asChild>
            <Link
              to="/transcripts?tab=upload"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Upload Transcript
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transcripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "title" | "status")
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transcripts List */}
      {filteredTranscripts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No transcripts found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No transcripts match your search."
                : "Upload your first transcript to get started."}
            </p>
            <Button asChild>
              <Link to="/transcripts?tab=upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Transcript
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTranscripts.map((transcript) => (
            <Card
              key={transcript.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {transcript.title}
                      </h3>
                      {getStatusBadge(transcript.status)}
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {transcript.contentSnippet.substring(0, 150)}...
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(transcript.uploadDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {transcript.wordCount.toLocaleString()} words
                      </div>
                      {transcript.notesGenerated && (
                        <Badge variant="outline" className="text-xs">
                          Notes Generated
                        </Badge>
                      )}
                      {transcript.quizGenerated && (
                        <Badge variant="outline" className="text-xs">
                          Quiz Generated
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {transcript.status === "completed" && (
                      <>
                        {transcript.notesGenerated && transcript.notesId && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/notes/${transcript.notesId}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Notes
                            </Link>
                          </Button>
                        )}
                        {transcript.quizGenerated && transcript.quizId && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/quizzes/${transcript.quizId}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Quiz
                            </Link>
                          </Button>
                        )}
                      </>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Transcript
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        {transcript.status === "completed" &&
                          !transcript.notesGenerated && (
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Notes
                            </DropdownMenuItem>
                          )}
                        {transcript.status === "completed" &&
                          !transcript.quizGenerated && (
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Quiz
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredTranscripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredTranscripts.length}
                </div>
                <div className="text-sm text-gray-600">Total Transcripts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    filteredTranscripts.filter((t) => t.status === "completed")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {filteredTranscripts.filter((t) => t.notesGenerated).length}
                </div>
                <div className="text-sm text-gray-600">Notes Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredTranscripts.filter((t) => t.quizGenerated).length}
                </div>
                <div className="text-sm text-gray-600">Quizzes Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
