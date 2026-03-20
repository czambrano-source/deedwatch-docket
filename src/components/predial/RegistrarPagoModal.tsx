import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
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

export function RegistrarPagoModal({ open, onClose, inmueble, tipoPredio, vigencia }: Props) {
  const [fechaPago, setFechaPago] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [valorAvaluo, setValorAvaluo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaPago || !valorPago) {
      toast.error("Fecha y valor son obligatorios");
      return;
    }

    setLoading(true);
    try {
      let urlSoporte: string | null = null;

      if (file) {
        // 1. Subir a Supabase storage (temporal, para obtener URL)
        const filePath = `${inmueble.Id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("soportes_predial")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("soportes_predial")
          .getPublicUrl(filePath);
        urlSoporte = urlData.publicUrl;

        // 2. Enviar a Alejandría via edge function
        const tipoDocMap: Record<string, string> = {
          inmueble: "factura_impuesto_predial_r2o",
          parqueadero: "factura_de_impuesto_predial_parqueadero_r2o",
          deposito: "factura_impuesto_predial_deposito_r2o",
        };
        try {
          await supabase.functions.invoke("upload-predial-alejandria", {
            body: {
              file_url: urlSoporte,
              id_inmueble: inmueble.Id,
              tipo_doc: tipoDocMap[tipoPredio] || tipoDocMap.inmueble,
              nombre_inmueble: inmueble.Name,
              vigencia,
            },
          });
        } catch (alejErr) {
          console.error("Error subiendo a Alejandría:", alejErr);
        }
      }

      const { error } = await supabase.from("gestion_predial").insert({
        salesforce_id: inmueble.Id,
        nombre_inmueble: inmueble.Name,
        fecha_pago: fechaPago,
        valor_pago: parseFloat(valorPago),
        valor_avaluo: valorAvaluo ? parseFloat(valorAvaluo) : null,
        url_soporte: urlSoporte,
        estado: "Pagado",
        anio_vigencia: vigencia,
        tipo_predio: tipoPredio,
      } as any);

      if (error) throw error;

      toast.success("Pago registrado y subido a Alejandría");
      queryClient.invalidateQueries({ queryKey: ["gestion_predial"] });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al registrar pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pago de Predial — {vigencia}</DialogTitle>
          <p className="text-sm text-muted-foreground">{inmueble.Name} · {tipoPredio === "inmueble" ? "Inmueble" : tipoPredio === "parqueadero" ? "Parqueadero" : "Depósito"}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Pago *</Label>
            <Input id="fecha" type="date" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor del Pago *</Label>
            <Input id="valor" type="number" placeholder="0" value={valorPago} onChange={(e) => setValorPago(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avaluo">Avalúo</Label>
            <Input id="avaluo" type="number" placeholder="0" value={valorAvaluo} onChange={(e) => setValorAvaluo(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soporte">Soporte (PDF o Imagen)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("soporte")?.click()}>
              <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : "Clic para seleccionar archivo"}
              </p>
            </div>
            <input id="soporte" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Registrar Pago
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
