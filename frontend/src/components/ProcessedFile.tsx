import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProcessedFileProps {
  title: string; // The name of the file
  content: string; // The content of the file for download
}

const ProcessedFile: React.FC<ProcessedFileProps> = ({ title, content }) => {
  const handleDownload = () => {
    // Create a Blob from the file content
    const blob = new Blob([content], { type: 'text/plain' });
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
