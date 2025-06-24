import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axios from 'axios';
import ProcessedTable from "./ProcessedTable";
import { API_URL } from "@/ApiConfig";
import { set } from "date-fns";
import ProcessedFile from "./ProcessedFile";

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
  const [modifiedRows, setModifiedRows] = useState<any[]>([]); // For storing modified rows

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

      // Send the file to the backend for processing
      const response = await axios.post(`${API_URL}/api/process-transcript`, formData, {
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
      setModifiedRows([]); // Reset modified rows
      setIsProcessed(true);
      toast.success("Transcript processed successfully");
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast.error("Failed to process transcript");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResend = async () => {
    if (modifiedRows.length === 0) {
      toast("No changes to send");
      return;
    }
    
    try {
      // Resend the modified rows data to the backend for processing
      await axios.post(`${API_URL}/api/update-templates`, modifiedRows);
    } catch (err) {
      console.error("Failed to send changes:", err);
      toast.error("Error sending changes");
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
        <>
          {/* Render the processed file download link */}
          <ProcessedFile 
            title={
              docTitle?.trim() !== ""
                ? `${docTitle}.docx`
                : file?.name
                  ? `PPS: ${file.name.split('.')[0]}.docx`
                  : "PPS: Untitled.docx"
            }
            data={tableData}
          />

          <ProcessedTable 
            data={tableData} 
            onModifiedRowsChange={(rows) => setModifiedRows(rows)}
          />
          <div className="flex justify-center mt-10">
            <Button 
              onClick={() => {
                console.log("Resend Changes button clicked");
                console.log("Modified Rows:", modifiedRows);
                handleResend();
              }}
              disabled={modifiedRows.length === 0 || options.isProcessing}
              className="w-full max-w-xl py-6"
            >
              {options.isProcessing ? "Resending..." : "Resend Changes"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileProcessing;