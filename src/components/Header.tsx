
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { usePackaging } from "@/context/PackagingContext";
import { toast } from "@/components/ui/use-toast";
import { Download, Home } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const { product } = usePackaging();

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
      doc.setFontSize(20);
      doc.text('Packaging Lifecycle Assessment Report', 15, 40);
      
      // Product details
      doc.setFontSize(14);
      doc.text(`Product: ${product.name}`, 15, 50);
      doc.text(`Total Carbon Footprint: ${product.totalCO2} kg CO₂e`, 15, 60);
      
      // Components section
      doc.setFontSize(16);
      doc.text('Components', 15, 75);
      
      let yPos = 85;
      product.components.forEach((component, index) => {
        const material = product.materials.find(m => m.id === component.materialId);
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${component.name}:`, 20, yPos);
        doc.text(`Material: ${material?.name || 'Unknown'}`, 30, yPos + 7);
        doc.text(`Weight: ${component.weight}g`, 30, yPos + 14);
        yPos += 25;
      });
      
      // Lifecycle stages section
      doc.setFontSize(16);
      doc.text('Lifecycle Stages', 15, yPos);
      yPos += 10;
      
      product.lifecycle.forEach((stage, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${stage.name}`, 20, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.text(`CO₂ Impact: ${(stage.co2Factor * 100).toFixed(1)}% of total`, 30, yPos);
        yPos += 15;
      });
      
      // Date of generation
      const today = new Date();
      const dateStr = today.toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${dateStr}`, 15, 280);
      
      // Save PDF
      doc.save('biopackaging-lifecycle-assessment.pdf');
      
      toast({
        title: "PDF Exported",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF.",
        variant: "destructive",
      });
    }
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
            Packaging Lifecycle Visualizer
          </h1>
          <p className="text-sm text-gray-500 hidden md:block">
            Analyze and optimize your sustainable packaging solutions
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="hidden md:flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Button>
        
        <Button 
          onClick={exportPDF}
          className="bg-bioelements-turquoise hover:bg-bioelements-green text-white flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Export Report</span>
        </Button>
      </div>
    </header>
  );
};
