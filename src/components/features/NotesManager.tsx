import jsPDF from "jspdf";
import React from "react";
import { Link } from "react-router-dom";

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
import { SectionLoading } from "../ui/loading";

export const NotesManager: React.FC = () => {
  const { notes, loading } = useAppContext();
  
  // Ensure notes is an array before using array methods
  const notesArray = Array.isArray(notes) ? notes : [];
  const renderNotes = (notesText: string) => {
    return (
      <div className="prose prose-sm max-w-none">
        <RichTextEditor
          value={notesText}
          onChange={() => {}}
          readOnly={true}
          height={300}
        />
      </div>
    );
  };

  const downloadNotesAsPDF = (note: NotesData) => {
    if (!note) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    pdf.setFontSize(16);
    pdf.text("Generated Notes", margin, 30);

    // Add content - strip HTML tags for PDF
    pdf.setFontSize(12);
    const plainText = note.notes
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ");
    const lines = pdf.splitTextToSize(plainText, maxWidth);
    let yPosition = 50;

    lines.forEach((line: string) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 30;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });

    pdf.save("transcript-notes.pdf");
  };

  const downloadNotesAsMarkdown = (note: NotesData) => {
    if (!note) return;

    // Convert HTML to Markdown
    let markdown = note.notes
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
    a.download = "transcript-notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No notes available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload a transcript to generate notes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notes Manager</h1>
        <p className="text-muted-foreground">{notesArray.length} notes available</p>
      </div>
      
      {notesArray.map((note, index) => (
        <Card key={note.id || index}>
          <CardHeader>
            <CardTitle>{note.title || `Notes #${note.id || index + 1}`}</CardTitle>
            <CardDescription>
              AI-generated notes from your transcript
              {note.created_at && (
                <span className="block text-sm text-muted-foreground mt-1">
                  Created: {new Date(note.created_at).toLocaleString()}
                </span>
              )}
            </CardDescription>
            <div className="flex gap-2">
              <Link to={`/notes/${note.id}`}>
                <Button variant="default" size="sm">
                  View Details
                </Button>
              </Link>
              <Button 
                onClick={() => downloadNotesAsPDF(note)} 
                variant="outline" 
                size="sm"
              >
                Download PDF
              </Button>
              <Button 
                onClick={() => downloadNotesAsMarkdown(note)} 
                variant="outline" 
                size="sm"
              >
                Download Markdown
              </Button>
            </div>
          </CardHeader>
          <CardContent>{renderNotes(note.notes)}</CardContent>
        </Card>
      ))}
    </div>
  );
};