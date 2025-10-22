import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppContextType, AppState, NotesData, QuizResponse, Template } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { getToken } = useAuth();
  
  const [state, setState] = useState<AppState>({
    templates: [],
    notes: [],
    quizzes: [],
    loading: false,
    error: null,
  });

  const setTemplates = (templates: Template[]) => {
    setState(prev => ({ ...prev, templates }));
  };

  const setNotes = (notes: NotesData[]) => {
    setState(prev => ({ ...prev, notes }));
  };

  const setQuizzes = (quizzes: QuizResponse[]) => {
    setState(prev => ({ ...prev, quizzes }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [templatesRes, notesRes, quizzesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/templates`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/quiz`, { headers }),
      ]);

      setTemplates(templatesRes.data);
      setNotes(notesRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const contextValue: AppContextType = {
    ...state,
    setTemplates,
    setNotes,
    setQuizzes,
    setLoading,
    setError,
    refreshData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};