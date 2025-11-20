import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TranscriptList } from './TranscriptList';
import { TranscriptUpload } from './TranscriptUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, List, Mic } from 'lucide-react';
import { TranscriptRecord } from './TranscriptRecord';

export const Transcripts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'list';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            All Transcripts
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New
          </TabsTrigger>
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Record Class
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

        <TabsContent value="record" className="mt-6">
          <TranscriptRecord 
            onSuccess={() => {
              setSearchParams({ tab: 'list' });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};