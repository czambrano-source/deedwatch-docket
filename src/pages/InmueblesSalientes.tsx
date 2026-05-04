import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, MapPin, Building2, AlertTriangle, CheckCircle2, Clock, Flame, Droplets, Zap, Plus, Trash2, Check, ExternalLink, LogOut, FileText, Hash, Layers, Car, Package } from "lucide-react";
import { useInmuebles } from "@/hooks/useInmuebles";
import { useFacturasServicios, type TipoServicio, type FacturaServicio } from "@/hooks/useServiciosPublicos";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { KpiCard } from "@/components/predial/KpiCard";
import { cn } from "@/lib/utils";
import type { Inmueble } from "@/types/inmueble";

const PROCESOS_SALIENTE = ["En Proceso de Venta"];

const TIPO_META: Record<TipoServicio, { label: string; icon: any; color: string; refField: string }> = {
  gas: { label: "Gas", icon: Flame, color: "text-orange-600", refField: "Referencia_de_Pago_del_Servicio_de_Gas_N__c" },
  agua: { label: "Acueducto", icon: Droplets, color: "text-blue-600", refField: "Referencia_de_Pago_del_Servicio_de_Acued__c" },
  energia: { label: "Energía", icon: Zap, color: "text-yellow-600", refField: "Referencia_de_Pago_Energia__c" },
};

const hasParqueadero = (i: Inmueble) => {
  if (i.Parqueadero__c != null && i.Parqueadero__c > 0) return true;
  if (i.No_Matricula_Inmo_Parqueadero__c && !["N/A", "No tiene", "SIN_MATRICULA"].includes(i.No_Matricula_Inmo_Parqueadero__c)) return true;
  return false;
};

const hasDeposito = (i: Inmueble) => {
  if (i.Deposito__c && !["No", "0", "N/A", "No tiene", "SIN_MATRICULA"].includes(i.Deposito__c)) return true;
  if (i.No_Matricula_Inmo_Deposito__c && !["N/A", "No tiene", "SIN_MATRICULA"].includes(i.No_Matricula_Inmo_Deposito__c)) return true;
  return false;
};

