
import React, { useState, useRef, DragEvent } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    onFileSelected(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Upload Transcript</h2>
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop your .txt, .doc, or .docx file or click to select.
      </p>
      <Card>
        <CardContent 
          className={`p-0 cursor-pointer ${isDragging ? 'file-drop-area active' : 'file-drop-area'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center h-40 p-4">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            {fileName ? (
              <p className="text-sm text-center">{fileName}</p>
            ) : (
              <p className="text-sm text-gray-400 text-center">Drag & drop or click to upload</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept=".txt,.doc,.docx"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
