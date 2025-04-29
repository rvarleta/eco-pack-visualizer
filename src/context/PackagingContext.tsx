import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  LifecycleStage, 
  Material, 
  PackagingComponent, 
  PackagingProduct,
  EcoEquivalent,
  FunctionalUnit,
  UserProfile
} from '@/types';
import { 
  calculateTotalImpacts, 
  calculateEcoEquivalents, 
  defaultProduct, 
  materials, 
  ecoEquivalents,
  productTemplates 
} from '@/data/defaultData';
import { toast } from '@/components/ui/use-toast';

interface PackagingContextProps {
  product: PackagingProduct;
  materials: Material[];
  ecoEquivalents: EcoEquivalent[];
  productTemplates: any[];
  userProfile: UserProfile | null;
  updateComponent: (component: PackagingComponent) => void;
  addComponent: (component: PackagingComponent) => void;
  removeComponent: (componentId: string) => void;
  updateLifecycleStage: (stageId: string, updates: Partial<LifecycleStage>) => void;
  addLifecycleStage: (parentId: string | null, newStage: LifecycleStage) => void;
  removeLifecycleStage: (stageId: string) => void;
  toggleExpandStage: (stageId: string) => void;
  updateFunctionalUnit: (functionalUnit: FunctionalUnit) => void;
  resetProduct: () => void;
  loadProductTemplate: (templateId: string) => void;
  getComponentImpact: (componentId: string, impactType: 'co2' | 'energy' | 'water' | 'waste' | 'fossilFuel') => number;
  getStageImpact: (stageId: string, impactType: 'co2' | 'energy' | 'water' | 'waste' | 'fossilFuel') => number;
  setUserProfile: (profile: UserProfile | null) => void;
  duplicateComponent: (componentId: string) => void;
  getCalculatedEcoEquivalents: () => EcoEquivalent[];
}

const PackagingContext = createContext<PackagingContextProps | undefined>(undefined);

