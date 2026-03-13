import { useState, useEffect, useMemo } from "react";
import {
  Database, Search, Loader2, AlertTriangle, CheckCircle2, RefreshCw,
  Wrench, Eye, History, LayoutDashboard, FileText, FileX, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useInmuebles } from "@/hooks/useInmuebles";
import { getInconsistencias } from "@/components/predial/InconsistenciasModal";
import { getCtlInconsistencias } from "@/components/predial/CtlInconsistenciasModal";
import type { Inmueble } from "@/types/inmueble";

/* ─── Types ─── */
interface Discrepancia {
  tipo?: string;
  severidad?: string;
  campo?: string;
  descripcion?: string;
  valor_actual?: string | null;
  valor_documento?: string | null;
  fuente?: string;
  [key: string]: any;
}

interface InmuebleProblema {
  codigo: string;
  salesforce_id: string;
  nombre_conjunto: string;
  direccion: string;
  proceso: string;
  discrepancias: Discrepancia[];
}

interface AnalisisIA {
  datos_actuales_sf?: Record<string, any>;
  documentos_analizados?: string[];
  documentos_faltantes?: string[];
  discrepancias?: Discrepancia[];
  [key: string]: any;
}

interface HistorialCambio {
  id: string;
  created_at: string;
  codigo_inmueble: string;
  salesforce_id: string | null;
  campo_corregido: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  fuente: string | null;
  aprobado_por: string;
}

/* ─── Build local inconsistencies from inmuebles ─── */
function buildProblemas(inmuebles: Inmueble[]): InmuebleProblema[] {
  const map = new Map<string, InmuebleProblema>();

  const ensure = (i: Inmueble): InmuebleProblema => {
    if (!map.has(i.Id)) {
      map.set(i.Id, {
        codigo: i.Name,
        salesforce_id: i.Id,
        nombre_conjunto: i.Nombre_de_edificio_o_conjunto__c || "",
        direccion: i.Direccion__c || "",
        proceso: i.Proceso_entrega_inmueble__c || "",
        discrepancias: [],
      });
    }
    return map.get(i.Id)!;
  };

  // Parqueadero / Depósito inconsistencies
  for (const inc of getInconsistencias(inmuebles)) {
    const p = ensure(inc.inmueble);
    for (const campo of inc.camposFaltantes) {
      p.discrepancias.push({
        tipo: inc.tipo === "parqueadero" ? "Parqueadero" : "Depósito",
        severidad: "media",
        campo: `${inc.tipo === "parqueadero" ? "Parqueadero" : "Depósito"} — ${campo}`,
        descripcion: `Campo "${campo}" faltante en ${inc.tipo}. Campos con datos: ${inc.camposPresentes.join(", ")}`,
      });
    }
  }

  // CTL inconsistencies
  for (const inc of getCtlInconsistencias(inmuebles)) {
    const p = ensure(inc.inmueble);
    const bloqueLabel = inc.bloque === "inmueble" ? "Inmueble" : inc.bloque === "parqueadero" ? "Parqueadero" : "Depósito";
    p.discrepancias.push({
      tipo: "CTL",
      severidad: "alta",
      campo: `CTL ${bloqueLabel}`,
      descripcion: inc.descripcion,
    });
  }

  // Fecha escritura missing
  for (const i of inmuebles) {
    const fecha = i.Legales__r?.records?.[0]?.Fecha_firma_escritura__c;
    if (!fecha) {
      const p = ensure(i);
      p.discrepancias.push({
        tipo: "Escritura",
        severidad: "alta",
        campo: "Fecha firma escritura",
        descripcion: "No tiene fecha de firma de escritura registrada",
      });
    }
  }

  return Array.from(map.values()).filter((p) => p.discrepancias.length > 0);
}

/* ─── Helpers ─── */
const severidadColor = (sev: string) => {
  const s = (sev || "").toLowerCase();
  if (s === "alta") return "bg-destructive text-destructive-foreground";
  if (s === "media") return "bg-accent text-accent-foreground";
  return "bg-muted text-muted-foreground";
};

