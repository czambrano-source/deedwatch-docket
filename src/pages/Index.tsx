import { useState, useMemo, useEffect } from "react";
import { Building2, Loader2, Search, CheckCircle2, Clock, TrendingUp, Hash, FileText, MapPin, DollarSign, ExternalLink, Calendar as CalendarIcon, Layers, Car, Package, AlertTriangle, X, Upload, Receipt, Eye, MessageSquare, ChevronDown } from "lucide-react";
import { useInmuebles, usePagos, useRecibos, useNotas } from "@/hooks/useInmuebles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { KpiCard } from "@/components/predial/KpiCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RegistrarPagoModal } from "@/components/predial/RegistrarPagoModal";
import { RegistrarReciboModal } from "@/components/predial/RegistrarReciboModal";
import { VerReciboModal } from "@/components/predial/VerReciboModal";
import { NotasModal } from "@/components/predial/NotasModal";
import { VerPagoModal } from "@/components/predial/VerPagoModal";
import { InconsistenciasModal, getInconsistencias } from "@/components/predial/InconsistenciasModal";
import { SinFechaEscrituraModal, getSinFechaEscritura } from "@/components/predial/SinFechaEscrituraModal";
import { CtlInconsistenciasModal, getCtlInconsistencias } from "@/components/predial/CtlInconsistenciasModal";
import type { Inmueble } from "@/types/inmueble";

const getFiduciariaName = (inmueble: Inmueble) => {
  return (inmueble as any).Fiduciaria__r?.Name ?? inmueble.Fiduciaria__c ?? "—";
};

type ModalType = "pago" | "verPago" | "notas" | "recibo" | "verRecibo";
type TipoPredio = "inmueble" | "parqueadero" | "deposito";