export const PackagingProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<PackagingProduct>({ ...defaultProduct });
  const [calculatedEcoEquivalents, setCalculatedEcoEquivalents] = useState<EcoEquivalent[]>(
    calculateEcoEquivalents(product.totalCO2, ecoEquivalents)
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    id: 'demo-user',
    name: 'Usuario de Demostración',
    email: 'demo@example.com',
    role: 'standard'
  });

  useEffect(() => {
    // Recalculate total impacts whenever product changes
    const newImpacts = calculateTotalImpacts(product.components, product.lifecycle, product.materials);
    
    if (
      newImpacts.co2 !== product.totalCO2 || 
      newImpacts.energy !== product.totalEnergy || 
      newImpacts.water !== product.totalWater || 
      newImpacts.waste !== product.totalWaste || 
      newImpacts.fossilFuel !== product.totalFossilFuel
    ) {
      setProduct(prev => ({
        ...prev,
        totalCO2: newImpacts.co2,
        totalEnergy: newImpacts.energy,
        totalWater: newImpacts.water,
        totalWaste: newImpacts.waste,
        totalFossilFuel: newImpacts.fossilFuel
      }));
      
      // Update eco-equivalents
      setCalculatedEcoEquivalents(calculateEcoEquivalents(newImpacts.co2, ecoEquivalents));
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
      title: "Componente Actualizado",
      description: `${updatedComponent.name} ha sido actualizado.`,
    });
  };

  const addComponent = (newComponent: PackagingComponent) => {
    if (product.components.some(c => c.id === newComponent.id)) {
      toast({
        title: "Componente Ya Existe",
        description: "Un componente con este ID ya existe.",
        variant: "destructive"
      });
      return;
    }
    
    setProduct(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
    
    toast({
      title: "Componente Agregado",
      description: `${newComponent.name} ha sido agregado.`,
    });
  };

  const removeComponent = (componentId: string) => {
    setProduct(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== componentId)
    }));
    
    toast({
      title: "Componente Eliminado",
      description: "El componente ha sido eliminado.",
    });
  };
  
  const duplicateComponent = (componentId: string) => {
    const componentToDuplicate = product.components.find(c => c.id === componentId);
    
    if (!componentToDuplicate) return;
    
    const newComponent = {
      ...componentToDuplicate,
      id: `${componentToDuplicate.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${componentToDuplicate.name} (Copia)`
    };
    
    addComponent(newComponent);
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
      title: "Etapa Actualizada",
      description: "La etapa del ciclo de vida ha sido actualizada.",
    });
  };
  
  const addLifecycleStage = (parentId: string | null, newStage: LifecycleStage) => {
    // Add at root level if no parent ID is provided
    if (!parentId) {
      setProduct(prev => ({
        ...prev,
        lifecycle: [...prev.lifecycle, newStage]
      }));
      
      toast({
        title: "Etapa Agregada",
        description: `${newStage.name} ha sido agregada al ciclo de vida.`,
      });
      return;
    }
    
    // Otherwise, add as a child to the specified parent
    const addStageRecursive = (stages: LifecycleStage[]): LifecycleStage[] => {
      return stages.map(stage => {
        if (stage.id === parentId) {
          return {
            ...stage,
            children: [...(stage.children || []), newStage],
            expanded: true // Auto-expand parent to show new child
          };
        }
        if (stage.children) {
          return {
            ...stage,
            children: addStageRecursive(stage.children)
          };
        }
        return stage;
      });
    };

    setProduct(prev => ({
      ...prev,
      lifecycle: addStageRecursive(prev.lifecycle)
    }));
    
    toast({
      title: "Subetapa Agregada",
      description: `${newStage.name} ha sido agregada.`,
    });
  };
  
  const removeLifecycleStage = (stageId: string) => {
    // Function to filter out the stage with the specified ID
    const removeStageRecursive = (stages: LifecycleStage[]): LifecycleStage[] => {
      // Filter out the stage with the specified ID at the current level
      const filteredStages = stages.filter(stage => stage.id !== stageId);
      
      // Recursively process any children
      return filteredStages.map(stage => {
        if (stage.children) {
          return {
            ...stage,
            children: removeStageRecursive(stage.children)
          };
        }
        return stage;
      });
    };

    setProduct(prev => ({
      ...prev,
      lifecycle: removeStageRecursive(prev.lifecycle)
    }));
    
    toast({
      title: "Etapa Eliminada",
      description: "La etapa del ciclo de vida ha sido eliminada.",
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
  
  const updateFunctionalUnit = (functionalUnit: FunctionalUnit) => {
    setProduct(prev => ({
      ...prev,
      functionalUnit
    }));
    
    toast({
      title: "Unidad Funcional Actualizada",
      description: "La unidad funcional ha sido actualizada.",
    });
  };

  const resetProduct = () => {
    setProduct({ ...defaultProduct });
    setCalculatedEcoEquivalents(calculateEcoEquivalents(defaultProduct.totalCO2, ecoEquivalents));
    toast({
      title: "Producto Reiniciado",
      description: "El producto ha sido reiniciado a los valores predeterminados.",
    });
  };
  
  const loadProductTemplate = (templateId: string) => {
    const template = productTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    setProduct(prev => ({
      ...prev,
      name: template.name,
      components: template.components,
      isPrototype: true
    }));
    
    toast({
      title: "Plantilla Cargada",
      description: `La plantilla ${template.name} ha sido cargada.`,
    });
  };

  const getComponentImpact = (componentId: string, impactType: 'co2' | 'energy' | 'water' | 'waste' | 'fossilFuel'): number => {
    const component = product.components.find(c => c.id === componentId);
    if (!component) return 0;
    
    const material = product.materials.find(m => m.id === component.materialId);
    if (!material) return 0;
    
    // Convert grams to kg and account for waste
    const wasteFactor = component.wasteFactor ?? 0.1;
    const effectiveWeight = (component.weight / 1000) * (1 + wasteFactor);
    
    let baseImpact = 0;
    switch (impactType) {
      case 'co2':
        baseImpact = material.co2PerKg * effectiveWeight;
        break;
      case 'energy':
        baseImpact = material.energyPerKg * effectiveWeight;
        break;
      case 'water':
        baseImpact = material.waterPerKg * effectiveWeight;
        break;
      case 'waste':
        baseImpact = material.wastePerKg * effectiveWeight;
        break;
      case 'fossilFuel':
        baseImpact = material.fossilFuelPerKg * effectiveWeight;
        break;
    }
    
    let total = 0;
    
    // Process lifecycle stages for this impact
    const processStage = (stage: LifecycleStage) => {
      let factor = 0;
      switch (impactType) {
        case 'co2':
          factor = stage.co2Factor ?? 0;
          break;
        case 'energy':
          factor = stage.energyFactor ?? 0;
          break;
        case 'water':
          factor = stage.waterFactor ?? 0;
          break;
        case 'waste':
          factor = stage.wasteFactor ?? 0;
          break;
        case 'fossilFuel':
          factor = stage.fossilFuelFactor ?? 0;
          break;
      }
      
      total += baseImpact * factor;
      
      // Process children
      if (stage.children) {
        stage.children.forEach(childStage => {
          processStage(childStage);
        });
      }
    };
    
    // Process all stages
    product.lifecycle.forEach(stage => {
      processStage(stage);
    });
    
    return parseFloat(total.toFixed(2));
  };

  const getStageImpact = (stageId: string, impactType: 'co2' | 'energy' | 'water' | 'waste' | 'fossilFuel'): number => {
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
    
    // Calculate impact for each component in this stage
    product.components.forEach(component => {
      const material = product.materials.find(m => m.id === component.materialId);
      if (!material) return;
      
      // Convert grams to kg and account for waste
      const wasteFactor = component.wasteFactor ?? 0.1;
      const effectiveWeight = (component.weight / 1000) * (1 + wasteFactor);
      
      let baseImpact = 0;
      let factor = 0;
      
      switch (impactType) {
        case 'co2':
          baseImpact = material.co2PerKg * effectiveWeight;
          factor = stage.co2Factor ?? 0;
          break;
        case 'energy':
          baseImpact = material.energyPerKg * effectiveWeight;
          factor = stage.energyFactor ?? 0;
          break;
        case 'water':
          baseImpact = material.waterPerKg * effectiveWeight;
          factor = stage.waterFactor ?? 0;
          break;
        case 'waste':
          baseImpact = material.wastePerKg * effectiveWeight;
          factor = stage.wasteFactor ?? 0;
          break;
        case 'fossilFuel':
          baseImpact = material.fossilFuelPerKg * effectiveWeight;
          factor = stage.fossilFuelFactor ?? 0;
          break;
      }
      
      total += baseImpact * factor;
    });
    
    return parseFloat(total.toFixed(2));
  };
  
  const getCalculatedEcoEquivalents = () => {
    return calculatedEcoEquivalents;
  };

  return (
    <PackagingContext.Provider value={{
      product,
      materials,
      ecoEquivalents: calculatedEcoEquivalents,
      productTemplates,
      userProfile,
      updateComponent,
      addComponent,
      removeComponent,
      updateLifecycleStage,
      addLifecycleStage,
      removeLifecycleStage,
      toggleExpandStage,
      updateFunctionalUnit,
      resetProduct,
      loadProductTemplate,
      getComponentImpact,
      getStageImpact,
      setUserProfile,
      duplicateComponent,
      getCalculatedEcoEquivalents
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
