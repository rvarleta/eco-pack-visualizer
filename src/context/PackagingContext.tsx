
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LifecycleStage, Material, PackagingComponent, PackagingProduct } from '@/types';
import { calculateTotalCO2, defaultProduct, materials } from '@/data/defaultData';
import { toast } from '@/components/ui/use-toast';

interface PackagingContextProps {
  product: PackagingProduct;
  materials: Material[];
  updateComponent: (component: PackagingComponent) => void;
  addComponent: (component: PackagingComponent) => void;
  removeComponent: (componentId: string) => void;
  updateLifecycleStage: (stageId: string, updates: Partial<LifecycleStage>) => void;
  toggleExpandStage: (stageId: string) => void;
  resetProduct: () => void;
  getComponentCO2: (componentId: string) => number;
  getStageCO2: (stageId: string) => number;
}

const PackagingContext = createContext<PackagingContextProps | undefined>(undefined);

export const PackagingProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<PackagingProduct>({ ...defaultProduct });

  useEffect(() => {
    // Recalculate total CO2 whenever product changes
    const newTotal = calculateTotalCO2(product.components, product.lifecycle);
    if (newTotal !== product.totalCO2) {
      setProduct(prev => ({ ...prev, totalCO2: newTotal }));
    }
  }, [product.components, product.lifecycle]);

  const updateComponent = (updatedComponent: PackagingComponent) => {
    setProduct(prev => ({
      ...prev,
      components: prev.components.map(c => 
        c.id === updatedComponent.id ? updatedComponent : c
      )
    }));
    
    toast({
      title: "Component Updated",
      description: `${updatedComponent.name} has been updated.`,
    });
  };

  const addComponent = (newComponent: PackagingComponent) => {
    if (product.components.some(c => c.id === newComponent.id)) {
      toast({
        title: "Component Already Exists",
        description: "A component with this ID already exists.",
        variant: "destructive"
      });
      return;
    }
    
    setProduct(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
    
    toast({
      title: "Component Added",
      description: `${newComponent.name} has been added.`,
    });
  };

  const removeComponent = (componentId: string) => {
    setProduct(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== componentId)
    }));
    
    toast({
      title: "Component Removed",
      description: "The component has been removed.",
    });
  };

  const updateLifecycleStage = (stageId: string, updates: Partial<LifecycleStage>) => {
    const updateStageRecursive = (stages: LifecycleStage[]): LifecycleStage[] => {
      return stages.map(stage => {
        if (stage.id === stageId) {
          return { ...stage, ...updates };
        }
        if (stage.children) {
          return {
            ...stage,
            children: updateStageRecursive(stage.children)
          };
        }
        return stage;
      });
    };

    setProduct(prev => ({
      ...prev,
      lifecycle: updateStageRecursive(prev.lifecycle)
    }));
    
    toast({
      title: "Lifecycle Stage Updated",
      description: "The lifecycle stage has been updated.",
    });
  };

  const toggleExpandStage = (stageId: string) => {
    const toggleStageRecursive = (stages: LifecycleStage[]): LifecycleStage[] => {
      return stages.map(stage => {
        if (stage.id === stageId) {
          return { ...stage, expanded: !stage.expanded };
        }
        if (stage.children) {
          return {
            ...stage,
            children: toggleStageRecursive(stage.children)
          };
        }
        return stage;
      });
    };

    setProduct(prev => ({
      ...prev,
      lifecycle: toggleStageRecursive(prev.lifecycle)
    }));
  };

  const resetProduct = () => {
    setProduct({ ...defaultProduct });
    toast({
      title: "Product Reset",
      description: "The product has been reset to default values.",
    });
  };

  const getComponentCO2 = (componentId: string): number => {
    const component = product.components.find(c => c.id === componentId);
    if (!component) return 0;
    
    const material = materials.find(m => m.id === component.materialId);
    if (!material) return 0;
    
    const componentCO2 = material.co2PerKg * (component.weight / 1000); // Convert grams to kg
    let total = 0;
    
    // Sum CO2 across all lifecycle stages for this component
    product.lifecycle.forEach(stage => {
      total += componentCO2 * stage.co2Factor;
      
      if (stage.children) {
        stage.children.forEach(childStage => {
          total += componentCO2 * childStage.co2Factor;
        });
      }
    });
    
    return parseFloat(total.toFixed(2));
  };

  const getStageCO2 = (stageId: string): number => {
    // Function to find a stage by ID recursively
    const findStage = (stages: LifecycleStage[], id: string): LifecycleStage | undefined => {
      for (const stage of stages) {
        if (stage.id === id) return stage;
        if (stage.children) {
          const found = findStage(stage.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const stage = findStage(product.lifecycle, stageId);
    if (!stage) return 0;
    
    let total = 0;
    
    // Calculate CO2 for each component in this stage
    product.components.forEach(component => {
      const material = materials.find(m => m.id === component.materialId);
      if (!material) return;
      
      const componentCO2 = material.co2PerKg * (component.weight / 1000);
      total += componentCO2 * stage.co2Factor;
    });
    
    return parseFloat(total.toFixed(2));
  };

  return (
    <PackagingContext.Provider value={{
      product,
      materials,
      updateComponent,
      addComponent,
      removeComponent,
      updateLifecycleStage,
      toggleExpandStage,
      resetProduct,
      getComponentCO2,
      getStageCO2
    }}>
      {children}
    </PackagingContext.Provider>
  );
};

export const usePackaging = () => {
  const context = useContext(PackagingContext);
  if (context === undefined) {
    throw new Error('usePackaging must be used within a PackagingProvider');
  }
  return context;
};
