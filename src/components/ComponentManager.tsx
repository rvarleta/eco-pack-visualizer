
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

export const ComponentManager = () => {
  const { product, materials, addComponent, removeComponent } = usePackaging();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState<PackagingComponent>({
    id: '',
    name: '',
    materialId: '',
    weight: 10,
  });
  
  const handleAddComponent = () => {
    if (!newComponent.id || !newComponent.name || !newComponent.materialId) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
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
        title: "Cannot Remove",
        description: "Product must have at least one component",
        variant: "destructive"
      });
      return;
    }
    
    removeComponent(id);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Packaging Components</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-bioelements-green hover:bg-bioelements-medium-green">
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Component</DialogTitle>
              <DialogDescription>
                Define a new packaging component and its material.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="component-id">Component ID</Label>
                <Input 
                  id="component-id"
                  value={newComponent.id}
                  onChange={(e) => setNewComponent({...newComponent, id: e.target.value})}
                  placeholder="e.g. bottle-cap"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="component-name">Component Name</Label>
                <Input 
                  id="component-name"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                  placeholder="e.g. Bottle Cap"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="component-material">Material</Label>
                <Select 
                  value={newComponent.materialId} 
                  onValueChange={(value) => setNewComponent({...newComponent, materialId: value})}
                >
                  <SelectTrigger id="component-material">
                    <SelectValue placeholder="Select a material" />
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
                <Label htmlFor="component-weight">Weight (grams)</Label>
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
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddComponent}>Add Component</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {product.components.map(component => (
          <div key={component.id} className="relative">
            <MaterialSelector component={component} />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              onClick={() => handleDelete(component.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
