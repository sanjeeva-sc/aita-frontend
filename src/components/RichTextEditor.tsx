import React, { useRef, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wand2, X } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = 400,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectionChange = useCallback(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const selection = quill.getSelection();
      
      if (selection && selection.length > 0) {
        const text = quill.getText(selection.index, selection.length);
        setSelectedText(text);
      } else {
        setSelectedText("");
        setShowAIPanel(false);
      }
    }
  }, []);

  const handleAIEdit = async () => {
    if (!selectedText || !aiPrompt.trim()) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing - in a real app, you'd call your AI API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just add some formatting based on the prompt
      let editedText = selectedText;
      
      if (aiPrompt.toLowerCase().includes("bold")) {
        editedText = `<strong>${selectedText}</strong>`;
      } else if (aiPrompt.toLowerCase().includes("italic")) {
        editedText = `<em>${selectedText}</em>`;
      } else if (aiPrompt.toLowerCase().includes("highlight")) {
        editedText = `<mark>${selectedText}</mark>`;
      } else if (aiPrompt.toLowerCase().includes("uppercase")) {
        editedText = selectedText.toUpperCase();
      } else if (aiPrompt.toLowerCase().includes("lowercase")) {
        editedText = selectedText.toLowerCase();
      } else {
        // Default: add emphasis
        editedText = `<em>${selectedText}</em>`;
      }

      // Replace the selected text with the edited version
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const selection = quill.getSelection();
        
        if (selection) {
          quill.deleteText(selection.index, selection.length);
          quill.clipboard.dangerouslyPasteHTML(selection.index, editedText);
        }
      }

      setShowAIPanel(false);
      setAiPrompt("");
      setSelectedText("");
    } catch (error) {
      console.error("AI editing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const modules = {
    toolbar: readOnly ? false : [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
      ...(selectedText ? [['ai-edit']] : [])
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor relative">
      <div style={{ height: `${height}px` }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          modules={modules}
          formats={formats}
          onChangeSelection={handleSelectionChange}
          style={{ height: `${height - 42}px` }}
        />
      </div>

      {/* AI Editing Panel */}
      {selectedText && !readOnly && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="bg-white shadow-md"
          >
            <Wand2 className="w-4 h-4 mr-1" />
            AI Edit
          </Button>
        </div>
      )}

      {showAIPanel && (
        <Card className="absolute top-12 right-2 w-80 z-20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              AI Edit Selected Text
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIPanel(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Selected Text:</label>
              <div className="text-sm bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                {selectedText}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600">AI Instruction:</label>
              <Textarea
                placeholder="e.g., 'make this bold', 'highlight this', 'make uppercase'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="text-sm"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAIEdit}
                disabled={!aiPrompt.trim() || isProcessing}
                size="sm"
                className="flex-1"
              >
                {isProcessing ? "Processing..." : "Apply AI Edit"}
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              Try: "bold", "italic", "highlight", "uppercase", "lowercase"
            </div>
          </CardContent>
        </Card>
      )}

      <style>{`
        .ql-editor {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          color: #2563eb;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .ql-editor h1 { font-size: 1.8em; }
        .ql-editor h2 { font-size: 1.5em; }
        .ql-editor h3 { font-size: 1.3em; }
        
        .ql-editor ul, .ql-editor ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        .ql-editor li { margin: 0.5em 0; }
        .ql-editor p { margin: 1em 0; }
        
        .ql-editor mark {
          background-color: #fef08a;
          padding: 2px 4px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
