import React from 'react';
import { useParams } from 'react-router-dom';
import { QuizListView } from './QuizListView';
import { QuizDetail } from './QuizDetail';

export const Quizzes: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // If there's an ID in the URL, show the detail view
  if (id) {
    return <QuizDetail />;
  }

  // Otherwise, show the list view
  return <QuizListView />;
};