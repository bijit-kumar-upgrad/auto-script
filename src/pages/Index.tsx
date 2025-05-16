
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ProcessingOptions, { ProcessingOptionsType } from "@/components/ProcessingOptions";
import OutputSettings from "@/components/OutputSettings";
import ProcessedFile from "@/components/ProcessedFile";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [options, setOptions] = useState<ProcessingOptionsType>({
    suggestFaceShots: true,
    suggestGraphics: false,
    applyTemplates: true,
  });

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessed(false);
    if (!docTitle) {
      // Set a default doc title based on the file name
      const baseName = selectedFile.name.split('.')[0];
      setDocTitle(baseName);
    }
  };

  const handleProcessTranscript = () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call to backend
    setTimeout(() => {
      setIsProcessing(false);
      setIsProcessed(true);
      toast.success("Transcript processed successfully");
    }, 2000);
  };

  const handleDownload = () => {
    // In a real app, this would download the actual processed file
    // For now, we'll just create a dummy text file
    const dummyContent = `This is a processed transcript for ${file?.name}
Processing options:
- Suggest Face Shots: ${options.suggestFaceShots ? 'Yes' : 'No'}
- Suggest Graphics: ${options.suggestGraphics ? 'Yes' : 'No'}
- Apply Templates: ${options.applyTemplates ? 'Yes' : 'No'}`;

    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle || 'processed_transcript'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("File downloaded");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark-gray flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container max-w-6xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-4xl font-bold text-center mb-8">Auto Script</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <FileUpload onFileSelected={handleFileSelected} />
                
                <ProcessingOptions 
                  options={options}
                  onOptionsChange={setOptions}
                />
              </div>
              
              <div>
                <OutputSettings
                  docTitle={docTitle}
                  onDocTitleChange={setDocTitle}
                />
              </div>
            </div>
            
            <div className="flex justify-center mt-10">
              <Button 
                onClick={handleProcessTranscript} 
                disabled={!file || isProcessing}
                className="w-full max-w-xl py-6"
              >
                {isProcessing ? "Processing..." : "Process Transcript"}
              </Button>
            </div>
            
            {isProcessed && (
              <ProcessedFile 
                title={docTitle || "Processed Document"} 
                onDownload={handleDownload} 
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="text-center p-4 text-sm text-gray-400">
        © 2025 Auto Script. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
