import { useState, useMemo } from "react";
import { Database, Search, Loader2, AlertTriangle, CheckCircle2, RefreshCw, ChevronRight, Wrench, ArrowLeft } from "lucide-react";
import { useInmuebles } from "@/hooks/useInmuebles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Inmueble } from "@/types/inmueble";

const N8N_ANALISIS = "https://n8n.duppla.co/webhook/analisis-discrepancias";
const N8N_FIX = "https://n8n.duppla.co/webhook/fix-discrepancia-sf";

interface Discrepancia {
  campo: string;
  valor_duppla?: string | null;
  valor_sf?: string | null;
  descripcion?: string;
  [key: string]: any;
}

interface AnalisisResult {
  codigo_inmueble: string;
  discrepancias: Discrepancia[];
  [key: string]: any;
}

export default function DataPage() {
  const { data: inmuebles = [], isLoading } = useInmuebles();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedInmueble, setSelectedInmueble] = useState<Inmueble | null>(null);
  const [analisis, setAnalisis] = useState<AnalisisResult | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fixing, setFixing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return inmuebles;
    const q = search.toLowerCase();
    return inmuebles.filter(
      (i) =>
        i.Name.toLowerCase().includes(q) ||
        i.Id.toLowerCase().includes(q) ||
        (i.Opportunity__r?.Name ?? "").toLowerCase().includes(q)
    );
  }, [inmuebles, search]);

  const handleAnalizar = async (inmueble: Inmueble) => {
    setSelectedInmueble(inmueble);
    setAnalisis(null);
    setRawResponse(null);
    setAnalyzing(true);

    try {
      const res = await fetch(N8N_ANALISIS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo_inmueble: inmueble.Name }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setRawResponse(data);

      // Normalize response: could be { discrepancias: [...] } or an array directly
      if (Array.isArray(data)) {
        setAnalisis({ codigo_inmueble: inmueble.Name, discrepancias: data });
      } else if (data?.discrepancias) {
        setAnalisis(data);
      } else {
        // Treat entire object as the result
        setAnalisis({ codigo_inmueble: inmueble.Name, discrepancias: [], ...data });
      }
    } catch (err: any) {
      toast({
        title: "Error al analizar",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFix = async (discrepancia: Discrepancia) => {
    if (!selectedInmueble) return;
    const key = discrepancia.campo ?? JSON.stringify(discrepancia);
    setFixing(key);

    try {
      const res = await fetch(N8N_FIX, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo_inmueble: selectedInmueble.Name,
          salesforce_id: selectedInmueble.Id,
          ...discrepancia,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      if (data?.status === "updated") {
        toast({ title: "Corregido", description: `Campo "${discrepancia.campo}" actualizado en SF.` });
        // Remove from list
        setAnalisis((prev) =>
          prev
            ? { ...prev, discrepancias: prev.discrepancias.filter((d) => d !== discrepancia) }
            : prev
        );
      } else {
        toast({ title: "Respuesta", description: JSON.stringify(data) });
      }
    } catch (err: any) {
      toast({ title: "Error al corregir", description: err.message, variant: "destructive" });
    } finally {
      setFixing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando inmuebles…</span>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left panel — inmueble list */}
      <aside className="w-80 border-r bg-card flex flex-col shrink-0">
        <div className="p-3 border-b space-y-2">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            Sincronización de Datos
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar inmueble…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((inm) => {
            const isSelected = selectedInmueble?.Id === inm.Id;
            return (
              <button
                key={inm.Id}
                onClick={() => handleAnalizar(inm)}
                className={cn(
                  "w-full text-left px-3 py-2.5 border-b text-xs transition-colors hover:bg-accent/30",
                  isSelected && "bg-primary/10 border-l-2 border-l-primary"
                )}
              >
                <p className="font-semibold text-foreground truncate">{inm.Name}</p>
                <p className="text-muted-foreground truncate">{inm.Opportunity__r?.Name ?? "—"}</p>
              </button>
            );
          })}
        </div>

        <div className="p-2 border-t text-xs text-muted-foreground text-center">
          {filtered.length} de {inmuebles.length} inmuebles
        </div>
      </aside>

      {/* Right panel — analysis results */}
      <main className="flex-1 overflow-y-auto p-6">
        {!selectedInmueble && !analyzing && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <Database className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Selecciona un inmueble de la lista para analizar discrepancias entre Duppla Net y Salesforce.
            </p>
          </div>
        )}

        {analyzing && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analizando discrepancias de <span className="font-semibold text-foreground">{selectedInmueble?.Name}</span>…</p>
          </div>
        )}

        {!analyzing && selectedInmueble && analisis && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedInmueble.Name}</h2>
                <p className="text-xs text-muted-foreground">{selectedInmueble.Opportunity__r?.Name} — ID: {selectedInmueble.Id}</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => handleAnalizar(selectedInmueble)}>
                <RefreshCw className="w-3.5 h-3.5" /> Re-analizar
              </Button>
            </div>

            {analisis.discrepancias.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                  <CheckCircle2 className="w-10 h-10 text-duppla-green" />
                  <p className="text-sm font-medium text-foreground">Sin discrepancias</p>
                  <p className="text-xs text-muted-foreground">Los datos coinciden entre Duppla Net y Salesforce.</p>
                  {rawResponse && (
                    <details className="w-full mt-4">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Ver respuesta completa</summary>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-60">
                        {JSON.stringify(rawResponse, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-duppla-orange-light text-duppla-orange border-duppla-orange/30">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {analisis.discrepancias.length} discrepancia(s)
                  </Badge>
                </div>

                <div className="space-y-2">
                  {analisis.discrepancias.map((disc, idx) => {
                    const isFixing = fixing === (disc.campo ?? JSON.stringify(disc));
                    return (
                      <Card key={idx} className="border-l-4 border-l-duppla-orange/60">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1.5">
                              <p className="text-sm font-semibold text-foreground">{disc.campo ?? `Discrepancia ${idx + 1}`}</p>
                              {disc.descripcion && (
                                <p className="text-xs text-muted-foreground">{disc.descripcion}</p>
                              )}
                              <div className="flex gap-4 text-xs">
                                {disc.valor_duppla !== undefined && (
                                  <div>
                                    <span className="text-muted-foreground">Duppla Net: </span>
                                    <span className="font-mono text-foreground">{disc.valor_duppla ?? "—"}</span>
                                  </div>
                                )}
                                {disc.valor_sf !== undefined && (
                                  <div>
                                    <span className="text-muted-foreground">Salesforce: </span>
                                    <span className="font-mono text-foreground">{disc.valor_sf ?? "—"}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs shrink-0"
                              disabled={isFixing}
                              onClick={() => handleFix(disc)}
                            >
                              {isFixing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Wrench className="w-3.5 h-3.5" />
                              )}
                              Corregir en SF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {rawResponse && (
                  <details className="mt-4">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Ver respuesta completa del webhook</summary>
                    <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-60">
                      {JSON.stringify(rawResponse, null, 2)}
                    </pre>
                  </details>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
