import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Trash2, Receipt, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Recibo {
  id: string;
  url_recibo?: string;
  notas?: string;
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

export function VerReciboModal({ open, onClose, salesforceId, tipoPredio, nombreInmueble }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: recibos = [], isLoading } = useQuery<Recibo[]>({
    queryKey: ["recibos_predial", salesforceId, tipoPredio],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recibos_predial")
        .select("*")
        .eq("salesforce_id", salesforceId)
        .eq("tipo_predio", tipoPredio)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Recibo[];
    },
    enabled: open,
  });

  const tipoDocMap: Record<string, string> = {
    inmueble: "recibo_pago_predial_r2o",
    parqueadero: "recibo_pago_del_predial_del_parqueadero_r2o",
    deposito: "recibo_pago_predial_deposito_r2o",
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este recibo? También se eliminará el documento de Alejandría.")) return;
    setDeleting(id);
    try {
      // Eliminar de Alejandría
      await supabase.functions.invoke("delete-predial-alejandria", {
        body: {
          id_inmueble: salesforceId,
          tipo_doc: tipoDocMap[tipoPredio] || tipoDocMap.inmueble,
        },
      });
      // Eliminar registro de Supabase
      const { error } = await supabase.from("recibos_predial").delete().eq("id", id);
      if (error) throw error;
      toast.success("Recibo eliminado");
      queryClient.invalidateQueries({ queryKey: ["recibos_predial"] });
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
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Recibos - {tipoLabel}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{nombreInmueble}</p>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : recibos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No se han registrado recibos</p>
          ) : (
            recibos.map((r) => (
              <div key={r.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                        : "Sin fecha"}
                    </span>
                    {r.anio_vigencia && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">Vigencia {r.anio_vigencia}</Badge>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(r.id)}
                    disabled={deleting === r.id}
                  >
                    {deleting === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </Button>
                </div>
                {r.notas && (
                  <p className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">{r.notas}</p>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Documento guardado en Alejandría
                </span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
