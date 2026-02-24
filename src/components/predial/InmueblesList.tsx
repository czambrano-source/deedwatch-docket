import { useState } from "react";
import { Search, Building2, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

interface InmueblesListProps {
  inmuebles: Inmueble[];
  pagos: GestionPredial[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function InmueblesList({ inmuebles, pagos, selectedId, onSelect }: InmueblesListProps) {
  const [search, setSearch] = useState("");

  const pagosMap = new Map(pagos.map((p) => [p.salesforce_id, p]));

  const filtered = inmuebles.filter((i) => {
    const q = search.toLowerCase();
    return (
      (i.Name?.toLowerCase().includes(q)) ||
      (i.Id?.toLowerCase().includes(q)) ||
      (i.Ciudad__c?.toLowerCase().includes(q)) ||
      (i.chip_apartamento__c?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b space-y-2">
        <h2 className="font-semibold text-foreground text-sm">Inmuebles ({inmuebles.length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, cliente, edificio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((inmueble) => {
          const pago = pagosMap.get(inmueble.Id);
          const isPagado = pago?.estado === "Pagado";
          const isSelected = selectedId === inmueble.Id;

          return (
            <button
              key={inmueble.Id}
              onClick={() => onSelect(inmueble.Id)}
              className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${
                isSelected ? "bg-duppla-green-light border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{inmueble.Name}</p>
                  <p className="text-xs text-muted-foreground truncate">{inmueble.Id}</p>
                  <p className="text-xs text-muted-foreground">{inmueble.Ciudad__c}</p>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {isPagado ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-green bg-duppla-green-light px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Pagado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-gray bg-muted px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm p-8">No se encontraron inmuebles</p>
        )}
      </div>
    </div>
  );
}
