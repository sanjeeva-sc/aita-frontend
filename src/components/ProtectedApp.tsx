import { useUser } from "@clerk/clerk-react";
import { AppProvider } from "../context/AppContext";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { Dashboard } from "./features/Dashboard";
import { Transcripts } from "./features/Transcripts";
import { NotesManager } from "./features/NotesManager";
import { NotesDetail } from "./features/NotesDetail";
import { QuizManager } from "./features/QuizManager";
import { QuizDetail } from "./features/QuizDetail";
import { QuizEdit } from "./features/QuizEdit";
import { QuizResults } from "./features/QuizResults";
import { PageLoading } from "./ui/loading";
import { ErrorBoundary } from "./ui/error-boundary";
import { PageTransition } from "./ui/animations";

const ProtectedApp = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <PageLoading message="Loading your workspace..." />;
  }

  if (!isSignedIn) {
    window.location.href = "/";
    return null;
  }

  const roles = Array.isArray(((user?.unsafeMetadata || {}) as any).roles)
    ? (((user?.unsafeMetadata || {}) as any).roles as string[])
    : [];
  if (!roles.includes("teacher")) {
    window.location.href = "/sign-in";
    return null;
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <PageTransition>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Transcript Management */}
              <Route path="transcripts" element={<Transcripts />} />
              
              {/* Notes Management */}
              <Route path="notes" element={<NotesManager />} />
              <Route path="notes/:id" element={<NotesDetail />} />
              
              {/* Quiz Management */}
              <Route path="quizzes" element={<QuizManager />} />
              <Route path="quizzes/:id" element={<QuizDetail />} />
              <Route path="quizzes/:id/edit" element={<QuizEdit />} />
              <Route path="quizzes/:id/results" element={<QuizResults />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </PageTransition>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default ProtectedApp;