export default function InmueblesSalientes() {
  const qc = useQueryClient();
  const { data: inmueblesRaw = [], isLoading } = useInmuebles();
  const { data: facturas = [] } = useFacturasServicios();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFacturaModal, setShowFacturaModal] = useState<{ tipo: TipoServicio } | null>(null);

  const salientes = useMemo(() => {
    return inmueblesRaw
      .filter((i) => !i.Name?.toUpperCase().startsWith("PRUEBA"))
      .filter((i) => PROCESOS_SALIENTE.includes(i.Proceso_entrega_inmueble__c ?? ""));
  }, [inmueblesRaw]);

  const facturasPorInmueble = useMemo(() => {
    const m = new Map<string, FacturaServicio[]>();
    facturas.forEach((f) => {
      const arr = m.get(f.salesforce_id) ?? [];
      arr.push(f);
      m.set(f.salesforce_id, arr);
    });
    return m;
  }, [facturas]);

  const today = new Date().toISOString().slice(0, 10);
  const limite = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
  const totalSalientes = salientes.length;
  const facturasVencidas = facturas.filter((f) => !f.pagado && f.fecha_vencimiento && f.fecha_vencimiento < today).length;
  const facturasProximas = facturas.filter((f) => !f.pagado && f.fecha_vencimiento && f.fecha_vencimiento >= today && f.fecha_vencimiento <= limite).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return salientes.filter((i) =>
      !q ||
      i.Name?.toLowerCase().includes(q) ||
      i.Direccion__c?.toLowerCase().includes(q) ||
      i.Opportunity__r?.Name?.toLowerCase().includes(q)
    );
  }, [salientes, search]);

  const selected = filtered.find((i) => i.Id === selectedId) ?? null;

  const marcarPagada = async (factura: FacturaServicio) => {
    const { error } = await supabase
      .from("facturas_servicios")
      .update({ pagado: true, fecha_pago: today })
      .eq("id", factura.id);
    if (error) return toast.error("Error marcando pago");
    toast.success("Factura marcada como pagada");
    qc.invalidateQueries({ queryKey: ["facturas_servicios"] });
  };

  const eliminarFactura = async (id: string) => {
    if (!confirm("¿Eliminar esta factura?")) return;
    const { error } = await supabase.from("facturas_servicios").delete().eq("id", id);
    if (error) return toast.error("Error eliminando");
    toast.success("Factura eliminada");
    qc.invalidateQueries({ queryKey: ["facturas_servicios"] });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isLoading && inmueblesRaw.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <LogOut className="w-6 h-6 text-primary" /> Inmuebles salientes
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Seguimiento de servicios públicos en inmuebles en proceso de venta</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KpiCard
                title="Inmuebles salientes"
                value={totalSalientes}
                subtitle="En proceso de venta"
                icon={Building2}
                iconBg="bg-duppla-blue-light"
                iconColor="text-duppla-blue"
              />
              <KpiCard
                title="Facturas vencidas"
                value={facturasVencidas}
                subtitle="Sin pagar"
                icon={AlertTriangle}
                iconBg="bg-duppla-red-light"
                iconColor="text-destructive"
              />
              <KpiCard
                title="Próximas a vencer"
                value={facturasProximas}
                subtitle="En los próximos 5 días"
                icon={Clock}
                iconBg="bg-duppla-orange-light"
                iconColor="text-duppla-orange"
              />
            </div>

            {salientes.length === 0 && !isLoading && (
              <Card className="border-amber-300 bg-amber-50">
                <CardContent className="p-4 text-sm text-amber-900">
                  <strong>Sin datos:</strong> No se encontraron inmuebles con <code className="bg-amber-100 px-1 rounded">Proceso_entrega_inmueble__c = "En Proceso de Venta"</code>.
                </CardContent>
              </Card>
            )}

            <div className="bg-card rounded-lg border p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  className="pl-8 h-9 text-sm"
                  placeholder="Buscar por nombre, dirección u oportunidad..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Lista */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-card rounded-lg border">
                  <div className="px-4 py-3 border-b">
                    <h3 className="text-sm font-semibold text-foreground">
                      {filtered.length} inmueble{filtered.length !== 1 ? "s" : ""}
                    </h3>
                  </div>
                  <div className="divide-y max-h-[calc(100vh-440px)] overflow-y-auto">
                    {filtered.map((i) => {
                      const facturasInm = facturasPorInmueble.get(i.Id) ?? [];
                      const vencidas = facturasInm.filter((f) => !f.pagado && f.fecha_vencimiento && f.fecha_vencimiento < today).length;
                      const isSel = selectedId === i.Id;
                      return (
                        <button
                          key={i.Id}
                          onClick={() => setSelectedId(i.Id)}
                          className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${isSel ? "bg-duppla-green-light border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">{i.Name}</p>
                              <p className="text-xs text-muted-foreground truncate">{i.Opportunity__r?.Name ?? "—"}</p>
                              {vencidas > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full mt-1">
                                  <AlertTriangle className="w-3 h-3" /> {vencidas} vencida{vencidas !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {filtered.length === 0 && (
                      <div className="p-8 text-center text-sm text-muted-foreground">Sin resultados</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalle */}
              <div className="col-span-12 lg:col-span-8">
                {!selected ? (
                  <div className="bg-card rounded-lg border p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Selecciona un inmueble para ver detalles</p>
                  </div>
                ) : (
                  <DetalleInmueble
                    inmueble={selected}
                    facturas={facturasPorInmueble.get(selected.Id) ?? []}
                    onAddFactura={(tipo) => setShowFacturaModal({ tipo })}
                    onMarcarPagada={marcarPagada}
                    onEliminar={eliminarFactura}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showFacturaModal && selected && (
        <FacturaModal
          tipo={showFacturaModal.tipo}
          salesforceId={selected.Id}
          onClose={() => setShowFacturaModal(null)}
          onSaved={() => { setShowFacturaModal(null); qc.invalidateQueries({ queryKey: ["facturas_servicios"] }); }}
        />
      )}
    </div>
  );
}

function DetalleInmueble({ inmueble, facturas, onAddFactura, onMarcarPagada, onEliminar }: {
  inmueble: Inmueble;
  facturas: FacturaServicio[];
  onAddFactura: (t: TipoServicio) => void;
  onMarcarPagada: (f: FacturaServicio) => void;
  onEliminar: (id: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{inmueble.Name}</h2>
          <p className="text-sm text-muted-foreground">{inmueble.Opportunity__r?.Name ?? "—"}</p>
        </div>
      </div>

      {/* Información del inmueble */}
      <div className="bg-card rounded-xl border p-4 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-primary" /> Información del Inmueble
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <DItem label="Fiduciaria" value={(inmueble as any).Fiduciaria__r?.Name ?? inmueble.Fiduciaria__c} icon={Building2} />
          <DItem label="Tipo de inmueble" value={inmueble.Tipo_de_inmueble__c} icon={Building2} />
          <DItem label="Municipio" value={(inmueble as any).Municipio_del__c} icon={MapPin} />
          <DItem label="Número de apartamento" value={inmueble.Numero_de_apartamento__c} icon={Building2} />
          <DItem label="Departamento" value={inmueble.Departamento__c} icon={MapPin} />
          <DItem label="Torre" value={inmueble.Torre__c} icon={Layers} />
          <DItem label="Ciudad" value={inmueble.Ciudad_Inmueble__c} icon={MapPin} />
          <DItem label="No. Matrícula Apto" value={inmueble.Numero_matricula_inmobiliaria__c} icon={FileText} />
          <DItem label="Dirección" value={inmueble.Direccion__c} icon={MapPin} />
          <DItem label="Chip Apartamento" value={inmueble.chip_apartamento__c === "SIN_CHIP" ? "Sin asignar" : (inmueble.chip_apartamento__c || undefined)} icon={Hash} />
          <DItem label="Edificio / Conjunto" value={inmueble.Nombre_de_edificio_o_conjunto__c} icon={Building2} />
        </div>
      </div>

      {/* Parqueadero */}
      {hasParqueadero(inmueble) && (
        <div className="bg-card rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
            <Car className="w-4 h-4 text-primary" /> Parqueadero
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <DItem label="Cantidad" value={inmueble.Parqueadero__c != null ? String(inmueble.Parqueadero__c) : undefined} icon={Car} />
            <DItem label="Número" value={inmueble.numero_del_parqueadero__c} icon={Hash} />
            {inmueble.numero_de_parqueadero_adicional__c && (
              <DItem label="Número adicional" value={inmueble.numero_de_parqueadero_adicional__c} icon={Hash} />
            )}
            <DItem label="No. Matrícula Parqueadero" value={inmueble.No_Matricula_Inmo_Parqueadero__c} icon={FileText} />
            <DItem label="Chip Parqueadero" value={inmueble.chip_parqueadero__c} icon={Hash} />
          </div>
        </div>
      )}

      {/* Depósito */}
      {hasDeposito(inmueble) && (
        <div className="bg-card rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-primary" /> Depósito
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <DItem label="Número depósito" value={inmueble.numero_deposito__c} icon={Hash} />
            <DItem label="No. Matrícula Depósito" value={inmueble.No_Matricula_Inmo_Deposito__c} icon={FileText} />
            <DItem label="Chip Depósito" value={inmueble.chip_deposito__c} icon={Hash} />
          </div>
        </div>
      )}

      {/* Servicios públicos */}
      {(["gas", "agua", "energia"] as TipoServicio[]).map((tipo) => {
        const meta = TIPO_META[tipo];
        const Icon = meta.icon;
        const refSF = (inmueble as any)[meta.refField];
        const facturasTipo = facturas.filter((f) => f.tipo_servicio === tipo);
        return (
          <div key={tipo} className="bg-card rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className={cn("w-5 h-5", meta.color)} />
                <h3 className="font-semibold">{meta.label}</h3>
                {refSF ? (
                  <Badge variant="outline" className="text-xs">Ref SF: {refSF}</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">Sin ref. en SF</Badge>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => onAddFactura(tipo)}>
                <Plus className="w-3 h-3 mr-1" /> Factura
              </Button>
            </div>
            {facturasTipo.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin facturas registradas</p>
            ) : (
              <div className="space-y-2">
                {facturasTipo.map((f) => {
                  const vencida = !f.pagado && f.fecha_vencimiento && f.fecha_vencimiento < today;
                  return (
                    <div key={f.id} className={cn(
                      "flex items-center gap-3 p-2 rounded border text-sm",
                      f.pagado ? "bg-duppla-green-light/30 border-duppla-green/30" : vencida ? "bg-destructive/5 border-destructive/30" : "bg-card"
                    )}>
                      <div className="flex-1">
                        <div className="font-medium">
                          {f.valor ? `$${Number(f.valor).toLocaleString("es-CO")}` : "Sin valor"}
                          {f.referencia_pago && <span className="text-xs text-muted-foreground ml-2">Ref: {f.referencia_pago}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Vence: {f.fecha_vencimiento ?? "—"}
                          {f.pagado && f.fecha_pago && ` • Pagada el ${f.fecha_pago}`}
                        </div>
                      </div>
                      {f.pagado ? (
                        <Badge className="bg-duppla-green text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Pagada</Badge>
                      ) : vencida ? (
                        <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Vencida</Badge>
                      ) : (
                        <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
                      )}
                      {f.url_soporte && (
                        <a href={f.url_soporte} target="_blank" rel="noreferrer" className="text-primary"><ExternalLink className="w-4 h-4" /></a>
                      )}
                      {!f.pagado && (
                        <Button size="sm" variant="ghost" onClick={() => onMarcarPagada(f)} title="Marcar pagada">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => onEliminar(f.id)} title="Eliminar">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FacturaModal({ tipo, salesforceId, onClose, onSaved }: {
  tipo: TipoServicio;
  salesforceId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [referencia, setReferencia] = useState("");
  const [valor, setValor] = useState("");
  const [fechaVenc, setFechaVenc] = useState("");
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);

  const guardar = async () => {
    if (!fechaVenc) return toast.error("Fecha de vencimiento requerida");
    setSaving(true);
    const { error } = await supabase.from("facturas_servicios").insert({
      salesforce_id: salesforceId,
      tipo_servicio: tipo,
      referencia_pago: referencia || null,
      valor: valor ? Number(valor) : null,
      fecha_vencimiento: fechaVenc,
      notas: notas || null,
    });
    setSaving(false);
    if (error) return toast.error("Error: " + error.message);
    toast.success("Factura registrada");
    onSaved();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva factura — {TIPO_META[tipo].label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Referencia de pago</Label>
            <Input value={referencia} onChange={(e) => setReferencia(e.target.value)} />
          </div>
          <div>
            <Label>Valor (COP)</Label>
            <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>
          <div>
            <Label>Fecha de vencimiento *</Label>
            <Input type="date" value={fechaVenc} onChange={(e) => setFechaVenc(e.target.value)} />
          </div>
          <div>
            <Label>Notas</Label>
            <Input value={notas} onChange={(e) => setNotas(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={guardar} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
