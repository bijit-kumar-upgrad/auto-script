import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export interface ProcessingOptionsType {
  suggestFaceShots: number; // Slider value for face shots
  suggestGraphics: number; // Slider value for graphics
  applyTemplates: number; // Slider value for templates
}

interface ProcessingOptionsProps {
  options: ProcessingOptionsType;
  onOptionsChange: (options: ProcessingOptionsType) => void;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  options,
  onOptionsChange,
}) => {
  const total = options.suggestFaceShots + options.suggestGraphics + options.applyTemplates;
  const error = total !== 100 ? 'The total value must equal 100' : '';

  const handleSliderChange = (name: keyof ProcessingOptionsType, value: number) => {
    onOptionsChange({
      ...options,
      [name]: value,
    });
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Processing Options</h2>
        <p className="text-sm text-gray-500 mb-4">
          Configure how the transcript is processed and formatted.
        </p>
        
        <div className="space-y-4">
          {/* FaceShots Slider */}
          <div className="flex items-center justify-between">
            <Label htmlFor="suggestFaceShots" className="w-1/4 text-left">Faceshots</Label>
            <div className="w-5/6">
              <Slider
                id="suggestFaceShots"
                min={0}
                max={100}
                step={5}
                value={[options.suggestFaceShots]}
                onValueChange={(value) => handleSliderChange('suggestFaceShots', value[0])}
                
              />
            </div>
            <div className="w-1/6 text-center">{[options.suggestFaceShots]}%</div>
          </div>
          
          {/* Graphics Slider */}
          <div className="flex items-center justify-between">
            <Label htmlFor="suggestGraphics" className="w-1/4 text-left">Graphics</Label>
            <div className="w-5/6">
              <Slider
                id="suggestGraphics"
                min={0}
                max={100}
                step={5}
                value={[options.suggestGraphics]}
                onValueChange={(value) => handleSliderChange('suggestGraphics', value[0])}
              />
            </div>
            <div className="w-1/6 text-center">{options.suggestGraphics}%</div>
          </div>

          {/* Templates Slider */}
          <div className="flex items-center justify-between">
            <Label htmlFor="applyTemplates" className="w-1/4 text-left">Templates</Label>
            <div className="w-5/6">
              <Slider
                id="applyTemplates"
                min={0}
                max={100}
                step={5}
                value={[options.applyTemplates]}
                onValueChange={(value) => handleSliderChange('applyTemplates', value[0])}
              />
            </div>
            <div className="w-1/6 text-center">{options.applyTemplates}%</div>
          </div>
          
          {/* Error Message */}
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingOptions;