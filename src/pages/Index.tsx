import { useState } from "react";
import { Building2, Loader2, Search, CheckCircle2, Clock, TrendingUp, Hash, FileText, MapPin, DollarSign, ExternalLink, Calendar, Layers, Car, Package } from "lucide-react";
import { useInmuebles, usePagos } from "@/hooks/useInmuebles";
import { KpiCard } from "@/components/predial/KpiCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RegistrarPagoModal } from "@/components/predial/RegistrarPagoModal";
import type { Inmueble } from "@/types/inmueble";

const Index = () => {
  const { data: inmuebles = [], isLoading: loadingInmuebles } = useInmuebles();
  const { data: pagos = [], isLoading: loadingPagos } = usePagos();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const isLoading = loadingInmuebles || loadingPagos;
  const pagosMap = new Map(pagos.map((p) => [p.salesforce_id, p]));
  const total = inmuebles.length;
  const pagadosCount = pagos.filter((p) => p.estado === "Pagado").length;
  const pendientes = total - pagadosCount;
  const montoRecaudado = pagos.filter((p) => p.estado === "Pagado").reduce((s, p) => s + (p.valor_pago ?? 0), 0);
  const pctPagados = total > 0 ? Math.round((pagadosCount / total) * 100) : 0;
  const formatCurrency = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  const filtered = inmuebles.filter((i) => {
    const q = search.toLowerCase();
    return i.Name?.toLowerCase().includes(q) || i.Id?.toLowerCase().includes(q) || i.Ciudad_Inmueble__c?.toLowerCase().includes(q) || i.Nombre_de_edificio_o_conjunto__c?.toLowerCase().includes(q) || i.chip_apartamento__c?.toLowerCase().includes(q);
  });

  const selected = inmuebles.find((i) => i.Id === selectedId) ?? null;
  const selectedPago = selectedId ? pagosMap.get(selectedId) : undefined;
  const isPagado = selectedPago?.estado === "Pagado";

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
          {/* Resumen Section */}
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
              <KpiCard title="Monto Recaudado" value={formatCurrency(montoRecaudado)} subtitle="Total pagado" icon={TrendingUp} iconBg="bg-duppla-green-light" iconColor="text-duppla-green" />
            </div>

            <div className="bg-card rounded-xl border p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">{pctPagados}% completado</span>
                <span className="text-muted-foreground">{pagadosCount} de {total}</span>
              </div>
              <Progress value={pctPagados} className="h-3" />
            </div>
          </div>

          {/* Inmuebles Master-Detail */}
          <div className="border-t">
            <div className="flex" style={{ height: "calc(100vh - 3.5rem)" }}>
              {/* List */}
              <div className="w-[380px] flex-shrink-0 border-r bg-card flex flex-col">
                <div className="p-4 border-b space-y-2">
                  <h2 className="font-semibold text-foreground text-sm">Inmuebles ({total})</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por código, cliente, edificio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filtered.map((inmueble) => {
                    const p = pagosMap.get(inmueble.Id);
                    const paid = p?.estado === "Pagado";
                    const isSel = selectedId === inmueble.Id;
                    return (
                      <button key={inmueble.Id} onClick={() => setSelectedId(inmueble.Id)} className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${isSel ? "bg-duppla-green-light border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{inmueble.Name}</p>
                            <p className="text-xs text-muted-foreground truncate">{inmueble.Nombre_de_edificio_o_conjunto__c ?? inmueble.Id}</p>
                            <p className="text-xs text-muted-foreground">{inmueble.Ciudad_Inmueble__c}</p>
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            {paid ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-green bg-duppla-green-light px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Pagado</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-duppla-gray bg-muted px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
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
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><Building2 className="w-6 h-6 text-muted-foreground" /></div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">{selected.Name}</h2>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><Hash className="w-3 h-3" /> {selected.Id}</p>
                          {selected.Cliente__c && <p className="text-sm text-muted-foreground mt-0.5">{selected.Cliente__c}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selected.Proceso_entrega_inmueble__c && <Badge variant="outline" className="border-primary text-primary">{selected.Proceso_entrega_inmueble__c}</Badge>}
                        {isPagado ? <Badge className="bg-duppla-green text-primary-foreground"><CheckCircle2 className="w-3 h-3 mr-1" /> Pagado</Badge> : <Badge variant="secondary">Pendiente</Badge>}
                      </div>
                    </div>

                    <div className="bg-card rounded-xl border p-5 space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> Información del Inmueble</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DItem label="Código de Inmueble" value={selected.Name} icon={Hash} />
                        <DItem label="Edificio / Conjunto" value={selected.Nombre_de_edificio_o_conjunto__c} icon={Building2} />
                        <DItem label="Dirección" value={selected.Direccion__c} icon={MapPin} />
                        <DItem label="Ciudad" value={selected.Ciudad_Inmueble__c} icon={MapPin} />
                        <DItem label="Departamento" value={selected.Departamento__c} icon={MapPin} />
                        <DItem label="Torre" value={selected.Torre__c} icon={Layers} />
                        <DItem label="Apartamento" value={selected.Numero_de_apartamento__c} icon={Building2} />
                        <DItem label="Matrícula Inmo Apto" value={selected.Numero_matricula_inmobiliaria__c} icon={FileText} />
                        <DItem label="CHIP Apto" value={selected.chip_apartamento__c || "Sin asignar"} icon={Hash} />
                        <DItem label="Fiduciaria" value={selected.Fiduciaria__c} icon={Building2} />
                        <DItem label="Escritura" value={selected.Fecha_firma_escritura__c} icon={Calendar} />
                        <DItem label="Estado Operativo" value={selected.Proceso_entrega_inmueble__c} icon={CheckCircle2} />
                      </div>
                    </div>

                    {/* Anexos */}
                    <div className="bg-card rounded-xl border p-5 space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><Package className="w-4 h-4 text-primary" /> Anexos</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Car className="w-3 h-3" /> Parqueadero</p>
                          <p className="text-sm font-medium text-foreground">{selected.numero_del_parqueadero__c || "—"}</p>
                          <p className="text-xs text-muted-foreground">Matrícula: {selected.No_Matricula_Inmo_Parqueadero__c || "—"}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Package className="w-3 h-3" /> Depósito</p>
                          <p className="text-sm font-medium text-foreground">{selected.Deposito__c || "—"}</p>
                          <p className="text-xs text-muted-foreground">Matrícula: {selected.No_Matricula_Inmo_Deposito__c || "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl border p-5 space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-primary" /> Gestión de Predial</h3>
                      {isPagado && selectedPago ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <DItem label="Fecha de Pago" value={selectedPago.fecha_pago} icon={Calendar} />
                            <DItem label="Valor Pagado" value={selectedPago.valor_pago ? formatCurrency(selectedPago.valor_pago) : undefined} icon={DollarSign} />
                            <DItem label="Avalúo" value={selectedPago.valor_avaluo ? formatCurrency(selectedPago.valor_avaluo) : undefined} icon={DollarSign} />
                          </div>
                          {selectedPago.notas && <div className="bg-muted rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Notas</p><p className="text-sm text-foreground">{selectedPago.notas}</p></div>}
                          {selectedPago.url_soporte && <Button variant="outline" size="sm" asChild><a href={selectedPago.url_soporte} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Ver Soporte PDF</a></Button>}
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-3">
                          <p className="text-muted-foreground text-sm">No se ha registrado pago para este inmueble.</p>
                          <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90"><DollarSign className="w-4 h-4 mr-1" /> Registrar Pago</Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && <RegistrarPagoModal open={showModal} onClose={() => setShowModal(false)} inmueble={selected} />}
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
