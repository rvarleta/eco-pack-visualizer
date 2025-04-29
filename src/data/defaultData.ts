
import { EcoEquivalent, LifecycleStage, Material, PackagingComponent, PackagingProduct, FunctionalUnit } from "@/types";

export const materials: Material[] = [
  // Bio-based materials
  {
    id: "pla",
    name: "PLA (Polylactic Acid)",
    category: "bio-based",
    co2PerKg: 3.8,
    energyPerKg: 54.0,
    waterPerKg: 235.0,
    wastePerKg: 0.15,
    fossilFuelPerKg: 42.0,
    description: "Biodegradable polyester derived from renewable resources like corn starch",
    recyclable: true,
    biodegradable: true,
    compostable: true,
    origin: 'international'
  },
  {
    id: "pbat",
    name: "PBAT",
    category: "bio-based",
    co2PerKg: 4.2,
    energyPerKg: 59.0,
    waterPerKg: 245.0,
    wastePerKg: 0.18,
    fossilFuelPerKg: 46.0,
    description: "Biodegradable aliphatic-aromatic copolyester suitable for film applications",
    recyclable: false,
    biodegradable: true,
    compostable: true,
    origin: 'international'
  },
  {
    id: "starch-blend",
    name: "Starch Blend",
    category: "bio-based",
    co2PerKg: 2.7,
    energyPerKg: 45.0,
    waterPerKg: 190.0,
    wastePerKg: 0.12,
    fossilFuelPerKg: 38.0,
    description: "Blend of starch with other biopolymers for improved mechanical properties",
    recyclable: false,
    biodegradable: true,
    compostable: true,
    origin: 'national'
  },
  
  // Conventional plastics
  {
    id: "pet",
    name: "PET (Polyethylene Terephthalate)",
    category: "conventional-plastic",
    co2PerKg: 6.5,
    energyPerKg: 80.0,
    waterPerKg: 294.0,
    wastePerKg: 0.21,
    fossilFuelPerKg: 70.0,
    description: "Commonly used in bottles and containers",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'international'
  },
  {
    id: "pe",
    name: "PE (Polyethylene)",
    category: "conventional-plastic",
    co2PerKg: 5.8,
    energyPerKg: 76.0,
    waterPerKg: 270.0,
    wastePerKg: 0.19,
    fossilFuelPerKg: 65.0,
    description: "Common plastic used in packaging, bags, and films",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'international'
  },
  {
    id: "pp",
    name: "PP (Polypropylene)",
    category: "conventional-plastic",
    co2PerKg: 4.9,
    energyPerKg: 73.0,
    waterPerKg: 260.0,
    wastePerKg: 0.17,
    fossilFuelPerKg: 62.0,
    description: "Versatile plastic used for containers and packaging",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'international'
  },
  {
    id: "ps",
    name: "PS (Polystyrene)",
    category: "conventional-plastic",
    co2PerKg: 7.8,
    energyPerKg: 88.0,
    waterPerKg: 310.0,
    wastePerKg: 0.23,
    fossilFuelPerKg: 78.0,
    description: "Rigid or foam plastic used for protective packaging",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'international'
  },
  
  // Paper and cardboard
  {
    id: "cardboard",
    name: "Corrugated Cardboard",
    category: "paper-cardboard",
    co2PerKg: 1.1,
    energyPerKg: 25.0,
    waterPerKg: 20.0,
    wastePerKg: 0.05,
    fossilFuelPerKg: 18.0,
    description: "Used for boxes and structural packaging",
    recyclable: true,
    biodegradable: true,
    compostable: true,
    origin: 'national'
  },
  {
    id: "kraft-paper",
    name: "Kraft Paper",
    category: "paper-cardboard",
    co2PerKg: 0.9,
    energyPerKg: 22.0,
    waterPerKg: 15.0,
    wastePerKg: 0.04,
    fossilFuelPerKg: 14.0,
    description: "Strong paper for bags and wrapping",
    recyclable: true,
    biodegradable: true,
    compostable: true,
    origin: 'national'
  },
  
  // Metal
  {
    id: "aluminum",
    name: "Aluminum",
    category: "metal",
    co2PerKg: 11.0,
    energyPerKg: 170.0,
    waterPerKg: 1320.0,
    wastePerKg: 0.15,
    fossilFuelPerKg: 150.0,
    description: "Lightweight metal for cans and foils",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'international'
  },
  {
    id: "steel",
    name: "Steel",
    category: "metal",
    co2PerKg: 2.8,
    energyPerKg: 45.0,
    waterPerKg: 55.0,
    wastePerKg: 0.18,
    fossilFuelPerKg: 40.0,
    description: "Durable metal for cans and containers",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'national'
  },
  
  // Glass
  {
    id: "glass",
    name: "Glass",
    category: "glass",
    co2PerKg: 1.4,
    energyPerKg: 15.0,
    waterPerKg: 12.0,
    wastePerKg: 0.02,
    fossilFuelPerKg: 12.0,
    description: "Inert material for bottles and jars",
    recyclable: true,
    biodegradable: false,
    compostable: false,
    origin: 'national'
  },
  
  // Wood
  {
    id: "wood",
    name: "Wood",
    category: "wood",
    co2PerKg: 0.4,
    energyPerKg: 8.0,
    waterPerKg: 5.0,
    wastePerKg: 0.12,
    fossilFuelPerKg: 6.0,
    description: "Natural material for crates and pallets",
    recyclable: true,
    biodegradable: true,
    compostable: true,
    origin: 'national'
  }
];

