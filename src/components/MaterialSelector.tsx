
import { usePackaging } from "@/context/PackagingContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PackagingComponent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Box, Copy, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface MaterialSelectorProps {
  component: PackagingComponent;
}

export const MaterialSelector = ({ component }: MaterialSelectorProps) => {
  const { 
    materials, 
    updateComponent, 
    getComponentImpact,
    duplicateComponent,
    userProfile
  } = usePackaging();
  
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
  
  const handleWasteFactorChange = (wasteFactor: string) => {
    const wasteValue = parseFloat(wasteFactor);
    if (!isNaN(wasteValue) && wasteValue >= 0) {
      updateComponent({
        ...component,
        wasteFactor: wasteValue
      });
    }
  };
  
  const selectedMaterial = materials.find(m => m.id === component.materialId);
  const co2Impact = getComponentImpact(component.id, 'co2');
  const energyImpact = getComponentImpact(component.id, 'energy');
  const waterImpact = getComponentImpact(component.id, 'water');
  const wasteImpact = getComponentImpact(component.id, 'waste');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Box className="w-5 h-5 text-bioelements-turquoise mr-2" />
          <h3 className="font-medium text-gray-800">{component.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-500 hover:text-bioelements-turquoise flex items-center gap-1"
            onClick={() => duplicateComponent(component.id)}
          >
            <Copy className="w-3 h-3" />
            <span className="text-xs">Duplicar</span>
          </Button>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">Impacto:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="bg-bioelements-soft-green text-bioelements-green font-medium"
                  >
                    {co2Impact} kg CO₂e
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Impacto de carbono total del componente en el ciclo de vida</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
                  <p className="max-w-xs">Seleccionar el material para este componente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Select 
            value={component.materialId} 
            onValueChange={handleMaterialChange}
          >
            <SelectTrigger id={`material-${component.id}`} className="w-full">
              <SelectValue placeholder="Seleccionar material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header-bio" disabled className="font-semibold text-bioelements-green">
                Materiales Bio-basados
              </SelectItem>
              {materials
                .filter(m => m.category === 'bio-based')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                  </SelectItem>
                ))
              }
              
              <SelectItem value="header-conv" disabled className="font-semibold text-gray-500">
                Plásticos Convencionales
              </SelectItem>
              {materials
                .filter(m => m.category === 'conventional-plastic')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                  </SelectItem>
                ))
              }
              
              <SelectItem value="header-paper" disabled className="font-semibold text-amber-700">
                Papel y Cartón
              </SelectItem>
              {materials
                .filter(m => m.category === 'paper-cardboard')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                  </SelectItem>
                ))
              }
              
              <SelectItem value="header-metal" disabled className="font-semibold text-slate-700">
                Metales
              </SelectItem>
              {materials
                .filter(m => m.category === 'metal')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                  </SelectItem>
                ))
              }
              
              <SelectItem value="header-glass" disabled className="font-semibold text-blue-600">
                Vidrio
              </SelectItem>
              {materials
                .filter(m => m.category === 'glass')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                  </SelectItem>
                ))
              }
              
              <SelectItem value="header-wood" disabled className="font-semibold text-amber-800">
                Madera
              </SelectItem>
              {materials
                .filter(m => m.category === 'wood')
                .map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor={`weight-${component.id}`} className="mr-2">Peso (g)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Peso en gramos</p>
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
          
          {userProfile?.role === 'advanced' && (
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`waste-${component.id}`} className="mr-2">Merma (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Factor de pérdida durante producción</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Input
                id={`waste-${component.id}`}
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={component.wasteFactor || 0}
                onChange={(e) => handleWasteFactorChange(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
      
      {selectedMaterial && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMaterial.recyclable && (
              <Badge variant="outline" className="text-xs bg-bioelements-soft-blue">
                Reciclable
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
            <Badge variant="outline" className="text-xs bg-gray-100">
              {selectedMaterial.origin === 'national' ? 'Origen Nacional' : 'Origen Internacional'}
            </Badge>
          </div>
          <p>{selectedMaterial.description}</p>
          
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <p>Huella de Carbono: {selectedMaterial.co2PerKg} kg CO₂e/kg</p>
            <p>Consumo Energético: {selectedMaterial.energyPerKg} MJ/kg</p>
            <p>Consumo de Agua: {selectedMaterial.waterPerKg} L/kg</p>
            <p>Generación de Residuos: {selectedMaterial.wastePerKg} kg/kg</p>
          </div>
          
          <div className="mt-2 grid grid-cols-1 gap-y-1">
            <div className="flex justify-between">
              <span>Impacto CO₂:</span>
              <span className="font-medium text-bioelements-green">{co2Impact} kg CO₂e</span>
            </div>
            
            {userProfile?.role === 'advanced' && (
              <>
                <div className="flex justify-between">
                  <span>Consumo de Energía:</span>
                  <span className="font-medium text-blue-700">{energyImpact} MJ</span>
                </div>
                <div className="flex justify-between">
                  <span>Consumo de Agua:</span>
                  <span className="font-medium text-blue-600">{waterImpact} L</span>
                </div>
                <div className="flex justify-between">
                  <span>Generación de Residuos:</span>
                  <span className="font-medium text-amber-700">{wasteImpact} kg</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
