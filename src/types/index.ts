
export type MaterialCategory = 
  | 'bio-based' 
  | 'conventional-plastic' 
  | 'paper-cardboard' 
  | 'metal' 
  | 'glass' 
  | 'wood';

export type Material = {
  id: string;
  name: string;
  category: MaterialCategory;
  co2PerKg: number;
  energyPerKg: number;  // MJ per kg
  waterPerKg: number;   // Liters per kg
  wastePerKg: number;   // kg waste per kg material
  fossilFuelPerKg: number; // MJ from fossil fuels per kg
  description: string;
  recyclable: boolean;
  biodegradable: boolean;
  compostable: boolean;
  origin: 'national' | 'international';
  customizable?: boolean;
};

export type PackagingComponent = {
  id: string;
  name: string;
  materialId: string;
  weight: number; // in grams
  wasteFactor?: number; // manufacturing waste as a fraction (0.1 = 10% waste)
};

export type LifecycleStage = {
  id: string;
  name: string;
  icon: string;
  description: string;
  co2Factor: number; // multiplier for the material's CO2
  energyFactor?: number; // multiplier for energy impact
  waterFactor?: number; // multiplier for water usage
  wasteFactor?: number; // multiplier for waste production
  fossilFuelFactor?: number; // multiplier for fossil fuel usage
  children?: LifecycleStage[];
  expanded?: boolean;
  editable?: boolean;
};

export type EcoEquivalent = {
  id: string;
  name: string;
  icon: string;
  value: number;
  unit: string;
  conversionFactor: number; // How to convert from kg CO2e
};

export type FunctionalUnit = {
  name: string;
  quantity: number;
  description: string;
};

export type PackagingProduct = {
  id: string;
  name: string;
  components: PackagingComponent[];
  lifecycle: LifecycleStage[];
  materials: Material[];
  totalCO2: number;
  totalEnergy?: number;
  totalWater?: number;
  totalWaste?: number;
  totalFossilFuel?: number;
  functionalUnit?: FunctionalUnit;
  isPrototype?: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  organization?: string;
  role: 'standard' | 'advanced';
};

