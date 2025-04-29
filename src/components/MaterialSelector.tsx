
import { usePackaging } from "@/context/PackagingContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PackagingComponent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Box, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MaterialSelectorProps {
  component: PackagingComponent;
}

export const MaterialSelector = ({ component }: MaterialSelectorProps) => {
  const { materials, updateComponent, getComponentCO2 } = usePackaging();
  
  const handleMaterialChange = (materialId: string) => {
    updateComponent({
      ...component,
      materialId
    });
  };
  
  const handleWeightChange = (weight: string) => {
    const weightValue = parseFloat(weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      updateComponent({
        ...component,
        weight: weightValue
      });
    }
  };
  
  const selectedMaterial = materials.find(m => m.id === component.materialId);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Box className="w-5 h-5 text-bioelements-turquoise mr-2" />
          <h3 className="font-medium text-gray-800">{component.name}</h3>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Carbon Impact:</span>
          <Badge 
            variant="outline" 
            className="bg-bioelements-soft-green text-bioelements-green font-medium"
          >
            {getComponentCO2(component.id)} kg CO₂e
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor={`material-${component.id}`} className="mr-2">Material</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Select the material for this component</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Select 
            value={component.materialId} 
            onValueChange={handleMaterialChange}
          >
            <SelectTrigger id={`material-${component.id}`} className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header-bio" disabled className="font-semibold text-bioelements-green">
                Bio-based Materials
              </SelectItem>
              {materials
                .filter(m => m.category === 'bio-based')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))
              }
              
              <SelectItem value="header-conv" disabled className="font-semibold text-gray-500">
                Conventional Plastics
              </SelectItem>
              {materials
                .filter(m => m.category === 'conventional')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor={`weight-${component.id}`} className="mr-2">Weight (g)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Weight in grams</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Input
            id={`weight-${component.id}`}
            type="number"
            min="0.1"
            step="0.1"
            value={component.weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      {selectedMaterial && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMaterial.recyclable && (
              <Badge variant="outline" className="text-xs bg-bioelements-soft-blue">
                Recyclable
              </Badge>
            )}
            {selectedMaterial.biodegradable && (
              <Badge variant="outline" className="text-xs bg-bioelements-soft-green">
                Biodegradable
              </Badge>
            )}
            {selectedMaterial.compostable && (
              <Badge variant="outline" className="text-xs bg-bioelements-light-green bg-opacity-20">
                Compostable
              </Badge>
            )}
          </div>
          <p>{selectedMaterial.description}</p>
          <p className="mt-1 text-xs">Base Carbon Footprint: {selectedMaterial.co2PerKg} kg CO₂e/kg</p>
        </div>
      )}
    </div>
  );
};
