import React, { useState } from 'react';

interface ProcessedItem {
  plate_no: number;
  transcript: string;
  plate_type?: string;
  description?: string;
  plate_details?: {
    template_number?: string;
    plate_content: {
      heading?: string;
      descriptiveText?: string | null;
      subheadings?: Array<{
        subheadingText?: string | null;
        descriptiveText?: string | null;
        points?: Array<{ 
          text: string | null;
          subpoints: string[] | null
        }>;
        icon?: string | null;
        image?: string | null;
      }>;
    };
  };
}

interface ProcessedTableProps {
  data: ProcessedItem[];
  onModifiedRowsChange?: (modifiedRows: ProcessedItem[]) => void;
}

const plateOptions = [
  "Graphics",
  "Faceshot",
  "1",
  "1A",
  "2",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "16B",
  "17",
  "17B",
  "18",
  "18B",
  "20",
  "20B",
  "21",
  "21B",
  "22",
  "22B",
  "23",
  "23B",
  "24",
  "24B",
  "25",
  "26",
  "26B",
  "27",
  "28",
  "28A",
  "28B",
  "29",
  "29A",
  "29B",
]

const ProcessedTable: React.FC<ProcessedTableProps> = ({ data, onModifiedRowsChange }) =>   {
  const [modifiedData, setModifiedData] = useState<Record<number, string>>({});

  const handlePlateTypeChange = (index: number, newTemplate: string) => {
    const newModified = {...modifiedData, [index]: newTemplate };
    setModifiedData(newModified);

    // if a callback is passed, send modified rows to the parent component
    if (onModifiedRowsChange) {
      const modifiedRows = Object.entries(newModified).map(([index, template]) => {
        const item = parseInt(index, 10);
        return {
          plate_no: data[item].plate_no,
          transcript: data[item].transcript,
          template_number: `${template}`,
        };
      });
      onModifiedRowsChange(modifiedRows);
    }
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse border-4 border-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-4 border-black text-left w-1/2">Script</th>
            <th className="px-6 py-3 border-4 border-black text-left w-1/2">Graphics</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const content = item.plate_details?.plate_content || {};
            const currentTemplate = modifiedData[index] || item.plate_details?.template_number;
            const isModified = modifiedData.hasOwnProperty(index);

            // Logic to map faceshot/graphics plate types to their respective options
            const templateOptions = item.plate_type === "faceshot" || item.plate_type === "graphics"
              ? [item.plate_type === "faceshot" ? "Faceshot" : "Graphics"]
              : plateOptions;

            return (
              <tr 
                key={index}
                className={`border-4 border-black ${isModified ? 'bg-red-100' : ''}`}
              >
                <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                  {item.transcript}
                </td>
                <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                  <div className="mb-2 flex items-center space-x-4">
                    <div className="mb-1">Plate {item.plate_no}</div>
                    <select
                      value={currentTemplate}
                      onChange={(e) => handlePlateTypeChange(index, e.target.value)}
                      className="border-2 border-gray-400 rounded p-2 w-1/2"
                    >
                      {templateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Render image description if it exists */}
                  {item.description && item.plate_type == "graphics" && (
                    <div className="mb-2">
                      Description: <span className="italic">{item.description}</span>
                    </div>
                  )}

                  {/* Render plate_details if it exists */}
                  {item.plate_details && (
                    <div>
                      {content.heading && (
                        <div className="mb-2">
                          Heading: <span className="font-semibold">{content.heading}</span>
                        </div>
                      )}
                      {content.descriptiveText && (
                        <div className="mb-2">
                          Description: <p className="font-semibold">{content.descriptiveText}</p>
                        </div>
                      )}
                      {content.subheadings &&
                        content.subheadings.map((subheading, subIdx) => (
                          <div key={subIdx} className="mb-4">
                            Sub-heading: <span className="font-semibold">{subheading.subheadingText}</span>
                            {subheading.descriptiveText && (
                              <div className="mb-2">
                                Description: <p className="font-semibold">{subheading.descriptiveText}</p>
                              </div>
                            )}
                            {subheading.image && (
                              <div className="mb-2">Image: <span className="italic">{subheading.image}</span></div>
                            )}
                            {subheading.icon && (
                              <div className="mb-2">Icon: <span className="italic">{subheading.icon}</span></div>
                            )}
                            {subheading.points && subheading.points.map((point, pointIdx) => (
                              <div key={pointIdx} className="mb-4">
                                <ul className="list-disc pl-6 font-semibold">
                                  <li>{point.text}</li>
                                  {point.subpoints && point.subpoints.length > 0 && (
                                    <ul className="list-disc pl-6 font-semibold">
                                      {point.subpoints.map((subpoint, subpointIdx) => (
                                        <li key={subpointIdx}>{subpoint}</li>
                                      ))}
                                    </ul>
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessedTable;