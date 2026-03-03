import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Inmueble } from "@/types/inmueble";

interface Props {
  open: boolean;
  onClose: () => void;
  inmueble: Inmueble;
  tipoPredio: string;
  vigencia: number;
}

export function RegistrarReciboModal({ open, onClose, inmueble, tipoPredio, vigencia }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Debes adjuntar un archivo (imagen o PDF)");
      return;
    }

    setLoading(true);
    try {
      const filePath = `recibos/${inmueble.Id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("soportes_predial")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("soportes_predial")
        .getPublicUrl(filePath);

      const { error } = await supabase.from("recibos_predial").insert({
        salesforce_id: inmueble.Id,
        nombre_inmueble: inmueble.Name,
        tipo_predio: tipoPredio,
        anio_vigencia: vigencia,
        url_recibo: urlData.publicUrl,
        notas: notas || null,
      } as any);

      if (error) throw error;

      toast.success("Recibo registrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["recibos_predial"] });
      setFile(null);
      setNotas("");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al registrar recibo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Registrar Recibo — {vigencia}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {inmueble.Name} · {tipoPredio === "inmueble" ? "Inmueble" : tipoPredio === "parqueadero" ? "Parqueadero" : "Depósito"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recibo-file">Archivo (PDF o Imagen) *</Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("recibo-file")?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : "Clic para seleccionar archivo"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG</p>
            </div>
            <input
              id="recibo-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recibo-notas">Notas (opcional)</Label>
            <Textarea
              id="recibo-notas"
              placeholder="Observaciones sobre el recibo..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Subir Recibo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
