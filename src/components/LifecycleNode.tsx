
import { usePackaging } from "@/context/PackagingContext";
import { LifecycleStage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown,
  ArrowUp,
  Box,
  ChartPie,
  Edit,
  Factory,
  Leaf,
  Plus,
  Recycle,
  Trash2,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LifecycleNodeProps {
  stage: LifecycleStage;
  level?: number;
  isLast?: boolean;
}

export const LifecycleNode = ({ stage, level = 0, isLast = false }: LifecycleNodeProps) => {
  const { 
    toggleExpandStage, 
    updateLifecycleStage, 
    removeLifecycleStage, 
    addLifecycleStage, 
    getStageImpact,
    userProfile 
  } = usePackaging();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editedStage, setEditedStage] = useState({ ...stage });
  const [newStage, setNewStage] = useState<Partial<LifecycleStage>>({
    id: `${stage.id}-child-${Date.now()}`,
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
  
  const handleToggle = () => {
    toggleExpandStage(stage.id);
  };
  
  const handleSave = () => {
    updateLifecycleStage(stage.id, editedStage);
    setIsEditDialogOpen(false);
  };
  
  const handleAddSubStage = () => {
    if (!newStage.name || !newStage.id) {
      return;
    }
    
    // Add the new stage as a child of the current stage
    addLifecycleStage(stage.id, newStage as LifecycleStage);
    
    // Reset form and close dialog
    setNewStage({
      id: `${stage.id}-child-${Date.now()}`,
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
  
  const hasChildren = stage.children && stage.children.length > 0;
  const isExpanded = stage.expanded;
  
  const getIcon = () => {
    switch (stage.icon) {
      case 'leaf': return <Leaf className="w-5 h-5 text-bioelements-green" />;
      case 'factory': return <Factory className="w-5 h-5 text-bioelements-turquoise" />;
      case 'truck': return <Truck className="w-5 h-5 text-bioelements-medium-green" />;
      case 'recycle': return <Recycle className="w-5 h-5 text-bioelements-light-green" />;
      case 'box': return <Box className="w-5 h-5 text-bioelements-turquoise" />;
      case 'trash-2': return <Trash2 className="w-5 h-5 text-bioelements-medium-green" />;
      default: return <ChartPie className="w-5 h-5 text-bioelements-turquoise" />;
    }
  };

  const co2Impact = getStageImpact(stage.id, 'co2');
  const energyImpact = getStageImpact(stage.id, 'energy');
  const waterImpact = getStageImpact(stage.id, 'water');
  
  return (
    <div 
      className={cn(
        "relative pb-6",
        !isLast && "mb-2"
      )}
    >
      {/* Vertical connector line */}
      {!isLast && level > 0 && (
        <div 
          className="tree-connector"
          style={{
            top: '50px',
            bottom: '0px',
            left: `${level * 24 + 12}px`,
            borderLeft: '1px dashed #ccc'
          }}
        />
      )}
      
      {/* Horizontal connector line */}
      {level > 0 && (
        <div 
          className="tree-connector-horizontal"
          style={{
            position: 'absolute',
            top: '24px',
            left: `${(level - 1) * 24 + 12}px`,
            width: '24px',
            height: '1px',
            borderTop: '1px dashed #ccc'
          }}
        />
      )}
      
      <div 
        className={cn(
          "flex items-center bg-white rounded-md p-4 border node-hover-effect",
          level === 0 ? "border-bioelements-turquoise shadow-md ml-0" : "ml-6 border-gray-200"
        )}
        style={{
          marginLeft: `${level * 24}px`
        }}
      >
        <div className="mr-3">{getIcon()}</div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{stage.name}</h3>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "bg-bioelements-soft-green text-bioelements-green"
                      )}
                    >
                      {co2Impact} kg CO₂e
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Emisiones de CO₂ equivalentes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {userProfile?.role === 'advanced' && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant="outline" 
                          className="bg-bioelements-soft-blue text-blue-700"
                        >
                          {energyImpact} MJ
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Consumo de energía</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant="outline" 
                          className="bg-blue-100 text-blue-600"
                        >
                          {waterImpact} L
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Consumo de agua</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
        </div>
        
        <div className="flex items-center ml-4">
          {stage.editable && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-500 hover:text-bioelements-turquoise"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Etapa del Ciclo de Vida</DialogTitle>
                  <DialogDescription>
                    Actualice los detalles de esta etapa del ciclo de vida.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage-name">Nombre de la Etapa</Label>
                    <Input 
                      id="stage-name"
                      value={editedStage.name}
                      onChange={(e) => setEditedStage({...editedStage, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage-icon">Ícono</Label>
                    <Select 
                      value={editedStage.icon} 
                      onValueChange={(value) => setEditedStage({...editedStage, icon: value})}
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
                      value={editedStage.description}
                      onChange={(e) => setEditedStage({...editedStage, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stage-co2-factor">Factor de Impacto CO₂: {editedStage.co2Factor.toFixed(2)}</Label>
                      <span className="text-xs text-gray-500">
                        {(editedStage.co2Factor * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    <Slider 
                      id="stage-co2-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[editedStage.co2Factor]}
                      onValueChange={(values) => setEditedStage({...editedStage, co2Factor: values[0]})}
                      className="w-full"
                    />
                  </div>
                  
                  {userProfile?.role === 'advanced' && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stage-energy-factor">Factor de Energía: {editedStage.energyFactor?.toFixed(2) || "0.00"}</Label>
                        </div>
                        
                        <Slider 
                          id="stage-energy-factor"
                          min={0.1}
                          max={2}
                          step={0.1}
                          value={[editedStage.energyFactor || 0.5]}
                          onValueChange={(values) => setEditedStage({...editedStage, energyFactor: values[0]})}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stage-water-factor">Factor de Agua: {editedStage.waterFactor?.toFixed(2) || "0.00"}</Label>
                        </div>
                        
                        <Slider 
                          id="stage-water-factor"
                          min={0.1}
                          max={2}
                          step={0.1}
                          value={[editedStage.waterFactor || 0.5]}
                          onValueChange={(values) => setEditedStage({...editedStage, waterFactor: values[0]})}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stage-waste-factor">Factor de Residuos: {editedStage.wasteFactor?.toFixed(2) || "0.00"}</Label>
                        </div>
                        
                        <Slider 
                          id="stage-waste-factor"
                          min={0.1}
                          max={2}
                          step={0.1}
                          value={[editedStage.wasteFactor || 0.5]}
                          onValueChange={(values) => setEditedStage({...editedStage, wasteFactor: values[0]})}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stage-fossil-factor">Factor Combustibles Fósiles: {editedStage.fossilFuelFactor?.toFixed(2) || "0.00"}</Label>
                        </div>
                        
                        <Slider 
                          id="stage-fossil-factor"
                          min={0.1}
                          max={2}
                          step={0.1}
                          value={[editedStage.fossilFuelFactor || 0.5]}
                          onValueChange={(values) => setEditedStage({...editedStage, fossilFuelFactor: values[0]})}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {userProfile?.role === 'advanced' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-500 hover:text-bioelements-green"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Subetapa</DialogTitle>
                  <DialogDescription>
                    Defina una nueva subetapa para {stage.name}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="substage-id">ID de la Subetapa</Label>
                    <Input 
                      id="substage-id"
                      value={newStage.id}
                      onChange={(e) => setNewStage({...newStage, id: e.target.value})}
                      placeholder="e.g. processing"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="substage-name">Nombre de la Subetapa</Label>
                    <Input 
                      id="substage-name"
                      value={newStage.name}
                      onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                      placeholder="e.g. Procesamiento"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="substage-icon">Ícono</Label>
                    <Select 
                      value={newStage.icon} 
                      onValueChange={(value) => setNewStage({...newStage, icon: value})}
                    >
                      <SelectTrigger id="substage-icon">
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
                    <Label htmlFor="substage-description">Descripción</Label>
                    <Input 
                      id="substage-description"
                      value={newStage.description}
                      onChange={(e) => setNewStage({...newStage, description: e.target.value})}
                      placeholder="Descripción de la subetapa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="substage-co2-factor">Factor de Impacto CO₂: {newStage.co2Factor?.toFixed(2)}</Label>
                    </div>
                    <Slider 
                      id="substage-co2-factor"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[newStage.co2Factor || 0.5]}
                      onValueChange={(values) => setNewStage({...newStage, co2Factor: values[0]})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddSubStage}>Agregar Subetapa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {stage.editable && userProfile?.role === 'advanced' && level > 0 && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-500 hover:text-red-500"
              onClick={() => removeLifecycleStage(stage.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          
          {hasChildren && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggle}
              className="text-gray-500 hover:text-bioelements-green"
            >
              {isExpanded ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
      
      {/* Render children */}
      {hasChildren && isExpanded && (
        <div className="ml-6">
          {stage.children?.map((childStage, index) => (
            <LifecycleNode 
              key={childStage.id}
              stage={childStage}
              level={level + 1}
              isLast={index === (stage.children?.length || 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
