
export type Material = {
  id: string;
  name: string;
  category: 'bio-based' | 'conventional';
  co2PerKg: number;
  description: string;
  recyclable: boolean;
  biodegradable: boolean;
  compostable: boolean;
};

export type PackagingComponent = {
  id: string;
  name: string;
  materialId: string;
  weight: number; // in grams
};

export type LifecycleStage = {
  id: string;
  name: string;
  icon: string;
  description: string;
  co2Factor: number; // multiplier for the material's CO2
  children?: LifecycleStage[];
  expanded?: boolean;
};

export type PackagingProduct = {
  id: string;
  name: string;
  components: PackagingComponent[];
  lifecycle: LifecycleStage[];
  totalCO2: number;
};
