import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

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

interface ProcessedFileProps {
  title: string; // The name of the file
  data: ProcessedItem[]; // The content of the file for download
  onDownload?: () => void; // Optional callback for additional actions on download
}

const ProcessedFile: React.FC<ProcessedFileProps> = ({ title, data }) => {
  const FONT = "Lexend";
  const FONT_SIZE = 22; // Docx uses half-points, so 22 points = 11px

  const styledText = (
    text: string,
    value?: string,
    boldValue = false,
    bullet = false
  ) => 
    new Paragraph({
      children: value
      ? [
          new TextRun({ text: text, font: FONT, size: FONT_SIZE }), // label
          new TextRun({ text: value, font: FONT, size: FONT_SIZE, bold: boldValue }), // value
        ]
      : [
          new TextRun({ text: text, font: FONT, size: FONT_SIZE, bold: boldValue }),
        ],
      bullet: bullet ? { level: 0 } : undefined, // Add bullet if needed
      alignment: AlignmentType.LEFT, // Align text to the left
    });

  const handleDownload = async () => {
    const tableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            children: [styledText("Script", undefined, true)],
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [styledText("PPS", undefined, true)],
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        ],
      }),

      ...data.map((item) => {
        const content = item.plate_details?.plate_content;

        const ppsBlocks: Paragraph[] = [];

        let plate_type = "";
        if (item.plate_type === "graphics") {
          plate_type = "Graphics";
        } else if (item.plate_type === "faceshot") {
          plate_type = "Faceshot";
        } else {
          plate_type = item.plate_details?.template_number;
        }

        if (plate_type === "Graphics" || plate_type === "Faceshot") {
          ppsBlocks.push(styledText(`Plate ${item.plate_no}, ${plate_type}`));
        } else {
          ppsBlocks.push(styledText(`Plate ${item.plate_no}, Template ${plate_type}`));
        }

        // Add a newline after the plate type info
        ppsBlocks.push(new Paragraph({
          children: [new TextRun("\n")],
        }));

        if (item.plate_details){
          if (content.heading)
            ppsBlocks.push(styledText("Heading: ", content.heading, true));

          if (content.descriptiveText &&
            ["11", "12", "13", "14", "15", "24", "25", "26", "28", "29"].includes(item.plate_details.template_number))
            ppsBlocks.push(styledText("Description: ", content.descriptiveText, true));

          if (content.subheadings) {
            content.subheadings.forEach((subheading) => {
              // Add a newline before each subheading
              ppsBlocks.push(new Paragraph({
                children: [new TextRun("\n")],
              }));
              if (subheading.subheadingText){
                ppsBlocks.push(styledText("Sub-Heading: ", subheading.subheadingText, true));
                if (subheading.descriptiveText &&
                   ["4","8","9","17","20","22","27"].includes(item.plate_details.template_number))
                  ppsBlocks.push(styledText("Description: ", subheading.descriptiveText))
              }
              subheading.points?.forEach((point) => {
                ppsBlocks.push(styledText(point.text || "", undefined, true, true));
                point.subpoints?.forEach((subpoint) => {
                  ppsBlocks.push(styledText(subpoint, undefined, true, true));
                });
              });
            });
          }
        }
        return new TableRow({
          children: [
            new TableCell({
              children: [styledText(item.transcript)],
            }),
            new TableCell({
              children: ppsBlocks,
            }),
          ],
        });
      }),
    ];

    const doc = new Document({
      sections: [
        {
          children: [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    // Create a Blob from the file content
    const blob = await Packer.toBlob(doc);
    const downloadUrl = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = title; // Set the filename for the download
    link.click();
  };

  return (
    <Card className="max-w-md mx-auto mt-8 mb-8 bg-gray-50">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-14 w-14 flex-shrink-0">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="10" width="40" height="44" fill="white" stroke="#000" strokeWidth="2"/>
              <rect x="20" y="38" width="24" height="12" fill="#EEE" stroke="#000" strokeWidth="1"/>
              <text x="32" y="46" dominantBaseline="middle" textAnchor="middle" fontSize="8">DOC</text>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-medium">{title}</h3>
          </div>
        </div>
        
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download size={16} /> Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessedFile;