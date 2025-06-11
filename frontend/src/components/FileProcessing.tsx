import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axios from 'axios';
import ProcessedTable from "./ProcessedTable";

interface FileProcessingProps {
  file: File | null;
  docTitle: string;
  options: any;
  setProcessedContent: React.Dispatch<React.SetStateAction<string | null>>;
  setIsProcessed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileProcessing: React.FC<FileProcessingProps> = ({
  file,
  docTitle,
  options,
  setProcessedContent,
  setIsProcessed,
  setIsProcessing,
}) => {
  const [tableData, setTableData] = useState<any[]>([]); // For storing the OpenAI response data

  const handleProcessTranscript = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsProcessing(true);

    try {
      // Create FormData to send the file content to the backend
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to the backend for processing (assuming you have an endpoint /api/process)
      const response = await axios.post('http://localhost:8000/api/process-transcript', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Assuming the response contains the processed content
      const { data } = response;

      console.log("Response data:", data);

      let tableContent = data.content;
      if (typeof tableContent === "string") {
        try {
          tableContent = JSON.parse(tableContent);
        } catch (e) {
          console.error("Failed to parse content as JSON", e);
          tableContent = [];
        }
      }
      setTableData(tableContent); // Set the table data here
      setIsProcessed(true);
      toast.success("Transcript processed successfully");
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast.error("Failed to process transcript");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center mt-10">
        <Button 
          onClick={() => {
            console.log("Process Transcript button clicked");
            handleProcessTranscript();
          }} 
          disabled={!file || options.isProcessing}
          className="w-full max-w-xl py-6"
        >
          {options.isProcessing ? "Processing..." : "Process Transcript"}
        </Button>
      </div>

      {/* Render the table only after processing is successful */}
      {tableData.length > 0 && (
        <ProcessedTable data={tableData} />
      )}
    </div>
  );
};

export default FileProcessing;