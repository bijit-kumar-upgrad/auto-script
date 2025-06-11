import React from 'react';

interface ProcessedTableProps {
  data: Array<{
    script_block: string;
    pps: {
      plate_type: string;
      description: string | Array<{ point: string; subpoints: string[] }>;
    };
  }>;
}

const ProcessedTable: React.FC<ProcessedTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse border-4 border-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-4 border-black text-left w-1/2">Script Block</th>
            <th className="px-6 py-3 border-4 border-black text-left w-1/2">PPS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-4 border-black">
              <td className="px-6 py-4 w-1/2 align-top border-4 border-black">{item.script_block}</td>
              <td className="px-6 py-4 w-1/2 align-top border-4 border-black">
                {Array.isArray(item.pps.description) ? (
                  item.pps.description.map((desc, idx) => (
                    <div key={idx} className="mb-4">
                      <h4 className="font-semibold">{desc.point}</h4>
                      <ul className="list-disc pl-6">
                        {desc.subpoints.map((subpoint, subIdx) => (
                          <li key={subIdx}>{subpoint}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div>{item.pps.description}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessedTable;
