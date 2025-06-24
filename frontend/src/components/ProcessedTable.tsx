import { on } from 'events';
import React, { useState } from 'react';

interface ProcessedItem {
  script_block: string;
  pps: {
    plate_type: string;
    content: {
      heading?: string;
      subheading?: string;
      body: string | Array<{ point: string; subpoints: string[] }>;
      subheading2?: string;
      body2?: Array<{ point: string; subpoints: string[] }>;
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
  "Template 1",
  "Template 2",
  "Template 3",
  "Template 4",
  "Template 5",
  "Template 6",
  "Template 7",
  "Template 8",
  "Template 9",
  "Template 10",
  "Template 11",
  "Template 12",
  "Template 13",
  "Template 14",
  "Template 16",
  "Template 17",
  "Template 20",
  "Template 21",
  "Template 23",
  "Template 24",
  "Template 26",
  "Template 27",
  "Template 29"
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
        const platePrefix = data[item].pps.plate_type.split(',')[0].trim();
        return {
          script_block: data[item].script_block,
          pps: {
            plate_type: `${platePrefix}, ${template}`,
            content: {}
          },
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
            const [plateNumber, originalTemplate] = item.pps.plate_type.split(',').map(s => s.trim());
            const currentTemplate = modifiedData[index] || originalTemplate;
            const isModified = modifiedData.hasOwnProperty(index);

            return (
              <tr 
                key={index}
                className={`border-4 border-black ${isModified ? 'bg-red-100' : ''}`}
              >
                <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                  {item.script_block}
                </td>
                <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                  <div className="mb-2">
                    <div className="mb-1">{plateNumber}</div>
                    <select
                      value={currentTemplate}
                      onChange={(e) => handlePlateTypeChange(index, e.target.value)}
                      className="border-2 border-gray-300 rounded p-2 w-1/2"
                    >
                      {plateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {item.pps.content.heading && (
                  <div className="mb-2">
                    Heading: <span className="font-semibold">{item.pps.content.heading}</span>
                  </div>
                  )}

                  {item.pps.content.subheading && (
                    <div className="mb-1">
                      Sub-Heading: <span className="font-semibold">{item.pps.content.subheading}</span>
                    </div>
                  )}

                  {/* First body (either string or array) */}
                  {currentTemplate.includes("Faceshot") ? null : (
                    <div className="mb-1">Description:</div>
                  )}

                  {Array.isArray(item.pps.content.body) ? (
                    item.pps.content.body.map((desc, idx) => (
                      <div key={idx} className="mb-4">
                        <h4 className="font-semibold">{desc.point}</h4>
                        {Array.isArray(desc.subpoints) && desc.subpoints.length > 0 ? (
                          <ul className="list-disc pl-6 font-semibold">
                            {desc.subpoints.map((subpoint, subIdx) => (
                              <li key={subIdx}>{subpoint}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    item.pps.content.body && (
                      <div className="mb-4 font-semibold">{item.pps.content.body}</div>
                    )
                  )}

                  {/* Optional second subheading and body (e.g., in Template 8) */}
                  {item.pps.content.subheading2 && (
                    <div className="italic mb-1">{item.pps.content.subheading2}</div>
                  )}

                  {Array.isArray(item.pps.content.body2) &&
                    item.pps.content.body2.map((desc, idx) => (
                      <div key={`body2-${idx}`} className="mb-4">
                        <h4 className="font-semibold">{desc.point}</h4>
                        <ul className="list-disc pl-6">
                          {desc.subpoints.map((subpoint, subIdx) => (
                            <li key={subIdx}>{subpoint}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
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