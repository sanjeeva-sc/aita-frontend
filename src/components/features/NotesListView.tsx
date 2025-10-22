import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, Calendar, FileText, StickyNote } from 'lucide-react';
import jsPDF from 'jspdf';

import { useAppContext } from '../../context/AppContext';
import { NotesData } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SectionLoading } from '../ui/loading';

export const NotesListView: React.FC = () => {
  const { notes, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const downloadNotesAsPDF = (note: NotesData) => {
    if (!note) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    pdf.setFontSize(16);
    pdf.text(`Notes #${note.id}`, margin, 30);

    // Add metadata
    pdf.setFontSize(10);
    pdf.text(`Created: ${new Date(note.created_at).toLocaleString()}`, margin, 45);

    // Add content - strip HTML tags for PDF
    pdf.setFontSize(12);
    const plainText = note.notes
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ');
    const lines = pdf.splitTextToSize(plainText, maxWidth);
    let yPosition = 60;

    lines.forEach((line: string) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 30;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });

    pdf.save(`notes-${note.id}.pdf`);
  };

  const downloadNotesAsMarkdown = (note: NotesData) => {
    if (!note) return;

    // Convert HTML to Markdown
    let markdown = `# Notes #${note.id}\n\n`;
    markdown += `**Created:** ${new Date(note.created_at).toLocaleString()}\n\n`;
    markdown += '---\n\n';
    
    markdown += note.notes
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up extra newlines

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${note.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedNotes = React.useMemo(() => {
    if (!notes) return [];
    
    let filtered = notes.filter(note => {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.notes.toLowerCase().includes(searchLower) ||
        note.id.toString().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.id - b.id;
      }
    });
  }, [notes, searchTerm, sortBy]);

  if (loading) {
    return (
      <SectionLoading 
        message="Loading your notes..." 
        height="h-64"
      />
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-12">
        <StickyNote className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-6">
          Upload a transcript to generate your first notes
        </p>
        <Link to="/transcripts?tab=upload">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Upload Transcript
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedNotes.length} of {notes.length} notes
          </p>
        </div>
        <Link to="/transcripts?tab=upload">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate New Notes
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: 'date' | 'title') => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="title">Sort by ID</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-6">
        {filteredAndSortedNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5" />
                    Notes #{note.id}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(note.created_at).toLocaleDateString()} at{' '}
                    {new Date(note.created_at).toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Badge variant="secondary">AI Generated</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preview of notes content */}
                <div className="prose prose-sm max-w-none">
                  <div 
                    className="line-clamp-3 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: note.notes.substring(0, 200) + (note.notes.length > 200 ? '...' : '') 
                    }}
                  />
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Link to={`/notes/${note.id}`}>
                    <Button variant="default" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => downloadNotesAsPDF(note)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Download as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadNotesAsMarkdown(note)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Download as Markdown
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedNotes.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};