import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TranscriptList } from './TranscriptList';
import { TranscriptUpload } from './TranscriptUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, List } from 'lucide-react';

export const Transcripts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'list';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            All Transcripts
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <TranscriptList />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <TranscriptUpload 
            onSuccess={() => {
              // Switch to list tab after successful upload
              setSearchParams({ tab: 'list' });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};