
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProcessedFileProps {
  title: string;
  onDownload: () => void;
}

const ProcessedFile: React.FC<ProcessedFileProps> = ({ title, onDownload }) => {
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
        
        <Button onClick={onDownload} className="flex items-center gap-2">
          <Download size={16} /> Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessedFile;
