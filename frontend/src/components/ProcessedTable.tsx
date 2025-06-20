import React from 'react';

interface ProcessedTableProps {
  data: Array<{
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
  }>;
}

const ProcessedTable: React.FC<ProcessedTableProps> = ({ data }) => {
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
          {data.map((item, index) => (
            <tr key={index} className="border-4 border-black">
              <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                {item.script_block}
              </td>
              <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                <div>
                  <div className="mb-2">{item.pps.plate_type}</div>

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
                    {item.pps.plate_type.includes("Faceshot") ? null : (
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessedTable;