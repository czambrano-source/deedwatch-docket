import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Car, Package, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Inmueble } from "@/types/inmueble";

interface Inconsistencia {
  inmueble: Inmueble;
  tipo: "parqueadero" | "deposito";
  camposPresentes: string[];
  camposFaltantes: string[];
}

function getInconsistencias(inmuebles: Inmueble[]): Inconsistencia[] {
  const result: Inconsistencia[] = [];

  for (const i of inmuebles) {
    // --- Parqueadero ---
    const parqFields: { label: string; present: boolean }[] = [
      { label: "Cantidad", present: i.Parqueadero__c != null && i.Parqueadero__c > 0 },
      { label: "Número", present: !!i.numero_del_parqueadero__c },
      { label: "Matrícula", present: !!i.No_Matricula_Inmo_Parqueadero__c },
      { label: "CHIP", present: !!i.chip_parqueadero__c && i.chip_parqueadero__c !== "-" && i.chip_parqueadero__c !== "SIN_CHIP" },
    ];
    const parqPresent = parqFields.filter((f) => f.present);
    const parqMissing = parqFields.filter((f) => !f.present);
    // Only flag if some data exists but not all
    if (parqPresent.length > 0 && parqMissing.length > 0) {
      result.push({
        inmueble: i,
        tipo: "parqueadero",
        camposPresentes: parqPresent.map((f) => f.label),
        camposFaltantes: parqMissing.map((f) => f.label),
      });
    }

    // --- Depósito ---
    const depHasMain = !!i.Deposito__c && i.Deposito__c !== "No" && i.Deposito__c !== "0";
    const depFields: { label: string; present: boolean }[] = [
      { label: "Depósito", present: depHasMain },
      { label: "Matrícula", present: !!i.No_Matricula_Inmo_Deposito__c },
      { label: "CHIP", present: !!i.chip_deposito__c && i.chip_deposito__c !== "-" && i.chip_deposito__c !== "SIN_CHIP" },
    ];
    const depPresent = depFields.filter((f) => f.present);
    const depMissing = depFields.filter((f) => !f.present);
    if (depPresent.length > 0 && depMissing.length > 0) {
      result.push({
        inmueble: i,
        tipo: "deposito",
        camposPresentes: depPresent.map((f) => f.label),
        camposFaltantes: depMissing.map((f) => f.label),
      });
    }
  }

  return result;
}

interface Props {
  open: boolean;
  onClose: () => void;
  inmuebles: Inmueble[];
}

export function InconsistenciasModal({ open, onClose, inmuebles }: Props) {
  const inconsistencias = getInconsistencias(inmuebles);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="w-5 h-5 text-duppla-orange" />
            Reporte de Inconsistencias — Parqueaderos y Depósitos
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {inconsistencias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-duppla-green" />
              <p className="text-sm text-muted-foreground font-medium">No se encontraron inconsistencias. Todos los datos están completos o correctamente vacíos.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                Se encontraron <span className="font-semibold text-foreground">{inconsistencias.length}</span> inconsistencia(s) donde existe información parcial. Diligencie los campos faltantes.
              </p>
              {inconsistencias.map((inc, idx) => (
                <div key={`${inc.inmueble.Id}-${inc.tipo}-${idx}`} className="border rounded-lg p-4 space-y-2 bg-card">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {inc.inmueble.Name}
                    </p>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      {inc.tipo === "parqueadero" ? <Car className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                      {inc.tipo === "parqueadero" ? "Parqueadero" : "Depósito"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">✅ Campos con datos:</p>
                      <ul className="space-y-0.5">
                        {inc.camposPresentes.map((c) => (
                          <li key={c} className="text-duppla-green">{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">⚠️ Campos faltantes:</p>
                      <ul className="space-y-0.5">
                        {inc.camposFaltantes.map((c) => (
                          <li key={c} className="text-duppla-orange font-medium">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { getInconsistencias };
