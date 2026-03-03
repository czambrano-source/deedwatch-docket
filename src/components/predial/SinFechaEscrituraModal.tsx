import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarOff, Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Inmueble } from "@/types/inmueble";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  open: boolean;
  onClose: () => void;
  inmuebles: Inmueble[];
  onSelectInmueble?: (id: string) => void;
}

export function getSinFechaEscritura(inmuebles: Inmueble[]): Inmueble[] {
  return inmuebles.filter(
    (i) => !i.Legales__r?.records?.[0]?.Fecha_firma_escritura__c
  );
}

const generatePDF = (sinFecha: Inmueble[]) => {
  const doc = new jsPDF();
  const now = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  doc.setFontSize(16);
  doc.text("Inmuebles sin Fecha de Escritura", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${now}`, 14, 28);
  doc.text(`Total: ${sinFecha.length} inmueble(s)`, 14, 34);

  autoTable(doc, {
    startY: 40,
    head: [["Inmueble", "Oportunidad", "Ciudad", "Dirección"]],
    body: sinFecha.map((i) => [
      i.Name,
      i.Opportunity__r?.Name ?? "—",
      i.Ciudad_Inmueble__c ?? "—",
      i.Direccion__c ?? "—",
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 98, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`sin_fecha_escritura_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export function SinFechaEscrituraModal({ open, onClose, inmuebles, onSelectInmueble }: Props) {
  const sinFecha = getSinFechaEscritura(inmuebles);

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
              <CalendarOff className="w-5 h-5 text-duppla-orange" />
              Inmuebles sin Fecha de Firma de Escritura
            </DialogTitle>
            {sinFecha.length > 0 && (
              <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => generatePDF(sinFecha)}>
                <Download className="w-3.5 h-3.5" /> Generar Reporte PDF
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <p className="text-xs text-muted-foreground mb-3">
            Se encontraron <span className="font-semibold text-foreground">{sinFecha.length}</span> inmueble(s) sin fecha de firma de escritura. Haz clic para ver el inmueble.
          </p>
          {sinFecha.map((inmueble) => (
            <div
              key={inmueble.Id}
              className="border rounded-lg p-4 bg-card flex items-center gap-3 cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => handleSelect(inmueble.Id)}
            >
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
