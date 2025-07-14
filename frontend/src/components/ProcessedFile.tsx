import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
    italicsValue = false,
    bullet = false,
    bulletLevel? : number
  ) => 
    new Paragraph({
      children: value
      ? [
          new TextRun({ text: text, font: FONT, size: FONT_SIZE, italics: italicsValue }), // label
          new TextRun({ text: value, font: FONT, size: FONT_SIZE, bold: boldValue, italics: italicsValue }), // value
        ]
      : [
          new TextRun({ text: text, font: FONT, size: FONT_SIZE, bold: boldValue, italics: italicsValue }),
        ],
      bullet: bullet ? { level: bulletLevel ?? 0 } : undefined, // Add bullet if needed
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
            ["11", "12", "13", "14", "15", "24", "24B", "25", "26", "26B", "28", "28A", "28B", "29", "29A", "29B"].includes(item.plate_details.template_number))
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
                   ["4","8","9","17", "17B","20","20B","22","22B","27"].includes(item.plate_details.template_number))
                  ppsBlocks.push(styledText("Description: ", subheading.descriptiveText, true))
              }
              if (subheading.icon){
                ppsBlocks.push(styledText("Icon: ", subheading.icon, false, true));
              }
              if (subheading.image){
                ppsBlocks.push(styledText("Image: ", subheading.image, false, true));
              }
              subheading.points?.forEach((point) => {
                ppsBlocks.push(styledText(point.text || "", undefined, true, false, true));
                point.subpoints?.forEach((subpoint) => {
                  ppsBlocks.push(styledText(subpoint, undefined, true, false, true, 1));
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
    <div className='flex justify-center'>
      <Button 
        onClick={handleDownload}
        disabled={data.length === 0} // Disable the button until data is present
        className="w-full py-4 max-w-xl"
      >
        <Download size={16} /> Download
      </Button>
    </div>
  );
};

export default ProcessedFile;