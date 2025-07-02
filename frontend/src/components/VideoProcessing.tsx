import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios'; // Import axios for API call
import { toast } from "@/components/ui/sonner";
import { API_URL } from "@/ApiConfig"; // Ensure to update this with your actual API URL

interface VideoProcessingProps {
  videoFile: File | null;
}

const VideoProcessing: React.FC<VideoProcessingProps> = ({ videoFile }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);

  const handleGetTranscript = async () => {
    if (!videoFile) {
      toast.error("Please upload a video first.");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      console.log("Sending video for processing:", videoFile.name);

      // Send the video to the backend for processing
      const response = await axios.post(`${API_URL}/api/process-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscript(response.data.transcript); 
      setIsTranscriptReady(true);
      toast.success("Transcript generated successfully!");
    } catch (error) {
      console.error("Error generating transcript:", error);
      toast.error("Failed to generate transcript");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!isTranscriptReady) {
      toast.error("Transcript is not ready for download.");
      return;
    }

    // Download the transcript
    const blob = new Blob([transcript || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "generated_transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 flex space-x-4">
      <Button
        onClick={handleGetTranscript}
        disabled={!videoFile || isProcessing}
        className="w-full max-w-xl py-4"
      >
        {isProcessing ? "Processing..." : "Get Transcript"}
      </Button>
      <Button
        onClick={handleDownload}
        disabled={!isTranscriptReady}
        className="w-full max-w-xl py-4"
      >
        Download Transcript
      </Button>
    </div>
  );
};

export default VideoProcessing;