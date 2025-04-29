
import { Dashboard } from "./Dashboard";
import { PackagingProvider } from "@/context/PackagingContext";

const Index = () => {
  return (
    <PackagingProvider>
      <Dashboard />
    </PackagingProvider>
  );
};

export default Index;
