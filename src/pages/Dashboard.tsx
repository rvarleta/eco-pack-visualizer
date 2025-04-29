
import { Header } from "@/components/Header";
import { ComponentManager } from "@/components/ComponentManager";
import { LifecycleTree } from "@/components/LifecycleTree";
import { CarbonFootprintChart } from "@/components/CarbonFootprintChart";
import { usePackaging } from "@/context/PackagingContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export const Dashboard = () => {
  const { product, resetProduct } = usePackaging();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600">
              Design and analyze sustainable packaging solutions
            </p>
          </div>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={resetProduct}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Default</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ComponentManager />
          </div>
          
          <div className="lg:col-span-2">
            <LifecycleTree />
          </div>
        </div>
        
        <div className="mt-6">
          <CarbonFootprintChart />
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 BioElements. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
