import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OutputSettingsProps {
  docTitle: string;
  onDocTitleChange: (title: string) => void;
}

const OutputSettings: React.FC<OutputSettingsProps> = ({
  docTitle,
  onDocTitleChange,
}) => {
  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Output File</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configure the generated document.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="docTitle">Document Title</Label>
            <Input
              id="docTitle"
              placeholder="e.g., 'PPS: Module Name'"
              value={docTitle}
              onChange={(e) => onDocTitleChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputSettings;