export const ecoEquivalents: EcoEquivalent[] = [
  {
    id: "lightbulb",
    name: "Light Bulb Hours",
    icon: "lightbulb",
    value: 0,
    unit: "hours",
    conversionFactor: 0.06 // kg CO2e per hour of 60W bulb
  },
  {
    id: "car",
    name: "Car Travel",
    icon: "car",
    value: 0,
    unit: "km",
    conversionFactor: 0.12 // kg CO2e per km
  },
  {
    id: "shower",
    name: "Shower Time",
    icon: "shower",
    value: 0,
    unit: "minutes",
    conversionFactor: 0.25 // kg CO2e per minute
  },
  {
    id: "trash",
    name: "Trash Bags",
    icon: "trash",
    value: 0,
    unit: "bags",
    conversionFactor: 0.5 // kg CO2e per bag
  }
];

export const defaultComponents: PackagingComponent[] = [
  {
    id: "container",
    name: "Main Container",
    materialId: "pla",
    weight: 25,
    wasteFactor: 0.08
  },
  {
    id: "cap",
    name: "Cap/Lid",
    materialId: "pla",
    weight: 5,
    wasteFactor: 0.05
  },
  {
    id: "film",
    name: "Protective Film",
    materialId: "pbat",
    weight: 2,
    wasteFactor: 0.1
  }
];

export const defaultFunctionalUnit: FunctionalUnit = {
  name: "1000 units",
  quantity: 1000,
  description: "Standard functional unit for comparative analysis"
};

