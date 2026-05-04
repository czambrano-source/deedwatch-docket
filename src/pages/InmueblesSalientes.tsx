import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, MapPin, Building2, AlertTriangle, CheckCircle2, Clock, Flame, Droplets, Zap, Plus, Trash2, Check, ExternalLink, Send } from "lucide-react";
import { useInmuebles } from "@/hooks/useInmuebles";
import { useServiciosPublicos, useFacturasServicios, type TipoServicio, type FacturaServicio } from "@/hooks/useServiciosPublicos";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiCard } from "@/components/predial/KpiCard";
import { cn } from "@/lib/utils";
import type { Inmueble } from "@/types/inmueble";

const PROCESOS_SALIENTE = ["En proceso de venta"];

const TIPO_META: Record<TipoServicio, { label: string; icon: any; color: string; refField: string }> = {
  gas: { label: "Gas", icon: Flame, color: "text-orange-600", refField: "Referencia_de_Pago_del_Servicio_de_Gas_N__c" },
  agua: { label: "Acueducto", icon: Droplets, color: "text-blue-600", refField: "Referencia_de_Pago_del_Servicio_de_Acued__c" },
  energia: { label: "Energía", icon: Zap, color: "text-yellow-600", refField: "Referencia_de_Pago_Energia__c" },
};

