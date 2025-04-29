import { usePackaging } from "@/context/PackagingContext";
import { LifecycleNode } from "./LifecycleNode";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Edit, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifecycleStage } from "@/types";

export const LifecycleTree = () => {
  const { product, updateLifecycleStage, addLifecycleStage, userProfile } = usePackaging();
  const [allExpanded, setAllExpanded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStage, setNewStage] = useState<Partial<LifecycleStage>>({
    id: `stage-${Date.now()}`,
    name: "",
    icon: "box",
    description: "",
    co2Factor: 0.5,
    energyFactor: 0.5,
    waterFactor: 0.5,
    wasteFactor: 0.5,
    fossilFuelFactor: 0.5,
    expanded: false,
    editable: true
  });
  
  const toggleAll = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    
    // Update all stages in the lifecycle
    const updateAllNodes = (stages: LifecycleStage[]) => {
      stages.forEach(stage => {
        updateLifecycleStage(stage.id, { expanded: newExpandedState });
        if (stage.children) {
          updateAllNodes(stage.children);
        }
      });
    };
    
    updateAllNodes(product.lifecycle);
  };
  
  const handleAddStage = () => {
    if (!newStage.name || !newStage.id) {
      return;
    }
    
    // Add the new stage at the root level
    addLifecycleStage(null, newStage as LifecycleStage);
    
    // Reset form and close dialog
    setNewStage({
      id: `stage-${Date.now()}`,
      name: "",
      icon: "box",
      description: "",
      co2Factor: 0.5,
      energyFactor: 0.5,
      waterFactor: 0.5,
      wasteFactor: 0.5,
      fossilFuelFactor: 0.5,
      expanded: false,
      editable: true
    });
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Ciclo de Vida del Envase</h2>
          <p className="text-sm text-gray-500">Análisis ISO 14040 "cuna-a-tumba"</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-gray-600 flex items-center gap-2"
            onClick={toggleAll}
          >
            {allExpanded ? (
              <>
                <ArrowUp className="w-4 h-4" />
                <span>Colapsar Todo</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4" />
                <span>Expandir Todo</span>
              </>
            )}
          </Button>
          
          {userProfile?.role === 'advanced' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default"
                  className="bg-bioelements-green hover:bg-bioelements-medium-green flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Etapa</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Etapa</DialogTitle>
                  <DialogDescription>
                    Defina una nueva etapa del ciclo de vida para su análisis.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage-id">ID de la Etapa</Label>
                    <Input 
                      id="stage-id"
                      value={newStage.id}
                      onChange={(e) => setNewStage({...newStage, id: e.target.value})}
                      placeholder="e.g. production"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage-name">Nombre de la Etapa</Label>
                    <Input 
                      id="stage-name"
                      value={newStage.name}
                      onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                      placeholder="e.g. Producción"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage-icon">Ícono</Label>
                    <Select 
                      value={newStage.icon} 
                      onValueChange={(value) => setNewStage({...newStage, icon: value})}
                    >
                      <SelectTrigger id="stage-icon">
                        <SelectValue placeholder="Seleccionar ícono" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leaf">Hoja/Planta</SelectItem>
                        <SelectItem value="factory">Fábrica</SelectItem>
                        <SelectItem value="truck">Transporte</SelectItem>
                        <SelectItem value="recycle">Reciclaje</SelectItem>
                        <SelectItem value="box">Caja/Envase</SelectItem>
                        <SelectItem value="trash-2">Basura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage-description">Descripción</Label>
                    <Input 
                      id="stage-description"
                      value={newStage.description}
                      onChange={(e) => setNewStage({...newStage, description: e.target.value})}
                      placeholder="Descripción de la etapa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stage-co2-factor">Factor de Impacto CO₂: {newStage.co2Factor?.toFixed(2)}</Label>
                    </div>
                    <Slider 
                      id="stage-co2-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[newStage.co2Factor || 0.5]}
                      onValueChange={(values) => setNewStage({...newStage, co2Factor: values[0]})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stage-energy-factor">Factor de Impacto Energía: {newStage.energyFactor?.toFixed(2)}</Label>
                    </div>
                    <Slider 
                      id="stage-energy-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[newStage.energyFactor || 0.5]}
                      onValueChange={(values) => setNewStage({...newStage, energyFactor: values[0]})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stage-water-factor">Factor de Impacto Agua: {newStage.waterFactor?.toFixed(2)}</Label>
                    </div>
                    <Slider 
                      id="stage-water-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[newStage.waterFactor || 0.5]}
                      onValueChange={(values) => setNewStage({...newStage, waterFactor: values[0]})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stage-waste-factor">Factor de Impacto Residuos: {newStage.wasteFactor?.toFixed(2)}</Label>
                    </div>
                    <Slider 
                      id="stage-waste-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[newStage.wasteFactor || 0.5]}
                      onValueChange={(values) => setNewStage({...newStage, wasteFactor: values[0]})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stage-fossil-factor">Factor Combustibles Fósiles: {newStage.fossilFuelFactor?.toFixed(2)}</Label>
                    </div>
                    <Slider 
                      id="stage-fossil-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[newStage.fossilFuelFactor || 0.5]}
                      onValueChange={(values) => setNewStage({...newStage, fossilFuelFactor: values[0]})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddStage}>Agregar Etapa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {product.lifecycle.map((stage, index) => (
          <LifecycleNode 
            key={stage.id} 
            stage={stage} 
            isLast={index === product.lifecycle.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
