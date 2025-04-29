
import { Header } from "@/components/Header";
import { ComponentManager } from "@/components/ComponentManager";
import { LifecycleTree } from "@/components/LifecycleTree";
import { CarbonFootprintChart } from "@/components/CarbonFootprintChart";
import { usePackaging } from "@/context/PackagingContext";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Lightbulb, 
  Car, 
  Droplets,
  Trash2,
  ArrowLeftRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const Dashboard = () => {
  const { product, resetProduct, ecoEquivalents, setUserProfile, userProfile } = usePackaging();
  const [userRole, setUserRole] = useState(userProfile?.role || 'standard');
  
  const handleRoleChange = (role: 'standard' | 'advanced') => {
    setUserRole(role);
    setUserProfile({
      ...userProfile!,
      role
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              {product.isPrototype && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                  Prototipo
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <p className="text-gray-600">
                Diseñe y analice soluciones de envases sostenibles
              </p>
              {product.functionalUnit && (
                <span className="text-xs text-gray-500">
                  Unidad Funcional: {product.functionalUnit.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden md:block">Modo:</span>
              <Select value={userRole} onValueChange={(value: 'standard' | 'advanced') => handleRoleChange(value)}>
                <SelectTrigger className="w-[135px]">
                  <SelectValue placeholder="Seleccionar modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Estándar</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={resetProduct}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <ComponentManager />
          </div>
          
          <div className="lg:col-span-2">
            <LifecycleTree />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CarbonFootprintChart />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Eco-Equivalencias</h2>
              <p className="text-sm text-gray-500 mb-6">
                El impacto ambiental de su envase es equivalente a:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 p-3 rounded-full">
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horas de ampolleta encendida</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {ecoEquivalents.find(eq => eq.id === 'lightbulb')?.value || 0}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kilómetros en automóvil</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {ecoEquivalents.find(eq => eq.id === 'car')?.value || 0} km
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-bioelements-soft-blue p-3 rounded-full">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minutos de ducha</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {ecoEquivalents.find(eq => eq.id === 'shower')?.value || 0} min
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Trash2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bolsas de basura</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {ecoEquivalents.find(eq => eq.id === 'trash')?.value || 0}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Comparar con otro envase</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {userProfile?.role === 'advanced' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Análisis Detallado</h2>
            <p className="text-sm text-gray-500 mb-4">
              Métricas avanzadas disponibles en modo experto
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-bioelements-soft-green rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Huella de Carbono Total</p>
                <p className="text-2xl font-bold text-bioelements-green">{product.totalCO2} kg CO₂e</p>
              </div>
              
              <div className="bg-bioelements-soft-blue rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Consumo Energético Total</p>
                <p className="text-2xl font-bold text-blue-700">{product.totalEnergy} MJ</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Consumo de Agua Total</p>
                <p className="text-2xl font-bold text-blue-600">{product.totalWater} L</p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Generación de Residuos</p>
                <p className="text-2xl font-bold text-amber-700">{product.totalWaste} kg</p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 BioElements - Herramienta de Análisis de Ciclo de Vida. Todos los derechos reservados.</p>
          <p className="text-xs mt-1">
            El uso de las marcas Dictuc, CENEM o EcoPackaging en relación a este análisis está prohibido sin autorización expresa.
          </p>
        </div>
      </footer>
    </div>
  );
};