/* ─── Main Component ─── */
export default function DataPage() {
  const { toast } = useToast();
  const { data: rawInmuebles = [], isLoading } = useInmuebles();

  const [view, setView] = useState<"general" | "historial">("general");

  // Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [conjuntoFilter, setConjuntoFilter] = useState("all");
  const [procesoFilter, setProcesoFilter] = useState("all");
  const [severidadFilter, setSeveridadFilter] = useState("all");

  // AI Analysis
  const [selectedInmueble, setSelectedInmueble] = useState<InmuebleProblema | null>(null);
  const [analisisIA, setAnalisisIA] = useState<AnalisisIA | null>(null);
  const [analyzingIA, setAnalyzingIA] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fix modal
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [fixDiscrepancia, setFixDiscrepancia] = useState<Discrepancia | null>(null);
  const [fixValorNuevo, setFixValorNuevo] = useState("");
  const [fixingInProgress, setFixingInProgress] = useState(false);

  // Historial
  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialFilterInmueble, setHistorialFilterInmueble] = useState("");
  const [historialFilterUsuario, setHistorialFilterUsuario] = useState("");

  /* ─── Build problems from local data ─── */
  const inmuebles = useMemo(() => buildProblemas(rawInmuebles), [rawInmuebles]);

  /* ─── KPIs ─── */
  const kpis = useMemo(() => {
    let alta = 0, media = 0, baja = 0;
    inmuebles.forEach((i) =>
      i.discrepancias.forEach((d) => {
        const s = (d.severidad || "baja").toLowerCase();
        if (s === "alta") alta++;
        else if (s === "media") media++;
        else baja++;
      })
    );
    return { total: rawInmuebles.length, conProblemas: inmuebles.length, alta, media, baja };
  }, [inmuebles, rawInmuebles]);

  /* ─── Filters ─── */
  const conjuntos = useMemo(() => [...new Set(inmuebles.map((i) => i.nombre_conjunto).filter(Boolean))], [inmuebles]);
  const procesos = useMemo(() => [...new Set(inmuebles.map((i) => i.proceso).filter(Boolean))], [inmuebles]);

  const filteredInmuebles = useMemo(() => {
    let result = [...inmuebles];
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (i) =>
          i.codigo.toLowerCase().includes(q) ||
          i.nombre_conjunto.toLowerCase().includes(q) ||
          i.direccion.toLowerCase().includes(q)
      );
    }
    if (conjuntoFilter !== "all") result = result.filter((i) => i.nombre_conjunto === conjuntoFilter);
    if (procesoFilter !== "all") result = result.filter((i) => i.proceso === procesoFilter);
    if (severidadFilter !== "all") {
      result = result.filter((i) =>
        i.discrepancias.some((d) => (d.severidad || "baja").toLowerCase() === severidadFilter)
      );
    }
    return result.sort((a, b) => b.discrepancias.length - a.discrepancias.length);
  }, [inmuebles, searchFilter, conjuntoFilter, procesoFilter, severidadFilter]);

  /* ─── Load historial ─── */
  const fetchHistorial = async () => {
    setHistorialLoading(true);
    const { data, error } = await supabase
      .from("historial_cambios_sf")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setHistorial(data as HistorialCambio[]);
    setHistorialLoading(false);
  };

  useEffect(() => {
    if (view === "historial") fetchHistorial();
  }, [view]);

  /* ─── AI Analysis ─── */
  const handleAnalizarIA = async (inm: InmuebleProblema) => {
    setSelectedInmueble(inm);
    setAnalisisIA(null);
    setAnalyzingIA(true);
    setSheetOpen(true);

    // Also load historial for this inmueble
    fetchHistorial();

    try {
      const { data, error } = await supabase.functions.invoke("check-escritura-antecedente", {
        body: { codigo_inmueble: inm.codigo, salesforce_id: inm.salesforce_id },
      });
      if (error) throw new Error(error.message);
      if ((data as any)?.ok === false) throw new Error((data as any).error ?? "Error");

      const payload = (data as any)?.payload ?? data;
      setAnalisisIA(payload);
    } catch (err: any) {
      toast({ title: "Error en análisis IA", description: err.message, variant: "destructive" });
      setSheetOpen(false);
    } finally {
      setAnalyzingIA(false);
    }
  };

  /* ─── Fix flow ─── */
  const openFixModal = (disc: Discrepancia) => {
    setFixDiscrepancia(disc);
    setFixValorNuevo(disc.valor_documento || "");
    setFixModalOpen(true);
  };

  const handleConfirmFix = async () => {
    if (!fixDiscrepancia || !selectedInmueble) return;
    setFixingInProgress(true);

    try {
      const payload = {
        codigo_inmueble: selectedInmueble.codigo,
        salesforce_id: selectedInmueble.salesforce_id,
        campo: fixDiscrepancia.campo,
        valor_actual: fixDiscrepancia.valor_actual,
        valor_nuevo: fixValorNuevo,
        fuente: fixDiscrepancia.fuente,
        aprobador: "usuario@duppla.co",
      };

      const { data, error } = await supabase.functions.invoke("fix-discrepancia-sf", { body: payload });
      if (error) throw new Error(error.message);
      if ((data as any)?.ok === false) throw new Error((data as any).error ?? "Error");

      await supabase.from("historial_cambios_sf").insert({
        codigo_inmueble: selectedInmueble.codigo,
        salesforce_id: selectedInmueble.salesforce_id,
        campo_corregido: fixDiscrepancia.campo || "",
        valor_anterior: fixDiscrepancia.valor_actual,
        valor_nuevo: fixValorNuevo,
        fuente: fixDiscrepancia.fuente,
        aprobado_por: payload.aprobador,
      });

      toast({ title: "Corregido", description: `Campo "${fixDiscrepancia.campo}" actualizado en SF.` });

      if (analisisIA?.discrepancias) {
        setAnalisisIA({
          ...analisisIA,
          discrepancias: analisisIA.discrepancias.filter((d) => d !== fixDiscrepancia),
        });
      }

      setFixModalOpen(false);
      fetchHistorial();
    } catch (err: any) {
      toast({ title: "Error al corregir", description: err.message, variant: "destructive" });
    } finally {
      setFixingInProgress(false);
    }
  };

  /* ─── Historial for specific inmueble ─── */
  const inmuebleHistorial = useMemo(() => {
    if (!selectedInmueble?.codigo) return [];
    return historial.filter((h) => h.codigo_inmueble === selectedInmueble.codigo);
  }, [historial, selectedInmueble]);

  /* ─── Filtered historial ─── */
  const filteredHistorial = useMemo(() => {
    let result = [...historial];
    if (historialFilterInmueble) {
      const q = historialFilterInmueble.toLowerCase();
      result = result.filter((h) => h.codigo_inmueble.toLowerCase().includes(q));
    }
    if (historialFilterUsuario) {
      const q = historialFilterUsuario.toLowerCase();
      result = result.filter((h) => h.aprobado_por.toLowerCase().includes(q));
    }
    return result;
  }, [historial, historialFilterInmueble, historialFilterUsuario]);

  /* ─── Severity badge counts ─── */
  const severityCounts = (discs: Discrepancia[]) => {
    let alta = 0, media = 0, baja = 0;
    discs.forEach((d) => {
      const s = (d.severidad || "baja").toLowerCase();
      if (s === "alta") alta++;
      else if (s === "media") media++;
      else baja++;
    });
    return { alta, media, baja };
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* ─── Side menu ─── */}
      <aside className="w-52 border-r bg-card flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            Data SF
          </h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setView("general")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              view === "general" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Vista General
          </button>
          <button
            onClick={() => setView("historial")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              view === "historial" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <History className="w-4 h-4" />
            Historial de Cambios
          </button>
        </nav>
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 overflow-y-auto">
        {view === "general" && (
          <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold text-foreground">Consistencia de Datos SF</h1>

            {/* KPI Cards */}
            {isLoading ? (
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                <Card>
                  <CardContent className="pt-4 pb-4 px-4">
                    <p className="text-xs text-muted-foreground">Analizados</p>
                    <p className="text-2xl font-bold text-foreground">{kpis.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4 px-4">
                    <p className="text-xs text-muted-foreground">Con problemas</p>
                    <p className="text-2xl font-bold text-foreground">{kpis.conProblemas}</p>
                  </CardContent>
                </Card>
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="pt-4 pb-4 px-4">
                    <p className="text-xs text-destructive/70">Severidad Alta</p>
                    <p className="text-2xl font-bold text-destructive">{kpis.alta}</p>
                  </CardContent>
                </Card>
                <Card className="bg-duppla-orange/10 border-duppla-orange/20">
                  <CardContent className="pt-4 pb-4 px-4">
                    <p className="text-xs text-duppla-orange/70">Severidad Media</p>
                    <p className="text-2xl font-bold text-duppla-orange">{kpis.media}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4 px-4">
                    <p className="text-xs text-muted-foreground">Severidad Baja</p>
                    <p className="text-2xl font-bold text-muted-foreground">{kpis.baja}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar código, conjunto, dirección…"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
              <Select value={conjuntoFilter} onValueChange={setConjuntoFilter}>
                <SelectTrigger className="w-48 h-9 text-xs">
                  <SelectValue placeholder="Conjunto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los conjuntos</SelectItem>
                  {conjuntos.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={procesoFilter} onValueChange={setProcesoFilter}>
                <SelectTrigger className="w-44 h-9 text-xs">
                  <SelectValue placeholder="Proceso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los procesos</SelectItem>
                  {procesos.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={severidadFilter} onValueChange={setSeveridadFilter}>
                <SelectTrigger className="w-40 h-9 text-xs">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <Skeleton className="h-64 rounded-lg" />
            ) : filteredInmuebles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                  <p className="text-sm font-medium text-foreground">Sin inconsistencias encontradas</p>
                  <p className="text-xs text-muted-foreground">Todos los inmuebles están sincronizados.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Código</TableHead>
                      <TableHead className="text-xs">Conjunto</TableHead>
                      <TableHead className="text-xs">Dirección</TableHead>
                      <TableHead className="text-xs">Proceso</TableHead>
                      <TableHead className="text-xs text-center">Problemas</TableHead>
                      <TableHead className="text-xs">Severidad</TableHead>
                      <TableHead className="text-xs text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInmuebles.map((inm) => {
                      const counts = severityCounts(inm.discrepancias);
                      return (
                        <TableRow key={inm.salesforce_id}>
                          <TableCell className="text-xs font-mono font-medium">{inm.codigo}</TableCell>
                          <TableCell className="text-xs">{inm.nombre_conjunto || "—"}</TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">{inm.direccion || "—"}</TableCell>
                          <TableCell className="text-xs">{inm.proceso || "—"}</TableCell>
                          <TableCell className="text-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="text-xs font-semibold text-primary underline decoration-dashed underline-offset-2 hover:text-primary/80 cursor-pointer">
                                  {inm.discrepancias.length}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-0" align="start">
                                <div className="px-3 py-2 border-b">
                                  <p className="text-xs font-semibold text-foreground">{inm.codigo} — {inm.discrepancias.length} problema(s)</p>
                                </div>
                                <div className="max-h-60 overflow-y-auto divide-y">
                                  {inm.discrepancias.map((d, idx) => (
                                    <div key={idx} className="px-3 py-2 space-y-0.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-foreground">{d.campo}</span>
                                        <span className={cn(
                                          "text-[10px] font-medium px-1.5 py-0 rounded",
                                          (d.severidad || "").toLowerCase() === "alta" && "text-destructive bg-destructive/10",
                                          (d.severidad || "").toLowerCase() === "media" && "text-duppla-orange bg-duppla-orange/10",
                                          (d.severidad || "").toLowerCase() !== "alta" && (d.severidad || "").toLowerCase() !== "media" && "text-muted-foreground bg-muted",
                                        )}>
                                          {d.severidad || "baja"}
                                        </span>
                                      </div>
                                      {d.descripcion && (
                                        <p className="text-[11px] text-muted-foreground leading-tight">{d.descripcion}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1.5">
                              {counts.alta > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">
                                  {counts.alta} alta
                                </span>
                              )}
                              {counts.media > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-duppla-orange bg-duppla-orange/10 px-2 py-0.5 rounded-md">
                                  {counts.media} media
                                </span>
                              )}
                              {counts.baja > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                  {counts.baja} baja
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs h-7"
                              onClick={() => handleAnalizarIA(inm)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Analizar con IA
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        )}

        {/* ─── Historial View ─── */}
        {view === "historial" && (
          <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold text-foreground">Historial de Cambios</h1>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filtrar por inmueble…"
                  value={historialFilterInmueble}
                  onChange={(e) => setHistorialFilterInmueble(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filtrar por usuario…"
                  value={historialFilterUsuario}
                  onChange={(e) => setHistorialFilterUsuario(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {historialLoading ? (
              <Skeleton className="h-64 rounded-lg" />
            ) : filteredHistorial.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                  <History className="w-10 h-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No hay cambios registrados aún.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Fecha</TableHead>
                      <TableHead className="text-xs">Inmueble</TableHead>
                      <TableHead className="text-xs">Campo</TableHead>
                      <TableHead className="text-xs">Valor Anterior</TableHead>
                      <TableHead className="text-xs">Valor Nuevo</TableHead>
                      <TableHead className="text-xs">Aprobó</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistorial.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(h.created_at).toLocaleDateString("es-CO", {
                            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-mono">{h.codigo_inmueble}</TableCell>
                        <TableCell className="text-xs font-medium">{h.campo_corregido}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{h.valor_anterior || "—"}</TableCell>
                        <TableCell className="text-xs font-medium text-primary">{h.valor_nuevo || "—"}</TableCell>
                        <TableCell className="text-xs">{h.aprobado_por}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* ─── AI Analysis Sheet ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">
              Análisis IA — {selectedInmueble?.codigo}
            </SheetTitle>
          </SheetHeader>

          {analyzingIA && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground text-center">
                Analizando documentos con IA…<br />
                <span className="text-xs">esto puede tardar hasta 1 minuto</span>
              </p>
            </div>
          )}

          {!analyzingIA && analisisIA && (
            <div className="space-y-6 mt-4">
              {/* SF current data */}
              {analisisIA.datos_actuales_sf && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Datos actuales en SF</h3>
                  <div className="bg-muted rounded-lg p-3 space-y-1">
                    {Object.entries(analisisIA.datos_actuales_sf).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{key}</span>
                        <span className={cn("font-mono", !val && "bg-accent/30 px-1 rounded text-accent-foreground")}>
                          {val ? String(val) : "vacío"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {(analisisIA.documentos_analizados?.length || analisisIA.documentos_faltantes?.length) ? (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Documentos</h3>
                  <div className="space-y-1">
                    {analisisIA.documentos_analizados?.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        <span className="text-foreground">{doc}</span>
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">Analizado</Badge>
                      </div>
                    ))}
                    {analisisIA.documentos_faltantes?.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <FileX className="w-3.5 h-3.5 text-destructive" />
                        <span className="text-muted-foreground">{doc}</span>
                        <Badge variant="destructive" className="text-[10px]">Faltante</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Discrepancies from IA */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Discrepancias IA ({analisisIA.discrepancias?.length || 0})
                </h3>
                {!analisisIA.discrepancias?.length ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Sin discrepancias adicionales detectadas por IA
                  </div>
                ) : (
                  <div className="space-y-2">
                    {analisisIA.discrepancias.map((disc, idx) => (
                      <Card key={idx} className="border-l-4" style={{
                        borderLeftColor: (disc.severidad || "").toLowerCase() === "alta"
                          ? "hsl(var(--destructive))"
                          : (disc.severidad || "").toLowerCase() === "media"
                            ? "hsl(var(--accent))"
                            : "hsl(var(--muted))"
                      }}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-foreground">{disc.campo}</p>
                              {disc.descripcion && <p className="text-[11px] text-muted-foreground">{disc.descripcion}</p>}
                            </div>
                            {disc.severidad && (
                              <Badge className={cn("text-[10px]", severidadColor(disc.severidad))}>
                                {disc.severidad}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-[11px]">
                            <div>
                              <span className="text-muted-foreground">SF: </span>
                              <span className="font-mono">{disc.valor_actual || "vacío"}</span>
                            </div>
                            {disc.valor_documento && (
                              <div>
                                <span className="text-muted-foreground">Documento: </span>
                                <span className="font-mono text-primary">{disc.valor_documento}</span>
                              </div>
                            )}
                          </div>
                          {disc.fuente && (
                            <p className="text-[10px] text-muted-foreground">Fuente: {disc.fuente}</p>
                          )}
                          {disc.valor_documento && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs h-7 mt-1"
                              onClick={() => openFixModal(disc)}
                            >
                              <Wrench className="w-3 h-3" />
                              Corregir en SF
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Local discrepancies for context */}
              {selectedInmueble && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Problemas detectados localmente ({selectedInmueble.discrepancias.length})
                  </h3>
                  <div className="space-y-1">
                    {selectedInmueble.discrepancias.map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-[10px] px-1.5", severidadColor(d.severidad || "baja"))}>
                            {d.severidad || "baja"}
                          </Badge>
                          <span className="font-medium text-foreground">{d.campo}</span>
                        </div>
                        <span className="text-muted-foreground text-[11px]">{d.tipo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historial for this inmueble */}
              {inmuebleHistorial.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Cambios previos</h3>
                  <div className="space-y-1">
                    {inmuebleHistorial.map((h) => (
                      <div key={h.id} className="flex justify-between text-[11px] py-1 border-b last:border-0">
                        <div>
                          <span className="font-medium">{h.campo_corregido}</span>
                          <span className="text-muted-foreground ml-2">{h.valor_anterior} → {h.valor_nuevo}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {new Date(h.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Fix Confirmation Modal ─── */}
      <Dialog open={fixModalOpen} onOpenChange={setFixModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar corrección en Salesforce</DialogTitle>
            <DialogDescription>
              Se actualizará el siguiente campo en Salesforce.
            </DialogDescription>
          </DialogHeader>

          {fixDiscrepancia && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs text-muted-foreground">Campo</label>
                  <p className="font-medium text-foreground">{fixDiscrepancia.campo}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Fuente</label>
                  <p className="text-foreground">{fixDiscrepancia.fuente || "—"}</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Valor actual (SF)</label>
                <p className="font-mono text-sm text-muted-foreground bg-muted px-2 py-1 rounded mt-1">
                  {fixDiscrepancia.valor_actual || "vacío"}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Valor nuevo (editable)</label>
                <Input
                  value={fixValorNuevo}
                  onChange={(e) => setFixValorNuevo(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Aprobador</label>
                <p className="text-sm text-foreground">usuario@duppla.co</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFixModalOpen(false)} disabled={fixingInProgress}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmFix} disabled={fixingInProgress || !fixValorNuevo}>
              {fixingInProgress && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirmar corrección
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
