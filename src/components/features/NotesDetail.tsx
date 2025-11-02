import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Calendar, Hash } from "lucide-react";

import { useAppContext } from "../../context/AppContext";
import { NotesData } from "../../types";
import RichTextEditor from "../RichTextEditor";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { SectionLoading } from "../ui/loading";

export const NotesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, loading } = useAppContext();
  const [note, setNote] = useState<NotesData | null>(null);

  useEffect(() => {
    if (notes && id) {
      const foundNote = notes.find(n => n.id === parseInt(id));
      setNote(foundNote || null);
    }
  }, [notes, id]);

  const downloadNotesAsPDF = (noteData: NotesData) => {
    if (!noteData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    pdf.setFontSize(16);
    pdf.text(`Notes #${noteData.id}`, margin, 30);

    // Add metadata
    pdf.setFontSize(10);
    pdf.text(`Created: ${new Date(noteData.created_at).toLocaleString()}`, margin, 45);

    // Add content - strip HTML tags for PDF
    pdf.setFontSize(12);
    const plainText = noteData.notes
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ");
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

    pdf.save(`notes-${noteData.id}.pdf`);
  };

  const downloadNotesAsMarkdown = (noteData: NotesData) => {
    if (!noteData) return;

    // Convert HTML to Markdown
    let markdown = `# Notes #${noteData.id}\n\n`;
    markdown += `**Created:** ${new Date(noteData.created_at).toLocaleString()}\n\n`;
    markdown += "---\n\n";
    
    markdown += noteData.notes
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<ul[^>]*>/gi, "")
      .replace(/<\/ul>/gi, "\n")
      .replace(/<ol[^>]*>/gi, "")
      .replace(/<\/ol>/gi, "\n")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up extra newlines

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${noteData.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <SectionLoading 
        message="Loading note details..." 
        height="h-64"
      />
    );
  }

  if (!note) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Note not found</p>
            <p className="text-sm text-muted-foreground mt-2">
              The note with ID {id} could not be found.
            </p>
            <Link to="/notes">
              <Button className="mt-4">
                Return to Notes Manager
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {note.title || `Notes #${note.id}`}
            </h1>
            <p className="text-muted-foreground">Detailed view</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => downloadNotesAsPDF(note)} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button 
            onClick={() => downloadNotesAsMarkdown(note)} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Markdown
          </Button>
        </div>
      </div>

      {/* Note metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                {note.title || `Note #${note.id}`}
              </CardTitle>
              <CardDescription>
                AI-generated notes from your transcript
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(note.created_at).toLocaleDateString()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(note.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Note content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Full note content with rich formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <RichTextEditor
              value={note.notes}
              onChange={() => {}}
              readOnly={true}
              height={600}
            />
          </div>
        </CardContent>
      </Card>

      {/* Original transcript (if available) */}
      {note.transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Original Transcript</CardTitle>
            <CardDescription>
              The source transcript used to generate these notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {note.transcript}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};