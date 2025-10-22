import { useUser } from "@clerk/clerk-react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ProtectedApp from "./components/ProtectedApp";
import StudentQuiz from "./components/StudentQuiz";
import StudentQuizTake from "./components/StudentQuizTake";
import StudentQuizResults from "./components/StudentQuizResults";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { PageLoading } from "./components/ui/loading";

const AppRouter = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <PageLoading message="Initializing application..." />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isSignedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />
        <Route
          path="/sign-in/*"
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">AiTA</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      AI-powered Teaching Assistant
                    </p>
                  </div>
                  <SignIn routing="path" path="/sign-in" />
                </div>
              </div>
            )
          }
        />
        <Route
          path="/sign-up/*"
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">AiTA</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      AI-powered Teaching Assistant
                    </p>
                  </div>
                  <SignUp routing="path" path="/sign-up" />
                </div>
              </div>
            )
          }
        />
        
        {/* Student Quiz Routes */}
        <Route path="/quiz/:link" element={<StudentQuiz />} />
        {/* Support both patterns for student take flow */}
        <Route path="/quiz/:link/take" element={<StudentQuizTake />} />
        <Route path="/quiz/take/:token" element={<StudentQuizTake />} />
        <Route path="/quiz/:link/results" element={<StudentQuizResults />} />

        {/* Teacher Protected Routes */}
        <Route
          path="/*"
          element={isSignedIn ? <ProtectedApp /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
