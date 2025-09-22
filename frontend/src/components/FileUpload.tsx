import React, { useState, useRef, useEffect, DragEvent } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface FileUploadProps {
  onFileSelected: (file: File | null, text?: string) => void;
  resetStatus: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, resetStatus }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the file name when resetStatus changes to true
  useEffect(() => {
    if (resetStatus) {
      setFileName(null); // Resets the file name
      setTextInput(""); // Resets the text box 
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input field
      }
    }
  }, [resetStatus]);

  const processFile = async (file: File) => {
    setFileName(file.name);
    onFileSelected(file, undefined);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleTextChange = (value: string) => {
    setTextInput(value);
    onFileSelected(null, value);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* File Upload Card */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Upload Transcript</h2>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your .txt, or .docx file or click to select.
          </p>

          <div
            className={`p-0 cursor-pointer ${isDragging ? 'file-drop-area active' : 'file-drop-area'}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);

              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                processFile(files[0]);
              }
            }}
            onClick={handleClick}
          >
        
            <div className="flex flex-col items-center justify-center h-40 p-4">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              {fileName ? (
                <p className="text-sm text-center">{fileName}</p>
              ) : (
                <p className="text-sm text-gray-500 text-center">Drag & drop or click to upload</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  processFile(files[0]);
                }
              }}
              accept=".txt,.docx"
            />
          </div>
        </CardContent>
      </Card>

      {/* Text Paste Card */}
      <Card className='bg-gray-50'>
        <CardContent className='pt-6'>
          <h2 className="text-xl font-semibold mb-2">Paste Transcript</h2>
          <p className="text-sm text-gray-500 mb-4">
            Paste transcript here
          </p>

          <Textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm"
            placeholder="Paste transcript here..."
            value={textInput}
            onChange={(e) => {
              const value = e.target.value;
              setTextInput(value);

              if (value.trim()) {
                // Convert pasted text into a File object
                const blob = new Blob([value], { type: "text/plain" });
                const syntheticFile = new File([blob], "transcript.txt", {
                  type: "text/plain",
                });

                // Use same pipeline as file uploads
                onFileSelected(syntheticFile);
              } else {
                // Clear file if text is erased
                onFileSelected(null);
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;