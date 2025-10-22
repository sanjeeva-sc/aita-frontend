import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Template } from "../../types";
import { Alert, AlertDescription } from "../ui/alert";
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
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { CheckCircle, Upload, Brain, FileText, Loader2 } from "lucide-react";
import { InlineLoading } from "../ui/loading";
import { NotesCustomization, defaultNotesOptions } from './NotesCustomization';
import { QuizCustomization, defaultQuizOptions } from './QuizCustomization';

interface TranscriptUploadProps {
  onSuccess?: (notesId: number) => void;
}

export const TranscriptUpload: React.FC<TranscriptUploadProps> = ({ onSuccess }) => {
  const { getToken } = useAuth();
  const { templates, refreshData } = useAppContext();
  const navigate = useNavigate();
  
  // Ensure templates is an array before using array methods
  const templatesArray = Array.isArray(templates) ? templates : [];

  const [transcript, setTranscript] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'processing' | 'generating' | 'complete'>('idle');
  const [notesOptions, setNotesOptions] = useState(defaultNotesOptions);
  const [quizOptions, setQuizOptions] = useState(defaultQuizOptions);
  const [showCustomization, setShowCustomization] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Read file content and set it to transcript
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setTranscript(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transcript.trim()) {
      setError(
        "Please provide a transcript either by typing or uploading a file."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setUploadProgress(0);
    setCurrentStep('uploading');

    try {
      // Get authentication token
      const token = await getToken();

      if (!token) {
        setError("Authentication failed. Please sign in again.");
        setCurrentStep('idle');
        return;
      }

      // Simulate upload progress
      setUploadProgress(25);
      
      let uploadResponse: any;

      if (file) {
        const formData = new FormData();
        formData.append("transcript", file);
        if (selectedTemplate) {
          formData.append("templateId", selectedTemplate);
        }
        if (showCustomization) {
          formData.append('notesOptions', JSON.stringify(notesOptions));
          formData.append('quizOptions', JSON.stringify(quizOptions));
        }

        setCurrentStep('processing');
        setUploadProgress(50);

        uploadResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Send as JSON for text input
        const requestData = {
          transcript: transcript,
          templateId: selectedTemplate || null,
          ...(showCustomization && { 
            notesOptions: notesOptions,
            quizOptions: quizOptions 
          })
        };

        setCurrentStep('processing');
        setUploadProgress(50);

        uploadResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/upload`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setCurrentStep('generating');
      setUploadProgress(75);

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { notesId } = uploadResponse.data;
      
      setCurrentStep('complete');
      setUploadProgress(100);
      setSuccess("Transcript processed successfully!");
      
      // Refresh global data
      await refreshData();
      
      // Call success callback or navigate
      if (onSuccess) {
        onSuccess(notesId);
      } else {
        // Navigate to notes view after a brief delay to show completion
        setTimeout(() => {
          navigate(`/notes/${notesId}`);
        }, 1500);
      }

      // Reset form after navigation
      setTimeout(() => {
        setTranscript("");
        setFile(null);
        setSelectedTemplate("");
        setCurrentStep('idle');
        setUploadProgress(0);
      }, 2000);
      
    } catch (err: any) {
      console.error("Error processing transcript:", err);
      setError(
        err.response?.data?.error ||
          "Failed to process transcript. Please try again."
      );
      setCurrentStep('idle');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Upload Transcript
          </CardTitle>
          <CardDescription className="text-lg">
            Upload a class transcript or paste text to generate detailed notes
            and quiz questions using AI
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transcript Input</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="transcript-text">Paste Transcript Text:</Label>
              <Textarea
                id="transcript-text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your class transcript here..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcript-file">Or Upload Text File:</Label>
              <Input
                type="file"
                id="transcript-file"
                accept=".txt,.md"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Note Template (Optional)</Label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Default Format</option>
                {templatesArray.map((template: Template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.subject})
                  </option>
                ))}
              </select>
            </div>

            {/* Customization Options Toggle */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-customization"
                  checked={showCustomization}
                  onChange={(e) => setShowCustomization(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <Label htmlFor="show-customization" className="text-sm font-medium">
                  Advanced Customization Options
                </Label>
              </div>

              {showCustomization && (
                <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Notes Customization</h3>
                    <NotesCustomization
                      options={notesOptions}
                      onChange={setNotesOptions}
                      onReset={() => setNotesOptions(defaultNotesOptions)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quiz Customization</h3>
                    <QuizCustomization
                      options={quizOptions}
                      onChange={setQuizOptions}
                      onReset={() => setQuizOptions(defaultQuizOptions)}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <InlineLoading size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Generate Notes & Quiz"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Your Transcript
            </CardTitle>
            <CardDescription>
              Please wait while we process your transcript with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1: Upload */}
              <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                currentStep === 'uploading' ? 'border-blue-200 bg-blue-50' :
                ['processing', 'generating', 'complete'].includes(currentStep) ? 'border-green-200 bg-green-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'uploading' ? 'bg-blue-500 text-white' :
                  ['processing', 'generating', 'complete'].includes(currentStep) ? 'bg-green-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {['processing', 'generating', 'complete'].includes(currentStep) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Upload</p>
                  <p className="text-xs text-muted-foreground">Sending data</p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                currentStep === 'processing' ? 'border-blue-200 bg-blue-50' :
                ['generating', 'complete'].includes(currentStep) ? 'border-green-200 bg-green-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'processing' ? 'bg-blue-500 text-white' :
                  ['generating', 'complete'].includes(currentStep) ? 'bg-green-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {['generating', 'complete'].includes(currentStep) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Processing</p>
                  <p className="text-xs text-muted-foreground">Analyzing text</p>
                </div>
              </div>

              {/* Step 3: AI Generation */}
              <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                currentStep === 'generating' ? 'border-blue-200 bg-blue-50' :
                currentStep === 'complete' ? 'border-green-200 bg-green-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'generating' ? 'bg-blue-500 text-white' :
                  currentStep === 'complete' ? 'bg-green-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'complete' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">AI Generation</p>
                  <p className="text-xs text-muted-foreground">Creating content</p>
                </div>
              </div>

              {/* Step 4: Complete */}
              <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                currentStep === 'complete' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Complete</p>
                  <p className="text-xs text-muted-foreground">Ready to view</p>
                </div>
              </div>
            </div>

            {/* Current Step Description */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {currentStep === 'uploading' && "Uploading your transcript..."}
                {currentStep === 'processing' && "Processing and validating your content..."}
                {currentStep === 'generating' && "AI is generating notes and quiz questions..."}
                {currentStep === 'complete' && "Success! Redirecting to your notes..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};