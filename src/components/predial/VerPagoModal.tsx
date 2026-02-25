import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Calendar, DollarSign, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Pago {
  id: string;
  fecha_pago: string;
  valor_pago: number;
  valor_avaluo?: number;
  url_soporte?: string;
  estado?: string;
  anio_vigencia?: number;
  created_at?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  salesforceId: string;
  tipoPredio: string;
  nombreInmueble: string;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

export function VerPagoModal({ open, onClose, salesforceId, tipoPredio, nombreInmueble }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: pagos = [], isLoading } = useQuery<Pago[]>({
    queryKey: ["gestion_predial", salesforceId, tipoPredio],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gestion_predial")
        .select("*")
        .eq("salesforce_id", salesforceId)
        .eq("tipo_predio", tipoPredio)
        .order("fecha_pago", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Pago[];
    },
    enabled: open,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este pago?")) return;
    setDeleting(id);
    try {
      const { error } = await supabase.from("gestion_predial").delete().eq("id", id);
      if (error) throw error;
      toast.success("Pago eliminado");
      queryClient.invalidateQueries({ queryKey: ["gestion_predial"] });
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  const tipoLabel = tipoPredio === "inmueble" ? "Inmueble" : tipoPredio === "parqueadero" ? "Parqueadero" : "Depósito";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Historial de Pagos - {tipoLabel}</DialogTitle>
          <p className="text-sm text-muted-foreground">{nombreInmueble}</p>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : pagos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No se han registrado pagos</p>
          ) : (
            pagos.map((p) => (
              <div key={p.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(p.fecha_pago).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    {p.anio_vigencia && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">Vigencia {p.anio_vigencia}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-duppla-green text-primary-foreground text-xs">{p.estado}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" /> Pago</span>
                  <span className="font-semibold text-foreground">{formatCurrency(p.valor_pago)}</span>
                </div>
                {p.valor_avaluo != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avalúo</span>
                    <span className="text-foreground">{formatCurrency(p.valor_avaluo)}</span>
                  </div>
                )}
                {p.url_soporte && (
                  <a href={p.url_soporte} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Ver soporte PDF
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
