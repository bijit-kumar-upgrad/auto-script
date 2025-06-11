import React, { useState } from "react";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ProcessingOptions, { ProcessingOptionsType } from "@/components/ProcessingOptions";
import OutputSettings from "@/components/OutputSettings";
import ProcessedFile from "@/components/ProcessedFile";
import FileProcessing from "@/components/FileProcessing";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [processedContent, setProcessedContent] = useState<string | null>(null);
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

  const handleDownload = () => {
    if (!processedContent) {
      toast.error("No processed content available for download");
      return;
    }

    // Create a Blob and trigger the download of the processed file
    const blob = new Blob([processedContent], { type: 'text/plain' });
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

            {/* Pass relevant props to FileProcessing */}
            <FileProcessing
              file={file}
              docTitle={docTitle}
              options={{ ...options, isProcessing }}
              setProcessedContent={setProcessedContent}
              setIsProcessed={setIsProcessed}
              setIsProcessing={setIsProcessing}
            />

            {isProcessed && processedContent && (
              <ProcessedFile 
                title={docTitle || "Processed Document"} 
                content={processedContent}
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