import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { usePackaging } from "@/context/PackagingContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CarbonFootprintChart = () => {
  const { product, materials, getComponentCO2, getStageCO2 } = usePackaging();

  // Prepare component data for chart
  const componentChartData = product.components.map(component => {
    const material = materials.find(m => m.id === component.materialId);
    return {
      name: component.name,
      CO2: getComponentCO2(component.id),
      material: material?.name || "Unknown",
      category: material?.category || "unknown"
    };
  });

  // Prepare lifecycle stage data for chart
  const stageChartData = product.lifecycle.map(stage => {
    return {
      name: stage.name,
      CO2: getStageCO2(stage.id)
    };
  });

  // Colors for bio-based vs conventional
  const getBioCategoryColor = (category: string) => {
    switch (category) {
      case "bio-based":
        return "#3ABF58";
      case "conventional":
        return "#1EAEDB";
      default:
        return "#8E9196";
    }
  };

  // Lifecycle stage colors
  const getStageColor = (index: number) => {
    const colors = ["#00D1D9", "#3ABF58", "#8FD14F", "#67A866", "#1EAEDB"];
    return colors[index % colors.length];
  };

  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle>Carbon Footprint Analysis</CardTitle>
        <CardDescription>
          Total Product CO₂ Equivalent: <span className="font-semibold text-bioelements-green">{product.totalCO2} kg</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Components Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-4 text-center">Components CO₂ Impact</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={componentChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}kg`} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    formatter={(value) => [`${value} kg CO₂e`, "Carbon Impact"]}
                    labelFormatter={(label) => `Component: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="CO2" name="CO₂ Equivalent (kg)">
                    {componentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBioCategoryColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 gap-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-bioelements-green mr-2"></div>
                <span className="text-sm">Bio-based</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-bioelements-turquoise mr-2"></div>
                <span className="text-sm">Conventional</span>
              </div>
            </div>
          </div>

          {/* Lifecycle Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-4 text-center">Lifecycle Stage Impact</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis tickFormatter={(value) => `${value}kg`} />
                  <Tooltip 
                    formatter={(value) => [`${value} kg CO₂e`, "Carbon Impact"]}
                    labelFormatter={(label) => `Stage: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="CO2" name="CO₂ Equivalent (kg)">
                    {stageChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStageColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
