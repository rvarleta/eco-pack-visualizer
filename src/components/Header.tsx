
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { usePackaging } from "@/context/PackagingContext";
import { toast } from "@/components/ui/use-toast";
import { 
  Download, 
  Home, 
  Lightbulb, 
  Car, 
  Droplets
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FunctionalUnit } from "@/types";

export const Header = () => {
  const navigate = useNavigate();
  const { product, updateFunctionalUnit, ecoEquivalents, userProfile } = usePackaging();
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [functionalUnit, setFunctionalUnit] = useState<FunctionalUnit>(
    product.functionalUnit || {
      name: "1000 unidades",
      quantity: 1000,
      description: "Unidad funcional estándar para análisis comparativo"
    }
  );

  const exportPDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Add logo
      const img = new Image();
      img.src = '/lovable-uploads/a2399e3e-f751-40ba-8799-33e029c78b24.png';
      
      // Wait for image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Add logo
      doc.addImage(img, 'PNG', 15, 10, 40, 20);
      
      // Title
      doc.setFontSize(18);
      doc.setTextColor(33, 37, 41);
      doc.setFont('helvetica', 'bold');
      doc.text('Informe de Evaluación de Ciclo de Vida de Envase', 15, 40);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Metodología ISO 14040 "cuna-a-tumba"`, 15, 48);
      
      // Product details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Producto: ${product.name}`, 15, 60);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      if (product.functionalUnit) {
        doc.text(`Unidad Funcional: ${product.functionalUnit.name} (${product.functionalUnit.quantity} unidades)`, 15, 67);
      }
      
      // Impact summary
      doc.setFillColor(240, 250, 240);
      doc.rect(15, 75, 180, 30, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen de Impacto Ambiental', 20, 83);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Huella de Carbono Total: ${product.totalCO2} kg CO₂e`, 20, 91);
      doc.text(`Consumo Energético: ${product.totalEnergy} MJ`, 20, 98);
      
      // Only show advanced metrics for advanced users
      if (userProfile?.role === 'advanced') {
        doc.text(`Consumo de Agua: ${product.totalWater} L`, 110, 91);
        doc.text(`Generación de Residuos: ${product.totalWaste} kg`, 110, 98);
      }
      
      // Eco equivalents
      doc.setFillColor(240, 245, 250);
      doc.rect(15, 110, 180, 35, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Eco-equivalencias', 20, 118);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      ecoEquivalents.forEach((equivalent, index) => {
        doc.text(`${equivalent.name}: ${equivalent.value} ${equivalent.unit}`, 20, 126 + (index * 7));
      });
      
      // Components section
      let yPos = 150;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Componentes del Envase', 15, yPos);
      
      yPos += 8;
      product.components.forEach((component, index) => {
        const material = product.materials.find(m => m.id === component.materialId) || 
                         { name: 'Unknown' };
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${component.name}:`, 20, yPos);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Material: ${material.name}`, 30, yPos + 6);
        doc.text(`Peso: ${component.weight}g`, 30, yPos + 12);
        
        yPos += 20;
        
        // Add page if we're getting close to the end
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
      });
      
      // Lifecycle stages section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Etapas del Ciclo de Vida', 15, yPos);
      yPos += 10;
      
      const processStages = (stages, level = 0) => {
        stages.forEach((stage, index) => {
          doc.setFontSize(11 - level);
          doc.setFont('helvetica', level === 0 ? 'bold' : 'normal');
          doc.text(`${' '.repeat(level * 3)}${level === 0 ? (index + 1) + '.' : '•'} ${stage.name}`, 20, yPos);
          yPos += 6;
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(`${' '.repeat(level * 3 + 2)}Impacto CO₂: ${(stage.co2Factor * 100).toFixed(1)}% del total`, 20, yPos);
          yPos += 10;
          
          // Process children if any
          if (stage.children && stage.children.length > 0) {
            processStages(stage.children, level + 1);
          }
          
          // Add page if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
          }
        });
      };
      
      // Start processing stages
      processStages(product.lifecycle);
      
      // Add page for methodology
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Metodología', 15, 30);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Este informe ha sido generado siguiendo la metodología de Análisis de Ciclo de Vida (ACV) conforme', 15, 40);
      doc.text('a la norma ISO 14040, evaluando las etapas desde la extracción de materias primas hasta el fin', 15, 47);
      doc.text('de vida del envase ("cuna-a-tumba"). Los factores de impacto utilizados en este análisis provienen', 15, 54);
      doc.text('de bases de datos nacionales e internacionales.', 15, 61);
      
      // Legal disclaimer
      doc.setFontSize(8);
      doc.text('Los resultados presentados en este informe son estimaciones basadas en factores genéricos y pueden variar según condiciones específicas.', 15, 75);
      doc.text('Se prohíbe el uso de las marcas Dictuc, CENEM o EcoPackaging en relación a este análisis sin autorización expresa.', 15, 80);
      
      // Date and version
      const today = new Date();
      const dateStr = today.toLocaleDateString();
      doc.setFontSize(9);
      doc.text(`Generado el: ${dateStr}`, 15, 280);
      doc.text('Versión de la herramienta: 1.0 (Prototipo)', 140, 280);
      
      // Save PDF
      doc.save('biopackaging-analisis-ciclo-vida.pdf');
      
      toast({
        title: "PDF Exportado",
        description: "Su informe ha sido descargado exitosamente.",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Error en Exportación",
        description: "Hubo un error al generar su PDF.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateFunctionalUnit = () => {
    updateFunctionalUnit(functionalUnit);
    setIsUnitDialogOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/a2399e3e-f751-40ba-8799-33e029c78b24.png" 
          alt="BioElements Logo" 
          className="h-12 mr-4"
        />
        <div>
          <h1 className="text-lg md:text-2xl font-semibold text-bioelements-dark">
            Análisis de Ciclo de Vida de Envases
          </h1>
          <p className="text-sm text-gray-500 hidden md:block">
            Analice y optimice sus soluciones de envases sostenibles
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex items-center gap-2"
            >
              <span>Unidad Funcional</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Definir Unidad Funcional</DialogTitle>
              <DialogDescription>
                La unidad funcional es la base para comparaciones justas entre sistemas de envases.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="unit-name">Nombre</Label>
                <Input 
                  id="unit-name"
                  value={functionalUnit.name}
                  onChange={(e) => setFunctionalUnit({...functionalUnit, name: e.target.value})}
                  placeholder="ej. 1000 unidades de producto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit-quantity">Cantidad</Label>
                <Input 
                  id="unit-quantity"
                  type="number"
                  value={functionalUnit.quantity}
                  onChange={(e) => setFunctionalUnit({...functionalUnit, quantity: parseFloat(e.target.value)})}
                  placeholder="ej. 1000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit-description">Descripción</Label>
                <Input 
                  id="unit-description"
                  value={functionalUnit.description}
                  onChange={(e) => setFunctionalUnit({...functionalUnit, description: e.target.value})}
                  placeholder="Descripción detallada de la unidad funcional"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUnitDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpdateFunctionalUnit}>Actualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          size="sm"
          className="hidden md:flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="w-4 h-4" />
          <span>Inicio</span>
        </Button>
        
        <Button 
          onClick={exportPDF}
          className="bg-bioelements-turquoise hover:bg-bioelements-green text-white flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Exportar Informe</span>
        </Button>
      </div>
    </header>
  );
};
