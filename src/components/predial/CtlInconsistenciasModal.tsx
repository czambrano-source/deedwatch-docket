import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Inmueble } from "@/types/inmueble";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CtlInconsistencia {
  inmueble: Inmueble;
  bloque: "inmueble" | "parqueadero" | "deposito";
  descripcion: string;
}

function isValidField(val?: string | null): boolean {
  if (!val) return false;
  const normalized = val.trim().toLowerCase();
  return normalized !== "" && normalized !== "n/a" && normalized !== "no tiene" && normalized !== "-" && normalized !== "sin_chip" && normalized !== "sin_deposito";
}

function getCtlInconsistencias(inmuebles: Inmueble[]): CtlInconsistencia[] {
  const result: CtlInconsistencia[] = [];

  for (const i of inmuebles) {
    // Inmueble: only flag if Matrícula or Chip have valid alphanumeric data
    if ((isValidField(i.Numero_matricula_inmobiliaria__c) || isValidField(i.chip_apartamento__c)) && (!i.nombre_ctl_inmueble__c || !i.nit_ctl_inmueble__c)) {
      result.push({ inmueble: i, bloque: "inmueble", descripcion: "CTL Inmueble vacío con Matrícula/Chip existente" });
    }

    // Parqueadero
    if ((isValidField(i.No_Matricula_Inmo_Parqueadero__c) || isValidField(i.chip_parqueadero__c)) && (!i.nombre_ctl_parqueadero__c || !i.nit_ctl_parqueadero__c)) {
      result.push({ inmueble: i, bloque: "parqueadero", descripcion: "CTL Parqueadero vacío con Matrícula/Chip existente" });
    }

    // Depósito
    if ((isValidField(i.No_Matricula_Inmo_Deposito__c) || isValidField(i.chip_deposito__c)) && (!i.nombre_ctl_bodega__c || !i.nit_ctl_bodega__c)) {
      result.push({ inmueble: i, bloque: "deposito", descripcion: "CTL Bodega vacío con Matrícula/Chip existente" });
    }
  }

  return result;
}

const bloqueLabel = (b: string) => {
  if (b === "inmueble") return "Inmueble";
  if (b === "parqueadero") return "Parqueadero";
  return "Depósito";
};

const generatePDF = (items: CtlInconsistencia[]) => {
  const doc = new jsPDF();
  const now = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  doc.setFontSize(16);
  doc.text("Reporte de Inconsistencias CTL", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${now} — Total: ${items.length}`, 14, 28);

  autoTable(doc, {
    startY: 34,
    head: [["Inmueble", "Bloque", "Descripción"]],
    body: items.map((inc) => [inc.inmueble.Name, bloqueLabel(inc.bloque), inc.descripcion]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 98, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`inconsistencias_ctl_${new Date().toISOString().slice(0, 10)}.pdf`);
};

interface Props {
  open: boolean;
  onClose: () => void;
  inmuebles: Inmueble[];
  onSelectInmueble?: (id: string) => void;
}

export function CtlInconsistenciasModal({ open, onClose, inmuebles, onSelectInmueble }: Props) {
  const items = getCtlInconsistencias(inmuebles);

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
              Inconsistencias en datos de CTL
            </DialogTitle>
            {items.length > 0 && (
              <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => generatePDF(items)}>
                <Download className="w-3.5 h-3.5" /> Generar Reporte PDF
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-duppla-green" />
              <p className="text-sm text-muted-foreground font-medium">No se encontraron inconsistencias en los datos de CTL.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                Se encontraron <span className="font-semibold text-foreground">{items.length}</span> inconsistencia(s). Haz clic para ver el inmueble.
              </p>
              {items.map((inc, idx) => (
                <div
                  key={`${inc.inmueble.Id}-${inc.bloque}-${idx}`}
                  className="border rounded-lg p-4 space-y-1 bg-card cursor-pointer transition-colors hover:bg-accent/50"
                  onClick={() => handleSelect(inc.inmueble.Id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{inc.inmueble.Name}</p>
                    <Badge variant="outline" className="text-xs">{bloqueLabel(inc.bloque)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{inc.descripcion}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { getCtlInconsistencias };
