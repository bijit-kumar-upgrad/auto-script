import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axios from 'axios';
import ProcessedTable from "./ProcessedTable";
import { API_URL } from "@/ApiConfig";
import ProcessedFile from "./ProcessedFile";
import { RotateCcw } from "lucide-react";

interface FileProcessingProps {
  file: File | null;
  docTitle: string;
  options: any;
  isProcessingTranscript: boolean;
  setIsProcessingTranscript: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessingResend: boolean;
  setIsProcessingResend: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: any; // signal from parent to reset all state
}

const FileProcessing: React.FC<FileProcessingProps> = ({
  file,
  docTitle,
  options,
  isProcessingTranscript,
  setIsProcessingTranscript,
  isProcessingResend,
  setIsProcessingResend,
  handleReset,
}) => {
  const [tableData, setTableData] = useState<any[]>([]); // For storing the OpenAI response data
  const [modifiedRows, setModifiedRows] = useState<any[]>([]); // For storing modified rows
  const [updatedTableData, setUpdatedTableData] = useState<any[]>([]); // For storing the updated table

  const handleProcessTranscript = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsProcessingTranscript(true); // Set processing state for "Process Transcript"

    try {
      // Create FormData to send the file content to the backend
      const formData = new FormData();
      formData.append('file', file);

      // Add the slider data to the form data
      const processingOptionsData = [
        options.suggestFaceShots,    // Faceshots percentage
        options.suggestGraphics,     // Graphics percentage
        options.applyTemplates,      // Templates percentage
      ];

      // Check if the total of the values add up to 100 before sending the request
      const total = options.suggestFaceShots + options.suggestGraphics + options.applyTemplates;

      if (total !== 100) {
        toast.error("Total of sliders must equal 100%");
        setIsProcessingTranscript(false);
        return;
      }

      formData.append('processingOptionsData', JSON.stringify(processingOptionsData));

      // Send the file and the processing options to the backend for processing
      const response = await axios.post(`${API_URL}/api/process-transcript`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { data } = response;

      console.log("Response data:", data);

      let tableContent = data;
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
      setIsProcessingTranscript(false);
      toast.success("Transcript processed successfully");
    } catch (error) {
      console.error("Error processing transcript(f):", error);
      toast.error("Failed to process transcript");
    } finally {
      setIsProcessingTranscript(false);
    }
  };

  const handleResend = async () => {
    if (modifiedRows.length === 0) {
      toast("No changes to send");
      return;
    }
    
    setIsProcessingResend(true);

    try {
      const formData = new FormData();
      formData.append('modifiedRows', JSON.stringify(modifiedRows));

      // Send the modified rows data to the backend for processing
      const response = await axios.post(`${API_URL}/api/update-templates`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const {data} = response;

      console.log("Response data from resend:", data);

      // Process the response data
      let updatedtableContent = data;
      if(typeof updatedtableContent === "string"){
        try {
          updatedtableContent = JSON.parse(updatedtableContent);
        } catch (e) {
          console.error("Failed to parse content as JSON", e);
          updatedtableContent = [];
        }
      }

      setUpdatedTableData(updatedtableContent); // Set the table data here
      setModifiedRows([]); // Reset modified rows
      setIsProcessingResend(false);
      toast.success("Changes have been successfully sent and processed");
    } catch (err) {
      console.error("Failed to send changes:", err);
      setIsProcessingResend(false);
      toast.error("Error sending changes");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mt-10 mb-4">
        {/* Process Transcript button */}
        <div className="flex justify-center flex-grow">
          <Button 
            onClick={() => {
              console.log("Process Transcript button clicked");
              handleProcessTranscript();
            }} 
            disabled={!file || isProcessingTranscript}
            className="w-[260px] h-12 text-base"
          >
            {isProcessingTranscript ? "Processing..." : "Process Transcript"}
          </Button>
        </div>

        {/* Reset button */}
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Refresh"
            className="h-12 px-4 flex items-center justify-center bg-red-500 text-white rounded-md"
            onClick={() => {
              setTableData([]);
              setModifiedRows([]);
              setUpdatedTableData([]);
              handleReset(); // signal to parent to reset
            }}
            style={{
              minWidth: '40px', 
              width: 'auto', 
              padding: '0',  // Remove unnecessary padding
              fontSize: '28px' // Force icon size directly
            }}
          >
            <RotateCcw size={28} />
          </button>
        </div>
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
                  ? `PPS-${file.name.split('.')[0]}.docx`
                  : "PPS-Untitled.docx"
            }
            data={tableData}
          />

          {/* Render the table */}
          <ProcessedTable 
            data={tableData} 
            onModifiedRowsChange={(rows) => setModifiedRows(rows)}
          />

          {/* Render the resend changes button */}
          <div className="flex justify-center mt-10">
            <Button 
              onClick={() => {
                console.log("Resend Changes button clicked");
                console.log("Modified Rows:", modifiedRows);
                handleResend();
              }}
              disabled={modifiedRows.length === 0 || isProcessingResend}
              className="w-full max-w-xl py-6"
            >
              {isProcessingResend ? "Resending..." : "Resend Changes"}
            </Button>
          </div>
        </>
      )}

      {/* Render the updated table only after processing is successful */}
      { updatedTableData.length > 0 && (
        <>
          {/* Render the table */}
          <ProcessedTable 
            data={updatedTableData} 
            onModifiedRowsChange={(rows) => setModifiedRows(rows)}
          />

          {/* Render the download button after processing */}
          <ProcessedFile 
            title={
              docTitle?.trim() !== ""
                ? `${docTitle}.docx`
                : file?.name
                  ? `PPS-${file.name.split('.')[0]}.docx`
                  : "PPS-Untitled.docx"
            }
            data={updatedTableData}
          />
        </>
      )}
    </div>
  );
};

export default FileProcessing;