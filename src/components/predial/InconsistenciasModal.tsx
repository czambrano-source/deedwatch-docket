import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Car, Package, CheckCircle2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Inmueble } from "@/types/inmueble";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Inconsistencia {
  inmueble: Inmueble;
  tipo: "parqueadero" | "deposito";
  camposPresentes: string[];
  camposFaltantes: string[];
}

function isInvalidPlaceholder(val?: string | number | null): boolean {
  if (val == null) return true;
  const n = String(val).trim().toLowerCase();
  return n === "" || n === "n/a" || n === "no tiene" || n === "-" || n === "sin_chip" || n === "sin_matricula";
}

function getInconsistencias(inmuebles: Inmueble[]): Inconsistencia[] {
  const result: Inconsistencia[] = [];

  for (const i of inmuebles) {
    // ── Parqueadero: only check fields if the property HAS parking (>=1) ──
    const hasParqueadero = i.Parqueadero__c != null && i.Parqueadero__c >= 1;
    if (hasParqueadero) {
      const parqFields: { label: string; present: boolean }[] = [
        { label: "Cantidad", present: true },
      ];
      if (!isInvalidPlaceholder(i.numero_del_parqueadero__c)) {
        parqFields.push({ label: "Número", present: true });
      } else if (!i.numero_del_parqueadero__c) {
        parqFields.push({ label: "Número", present: false });
      }
      if (!isInvalidPlaceholder(i.No_Matricula_Inmo_Parqueadero__c)) {
        parqFields.push({ label: "Matrícula", present: true });
      } else if (!i.No_Matricula_Inmo_Parqueadero__c) {
        parqFields.push({ label: "Matrícula", present: false });
      }
      if (!isInvalidPlaceholder(i.chip_parqueadero__c)) {
        parqFields.push({ label: "CHIP", present: true });
      } else if (!i.chip_parqueadero__c) {
        parqFields.push({ label: "CHIP", present: false });
      }

      const parqPresent = parqFields.filter((f) => f.present);
      const parqMissing = parqFields.filter((f) => !f.present);
      if (parqPresent.length > 0 && parqMissing.length > 0) {
        result.push({
          inmueble: i,
          tipo: "parqueadero",
          camposPresentes: parqPresent.map((f) => f.label),
          camposFaltantes: parqMissing.map((f) => f.label),
        });
      }
    }

    // ── Depósito: only check fields if the property HAS deposit ──
    const depMainVal = i.Deposito__c;
    const hasDeposito = !!depMainVal && !["no", "0"].includes(depMainVal.trim().toLowerCase()) && !isInvalidPlaceholder(depMainVal);
    if (hasDeposito) {
      const depFields: { label: string; present: boolean }[] = [
        { label: "Depósito", present: true },
      ];
      if (!isInvalidPlaceholder(i.No_Matricula_Inmo_Deposito__c)) {
        depFields.push({ label: "Matrícula", present: true });
      } else if (!i.No_Matricula_Inmo_Deposito__c) {
        depFields.push({ label: "Matrícula", present: false });
      }
      if (!isInvalidPlaceholder(i.chip_deposito__c)) {
        depFields.push({ label: "CHIP", present: true });
      } else if (!i.chip_deposito__c) {
        depFields.push({ label: "CHIP", present: false });
      }

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
  }

  return result;
}

const generatePDF = (inconsistencias: Inconsistencia[]) => {
  const doc = new jsPDF();
  const now = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  doc.setFontSize(16);
  doc.text("Reporte de Inconsistencias", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Parqueaderos y Depósitos — Generado: ${now}`, 14, 28);
  doc.text(`Total inconsistencias: ${inconsistencias.length}`, 14, 34);

  autoTable(doc, {
    startY: 40,
    head: [["Inmueble", "Tipo", "Campos con datos", "Campos faltantes"]],
    body: inconsistencias.map((inc) => [
      inc.inmueble.Name,
      inc.tipo === "parqueadero" ? "Parqueadero" : "Depósito",
      inc.camposPresentes.join(", "),
      inc.camposFaltantes.join(", "),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 98, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`inconsistencias_${new Date().toISOString().slice(0, 10)}.pdf`);
};

interface Props {
  open: boolean;
  onClose: () => void;
  inmuebles: Inmueble[];
  onSelectInmueble?: (id: string) => void;
}

export function InconsistenciasModal({ open, onClose, inmuebles, onSelectInmueble }: Props) {
  const inconsistencias = getInconsistencias(inmuebles);

  const handleSelect = (id: string) => {
    onSelectInmueble?.(id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5 text-duppla-orange" />
              Reporte de Inconsistencias — Parqueaderos y Depósitos
            </DialogTitle>
            {inconsistencias.length > 0 && (
              <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => generatePDF(inconsistencias)}>
                <Download className="w-3.5 h-3.5" /> Generar Reporte PDF
              </Button>
            )}
          </div>
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
                Se encontraron <span className="font-semibold text-foreground">{inconsistencias.length}</span> inconsistencia(s) donde existe información parcial. Haz clic en un inmueble para verlo.
              </p>
              {inconsistencias.map((inc, idx) => (
                <div
                  key={`${inc.inmueble.Id}-${inc.tipo}-${idx}`}
                  className="border rounded-lg p-4 space-y-2 bg-card cursor-pointer transition-colors hover:bg-accent/50"
                  onClick={() => handleSelect(inc.inmueble.Id)}
                >
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
