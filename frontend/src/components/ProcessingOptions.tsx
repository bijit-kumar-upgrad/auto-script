
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface ProcessingOptionsType {
  suggestFaceShots: boolean;
  suggestGraphics: boolean;
  applyTemplates: boolean;
}

interface ProcessingOptionsProps {
  options: ProcessingOptionsType;
  onOptionsChange: (options: ProcessingOptionsType) => void;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  options,
  onOptionsChange,
}) => {
  const handleCheckboxChange = (option: keyof ProcessingOptionsType) => {
    const newOptions = {
      ...options,
      [option]: !options[option],
    };
    onOptionsChange(newOptions);
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Processing Options</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configure how the transcript is processed and formatted.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="suggestFaceShots" 
              checked={options.suggestFaceShots}
              onCheckedChange={() => handleCheckboxChange('suggestFaceShots')}
            />
            <Label htmlFor="suggestFaceShots">Suggest Face Shots</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="suggestGraphics" 
              checked={options.suggestGraphics}
              onCheckedChange={() => handleCheckboxChange('suggestGraphics')}
            />
            <Label htmlFor="suggestGraphics">Suggest Relevant Graphics</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="applyTemplates" 
              checked={options.applyTemplates}
              onCheckedChange={() => handleCheckboxChange('applyTemplates')}
            />
            <Label htmlFor="applyTemplates">Apply Presentation Templates</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingOptions;
