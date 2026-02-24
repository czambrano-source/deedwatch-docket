import { useState } from "react";
import { TopNav } from "@/components/predial/TopNav";
import { ResumenTab } from "@/components/predial/ResumenTab";
import { InmueblesTab } from "@/components/predial/InmueblesTab";
import { useInmuebles, usePagos } from "@/hooks/useInmuebles";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"resumen" | "inmuebles">("resumen");
  const { data: inmuebles = [], isLoading: loadingInmuebles } = useInmuebles();
  const { data: pagos = [], isLoading: loadingPagos } = usePagos();

  const isLoading = loadingInmuebles || loadingPagos;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === "resumen" ? (
        <ResumenTab inmuebles={inmuebles} pagos={pagos} />
      ) : (
        <InmueblesTab inmuebles={inmuebles} pagos={pagos} />
      )}
    </div>
  );
};

export default Index;