export const defaultLifecycle: LifecycleStage[] = [
  {
    id: "raw-materials",
    name: "Raw Material Sourcing",
    icon: "leaf",
    description: "Extraction and production of raw materials",
    co2Factor: 1.0,
    energyFactor: 1.0,
    waterFactor: 1.0,
    wasteFactor: 0.3,
    fossilFuelFactor: 1.0,
    expanded: true,
    editable: true,
    children: [
      {
        id: "farming",
        name: "Farming/Extraction",
        icon: "recycle",
        description: "Growing crops or extracting raw materials",
        co2Factor: 0.6,
        energyFactor: 0.65,
        waterFactor: 0.8,
        wasteFactor: 0.15,
        fossilFuelFactor: 0.7,
        editable: true
      },
      {
        id: "processing-raw",
        name: "Initial Processing",
        icon: "factory",
        description: "Initial processing of raw materials",
        co2Factor: 0.4,
        energyFactor: 0.35,
        waterFactor: 0.2,
        wasteFactor: 0.15,
        fossilFuelFactor: 0.3,
        editable: true
      }
    ]
  },
  {
    id: "manufacturing",
    name: "Material Processing",
    icon: "factory",
    description: "Converting raw materials into packaging materials",
    co2Factor: 1.2,
    energyFactor: 1.5,
    waterFactor: 0.8,
    wasteFactor: 0.6,
    fossilFuelFactor: 1.3,
    expanded: false,
    editable: true,
    children: [
      {
        id: "refining",
        name: "Refining",
        icon: "factory",
        description: "Refining raw materials into usable forms",
        co2Factor: 0.5,
        energyFactor: 0.7,
        waterFactor: 0.3,
        wasteFactor: 0.3,
        fossilFuelFactor: 0.6,
        editable: true
      },
      {
        id: "formation",
        name: "Formation",
        icon: "box",
        description: "Forming materials into packaging components",
        co2Factor: 0.7,
        energyFactor: 0.8,
        waterFactor: 0.5,
        wasteFactor: 0.3,
        fossilFuelFactor: 0.7,
        editable: true
      }
    ]
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "truck",
    description: "Moving materials and products through the supply chain",
    co2Factor: 0.8,
    energyFactor: 0.9,
    waterFactor: 0.1,
    wasteFactor: 0.05,
    fossilFuelFactor: 1.2,
    expanded: false,
    editable: true,
    children: [
      {
        id: "transport-1",
        name: "Primary Transport",
        icon: "truck",
        description: "Transportation from raw material to manufacturing",
        co2Factor: 0.3,
        energyFactor: 0.35,
        waterFactor: 0.05,
        wasteFactor: 0.02,
        fossilFuelFactor: 0.5,
        editable: true
      },
      {
        id: "transport-2",
        name: "Distribution",
        icon: "truck",
        description: "Distribution to retailers or end-users",
        co2Factor: 0.5,
        energyFactor: 0.55,
        waterFactor: 0.05,
        wasteFactor: 0.03,
        fossilFuelFactor: 0.7,
        editable: true
      }
    ]
  },
  {
    id: "use-phase",
    name: "Use Phase",
    icon: "box",
    description: "Product utilization by end consumers",
    co2Factor: 0.2,
    energyFactor: 0.15,
    waterFactor: 0.3,
    wasteFactor: 0.1,
    fossilFuelFactor: 0.2,
    expanded: false,
    editable: true
  },
  {
    id: "end-of-life",
    name: "End-of-Life",
    icon: "recycle",
    description: "Final disposal or recycling of the packaging",
    co2Factor: 0.5,
    energyFactor: 0.3,
    waterFactor: 0.2,
    wasteFactor: 1.0,
    fossilFuelFactor: 0.3,
    expanded: false,
    editable: true,
    children: [
      {
        id: "recycling",
        name: "Recycling",
        icon: "recycle",
        description: "Processing for material recovery",
        co2Factor: 0.2,
        energyFactor: 0.15,
        waterFactor: 0.15,
        wasteFactor: 0.3,
        fossilFuelFactor: 0.15,
        editable: true
      },
      {
        id: "composting",
        name: "Composting",
        icon: "leaf",
        description: "Biodegradation in composting facilities",
        co2Factor: 0.1,
        energyFactor: 0.05,
        waterFactor: 0.05,
        wasteFactor: 0.2,
        fossilFuelFactor: 0.05,
        editable: true
      },
      {
        id: "landfill",
        name: "Landfill",
        icon: "trash-2",
        description: "Disposal in landfill",
        co2Factor: 0.2,
        energyFactor: 0.1,
        waterFactor: 0.0,
        wasteFactor: 0.5,
        fossilFuelFactor: 0.1,
        editable: true
      }
    ]
  }
];

