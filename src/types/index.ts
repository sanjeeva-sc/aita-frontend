// Shared types and interfaces for the AiTA application

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface NotesData {
  id: number;
  transcript: string;
  notes: string;
  format_type?: string;
  template_id?: string;
  created_at: string;
  title?: string;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  structure: string;
  created_at: string;
}

export interface QuizResponse {
  id: number;
  transcript_id: number;
  questions: QuizData;
  created_at: string;
  title?: string;
  statistics?: {
    total_responses: number;
    average_score: number | null;
    highest_score: number | null;
    lowest_score: number | null;
  };
}

export interface QuizResult {
  student_name: string;
  student_uid: string;
  score: number;
  completed_at: string;
}

// Additional types for better type safety
export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ApiError {
  message: string;
  status?: number;
}

// State management types
export interface AppState {
  templates: Template[];
  notes: NotesData[];
  quizzes: QuizResponse[];
  loading: boolean;
  error: string | null;
}

export interface AppContextType extends AppState {
  setTemplates: (templates: Template[]) => void;
  setNotes: (notes: NotesData[]) => void;
  setQuizzes: (quizzes: QuizResponse[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: () => Promise<void>;
}
