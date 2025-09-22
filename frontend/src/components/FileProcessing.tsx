import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axios from 'axios';
import ProcessedTable from "./ProcessedTable";
import { API_URL } from "@/ApiConfig";
import ProcessedFile from "./ProcessedFile";
import { RotateCcw, Copy, CopyIcon, RefreshCcw } from "lucide-react";

interface FileProcessingProps {
  file: File | null;
  docTitle: string;
  options: any;
  isProcessingTranscript: boolean;
  setIsProcessingTranscript: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessingResend: boolean;
  setIsProcessingResend: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: any;
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
      formData.append('mainResponseData', JSON.stringify(tableData));

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
          console.log("Updated Table:", updatedtableContent);
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

  // helper for copying table
  const copyTableFromWrapper = (wrapperSelector: string) => {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) {
      toast.error("No table wrapper found");
      return;
    }

    const tableEl = wrapper.querySelector<HTMLTableElement>("table");
    if (!tableEl) {
      toast.error("No table found inside wrapper");
      return;
    }

    // Clone table to clean it before copying
    const clone = tableEl.cloneNode(true) as HTMLElement;

    // Replace dropdowns with selected value
    clone.querySelectorAll("select").forEach((select) => {
      const selected = (select as HTMLSelectElement).selectedOptions[0]?.textContent || "";
      const span = document.createElement("span");
      span.textContent = selected;
      select.replaceWith(span);
    });

    // Append off-screen, select, copy, remove
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    const range = document.createRange();
    range.selectNode(clone);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const successful = document.execCommand("copy");
    //console.log("Copied content:", clone.outerHTML);

    sel?.removeAllRanges();
    document.body.removeChild(clone);

    if (successful) {
      toast.success("Table copied to clipboard!");
    } else {
      toast.error("Failed to copy table");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mt-4 mb-4 space-x-4">
        {/* Process Transcript button */}
        <div className="flex justify-center flex-grow">
          <Button 
            onClick={() => {
              console.log("Process Transcript button clicked");
              handleProcessTranscript();
            }} 
            disabled={!file || isProcessingTranscript}
            className="w-full py-4 max-w-xl"
          >
            {isProcessingTranscript ? "Processing..." : "Process Transcript"}
          </Button>
        </div>

        {/* Download button for processed data */}
        {/*<div className="flex justify-between mt-4 mb-4 space-x-4">*/}
          {/* Download button for processed file*/}
          <div className="flex justify-center">
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
          </div>

          {/* Copy Table button*/}
          <div className="flex justify-end">
            <Button
              onClick={() => copyTableFromWrapper(".initial-table-wrapper")}
              disabled={tableData.length === 0}
              className="w-full py-4 max-w-xl"
            >
              <CopyIcon/>
            </Button>
          </div>

          {/* Reset button */}
          <div className="flex justify-end">
            <Button
              aria-label="reset"
              className="w-full py-4 max-w-xl"
              onClick={() => {
                setTableData([]);
                setModifiedRows([]);
                setUpdatedTableData([]);
                handleReset();
              }}
              disabled = {!file}
            >
              <RefreshCcw />
            </Button>
          </div>
        {/*</div>*/}
      </div>

      {/* Render the table only after processing is successful */}
      {tableData.length > 0 && (
        <>
          {/* Render the table */}
          <div className="initial-table-wrapper">
            <ProcessedTable 
              data={tableData} 
              onModifiedRowsChange={(rows) => setModifiedRows(rows)}
            />
          </div>

          <div className="flex justify-center mt-8 mb-4 space-x-4">
            {/* Render the resend changes button */}
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  console.log("Resend Changes button clicked");
                  console.log("Modified Rows:", modifiedRows);
                  handleResend();
                }}
                disabled={modifiedRows.length === 0 || isProcessingResend}
                className="w-full max-w-xl py-4"
              >
                {isProcessingResend ? "Resending..." : "Resend Changes"}
              </Button>
            </div>

            {/* Render the download button after processing */}
            <div className="flex justify-center mx-4">
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
            </div>

            {/* Copy Table button*/}
            <div className="flex justify-end">
              <Button
                onClick={() => copyTableFromWrapper(".updated-table-wrapper")}
                disabled={updatedTableData.length === 0}
                className="w-full py-4 max-w-xl"
              >
                <CopyIcon/>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Render the updated table only after processing is successful */}
      { updatedTableData.length > 0 && (
        <>
          {/* Render the table */}
          <div className="updated-table-wrapper">
            <ProcessedTable 
              data={updatedTableData} 
              onModifiedRowsChange={(rows) => setModifiedRows(rows)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FileProcessing;