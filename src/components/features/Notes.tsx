import React from 'react';
import { useParams } from 'react-router-dom';
import { NotesListView } from './NotesListView';
import { NotesDetail } from './NotesDetail';

export const Notes: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // If there's an ID parameter, show the detail view
  if (id) {
    return <NotesDetail />;
  }

  // Otherwise, show the list view
  return <NotesListView />;
};