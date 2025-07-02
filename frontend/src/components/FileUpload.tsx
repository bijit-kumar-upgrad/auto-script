import React, { useState, useRef, DragEvent } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/ApiConfig';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setFileName(file.name);
    onFileSelected(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Upload Transcript</h2>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your .txt, .doc, or .docx file or click to select.
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
      
          <div className="flex flex-col items-center justify-center h-20 p-4">
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
            accept=".txt,.doc,.docx"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
