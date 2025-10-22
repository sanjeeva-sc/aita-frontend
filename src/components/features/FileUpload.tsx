import React from 'react';
import { TranscriptUpload } from './TranscriptUpload';

export const FileUpload: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Upload Transcript</h1>
        <p className="text-slate-600 mt-2">
          Upload a class transcript or paste text to generate detailed notes and quiz questions using AI
        </p>
      </div>
      
      <TranscriptUpload />
    </div>
  );
};