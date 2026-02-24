import { useState } from "react";
import { Building2, Loader2, Search, CheckCircle2, Clock, TrendingUp, Hash, FileText, MapPin, DollarSign, ExternalLink, Calendar, Layers, Car, Package } from "lucide-react";
import { useInmuebles, usePagos } from "@/hooks/useInmuebles";
import { KpiCard } from "@/components/predial/KpiCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RegistrarPagoModal } from "@/components/predial/RegistrarPagoModal";
import { NotasModal } from "@/components/predial/NotasModal";
import { VerPagoModal } from "@/components/predial/VerPagoModal";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

const FIDUCIARIA_MAP: Record<string, string> = {
  "a03Rb00000HG7TcIAL": "Accion Sociedad Fiduciaria SA",
  "a03Rb00000HGJGQIA5": "Alianza Fiduciaria SA",
};
const getFiduciariaName = (id?: string) => (id ? FIDUCIARIA_MAP[id] ?? id : "—");

type ModalType = "pago" | "verPago" | "notas";
type TipoPredio = "inmueble" | "parqueadero" | "deposito";

const Index = () => {
  const { data: inmuebles = [], isLoading: loadingInmuebles } = useInmuebles();
  const { data: pagos = [], isLoading: loadingPagos } = usePagos();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal state
  const [activeModal, setActiveModal] = useState<{ type: ModalType; tipoPredio: TipoPredio } | null>(null);

  // Pago incluido state (local toggle per session, in real app could be persisted)
  const [pagoIncluidoParq, setPagoIncluidoParq] = useState<Record<string, boolean>>({});
  const [pagoIncluidoDep, setPagoIncluidoDep] = useState<Record<string, boolean>>({});

  const isLoading = loadingInmuebles || loadingPagos;
  const total = inmuebles.length;

  // Helper: check if a specific tipo_predio has a payment
  const hasPago = (sfId: string, tipo: TipoPredio) =>
    pagos.some((p) => p.salesforce_id === sfId && (p as any).tipo_predio === tipo && p.estado === "Pagado");

  const pagadosCount = pagos.filter((p) => p.estado === "Pagado").length;
  const pendientes = total - new Set(pagos.filter((p) => p.estado === "Pagado").map((p) => p.salesforce_id)).size;
  const montoRecaudado = pagos.filter((p) => p.estado === "Pagado").reduce((s, p) => s + (p.valor_pago ?? 0), 0);
  const pctPagados = total > 0 ? Math.round((new Set(pagos.filter((p) => p.estado === "Pagado").map((p) => p.salesforce_id)).size / total) * 100) : 0;
  const formatCurrency = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  const filtered = inmuebles.filter((i) => {
    const q = search.toLowerCase();
    return i.Name?.toLowerCase().includes(q) || i.Id?.toLowerCase().includes(q) || i.Ciudad_Inmueble__c?.toLowerCase().includes(q) || i.Opportunity__r?.Name?.toLowerCase().includes(q) || i.chip_apartamento__c?.toLowerCase().includes(q);
  });

  const selected = inmuebles.find((i) => i.Id === selectedId) ?? null;

  const openModal = (type: ModalType, tipoPredio: TipoPredio) => setActiveModal({ type, tipoPredio });
  const closeModal = () => setActiveModal(null);

  // Combined status: "completo" if all applicable blocks are paid/included, "pendiente" otherwise
  const getOverallStatus = (i: Inmueble) => {
    const inmPaid = hasPago(i.Id, "inmueble");
    if (!inmPaid) return "pendiente";
    const needsParq = hasParqueadero(i);
    const needsDep = hasDeposito(i);
    if (needsParq && !hasPago(i.Id, "parqueadero") && !pagoIncluidoParq[i.Id]) return "pendiente";
    if (needsDep && !hasPago(i.Id, "deposito") && !pagoIncluidoDep[i.Id]) return "pendiente";
    return "completo";
  };

  // Status badge per block
  const StatusBadge = ({ sfId, tipo, inmueble }: { sfId: string; tipo: TipoPredio; inmueble: Inmueble }) => {
    // If parqueadero/deposito doesn't exist, show "No aplica"
    if (tipo === "parqueadero" && !hasParqueadero(inmueble)) {
      return <Badge variant="outline" className="text-xs text-muted-foreground">No aplica</Badge>;
    }
    if (tipo === "deposito" && !hasDeposito(inmueble)) {
      return <Badge variant="outline" className="text-xs text-muted-foreground">No aplica</Badge>;
    }

    const paid = hasPago(sfId, tipo);
    const incluidoParq = tipo === "parqueadero" && pagoIncluidoParq[sfId];
    const incluidoDep = tipo === "deposito" && pagoIncluidoDep[sfId];
    const isIncluido = incluidoParq || incluidoDep;

    if (paid || isIncluido) {
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-green bg-duppla-green-light px-2.5 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> {isIncluido ? "Incluido en Inmueble" : "Pagado"}</span>;
    }
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>;
  };

  // Action buttons column
  const ActionButtons = ({ tipoPredio, sfId }: { tipoPredio: TipoPredio; sfId: string }) => (
    <div className="w-[180px] flex-shrink-0 border-l pl-5 flex flex-col gap-2 justify-center">
      <p className="text-xs text-muted-foreground font-medium mb-1">Gestión Predial</p>
      <Button size="sm" onClick={() => openModal("pago", tipoPredio)} className="w-full bg-primary hover:bg-primary/90 text-xs">
        <DollarSign className="w-3 h-3 mr-1" /> Registrar Pago
      </Button>
      <Button size="sm" variant="outline" onClick={() => openModal("verPago", tipoPredio)} className="w-full text-xs">
        <ExternalLink className="w-3 h-3 mr-1" /> Ver Pago
      </Button>
      <Button size="sm" variant="secondary" onClick={() => openModal("notas", tipoPredio)} className="w-full text-xs">
        <FileText className="w-3 h-3 mr-1" /> Notas
      </Button>
    </div>
  );

  // Check if inmueble has parqueadero — any related field with data counts
  const hasParqueadero = (i: Inmueble) => {
    if (i.Parqueadero__c != null && i.Parqueadero__c > 0) return true;
    if (i.numero_del_parqueadero__c) return true;
    if (i.No_Matricula_Inmo_Parqueadero__c) return true;
    if (i.chip_parqueadero__c && i.chip_parqueadero__c !== "-" && i.chip_parqueadero__c !== "SIN_CHIP") return true;
    return false;
  };
  const hasDeposito = (i: Inmueble) => {
    if (i.Deposito__c && i.Deposito__c !== "No" && i.Deposito__c !== "0") return true;
    if (i.No_Matricula_Inmo_Deposito__c) return true;
    if (i.chip_deposito__c && i.chip_deposito__c !== "-" && i.chip_deposito__c !== "SIN_CHIP") return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="border-b bg-card px-6 flex items-center gap-6 h-14">
        <div className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">Duppla</span>
        </div>
        <nav className="flex items-center h-full">
          <span className="flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 border-primary text-primary">
            <DollarSign className="w-4 h-4" /> Prediales
          </span>
        </nav>
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Resumen */}
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" /> Gestión de Prediales
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Vista general y gestión de impuestos prediales</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="Total Inmuebles" value={total} subtitle="En Duppla" icon={Building2} iconBg="bg-duppla-blue-light" iconColor="text-duppla-blue" />
              <KpiCard title="Prediales Pagados" value={pagadosCount} subtitle="Registrados" icon={CheckCircle2} iconBg="bg-duppla-green-light" iconColor="text-duppla-green" />
              <KpiCard title="Pendientes" value={pendientes} subtitle="Sin registro" icon={Clock} iconBg="bg-duppla-orange-light" iconColor="text-duppla-orange" />
              <KpiCard title="Monto Total Pagado" value={formatCurrency(montoRecaudado)} subtitle="Total pagado" icon={TrendingUp} iconBg="bg-duppla-green-light" iconColor="text-duppla-green" />
            </div>
            <div className="bg-card rounded-xl border p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">{pctPagados}% completado</span>
                <span className="text-muted-foreground">{new Set(pagos.filter((p) => p.estado === "Pagado").map((p) => p.salesforce_id)).size} de {total}</span>
              </div>
              <Progress value={pctPagados} className="h-3" />
            </div>
          </div>

          {/* Master-Detail */}
          <div className="border-t px-6 pb-6 pt-4">
            <div className="flex rounded-xl border overflow-hidden" style={{ height: "calc(100vh - 20rem)" }}>
              {/* List */}
              <div className="w-[380px] flex-shrink-0 border-r bg-card flex flex-col rounded-tl-xl">
                <div className="p-4 border-b space-y-2">
                  <h2 className="font-semibold text-foreground text-sm">Inmuebles ({total})</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por código, cliente, edificio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                  </div>
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
                    <div className="bg-card rounded-xl border p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> Información del Inmueble</h3>
                        <StatusBadge sfId={selected.Id} tipo="inmueble" inmueble={selected} />
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <DItem label="Fiduciaria" value={getFiduciariaName(selected.Fiduciaria__c)} icon={Building2} />
                            <DItem label="Departamento" value={selected.Departamento__c} icon={MapPin} />
                            <DItem label="Ciudad Inmueble" value={selected.Ciudad_Inmueble__c} icon={MapPin} />
                            <DItem label="Dirección" value={selected.Direccion__c} icon={MapPin} />
                            <DItem label="Nombre de edificio o conjunto" value={selected.Nombre_de_edificio_o_conjunto__c} icon={Building2} />
                          </div>
                          <div className="space-y-4">
                            <DItem label="Tipo de inmueble" value={selected.Tipo_de_inmueble__c} icon={Building2} />
                            <DItem label="Número de apartamento" value={selected.Numero_de_apartamento__c} icon={Building2} />
                            <DItem label="Torre" value={selected.Torre__c} icon={Layers} />
                            <DItem label="No. Matricula Inmo Apto" value={selected.Numero_matricula_inmobiliaria__c} icon={FileText} />
                            <DItem label="Chip Apartamento" value={selected.chip_apartamento__c === "SIN_CHIP" ? "Sin asignar" : (selected.chip_apartamento__c || "Sin asignar")} icon={Hash} />
                            {(() => {
                              const pagoInm = pagos.find((p) => p.salesforce_id === selected.Id && (p as any).tipo_predio === "inmueble" && p.estado === "Pagado");
                              return pagoInm?.valor_avaluo ? (
                                <DItem label="Avalúo Catastral" value={formatCurrency(pagoInm.valor_avaluo)} icon={DollarSign} />
                              ) : null;
                            })()}
                          </div>
                        </div>
                        <ActionButtons tipoPredio="inmueble" sfId={selected.Id} />
                      </div>
                    </div>

                    {/* Parqueadero Block */}
                    <div className="bg-card rounded-xl border p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><Car className="w-4 h-4 text-primary" /> Información Parqueadero</h3>
                        <StatusBadge sfId={selected.Id} tipo="parqueadero" inmueble={selected} />
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <DItem label="Parqueadero" value={selected.Parqueadero__c != null ? (selected.Parqueadero__c > 0 ? `Sí (${selected.Parqueadero__c})` : "No") : undefined} icon={Car} />
                          <DItem label="Número del parqueadero" value={selected.numero_del_parqueadero__c} icon={Hash} />
                          <DItem label="No. Matricula Inmo Parqueadero" value={selected.No_Matricula_Inmo_Parqueadero__c} icon={FileText} />
                          <DItem label="Chip Parqueadero" value={selected.chip_parqueadero__c && selected.chip_parqueadero__c !== "-" ? selected.chip_parqueadero__c : undefined} icon={Hash} />
                        </div>
                        {hasParqueadero(selected) ? (
                          <div className="w-[180px] flex-shrink-0 border-l pl-5 flex flex-col gap-2 justify-center">
                            <p className="text-xs text-muted-foreground font-medium mb-1">Gestión Predial</p>
                            {!hasPago(selected.Id, "parqueadero") && (
                              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer mb-1">
                                <Checkbox
                                  checked={!!pagoIncluidoParq[selected.Id]}
                                  onCheckedChange={(v) => setPagoIncluidoParq((prev) => ({ ...prev, [selected.Id]: !!v }))}
                                />
                                Pago incluido en inmueble
                              </label>
                            )}
                            <Button size="sm" onClick={() => openModal("pago", "parqueadero")} className="w-full bg-primary hover:bg-primary/90 text-xs">
                              <DollarSign className="w-3 h-3 mr-1" /> Registrar Pago
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openModal("verPago", "parqueadero")} className="w-full text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" /> Ver Pago
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => openModal("notas", "parqueadero")} className="w-full text-xs">
                              <FileText className="w-3 h-3 mr-1" /> Notas
                            </Button>
                          </div>
                        ) : (
                          <div className="w-[180px] flex-shrink-0 border-l pl-5 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground text-center">Sin parqueadero asignado</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Depósito Block */}
                    <div className="bg-card rounded-xl border p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><Package className="w-4 h-4 text-primary" /> Información Depósito</h3>
                        <StatusBadge sfId={selected.Id} tipo="deposito" inmueble={selected} />
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <DItem label="Depósito" value={selected.Deposito__c} icon={Package} />
                          <DItem label="No. Matricula Inmo Depósito" value={selected.No_Matricula_Inmo_Deposito__c} icon={FileText} />
                          <DItem label="Chip Depósito" value={selected.chip_deposito__c && selected.chip_deposito__c !== "-" ? selected.chip_deposito__c : undefined} icon={Hash} />
                        </div>
                        {hasDeposito(selected) ? (
                          <div className="w-[180px] flex-shrink-0 border-l pl-5 flex flex-col gap-2 justify-center">
                            <p className="text-xs text-muted-foreground font-medium mb-1">Gestión Predial</p>
                            {!hasPago(selected.Id, "deposito") && (
                              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer mb-1">
                                <Checkbox
                                  checked={!!pagoIncluidoDep[selected.Id]}
                                  onCheckedChange={(v) => setPagoIncluidoDep((prev) => ({ ...prev, [selected.Id]: !!v }))}
                                />
                                Pago incluido en inmueble
                              </label>
                            )}
                            <Button size="sm" onClick={() => openModal("pago", "deposito")} className="w-full bg-primary hover:bg-primary/90 text-xs">
                              <DollarSign className="w-3 h-3 mr-1" /> Registrar Pago
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openModal("verPago", "deposito")} className="w-full text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" /> Ver Pago
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => openModal("notas", "deposito")} className="w-full text-xs">
                              <FileText className="w-3 h-3 mr-1" /> Notas
                            </Button>
                          </div>
                        ) : (
                          <div className="w-[180px] flex-shrink-0 border-l pl-5 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground text-center">Sin depósito asignado</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selected && activeModal?.type === "pago" && (
        <RegistrarPagoModal open onClose={closeModal} inmueble={selected} tipoPredio={activeModal.tipoPredio} />
      )}
      {selected && activeModal?.type === "verPago" && (
        <VerPagoModal open onClose={closeModal} salesforceId={selected.Id} tipoPredio={activeModal.tipoPredio} nombreInmueble={selected.Name} />
      )}
      {selected && activeModal?.type === "notas" && (
        <NotasModal open onClose={closeModal} salesforceId={selected.Id} tipoPredio={activeModal.tipoPredio} nombreInmueble={selected.Name} />
      )}
    </div>
  );
};

function DItem({ label, value, icon: Icon }: { label: string; value?: string | null; icon: any }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export default Index;