const Index = () => {
  const { data: inmuebles = [], isLoading: loadingInmuebles } = useInmuebles();
  const { data: pagos = [], isLoading: loadingPagos } = usePagos();
  const { data: recibos = [] } = useRecibos();
  const { data: notas = [] } = useNotas();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pagado" | "pendiente">("all");
  const [fiduciariaFilter, setFiduciariaFilter] = useState<string>("all");
  const [ciudadFilter, setCiudadFilter] = useState<string>("all");
  const [anioDesde, setAnioDesde] = useState<string>("all");
  const [anioHasta, setAnioHasta] = useState<string>("all");
  const [incluirSinFecha, setIncluirSinFecha] = useState(true);
  const [vigencia, setVigencia] = useState<number>(new Date().getFullYear());
  const [conReciboFilter, setConReciboFilter] = useState(false);

  // Modal state
  const [activeModal, setActiveModal] = useState<{ type: ModalType; tipoPredio: TipoPredio } | null>(null);
  const [showInconsistencias, setShowInconsistencias] = useState(false);
  const [showSinFechaEscritura, setShowSinFechaEscritura] = useState(false);
  const [showCtlInconsistencias, setShowCtlInconsistencias] = useState(false);

  // Pago incluido state (local toggle per session, in real app could be persisted)
  const [pagoIncluidoParq, setPagoIncluidoParq] = useState<Record<string, boolean>>({});
  const [pagoIncluidoDep, setPagoIncluidoDep] = useState<Record<string, boolean>>({});

  // CTL source (compra vs fiducia) from Supabase
  const [ctlSources, setCtlSources] = useState<Record<string, any>>({});
  useEffect(() => {
    if (!selectedId) { setCtlSources({}); return; }
    (async () => {
      try {
        const { data } = await supabase.from("ctl_source").select("bloque,tipo_ctl,fecha_ctl").eq("salesforce_id", selectedId);
        if (data) {
          const map: Record<string, any> = {};
          data.forEach((r: any) => { map[r.bloque] = { tipo: r.tipo_ctl, fecha: r.fecha_ctl }; });
          setCtlSources(map);
        }
      } catch {}
    })();
  }, [selectedId]);
  const esCtlR2O = (bloque: string) => ctlSources[bloque]?.tipo === 'fiducia';
  const ctlLabel = (bloque: string) => esCtlR2O(bloque) ? 'CTL actualizado R2O' : 'Información CTL de compra, no registra CTL actualizado R2O';
  const tieneCtlSource = (bloque: string) => !!ctlSources[bloque];

  const isLoading = loadingInmuebles || loadingPagos;
  const total = inmuebles.length;

  // Filter pagos by selected vigencia year
  const pagosVigencia = pagos.filter((p) => p.anio_vigencia === vigencia);

  // Helper: check if a specific tipo_predio has a payment for the selected vigencia
  const hasPago = (sfId: string, tipo: TipoPredio) =>
    pagosVigencia.some((p) => p.salesforce_id === sfId && (p as any).tipo_predio === tipo && p.estado === "Pagado");

  const montoRecaudado = pagosVigencia.filter((p) => p.estado === "Pagado").reduce((s, p) => s + (p.valor_pago ?? 0), 0);

  const formatCurrency = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  // Check if inmueble has parqueadero — any related field with data counts
  const hasParqueadero = (i: Inmueble) => {
    if (i.Parqueadero__c != null && i.Parqueadero__c > 0) return true;
    if (i.numero_del_parqueadero__c && i.numero_del_parqueadero__c !== "N/A" && i.numero_del_parqueadero__c !== "No tiene" && i.numero_del_parqueadero__c !== "SIN_MATRICULA") return true;
    if (i.No_Matricula_Inmo_Parqueadero__c && i.No_Matricula_Inmo_Parqueadero__c !== "N/A" && i.No_Matricula_Inmo_Parqueadero__c !== "No tiene" && i.No_Matricula_Inmo_Parqueadero__c !== "SIN_MATRICULA") return true;
    if (i.chip_parqueadero__c && i.chip_parqueadero__c !== "-" && i.chip_parqueadero__c !== "SIN_CHIP" && i.chip_parqueadero__c !== "N/A" && i.chip_parqueadero__c !== "No tiene" && i.chip_parqueadero__c !== "SIN_MATRICULA") return true;
    return false;
  };
  const hasDeposito = (i: Inmueble) => {
    if (i.Deposito__c && i.Deposito__c !== "No" && i.Deposito__c !== "0" && i.Deposito__c !== "N/A" && i.Deposito__c !== "No tiene" && i.Deposito__c !== "SIN_MATRICULA") return true;
    if (i.No_Matricula_Inmo_Deposito__c && i.No_Matricula_Inmo_Deposito__c !== "N/A" && i.No_Matricula_Inmo_Deposito__c !== "No tiene" && i.No_Matricula_Inmo_Deposito__c !== "SIN_MATRICULA") return true;
    if (i.chip_deposito__c && i.chip_deposito__c !== "-" && i.chip_deposito__c !== "SIN_CHIP" && i.chip_deposito__c !== "N/A" && i.chip_deposito__c !== "No tiene" && i.chip_deposito__c !== "SIN_MATRICULA") return true;
    return false;
  };

  // Helper: check if a field has valid alphanumeric data (not N/A, No tiene, empty, -, SIN_CHIP)
  const isValidField = (val?: string | number | null): boolean => {
    if (val == null) return false;
    if (typeof val !== 'string') return false;
    const normalized = val.trim().toLowerCase();
    return normalized !== "" && normalized !== "n/a" && normalized !== "no tiene" && normalized !== "-" && normalized !== "sin_chip" && normalized !== "sin_matricula";
  };

  // Show CTL only if both Matrícula and Chip have valid alphanumeric data
  const showCtlInmueble = (i: Inmueble) => isValidField(i.Numero_matricula_inmobiliaria__c) || isValidField(i.chip_apartamento__c);
  const showCtlParqueadero = (i: Inmueble) => isValidField(i.No_Matricula_Inmo_Parqueadero__c) || isValidField(i.chip_parqueadero__c);
  const showCtlDeposito = (i: Inmueble) => isValidField(i.No_Matricula_Inmo_Deposito__c) || isValidField(i.chip_deposito__c);

  // Necesita pago separado = tiene matrícula o chip independiente (no SIN_MATRICULA/SIN_CHIP)
  const needsSeparatePaymentParq = (i: Inmueble) => {
    if (!hasParqueadero(i)) return false;
    return isValidField(i.No_Matricula_Inmo_Parqueadero__c) || isValidField(i.chip_parqueadero__c);
  };
  const needsSeparatePaymentDep = (i: Inmueble) => {
    if (!hasDeposito(i)) return false;
    return isValidField(i.No_Matricula_Inmo_Deposito__c) || isValidField(i.chip_deposito__c);
  };

  // Combined status: "completo" if all applicable blocks are paid/included, "pendiente" otherwise
  const getOverallStatus = (i: Inmueble) => {
    const inmPaid = hasPago(i.Id, "inmueble");
    if (!inmPaid) return "pendiente";
    const needsParq = needsSeparatePaymentParq(i);
    const needsDep = needsSeparatePaymentDep(i);
    if (needsParq && !hasPago(i.Id, "parqueadero") && !pagoIncluidoParq[i.Id]) return "pendiente";
    if (needsDep && !hasPago(i.Id, "deposito") && !pagoIncluidoDep[i.Id]) return "pendiente";
    return "completo";
  };

  // Count using overall status (all blocks must be paid/included)
  const pagadosCount = inmuebles.filter((i) => getOverallStatus(i) === "completo").length;
  const pendientes = total - pagadosCount;
  const pctPagados = total > 0 ? Math.round((pagadosCount / total) * 100) : 0;

  // Unique values for filter dropdowns
  const fiduciarias = useMemo(() => {
    const set = new Set<string>();
    inmuebles.forEach((i) => { const name = getFiduciariaName(i); if (name !== "—") set.add(name); });
    return Array.from(set).sort();
  }, [inmuebles]);

  const ciudades = useMemo(() => {
    const set = new Set<string>();
    inmuebles.forEach((i) => { if (i.Municipio_del__c) set.add(i.Municipio_del__c); });
    return Array.from(set).sort();
  }, [inmuebles]);

  const aniosDisponibles = useMemo(() => {
    const years: number[] = [];
    for (let y = 2020; y <= 2035; y++) years.push(y);
    return years;
  }, []);

  // Helper: check if inmueble has at least one recibo for any tipo_predio in current vigencia
  const hasAnyRecibo = (sfId: string) =>
    recibos.some((r) => r.salesforce_id === sfId && r.anio_vigencia === vigencia);

  const conReciboCount = useMemo(() => inmuebles.filter((i) => hasAnyRecibo(i.Id)).length, [inmuebles, recibos, vigencia]);

  const hasActiveFilters = fiduciariaFilter !== "all" || ciudadFilter !== "all" || anioDesde !== "all" || anioHasta !== "all" || conReciboFilter;

  const filtered = inmuebles.filter((i) => {
    const q = search.toLowerCase();
    const matchesSearch = i.Name?.toLowerCase().includes(q) || i.Id?.toLowerCase().includes(q) || i.Ciudad_Inmueble__c?.toLowerCase().includes(q) || i.Opportunity__r?.Name?.toLowerCase().includes(q) || i.chip_apartamento__c?.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (statusFilter === "pagado" && getOverallStatus(i) !== "completo") return false;
    if (statusFilter === "pendiente" && getOverallStatus(i) === "completo") return false;
    if (fiduciariaFilter !== "all" && getFiduciariaName(i) !== fiduciariaFilter) return false;
    if (ciudadFilter !== "all" && i.Municipio_del__c !== ciudadFilter) return false;
    if (anioDesde !== "all" || anioHasta !== "all") {
      const fechaStr = i.Legales__r?.records?.[0]?.Fecha_firma_escritura__c;
      if (!fechaStr) return incluirSinFecha;
      const year = new Date(fechaStr).getFullYear();
      if (anioDesde !== "all" && year < Number(anioDesde)) return false;
      if (anioHasta !== "all" && year > Number(anioHasta)) return false;
    }
    if (conReciboFilter && !hasAnyRecibo(i.Id)) return false;
    return true;
  }).sort((a, b) => (a.Name ?? "").localeCompare(b.Name ?? "", "es"));

  const selected = inmuebles.find((i) => i.Id === selectedId) ?? null;

  const openModal = (type: ModalType, tipoPredio: TipoPredio) => setActiveModal({ type, tipoPredio });
  const closeModal = () => setActiveModal(null);

  // Status badge per block
  const StatusBadge = ({ sfId, tipo, inmueble }: { sfId: string; tipo: TipoPredio; inmueble: Inmueble }) => {
    if (tipo === "parqueadero" && !hasParqueadero(inmueble)) {
      return <Badge variant="outline" className="text-xs text-muted-foreground">No aplica</Badge>;
    }
    if (tipo === "deposito" && !hasDeposito(inmueble)) {
      return <Badge variant="outline" className="text-xs text-muted-foreground">No aplica</Badge>;
    }

    const paid = hasPago(sfId, tipo);
    const incluidoParq = tipo === "parqueadero" && (pagoIncluidoParq[sfId] || !needsSeparatePaymentParq(inmueble));
    const incluidoDep = tipo === "deposito" && (pagoIncluidoDep[sfId] || !needsSeparatePaymentDep(inmueble));
    const isIncluido = incluidoParq || incluidoDep;

    if (paid || isIncluido) {
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-green bg-duppla-green-light px-2.5 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> {paid ? "Pagado" : "Incluido en Inmueble"}</span>;
    }
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pago Pendiente</span>;
  };

  const hasRecibo = (sfId: string, tipo: TipoPredio) =>
    recibos.some((r) => r.salesforce_id === sfId && r.tipo_predio === tipo && r.anio_vigencia === vigencia);

  // Tipo doc maps for preview
  const pagoDocMap: Record<string, string> = {
    inmueble: "factura_impuesto_predial_r2o",
    parqueadero: "factura_de_impuesto_predial_parqueadero_r2o",
    deposito: "factura_impuesto_predial_deposito_r2o",
  };
  const reciboDocMap: Record<string, string> = {
    inmueble: "recibo_pago_predial_r2o",
    parqueadero: "recibo_pago_del_predial_del_parqueadero_r2o",
    deposito: "recibo_pago_predial_deposito_r2o",
  };

  // Preview doc button - calls Alejandría to open the document for the selected vigencia
  const PreviewDocButton = ({ salesforceId, tipoDoc, label }: { salesforceId: string; tipoDoc: string; label: string }) => {
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("preview-predial-alejandria", {
          body: { id_inmueble: salesforceId, tipo_doc: tipoDoc, vigencia: String(vigencia) },
        });
        if (error || !data?.found) {
          toast.error("Documento no encontrado en Alejandría");
          return;
        }
        // TODO: Reemplazar URL cuando ing. de sistemas provea endpoint de signed URL
        window.open(`https://back.duppla.co/app-administraciones/documento/${data.documento_id}/url`, "_blank");
      } catch {
        toast.error("Error al buscar documento");
      } finally {
        setLoading(false);
      }
    };
    return (
      <Button size="sm" variant="ghost" onClick={handleClick} disabled={loading} className="px-1.5 h-7" title={label}>
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
      </Button>
    );
  };

  // Action buttons column
  const ActionButtons = ({ tipoPredio, sfId }: { tipoPredio: TipoPredio; sfId: string }) => {
    const reciboExists = hasRecibo(sfId, tipoPredio);
    return (
      <div className="w-[180px] flex-shrink-0 border-l pl-5 flex flex-col gap-2 justify-center">
        <p className="text-xs text-muted-foreground font-medium mb-1">Gestión Predial</p>
        <Button size="sm" onClick={() => openModal("pago", tipoPredio)} className="w-full bg-primary hover:bg-primary/90 text-xs">
          <DollarSign className="w-3 h-3 mr-1" /> Registrar Pago
        </Button>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => openModal("verPago", tipoPredio)} className="flex-1 text-xs">
            <ExternalLink className="w-3 h-3 mr-1" /> Ver Pago
          </Button>
          <PreviewDocButton salesforceId={sfId} tipoDoc={pagoDocMap[tipoPredio]} label="Ver factura" />
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={reciboExists ? "default" : "ghost"}
            onClick={() => reciboExists ? openModal("verRecibo", tipoPredio) : openModal("recibo", tipoPredio)}
            className={cn("flex-1 text-xs", reciboExists ? "bg-duppla-green hover:bg-duppla-green/90" : "border border-dashed border-muted-foreground/40")}
          >
            {reciboExists ? <><Receipt className="w-3 h-3 mr-1" /> Recibo</> : <><Upload className="w-3 h-3 mr-1" /> Recibo</>}
          </Button>
          <PreviewDocButton salesforceId={sfId} tipoDoc={reciboDocMap[tipoPredio]} label="Ver recibo" />
        </div>
        <Button size="sm" variant="secondary" onClick={() => openModal("notas", tipoPredio)} className="w-full text-xs">
          <MessageSquare className="w-3 h-3 mr-1" /> Notas
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav is rendered by App.tsx */}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Resumen */}
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" /> Gestión de Prediales
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">Vista general y gestión de impuestos prediales</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Vigencia:</span>
                  <Select value={String(vigencia)} onValueChange={(v) => setVigencia(Number(v))}>
                    <SelectTrigger className="w-[100px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 16 }, (_, i) => 2020 + i).map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="Total Inmuebles" value={total} subtitle="En Duppla" icon={Building2} iconBg="bg-duppla-blue-light" iconColor="text-duppla-blue" onClick={() => { setStatusFilter("all"); setSelectedId(null); }} active={statusFilter === "all"} />
              <KpiCard title="Prediales Pagados" value={pagadosCount} subtitle="Registrados" icon={CheckCircle2} iconBg="bg-duppla-green-light" iconColor="text-duppla-green" onClick={() => { const next = statusFilter === "pagado" ? "all" : "pagado"; setStatusFilter(next); setSelectedId(null); }} active={statusFilter === "pagado"} />
              <KpiCard title="Pendientes" value={pendientes} subtitle="Sin registro" icon={Clock} iconBg="bg-duppla-orange-light" iconColor="text-duppla-orange" onClick={() => { const next = statusFilter === "pendiente" ? "all" : "pendiente"; setStatusFilter(next); setSelectedId(null); }} active={statusFilter === "pendiente"} />
              <KpiCard title="Monto Total Pagado" value={formatCurrency(montoRecaudado)} subtitle="Total pagado" icon={TrendingUp} iconBg="bg-duppla-green-light" iconColor="text-duppla-green" />
            </div>
            <div className="bg-card rounded-lg border px-4 py-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{pctPagados}% completado — Vigencia {vigencia}</span>
                <span className="text-muted-foreground">{pagadosCount} de {total}</span>
              </div>
              <Progress value={pctPagados} className="h-2" />
            </div>
            <div className="flex gap-2">
              {(() => {
                const count = getInconsistencias(inmuebles).length;
                if (count === 0) return null;
                return (
                  <button
                    onClick={() => setShowInconsistencias(true)}
                    className="flex-1 flex items-center gap-2 bg-duppla-orange/10 border border-duppla-orange/30 rounded-lg px-3 py-2 text-left transition-colors hover:bg-duppla-orange/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-duppla-orange flex-shrink-0" />
                    <p className="text-xs font-medium text-foreground">
                      {count} inconsistencia{count !== 1 ? "s" : ""} en Parqueaderos / Depósitos
                    </p>
                  </button>
                );
              })()}
              {(() => {
                const sinFechaCount = getSinFechaEscritura(inmuebles).length;
                if (sinFechaCount === 0) return null;
                return (
                  <button
                    onClick={() => setShowSinFechaEscritura(true)}
                    className="flex-1 flex items-center gap-2 bg-duppla-blue/10 border border-duppla-blue/30 rounded-lg px-3 py-2 text-left transition-colors hover:bg-duppla-blue/20"
                  >
                    <CalendarIcon className="w-4 h-4 text-duppla-blue flex-shrink-0" />
                    <p className="text-xs font-medium text-foreground">
                      {sinFechaCount} inmueble{sinFechaCount !== 1 ? "s" : ""} sin fecha de escritura
                    </p>
                  </button>
                );
              })()}
              {(() => {
                const ctlCount = getCtlInconsistencias(inmuebles).length;
                if (ctlCount === 0) return null;
                return (
                  <button
                    onClick={() => setShowCtlInconsistencias(true)}
                    className="flex-1 flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-left transition-colors hover:bg-destructive/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <p className="text-xs font-medium text-foreground">
                      ⚠️ {ctlCount} inconsistencia{ctlCount !== 1 ? "s" : ""} en datos de CTL
                    </p>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Master-Detail */}
          <div className="border-t px-6 pb-6 pt-4 max-w-7xl mx-auto">
            <div className="flex rounded-xl border overflow-hidden" style={{ height: "calc(100vh - 20rem)" }}>
              {/* List */}
              <div className="w-[380px] flex-shrink-0 border-r bg-card flex flex-col rounded-tl-xl">
                <div className="p-4 border-b space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground text-sm">Inmuebles ({filtered.length})</h2>
                    {hasActiveFilters && (
                      <button onClick={() => { setFiduciariaFilter("all"); setCiudadFilter("all"); setAnioDesde("all"); setAnioHasta("all"); setConReciboFilter(false); }} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <X className="w-3 h-3" /> Limpiar filtros
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por código, cliente, edificio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <Select value={fiduciariaFilter} onValueChange={setFiduciariaFilter}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Fiduciaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las fiduciarias</SelectItem>
                        {fiduciarias.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={ciudadFilter} onValueChange={setCiudadFilter}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los municipios</SelectItem>
                        {ciudades.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Select value={anioDesde} onValueChange={setAnioDesde}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Desde año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Escritura desde</SelectItem>
                        {aniosDisponibles.map((y) => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={anioHasta} onValueChange={setAnioHasta}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Hasta año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Escritura hasta</SelectItem>
                        {aniosDisponibles.map((y) => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(anioDesde !== "all" || anioHasta !== "all") && (
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <Checkbox checked={incluirSinFecha} onCheckedChange={(v) => setIncluirSinFecha(!!v)} className="h-3.5 w-3.5" />
                      Incluir sin fecha de escritura
                    </label>
                  )}
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox checked={conReciboFilter} onCheckedChange={(v) => { setConReciboFilter(!!v); setSelectedId(null); }} className="h-3.5 w-3.5" />
                    <Receipt className="w-3 h-3" /> Con recibo adjunto ({conReciboCount})
                  </label>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filtered.map((inmueble) => {
                    const status = getOverallStatus(inmueble);
                    const isSel = selectedId === inmueble.Id;
                    return (
                      <button key={inmueble.Id} onClick={() => setSelectedId(inmueble.Id)} className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${isSel ? "bg-duppla-green-light border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{inmueble.Name}</p>
                            <p className="text-xs text-muted-foreground truncate">{inmueble.Opportunity__r?.Name ?? "—"}</p>
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            {status === "completo" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-green bg-duppla-green-light px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Completo</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm p-8">No se encontraron inmuebles</p>}
                </div>
              </div>

              {/* Detail */}
              <div className="flex-1 overflow-y-auto bg-background p-6">
                {!selected ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto"><Building2 className="w-8 h-8 text-muted-foreground" /></div>
                      <p className="text-muted-foreground font-medium">Selecciona un inmueble para ver detalles</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><Building2 className="w-6 h-6 text-muted-foreground" /></div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">{selected.Name}</h2>
                          <p className="text-sm text-muted-foreground">{selected.Opportunity__r?.Name ?? "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selected.Proceso_entrega_inmueble__c && <Badge variant="outline" className="border-primary text-primary">{selected.Proceso_entrega_inmueble__c}</Badge>}
                        {getOverallStatus(selected) === "completo" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-green bg-duppla-green-light px-3 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Completo</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                        )}
                      </div>
                    </div>

                    {/* Inmueble Block */}
                    <div className="bg-card rounded-xl border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> Información del Inmueble</h3>
                        <StatusBadge sfId={selected.Id} tipo="inmueble" inmueble={selected} />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                          <DItem label="Fiduciaria" value={getFiduciariaName(selected)} icon={Building2} />
                          <DItem label="Tipo de inmueble" value={selected.Tipo_de_inmueble__c} icon={Building2} />
                          <DItem label="Municipio" value={selected.Municipio_del__c} icon={MapPin} />
                          <DItem label="Número de apartamento" value={selected.Numero_de_apartamento__c} icon={Building2} />
                          <DItem label="Departamento" value={selected.Departamento__c} icon={MapPin} />
                          <DItem label="Torre" value={selected.Torre__c} icon={Layers} />
                          <DItem label="Ciudad Inmueble" value={selected.Ciudad_Inmueble__c} icon={MapPin} />
                          <DItem label="No. Matricula Inmo Apto" value={selected.Numero_matricula_inmobiliaria__c} icon={FileText} />
                          <DItem label="Dirección" value={selected.Direccion__c} icon={MapPin} />
                          <DItem label="Chip Apartamento" value={selected.chip_apartamento__c === "SIN_CHIP" ? "Sin asignar" : (selected.chip_apartamento__c || "Sin asignar")} icon={Hash} />
                          <DItem label="Nombre de edificio o conjunto" value={selected.Nombre_de_edificio_o_conjunto__c} icon={Building2} />
                          {(() => {
                            const pagoInm = pagos.find((p) => p.salesforce_id === selected.Id && (p as any).tipo_predio === "inmueble" && p.estado === "Pagado");
                            return <DItem label="Avalúo Catastral" value={pagoInm?.valor_avaluo ? formatCurrency(pagoInm.valor_avaluo) : undefined} icon={DollarSign} />;
                          })()}
                          <DItem label="Fecha Firma Escritura" value={selected.Legales__r?.records?.[0]?.Fecha_firma_escritura__c ?? undefined} icon={CalendarIcon} />
                        </div>
                        <ActionButtons tipoPredio="inmueble" sfId={selected.Id} />
                      </div>
                      {/* CTL Inmueble */}
                      {showCtlInmueble(selected) && (
                        <div className="border-t border-border/40 pt-3 mt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> CTL Apto</h3>
                            {((selected as any).tiene_ctl_fiducia || tieneCtlSource('inmueble')) ? (
                              tieneCtlSource('inmueble') ? (
                                <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full", esCtlR2O('inmueble') ? "text-primary bg-duppla-green-light" : "text-duppla-orange bg-duppla-orange/10")}>{esCtlR2O('inmueble') ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} {ctlLabel('inmueble')}</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full text-primary bg-duppla-green-light"><CheckCircle2 className="w-3 h-3" /> En Alejandría</span>
                              )
                            ) : !selected.nombre_ctl_inmueble__c && !selected.nit_ctl_inmueble__c ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                            ) : null}
                          </div>
                          <div className="space-y-1">
                            <DItem label="Nombre" value={selected.nombre_ctl_inmueble__c} icon={FileText} />
                            <DItem label="NIT" value={selected.nit_ctl_inmueble__c} icon={Hash} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Parqueadero Block */}
                    <div className="bg-card rounded-xl border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><Car className="w-4 h-4 text-primary" /> Información Parqueadero</h3>
                        <StatusBadge sfId={selected.Id} tipo="parqueadero" inmueble={selected} />
                      </div>
                      {(selected.Parqueadero__c == null || selected.Parqueadero__c === 0) ? (
                        <DItem label="Parqueadero" value="No" icon={Car} />
                      ) : (
                        <>
                          <div className="flex gap-4 items-start">
                            <div className="flex-1 space-y-1.5">
                              <DItem label="Parqueadero" value={`Sí (${selected.Parqueadero__c})`} icon={Car} />
                              <DItem label="Número del parqueadero" value={selected.numero_del_parqueadero__c} icon={Hash} />
                              <DItem label="No. Matricula Inmo Parqueadero" value={selected.No_Matricula_Inmo_Parqueadero__c} icon={FileText} />
                              <DItem label="Chip Parqueadero" value={selected.chip_parqueadero__c} icon={Hash} />
                            </div>
                            {needsSeparatePaymentParq(selected) ? (
                            <div className="w-[180px] flex-shrink-0 border-l pl-5 flex flex-col gap-2 justify-center">
                              <p className="text-xs text-muted-foreground font-medium mb-1">Gestión Predial</p>
                              <Button size="sm" onClick={() => openModal("pago", "parqueadero")} className="w-full bg-primary hover:bg-primary/90 text-xs">
                                <DollarSign className="w-3 h-3 mr-1" /> Registrar Pago
                              </Button>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => openModal("verPago", "parqueadero")} className="flex-1 text-xs">
                                  <ExternalLink className="w-3 h-3 mr-1" /> Ver Pago
                                </Button>
                                <PreviewDocButton salesforceId={selected.Id} tipoDoc={pagoDocMap.parqueadero} label="Ver factura" />
                              </div>
                              {(() => {
                                const reciboExists = hasRecibo(selected.Id, "parqueadero");
                                return (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant={reciboExists ? "default" : "ghost"}
                                      onClick={() => reciboExists ? openModal("verRecibo", "parqueadero") : openModal("recibo", "parqueadero")}
                                      className={cn("flex-1 text-xs", reciboExists ? "bg-duppla-green hover:bg-duppla-green/90" : "border border-dashed border-muted-foreground/40")}
                                    >
                                      {reciboExists ? <><Receipt className="w-3 h-3 mr-1" /> Recibo</> : <><Upload className="w-3 h-3 mr-1" /> Recibo</>}
                                    </Button>
                                    <PreviewDocButton salesforceId={selected.Id} tipoDoc={reciboDocMap.parqueadero} label="Ver recibo" />
                                  </div>
                                );
                              })()}
                              <Button size="sm" variant="secondary" onClick={() => openModal("notas", "parqueadero")} className="w-full text-xs">
                                <MessageSquare className="w-3 h-3 mr-1" /> Notas
                              </Button>
                            </div>
                            ) : null}
                          </div>
                          {/* CTL Parqueadero */}
                          {showCtlParqueadero(selected) && (
                            <div className="border-t border-border/40 pt-3 mt-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> CTL Parqueadero</h3>
                                {((selected as any).tiene_ctl_parqueadero || tieneCtlSource('parqueadero')) ? (
                                  tieneCtlSource('parqueadero') ? (
                                    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full", esCtlR2O('parqueadero') ? "text-primary bg-duppla-green-light" : "text-duppla-orange bg-duppla-orange/10")}>{esCtlR2O('parqueadero') ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} {ctlLabel('parqueadero')}</span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full text-primary bg-duppla-green-light"><CheckCircle2 className="w-3 h-3" /> En Alejandría</span>
                                  )
                                ) : !selected.nombre_ctl_parqueadero__c && !selected.nit_ctl_parqueadero__c ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                                ) : null}
                              </div>
                              <div className="space-y-1">
                                <DItem label="Nombre" value={selected.nombre_ctl_parqueadero__c} icon={FileText} />
                                <DItem label="NIT" value={selected.nit_ctl_parqueadero__c} icon={Hash} />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Depósito Block */}
                    <div className="bg-card rounded-xl border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><Package className="w-4 h-4 text-primary" /> Información Depósito</h3>
                        <StatusBadge sfId={selected.Id} tipo="deposito" inmueble={selected} />
                      </div>
                      {(!selected.Deposito__c || ["no", "0"].includes(selected.Deposito__c.trim().toLowerCase())) ? (
                        <DItem label="Depósito" value="No" icon={Package} />
                      ) : (
                        <>
                          <div className="flex gap-4 items-start">
                            <div className="flex-1 space-y-1.5">
                              <DItem label="Depósito" value={selected.Deposito__c} icon={Package} />
                              <DItem label="No. Matricula Inmo Depósito" value={selected.No_Matricula_Inmo_Deposito__c} icon={FileText} />
                              <DItem label="Chip Depósito" value={selected.chip_deposito__c} icon={Hash} />
                            </div>
                            {needsSeparatePaymentDep(selected) ? (
                            <div className="w-[180px] flex-shrink-0 border-l pl-5 flex flex-col gap-2 justify-center">
                              <p className="text-xs text-muted-foreground font-medium mb-1">Gestión Predial</p>
                              <Button size="sm" onClick={() => openModal("pago", "deposito")} className="w-full bg-primary hover:bg-primary/90 text-xs">
                                <DollarSign className="w-3 h-3 mr-1" /> Registrar Pago
                              </Button>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => openModal("verPago", "deposito")} className="flex-1 text-xs">
                                  <ExternalLink className="w-3 h-3 mr-1" /> Ver Pago
                                </Button>
                                <PreviewDocButton salesforceId={selected.Id} tipoDoc={pagoDocMap.deposito} label="Ver factura" />
                              </div>
                              {(() => {
                                const reciboExists = hasRecibo(selected.Id, "deposito");
                                return (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant={reciboExists ? "default" : "ghost"}
                                      onClick={() => reciboExists ? openModal("verRecibo", "deposito") : openModal("recibo", "deposito")}
                                      className={cn("flex-1 text-xs", reciboExists ? "bg-duppla-green hover:bg-duppla-green/90" : "border border-dashed border-muted-foreground/40")}
                                    >
                                      {reciboExists ? <><Receipt className="w-3 h-3 mr-1" /> Recibo</> : <><Upload className="w-3 h-3 mr-1" /> Recibo</>}
                                    </Button>
                                    <PreviewDocButton salesforceId={selected.Id} tipoDoc={reciboDocMap.deposito} label="Ver recibo" />
                                  </div>
                                );
                              })()}
                              <Button size="sm" variant="secondary" onClick={() => openModal("notas", "deposito")} className="w-full text-xs">
                                <MessageSquare className="w-3 h-3 mr-1" /> Notas
                              </Button>
                            </div>
                            ) : null}
                          </div>
                          {/* CTL Depósito */}
                          {showCtlDeposito(selected) && (
                            <div className="border-t border-border/40 pt-3 mt-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> CTL Bodega</h3>
                                {((selected as any).tiene_ctl_bodega || tieneCtlSource('bodega')) ? (
                                  tieneCtlSource('bodega') ? (
                                    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full", esCtlR2O('bodega') ? "text-primary bg-duppla-green-light" : "text-duppla-orange bg-duppla-orange/10")}>{esCtlR2O('bodega') ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} {ctlLabel('bodega')}</span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full text-primary bg-duppla-green-light"><CheckCircle2 className="w-3 h-3" /> En Alejandría</span>
                                  )
                                ) : !selected.nombre_ctl_bodega__c && !selected.nit_ctl_bodega__c ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                                ) : null}
                              </div>
                              <div className="space-y-1">
                                <DItem label="Nombre" value={selected.nombre_ctl_bodega__c} icon={FileText} />
                                <DItem label="NIT" value={selected.nit_ctl_bodega__c} icon={Hash} />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Notas Block - collapsible */}
                    <NotasBlock salesforceId={selected.Id} notas={notas} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selected && activeModal?.type === "pago" && (
        <RegistrarPagoModal open onClose={closeModal} inmueble={selected} tipoPredio={activeModal.tipoPredio} vigencia={vigencia} />
      )}
      {selected && activeModal?.type === "recibo" && (
        <RegistrarReciboModal open onClose={closeModal} inmueble={selected} tipoPredio={activeModal.tipoPredio} vigencia={vigencia} />
      )}
      {selected && activeModal?.type === "verPago" && (
        <VerPagoModal open onClose={closeModal} salesforceId={selected.Id} tipoPredio={activeModal.tipoPredio} nombreInmueble={selected.Name} />
      )}
      {selected && activeModal?.type === "verRecibo" && (
        <VerReciboModal open onClose={closeModal} salesforceId={selected.Id} tipoPredio={activeModal.tipoPredio} nombreInmueble={selected.Name} />
      )}
      {selected && activeModal?.type === "notas" && (
        <NotasModal open onClose={closeModal} salesforceId={selected.Id} tipoPredio={activeModal.tipoPredio} nombreInmueble={selected.Name} />
      )}
      <InconsistenciasModal open={showInconsistencias} onClose={() => setShowInconsistencias(false)} inmuebles={inmuebles} onSelectInmueble={setSelectedId} />
      <SinFechaEscrituraModal open={showSinFechaEscritura} onClose={() => setShowSinFechaEscritura(false)} inmuebles={inmuebles} onSelectInmueble={setSelectedId} />
      <CtlInconsistenciasModal open={showCtlInconsistencias} onClose={() => setShowCtlInconsistencias(false)} inmuebles={inmuebles} onSelectInmueble={setSelectedId} />
    </div>
  );
};

function NotasBlock({ salesforceId, notas }: { salesforceId: string; notas: { id: string; salesforce_id: string; tipo_predio: string; nota: string; created_at: string }[] }) {
  const [expanded, setExpanded] = useState(false);
  const notasInmueble = notas.filter((n) => n.salesforce_id === salesforceId);
  const count = notasInmueble.length;
  const tipoLabels: Record<string, string> = { inmueble: "Inmueble", parqueadero: "Parqueadero", deposito: "Depósito" };

  const grouped: Record<string, typeof notasInmueble> = {};
  notasInmueble.forEach((n) => {
    const key = n.tipo_predio || "inmueble";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  return (
    <div className="bg-card rounded-xl border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors rounded-xl"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-primary" /> Notas
          {count > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">{count}</Badge>
          )}
        </h3>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {count === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">Sin notas registradas</p>
          ) : (
            Object.entries(grouped).map(([tipo, items]) => (
              <div key={tipo} className="space-y-2">
                {Object.keys(grouped).length > 1 && (
                  <p className="text-xs font-medium text-muted-foreground">{tipoLabels[tipo] || tipo}</p>
                )}
                {items.map((n) => (
                  <div key={n.id} className="bg-muted/50 rounded-lg px-3 py-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-sm text-foreground">{n.nota}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function DItem({ label, value, icon: Icon }: { label: string; value?: string | null; icon: any }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export default Index;