export default function InmueblesSalientes() {
  const qc = useQueryClient();
  const { data: inmueblesRaw = [], isLoading } = useInmuebles();
  const { data: servicios = [] } = useServiciosPublicos();
  const { data: facturas = [] } = useFacturasServicios();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFacturaModal, setShowFacturaModal] = useState<{ tipo: TipoServicio } | null>(null);
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);

  // Filtrar inmuebles salientes
  const salientes = useMemo(() => {
    return inmueblesRaw
      .filter((i) => !i.Name?.toUpperCase().startsWith("PRUEBA"))
      .filter((i) => PROCESOS_SALIENTE.includes(i.Proceso_entrega_inmueble__c ?? ""));
  }, [inmueblesRaw]);

  const servicioMap = useMemo(() => new Map(servicios.map((s) => [s.salesforce_id, s])), [servicios]);
  const facturasPorInmueble = useMemo(() => {
    const m = new Map<string, FacturaServicio[]>();
    facturas.forEach((f) => {
      const arr = m.get(f.salesforce_id) ?? [];
      arr.push(f);
      m.set(f.salesforce_id, arr);
    });
    return m;
  }, [facturas]);

  // KPIs
  const today = new Date().toISOString().slice(0, 10);
  const limite = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
  const totalSalientes = salientes.length;
  const conObligacion = salientes.filter((i) => servicioMap.get(i.Id)?.obligacion_duppla ?? true).length;
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

  const toggleObligacion = async (sfId: string, current: boolean) => {
    const existing = servicioMap.get(sfId);
    if (existing) {
      const { error } = await supabase
        .from("servicios_publicos_inmueble")
        .update({ obligacion_duppla: !current })
        .eq("salesforce_id", sfId);
      if (error) return toast.error("Error actualizando");
    } else {
      const { error } = await supabase
        .from("servicios_publicos_inmueble")
        .insert({ salesforce_id: sfId, obligacion_duppla: !current });
      if (error) return toast.error("Error guardando");
    }
    qc.invalidateQueries({ queryKey: ["servicios_publicos_inmueble"] });
  };

  const enviarAlertaManual = async () => {
    setEnviandoAlerta(true);
    try {
      const { data, error } = await supabase.functions.invoke("alerta-servicios-vencimiento");
      if (error) throw error;
      toast.success(`Alerta enviada a Slack (${data?.sent ?? 0} facturas)`);
      qc.invalidateQueries({ queryKey: ["facturas_servicios"] });
    } catch (e: any) {
      toast.error("Error enviando alerta: " + (e.message ?? e));
    } finally {
      setEnviandoAlerta(false);
    }
  };

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
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inmuebles salientes</h1>
          <p className="text-sm text-muted-foreground">Seguimiento de servicios públicos de inmuebles en proceso de venta</p>
        </div>
        <Button onClick={enviarAlertaManual} disabled={enviandoAlerta} variant="outline">
          {enviandoAlerta ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Enviar alerta a Slack
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard title="Inmuebles salientes" value={totalSalientes} icon={Building2} />
        <KpiCard title="Obligación Duppla" value={conObligacion} icon={CheckCircle2} />
        <KpiCard title="Facturas vencidas" value={facturasVencidas} icon={AlertTriangle} />
        <KpiCard title="Próximas a vencer (5d)" value={facturasProximas} icon={Clock} />
      </div>

      {salientes.length === 0 && !isLoading && (
        <Card className="mb-4 border-amber-300 bg-amber-50">
          <CardContent className="p-4 text-sm">
            <strong className="text-amber-800">Sin datos:</strong> No se encontraron inmuebles con <code>Proceso_entrega_inmueble__c = "En proceso de venta"</code>. Verifica que el webhook de n8n esté incluyendo ese campo en la respuesta.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* Lista */}
        <div className="col-span-5">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar inmueble..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filtered.map((i) => {
                const cfg = servicioMap.get(i.Id);
                const obligacion = cfg?.obligacion_duppla ?? true;
                const facturasInm = facturasPorInmueble.get(i.Id) ?? [];
                const vencidas = facturasInm.filter((f) => !f.pagado && f.fecha_vencimiento && f.fecha_vencimiento < today).length;
                return (
                  <button
                    key={i.Id}
                    onClick={() => setSelectedId(i.Id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      selectedId === i.Id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm truncate">{i.Name}</div>
                      {obligacion ? (
                        <Badge className="bg-duppla-green text-white text-[10px]"><Check className="w-3 h-3 mr-1" />Duppla paga</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">Cliente paga</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {i.Direccion__c ?? "—"}, {i.Ciudad_Inmueble__c}
                    </div>
                    {vencidas > 0 && (
                      <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {vencidas} factura(s) vencida(s)
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detalle */}
        <div className="col-span-7">
          {!selected ? (
            <Card><CardContent className="p-12 text-center text-muted-foreground">Selecciona un inmueble para gestionar sus servicios públicos</CardContent></Card>
          ) : (
            <DetalleInmueble
              inmueble={selected}
              servicio={servicioMap.get(selected.Id)}
              facturas={facturasPorInmueble.get(selected.Id) ?? []}
              onToggleObligacion={() => toggleObligacion(selected.Id, servicioMap.get(selected.Id)?.obligacion_duppla ?? true)}
              onAddFactura={(tipo) => setShowFacturaModal({ tipo })}
              onMarcarPagada={marcarPagada}
              onEliminar={eliminarFactura}
            />
          )}
        </div>
      </div>

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

function DetalleInmueble({ inmueble, servicio, facturas, onToggleObligacion, onAddFactura, onMarcarPagada, onEliminar }: {
  inmueble: Inmueble;
  servicio: any;
  facturas: FacturaServicio[];
  onToggleObligacion: () => void;
  onAddFactura: (t: TipoServicio) => void;
  onMarcarPagada: (f: FacturaServicio) => void;
  onEliminar: (id: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const obligacion = servicio?.obligacion_duppla ?? true;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">{inmueble.Name}</h2>
              <p className="text-sm text-muted-foreground">{inmueble.Opportunity__r?.Name}</p>
              <p className="text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {inmueble.Direccion__c}, {inmueble.Ciudad_Inmueble__c}</p>
              <p className="text-xs text-muted-foreground mt-1">{inmueble.Nombre_de_edificio_o_conjunto__c}</p>
            </div>
          </div>
          <div className="border-t pt-4 flex items-center gap-3 bg-muted/30 -mx-5 -mb-5 p-4 rounded-b-lg">
            <Checkbox checked={obligacion} onCheckedChange={onToggleObligacion} id="obligacion" />
            <Label htmlFor="obligacion" className="cursor-pointer flex-1">
              <div className="font-medium">¿Es obligación de Duppla pagar los servicios?</div>
              <div className="text-xs text-muted-foreground">Desactiva si el cliente compró el inmueble. Si vuelve al portafolio, reactiva.</div>
            </Label>
          </div>
        </CardContent>
      </Card>

      {(["gas", "agua", "energia"] as TipoServicio[]).map((tipo) => {
        const meta = TIPO_META[tipo];
        const Icon = meta.icon;
        const refSF = (inmueble as any)[meta.refField];
        const facturasTipo = facturas.filter((f) => f.tipo_servicio === tipo);
        return (
          <Card key={tipo}>
            <CardContent className="p-4">
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
            </CardContent>
          </Card>
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
