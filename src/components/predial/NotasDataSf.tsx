import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ChevronDown, Send, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Nota {
  id: string;
  salesforce_id: string;
  nota: string;
  created_at: string;
}

export function NotasDataSfBlock({ salesforceId }: { salesforceId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [nuevaNota, setNuevaNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: notas = [], isLoading } = useQuery<Nota[]>({
    queryKey: ["notas_data_sf", salesforceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notas_data_sf" as any)
        .select("*")
        .eq("salesforce_id", salesforceId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Nota[];
    },
    enabled: expanded,
  });

  const handleAdd = async () => {
    if (!nuevaNota.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("notas_data_sf" as any).insert({
        salesforce_id: salesforceId,
        nota: nuevaNota.trim(),
      } as any);
      if (error) throw error;
      setNuevaNota("");
      queryClient.invalidateQueries({ queryKey: ["notas_data_sf", salesforceId] });
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
      const { error } = await supabase.from("notas_data_sf" as any).delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["notas_data_sf", salesforceId] });
      toast.success("Nota eliminada");
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  const count = notas.length;

  return (
    <div className="bg-card rounded-xl border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors rounded-xl"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-primary" /> Notas
          {count > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">{count}</Badge>
          )}
        </h3>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Escribir nota..."
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              rows={2}
              className="flex-1 text-sm"
            />
            <Button size="sm" onClick={handleAdd} disabled={saving || !nuevaNota.trim()} className="self-end">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
            ) : count === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">Sin notas registradas</p>
            ) : (
              notas.map((n) => (
                <div key={n.id} className="bg-muted/50 rounded-lg px-3 py-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
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
      )}
    </div>
  );
}
