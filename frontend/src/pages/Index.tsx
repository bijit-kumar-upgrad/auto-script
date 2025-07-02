import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ProcessingOptions, { ProcessingOptionsType } from "@/components/ProcessingOptions";
import OutputSettings from "@/components/OutputSettings";
import ProcessedFile from "@/components/ProcessedFile";
import FileProcessing from "@/components/FileProcessing";
import VideoUpload from "@/components/VideoUpload";
import VideoProcessing from "@/components/VideoProcessing";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessingTranscript, setIsProcessingTranscript] = useState(false);
  const [isProcessingResend, setIsProcessingResend] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [transcriptReady, setTranscriptReady] = useState(false); 
  const [options, setOptions] = useState<ProcessingOptionsType>({
    suggestFaceShots: 10,
    suggestGraphics: 20,
    applyTemplates: 70,
  });

  // Handle file selection from FileUpload component
  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    if (!docTitle) {
      // Set a default doc title based on the file name
      const fileName = selectedFile.name.split('.')[0];
      setDocTitle(`PPS-${fileName}`);
    }
  };

  // Reset handler to clear all relevant state
  const handleReset = () => {
    setFile(null);
    setDocTitle("");
    setIsProcessingTranscript(false);
    setIsProcessingResend(false);
    setTranscriptReady(false);

    console.log("Page reset");
    // Optionally reset options to default if needed
    // setOptions({ suggestFaceShots: 10, suggestGraphics: 20, applyTemplates: 70 });
    // If FileProcessing manages its own tableData, you may need to lift state up for a full reset
    // For now, rely on file/docTitle being cleared to hide table/download
  };

  // Handle video selection from VideoUpload component
  const handleVideoSelected = (selectedVideo: File) => {
    setVideoFile(selectedVideo);
    setTranscriptReady(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark-gray flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container max-w-6xl mx-auto py-8">
          <h1 className="text-4xl font-bold text-center mb-2">Auto Script</h1>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <FileUpload onFileSelected={handleFileSelected} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProcessingOptions 
                  options={options}
                  onOptionsChange={setOptions}
                />
                <div>
                  <OutputSettings
                    docTitle={docTitle}
                    onDocTitleChange={setDocTitle}
                  />
                </div>
              </div>
            </div>      
            <div className="flex-1 flex justify-center">
              <FileProcessing
                file={file}
                docTitle={docTitle}
                options={options}
                isProcessingTranscript={isProcessingTranscript}
                setIsProcessingTranscript={setIsProcessingTranscript}
                isProcessingResend={isProcessingResend}
                setIsProcessingResend={setIsProcessingResend}
                handleReset={handleReset} // pass a signal to child for full reset
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;