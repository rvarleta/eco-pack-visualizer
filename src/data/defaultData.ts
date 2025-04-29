
import { LifecycleStage, Material, PackagingComponent, PackagingProduct } from "@/types";

export const materials: Material[] = [
  {
    id: "pla",
    name: "PLA (Polylactic Acid)",
    category: "bio-based",
    co2PerKg: 3.8,
    description: "Biodegradable polyester derived from renewable resources like corn starch",
    recyclable: true,
    biodegradable: true,
    compostable: true
  },
  {
    id: "pbat",
    name: "PBAT",
    category: "bio-based",
    co2PerKg: 4.2,
    description: "Biodegradable aliphatic-aromatic copolyester suitable for film applications",
    recyclable: false,
    biodegradable: true,
    compostable: true
  },
  {
    id: "starch-blend",
    name: "Starch Blend",
    category: "bio-based",
    co2PerKg: 2.7,
    description: "Blend of starch with other biopolymers for improved mechanical properties",
    recyclable: false,
    biodegradable: true,
    compostable: true
  },
  {
    id: "pet",
    name: "PET",
    category: "conventional",
    co2PerKg: 6.5,
    description: "Polyethylene terephthalate, commonly used in bottles and containers",
    recyclable: true,
    biodegradable: false,
    compostable: false
  },
  {
    id: "pe",
    name: "PE (Polyethylene)",
    category: "conventional",
    co2PerKg: 5.8,
    description: "Common plastic used in packaging, bags, and films",
    recyclable: true,
    biodegradable: false,
    compostable: false
  }
];

export const defaultComponents: PackagingComponent[] = [
  {
    id: "container",
    name: "Main Container",
    materialId: "pla",
    weight: 25
  },
  {
    id: "cap",
    name: "Cap/Lid",
    materialId: "pla",
    weight: 5
  },
  {
    id: "film",
    name: "Protective Film",
    materialId: "pbat",
    weight: 2
  }
];

export const defaultLifecycle: LifecycleStage[] = [
  {
    id: "raw-materials",
    name: "Raw Material Sourcing",
    icon: "leaf",
    description: "Extraction and production of raw materials",
    co2Factor: 1.0,
    expanded: true,
    children: [
      {
        id: "farming",
        name: "Farming/Extraction",
        icon: "recycle",
        description: "Growing crops or extracting raw materials",
        co2Factor: 0.6,
      },
      {
        id: "processing-raw",
        name: "Initial Processing",
        icon: "factory",
        description: "Initial processing of raw materials",
        co2Factor: 0.4,
      }
    ]
  },
  {
    id: "manufacturing",
    name: "Material Processing",
    icon: "factory",
    description: "Converting raw materials into packaging materials",
    co2Factor: 1.2,
    expanded: false,
    children: [
      {
        id: "refining",
        name: "Refining",
        icon: "factory",
        description: "Refining raw materials into usable forms",
        co2Factor: 0.5,
      },
      {
        id: "formation",
        name: "Formation",
        icon: "box",
        description: "Forming materials into packaging components",
        co2Factor: 0.7,
      }
    ]
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "truck",
    description: "Moving materials and products through the supply chain",
    co2Factor: 0.8,
    expanded: false,
    children: [
      {
        id: "transport-1",
        name: "Primary Transport",
        icon: "truck",
        description: "Transportation from raw material to manufacturing",
        co2Factor: 0.3,
      },
      {
        id: "transport-2",
        name: "Distribution",
        icon: "truck",
        description: "Distribution to retailers or end-users",
        co2Factor: 0.5,
      }
    ]
  },
  {
    id: "use-phase",
    name: "Use Phase",
    icon: "box",
    description: "Product utilization by end consumers",
    co2Factor: 0.2,
    expanded: false,
  },
  {
    id: "end-of-life",
    name: "End-of-Life",
    icon: "recycle",
    description: "Final disposal or recycling of the packaging",
    co2Factor: 0.5,
    expanded: false,
    children: [
      {
        id: "recycling",
        name: "Recycling",
        icon: "recycle",
        description: "Processing for material recovery",
        co2Factor: 0.2,
      },
      {
        id: "composting",
        name: "Composting",
        icon: "leaf",
        description: "Biodegradation in composting facilities",
        co2Factor: 0.1,
      },
      {
        id: "landfill",
        name: "Landfill",
        icon: "trash-2",
        description: "Disposal in landfill",
        co2Factor: 0.2,
      }
    ]
  }
];

export const calculateTotalCO2 = (components: PackagingComponent[], lifecycle: LifecycleStage[]): number => {
  let total = 0;
  
  // Calculate CO2 for each component based on material
  components.forEach(component => {
    const material = materials.find(m => m.id === component.materialId);
    if (!material) return;
    
    const componentCO2 = material.co2PerKg * (component.weight / 1000); // Convert grams to kg
    
    // Add CO2 for each lifecycle stage
    lifecycle.forEach(stage => {
      total += componentCO2 * stage.co2Factor;
      
      // Include children stages if they exist
      if (stage.children) {
        stage.children.forEach(childStage => {
          total += componentCO2 * childStage.co2Factor;
        });
      }
    });
  });
  
  return parseFloat(total.toFixed(2));
};

export const defaultProduct: PackagingProduct = {
  id: "default-product",
  name: "Eco-Friendly Container",
  components: defaultComponents,
  lifecycle: defaultLifecycle,
  totalCO2: calculateTotalCO2(defaultComponents, defaultLifecycle)
};
