
import { usePackaging } from "@/context/PackagingContext";
import { LifecycleStage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Box,
  ChartPie,
  Edit,
  Factory,
  Leaf,
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

interface LifecycleNodeProps {
  stage: LifecycleStage;
  level?: number;
  isLast?: boolean;
}

export const LifecycleNode = ({ stage, level = 0, isLast = false }: LifecycleNodeProps) => {
  const { toggleExpandStage, updateLifecycleStage, getStageCO2 } = usePackaging();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedStage, setEditedStage] = useState({ ...stage });
  
  const handleToggle = () => {
    toggleExpandStage(stage.id);
  };
  
  const handleSave = () => {
    updateLifecycleStage(stage.id, editedStage);
    setIsDialogOpen(false);
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
      default: return <ChartPie className="w-5 h-5 text-bioelements-turquoise" />;
    }
  };
  
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
            left: `${level * 24 + 12}px`
          }}
        />
      )}
      
      {/* Horizontal connector line */}
      {level > 0 && (
        <div 
          className="tree-connector-horizontal"
          style={{
            top: '24px',
            left: `${(level - 1) * 24 + 12}px`,
            width: '24px'
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
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2",
                level === 0 ? "bg-bioelements-soft-green text-bioelements-green" : "bg-gray-100"
              )}
            >
              {getStageCO2(stage.id)} kg CO₂e
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
        </div>
        
        <div className="flex items-center ml-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <DialogTitle>Edit Lifecycle Stage</DialogTitle>
                <DialogDescription>
                  Update the details of this lifecycle stage.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="stage-name">Stage Name</Label>
                  <Input 
                    id="stage-name"
                    value={editedStage.name}
                    onChange={(e) => setEditedStage({...editedStage, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stage-description">Description</Label>
                  <Input 
                    id="stage-description"
                    value={editedStage.description}
                    onChange={(e) => setEditedStage({...editedStage, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stage-co2-factor">CO₂ Impact Factor: {editedStage.co2Factor.toFixed(2)}</Label>
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