export const calculateTotalImpacts = (components: PackagingComponent[], lifecycle: LifecycleStage[], materialList: Material[]): {
  co2: number;
  energy: number;
  water: number;
  waste: number;
  fossilFuel: number;
} => {
  let totalCO2 = 0;
  let totalEnergy = 0;
  let totalWater = 0;
  let totalWaste = 0;
  let totalFossilFuel = 0;
  
  // Calculate impacts for each component based on material
  components.forEach(component => {
    const material = materialList.find(m => m.id === component.materialId);
    if (!material) return;
    
    // Convert grams to kg and account for manufacturing waste
    const wasteFactor = component.wasteFactor ?? 0.1;
    const effectiveWeight = (component.weight / 1000) * (1 + wasteFactor);
    
    const componentCO2 = material.co2PerKg * effectiveWeight;
    const componentEnergy = material.energyPerKg * effectiveWeight;
    const componentWater = material.waterPerKg * effectiveWeight;
    const componentWaste = material.wastePerKg * effectiveWeight;
    const componentFossilFuel = material.fossilFuelPerKg * effectiveWeight;
    
    // Process each lifecycle stage
    const processStage = (stage: LifecycleStage) => {
      totalCO2 += componentCO2 * (stage.co2Factor ?? 0);
      totalEnergy += componentEnergy * (stage.energyFactor ?? 0);
      totalWater += componentWater * (stage.waterFactor ?? 0);
      totalWaste += componentWaste * (stage.wasteFactor ?? 0);
      totalFossilFuel += componentFossilFuel * (stage.fossilFuelFactor ?? 0);
      
      // Process children stages if they exist
      if (stage.children) {
        stage.children.forEach(childStage => {
          processStage(childStage);
        });
      }
    };
    
    // Start processing from top-level stages
    lifecycle.forEach(stage => {
      processStage(stage);
    });
  });
  
  return {
    co2: parseFloat(totalCO2.toFixed(2)),
    energy: parseFloat(totalEnergy.toFixed(2)),
    water: parseFloat(totalWater.toFixed(2)),
    waste: parseFloat(totalWaste.toFixed(2)),
    fossilFuel: parseFloat(totalFossilFuel.toFixed(2))
  };
};

export const calculateEcoEquivalents = (co2Amount: number, equivalents: EcoEquivalent[]): EcoEquivalent[] => {
  return equivalents.map(eq => ({
    ...eq,
    value: parseFloat((co2Amount / eq.conversionFactor).toFixed(2))
  }));
};

export const defaultProduct: PackagingProduct = {
  id: "default-product",
  name: "Envase Ecológico",
  components: defaultComponents,
  lifecycle: defaultLifecycle,
  materials: materials,
  totalCO2: 0, // Will be calculated
  totalEnergy: 0,
  totalWater: 0,
  totalWaste: 0,
  totalFossilFuel: 0,
  functionalUnit: defaultFunctionalUnit,
  isPrototype: true
};

// Calculate initial values
const initialImpacts = calculateTotalImpacts(defaultComponents, defaultLifecycle, materials);
defaultProduct.totalCO2 = initialImpacts.co2;
defaultProduct.totalEnergy = initialImpacts.energy;
defaultProduct.totalWater = initialImpacts.water;
defaultProduct.totalWaste = initialImpacts.waste;
defaultProduct.totalFossilFuel = initialImpacts.fossilFuel;

// Product templates for quick selection
export const productTemplates = [
  {
    id: "beverage-bottle",
    name: "Botella de Bebida",
    description: "Botella PET con tapa de plástico",
    components: [
      {
        id: "bottle-body",
        name: "Cuerpo de la Botella",
        materialId: "pet",
        weight: 25
      },
      {
        id: "bottle-cap",
        name: "Tapa",
        materialId: "pe",
        weight: 3
      },
      {
        id: "bottle-label",
        name: "Etiqueta",
        materialId: "kraft-paper",
        weight: 1
      }
    ]
  },
  {
    id: "food-container",
    name: "Contenedor de Alimentos",
    description: "Contenedor biodegradable para comida preparada",
    components: [
      {
        id: "container-body",
        name: "Cuerpo del Contenedor",
        materialId: "pla",
        weight: 18
      },
      {
        id: "container-lid",
        name: "Tapa",
        materialId: "pla",
        weight: 7
      }
    ]
  },
  {
    id: "cardboard-box",
    name: "Caja de Cartón",
    description: "Caja de cartón para envíos",
    components: [
      {
        id: "box-body",
        name: "Cuerpo de la Caja",
        materialId: "cardboard",
        weight: 120
      },
      {
        id: "box-tape",
        name: "Cinta Adhesiva",
        materialId: "pe",
        weight: 5
      }
    ]
  }
];

