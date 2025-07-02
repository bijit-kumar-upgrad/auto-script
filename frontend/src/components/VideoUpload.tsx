import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import VideoProcessing from './VideoProcessing';

interface VideoUploadProps {
  onVideoSelected: (file: File) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideo = async(file: File) => {
    setFileName(file.name);
    setVideoFile(file); // Provide the selected file to the VideoProcessing component
  };

  return (      
    <Card className="bg-gray-50">
      <CardContent className='pt-6'>
        <h2 className="text-xl font-semibold mb-2">Upload Video</h2>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your video file or click to select (.mp4, .mov, .avi).
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
                  handleVideo(files[0]);
              }
          }}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center h-30 p-4">
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
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleVideo(files[0]);
              }
            }}
            accept="video/*"
          />
        </div>
        <div className="mt-6">
          <VideoProcessing videoFile={videoFile} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;