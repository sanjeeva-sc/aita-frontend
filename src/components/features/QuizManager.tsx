import React from "react";
import { useAppContext } from "../../context/AppContext";
import { QuizList } from "./QuizList";

export const QuizManager: React.FC = () => {
  const { quizzes, loading } = useAppContext();

  return <QuizList quizzes={quizzes || []} loading={loading} />;
};