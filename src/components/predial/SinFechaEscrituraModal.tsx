import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarOff, Building2 } from "lucide-react";
import type { Inmueble } from "@/types/inmueble";

interface Props {
  open: boolean;
  onClose: () => void;
  inmuebles: Inmueble[];
}

export function getSinFechaEscritura(inmuebles: Inmueble[]): Inmueble[] {
  return inmuebles.filter(
    (i) => !i.Legales__r?.records?.[0]?.Fecha_firma_escritura__c
  );
}

export function SinFechaEscrituraModal({ open, onClose, inmuebles }: Props) {
  const sinFecha = getSinFechaEscritura(inmuebles);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <CalendarOff className="w-5 h-5 text-duppla-orange" />
            Inmuebles sin Fecha de Firma de Escritura
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <p className="text-xs text-muted-foreground mb-3">
            Se encontraron <span className="font-semibold text-foreground">{sinFecha.length}</span> inmueble(s) sin fecha de firma de escritura registrada.
          </p>
          {sinFecha.map((inmueble) => (
            <div key={inmueble.Id} className="border rounded-lg p-4 bg-card flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{inmueble.Name}</p>
                <p className="text-xs text-muted-foreground truncate">{inmueble.Opportunity__r?.Name ?? "—"}</p>
              </div>
              <p className="text-xs text-duppla-orange font-medium flex-shrink-0">Sin fecha</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
