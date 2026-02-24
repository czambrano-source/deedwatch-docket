import { Building2, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { Progress } from "@/components/ui/progress";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

interface ResumenTabProps {
  inmuebles: Inmueble[];
  pagos: GestionPredial[];
}

export function ResumenTab({ inmuebles, pagos }: ResumenTabProps) {
  const total = inmuebles.length;
  const pagados = pagos.filter((p) => p.estado === "Pagado").length;
  const pendientes = total - pagados;
  const montoRecaudado = pagos
    .filter((p) => p.estado === "Pagado")
    .reduce((sum, p) => sum + (p.valor_pago ?? 0), 0);

  const pctPagados = total > 0 ? Math.round((pagados / total) * 100) : 0;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Resumen de Prediales
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Vista general del estado de los impuestos prediales</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Inmuebles"
          value={total}
          subtitle="En Duppla"
          icon={Building2}
          iconBg="bg-duppla-blue-light"
          iconColor="text-duppla-blue"
        />
        <KpiCard
          title="Prediales Pagados"
          value={pagados}
          subtitle="Registrados"
          icon={CheckCircle2}
          iconBg="bg-duppla-green-light"
          iconColor="text-duppla-green"
        />
        <KpiCard
          title="Pendientes"
          value={pendientes}
          subtitle="Sin registro de pago"
          icon={Clock}
          iconBg="bg-duppla-orange-light"
          iconColor="text-duppla-orange"
        />
        <KpiCard
          title="Monto Recaudado"
          value={formatCurrency(montoRecaudado)}
          subtitle="Total pagado"
          icon={TrendingUp}
          iconBg="bg-duppla-green-light"
          iconColor="text-duppla-green"
        />
      </div>

      {/* Completitud */}
      <div className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Completitud de Registros
        </h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">{pctPagados}% completado</span>
          <span className="text-muted-foreground">{pagados} de {total}</span>
        </div>
        <Progress value={pctPagados} className="h-3" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-duppla-green-light">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-duppla-green" />
              <span className="text-sm font-medium text-foreground">Pagados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{pctPagados}%</span>
              <span className="bg-duppla-green text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">{pagados}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-duppla-orange-light">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-duppla-orange" />
              <span className="text-sm font-medium text-foreground">Pendientes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{total > 0 ? Math.round((pendientes / total) * 100) : 0}%</span>
              <span className="bg-duppla-orange text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">{pendientes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
