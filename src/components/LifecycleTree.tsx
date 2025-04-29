
import { usePackaging } from "@/context/PackagingContext";
import { LifecycleNode } from "./LifecycleNode";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export const LifecycleTree = () => {
  const { product, updateLifecycleStage } = usePackaging();
  const [allExpanded, setAllExpanded] = useState(false);
  
  const toggleAll = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    
    // Update all stages in the lifecycle
    const updateAllNodes = (stages) => {
      stages.forEach(stage => {
        updateLifecycleStage(stage.id, { expanded: newExpandedState });
        if (stage.children) {
          updateAllNodes(stage.children);
        }
      });
    };
    
    updateAllNodes(product.lifecycle);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Packaging Lifecycle</h2>
        
        <Button
          variant="outline"
          className="text-gray-600 flex items-center gap-2"
          onClick={toggleAll}
        >
          {allExpanded ? (
            <>
              <ArrowUp className="w-4 h-4" />
              <span>Collapse All</span>
            </>
          ) : (
            <>
              <ArrowDown className="w-4 h-4" />
              <span>Expand All</span>
            </>
          )}
        </Button>
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
