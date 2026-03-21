import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  salesforceId: string;
  tipoPredio: string;
  nombreInmueble: string;
}

interface Nota {
  id: string;
  nota: string;
  created_at: string;
}

export function NotasModal({ open, onClose, salesforceId, tipoPredio, nombreInmueble }: Props) {
  const [nuevaNota, setNuevaNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: notas = [], isLoading } = useQuery<Nota[]>({
    queryKey: ["notas_predial", salesforceId, tipoPredio],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notas_predial")
        .select("*")
        .eq("salesforce_id", salesforceId)
        .eq("tipo_predio", tipoPredio)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Nota[];
    },
    enabled: open,
  });

  const handleAdd = async () => {
    if (!nuevaNota.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("notas_predial").insert({
        salesforce_id: salesforceId,
        tipo_predio: tipoPredio,
        nota: nuevaNota.trim(),
      } as any);
      if (error) throw error;
      setNuevaNota("");
      queryClient.invalidateQueries({ queryKey: ["notas_predial"] });
      toast.success("Nota guardada");
    } catch (err: any) {
      toast.error(err.message || "Error al guardar nota");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta nota?")) return;
    setDeleting(id);
    try {
      const { error } = await supabase.from("notas_predial").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["notas_predial"] });
      toast.success("Nota eliminada");
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  const tipoLabel = tipoPredio === "inmueble" ? "Inmueble" : tipoPredio === "parqueadero" ? "Parqueadero" : "Depósito";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notas - {tipoLabel}</DialogTitle>
          <p className="text-sm text-muted-foreground">{nombreInmueble}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Escribir nota..."
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAdd} disabled={saving || !nuevaNota.trim()} className="self-end">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : notas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Sin notas registradas</p>
            ) : (
              notas.map((n) => (
                <div key={n.id} className="border rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(n.id)}
                      disabled={deleting === n.id}
                    >
                      {deleting === n.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </Button>
                  </div>
                  <p className="text-sm text-foreground">{n.nota}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
