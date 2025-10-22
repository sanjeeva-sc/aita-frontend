import { Clock, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  timeLimit?: number; // in minutes
  totalQuestions: number;
  questions: QuizQuestion[];
  settings: {
    shuffleQuestions: boolean;
    showAnswers: boolean;
    allowRetake: boolean;
  };
}

interface StudentInfo {
  name: string;
  registrationNumber: string;
}

const StudentQuiz = () => {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: "",
    registrationNumber: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<StudentInfo>>({});

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!link) {
        setError("Invalid quiz link");
        setLoading(false);
        return;
      }

      try {
        // Mock data for now - replace with actual API call
        const mockQuiz: QuizData = {
          id: "1",
          title: "Biology Quiz - Cell Structure",
          description:
            "Test your knowledge of cell structure and organelles. This quiz covers the basic components of cells and their functions.",
          instructions:
            "Please read each question carefully and select the best answer. You have 30 minutes to complete this quiz. Once you start, the timer will begin counting down.",
          timeLimit: 30,
          totalQuestions: 10,
          questions: [
            {
              question: "What is the powerhouse of the cell?",
              options: [
                "Nucleus",
                "Mitochondria",
                "Ribosome",
                "Endoplasmic Reticulum",
              ],
              correct_answer: "Mitochondria",
              explanation:
                "Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration.",
            },
          ],
          settings: {
            shuffleQuestions: false,
            showAnswers: true,
            allowRetake: true,
          },
        };

        setQuiz(mockQuiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Quiz not found or has expired");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [link]);

  const validateForm = (): boolean => {
    const errors: Partial<StudentInfo> = {};

    if (!studentInfo.name.trim()) {
      errors.name = "Name is required";
    }

    if (!studentInfo.registrationNumber.trim()) {
      errors.registrationNumber = "Registration number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartQuiz = () => {
    if (!validateForm()) return;

    // Store student info in sessionStorage for the quiz
    sessionStorage.setItem("studentInfo", JSON.stringify(studentInfo));

    // Navigate to the quiz taking page
    navigate(`/quiz/${link}/take`);
  };

  const handleInputChange = (field: keyof StudentInfo, value: string) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Quiz Not Found
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Quiz not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {quiz.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{quiz.description}</p>

          {/* Quiz Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{quiz.totalQuestions} Questions</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{quiz.timeLimit} Minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Card */}
        {quiz.instructions && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Instructions
            </h2>
            <p className="text-gray-600 leading-relaxed">{quiz.instructions}</p>
          </div>
        )}

        {/* Student Information Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Student Information
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={studentInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                type="text"
                value={studentInfo.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                placeholder="Enter your registration number"
                className={
                  formErrors.registrationNumber ? "border-red-500" : ""
                }
              />
              {formErrors.registrationNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {formErrors.registrationNumber}
                </p>
              )}
            </div>

            <Button onClick={handleStartQuiz} className="w-full mt-6" size="lg">
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
