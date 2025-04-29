
import { Button } from "@/components/ui/button";
import { usePackaging } from "@/context/PackagingContext";
import { MaterialSelector } from "./MaterialSelector";
import { Plus, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PackagingComponent } from "@/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ComponentManager = () => {
  const { 
    product, 
    materials, 
    addComponent, 
    removeComponent,
    productTemplates,
    loadProductTemplate
  } = usePackaging();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState<PackagingComponent>({
    id: '',
    name: '',
    materialId: '',
    weight: 10,
  });
  
  const handleAddComponent = () => {
    if (!newComponent.id || !newComponent.name || !newComponent.materialId) {
      toast({
        title: "Error de Validación",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }
    
    // Generate an ID if not provided
    if (!newComponent.id) {
      const id = `component-${Date.now()}`;
      newComponent.id = id;
    }
    
    addComponent(newComponent);
    setDialogOpen(false);
    
    // Reset form
    setNewComponent({
      id: '',
      name: '',
      materialId: '',
      weight: 10,
    });
  };
  
  const handleDelete = (id: string) => {
    if (product.components.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "El producto debe tener al menos un componente",
        variant: "destructive"
      });
      return;
    }
    
    removeComponent(id);
  };
  
  const handleLoadTemplate = (templateId: string) => {
    loadProductTemplate(templateId);
    setTemplateDialogOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Componentes del Envase</h2>
          <p className="text-sm text-gray-500">Gestione los materiales y pesos de cada componente</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Cargar Plantilla
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seleccionar Plantilla</DialogTitle>
                <DialogDescription>
                  Elija una plantilla predefinida para cargar como base.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {productTemplates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:border-bioelements-turquoise transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-xs text-gray-500">{template.description}</p>
                      <p className="text-xs mt-1 text-gray-700">Componentes: {template.components.length}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleLoadTemplate(template.id)}
                      >
                        Seleccionar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancelar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bioelements-green hover:bg-bioelements-medium-green">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Componente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Componente</DialogTitle>
                <DialogDescription>
                  Defina un nuevo componente de envase y su material.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="component-id">ID del Componente</Label>
                  <Input 
                    id="component-id"
                    value={newComponent.id}
                    onChange={(e) => setNewComponent({...newComponent, id: e.target.value})}
                    placeholder="ej. tapa-botella"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="component-name">Nombre del Componente</Label>
                  <Input 
                    id="component-name"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                    placeholder="ej. Tapa de Botella"
                  />
                </div>
                
                <Tabs defaultValue="bio-based" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="bio-based">Bioplásticos</TabsTrigger>
                    <TabsTrigger value="conventional">Convencionales</TabsTrigger>
                    <TabsTrigger value="other">Otros</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bio-based">
                    <div className="space-y-2">
                      <Label htmlFor="component-material-bio">Material</Label>
                      <Select 
                        value={newComponent.materialId} 
                        onValueChange={(value) => setNewComponent({...newComponent, materialId: value})}
                      >
                        <SelectTrigger id="component-material-bio">
                          <SelectValue placeholder="Seleccione un material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials
                            .filter(m => m.category === 'bio-based')
                            .map(material => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="conventional">
                    <div className="space-y-2">
                      <Label htmlFor="component-material-conv">Material</Label>
                      <Select 
                        value={newComponent.materialId} 
                        onValueChange={(value) => setNewComponent({...newComponent, materialId: value})}
                      >
                        <SelectTrigger id="component-material-conv">
                          <SelectValue placeholder="Seleccione un material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials
                            .filter(m => m.category === 'conventional-plastic')
                            .map(material => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.name} {material.origin === 'national' ? '(Nacional)' : ''}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="other">
                    <div className="space-y-2">
                      <Label htmlFor="component-material-other">Material</Label>
                      <Select 
                        value={newComponent.materialId} 
                        onValueChange={(value) => setNewComponent({...newComponent, materialId: value})}
                      >
                        <SelectTrigger id="component-material-other">
                          <SelectValue placeholder="Seleccione un material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="header-paper" disabled className="font-semibold">
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
                          
                          <SelectItem value="header-metal" disabled className="font-semibold">
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
                          
                          <SelectItem value="header-glass" disabled className="font-semibold">
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
                          
                          <SelectItem value="header-wood" disabled className="font-semibold">
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
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-2">
                  <Label htmlFor="component-weight">Peso (gramos)</Label>
                  <Input 
                    id="component-weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newComponent.weight}
                    onChange={(e) => setNewComponent({...newComponent, weight: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddComponent}>Agregar Componente</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="space-y-4">
        {product.components.map(component => (
          <div key={component.id} className="relative">
            <MaterialSelector component={component} />
            {product.components.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                onClick={() => handleDelete(component.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
