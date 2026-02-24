import { Building2, MapPin, Hash, FileText, Calendar, DollarSign, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

interface InmuebleDetailProps {
  inmueble: Inmueble | null;
  pago: GestionPredial | undefined;
  onRegistrarPago: () => void;
}

export function InmuebleDetail({ inmueble, pago, onRegistrarPago }: InmuebleDetailProps) {
  if (!inmueble) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Selecciona un inmueble para ver detalles</p>
        </div>
      </div>
    );
  }

  const isPagado = pago?.estado === "Pagado";
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{inmueble.Name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" /> {inmueble.Id}
            </p>
            {inmueble.Cliente__c && (
              <p className="text-sm text-muted-foreground mt-0.5">{inmueble.Cliente__c}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {inmueble.Proceso_entrega_inmueble__c && (
            <Badge variant="outline" className="border-primary text-primary">
              {inmueble.Proceso_entrega_inmueble__c}
            </Badge>
          )}
          {isPagado ? (
            <Badge className="bg-duppla-green text-primary-foreground">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Pagado
            </Badge>
          ) : (
            <Badge variant="secondary">Pendiente</Badge>
          )}
        </div>
      </div>

      {/* Grid de detalles */}
      <div className="bg-card rounded-xl border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-primary" /> Información del Inmueble
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailItem label="CHIP" value={inmueble.chip_apartamento__c || "Sin asignar"} icon={Hash} />
          <DetailItem label="Matrícula Inmobiliaria" value={inmueble.Numero_matricula_inmobiliaria__c} icon={FileText} />
          <DetailItem label="Fiduciaria" value={inmueble.Fiduciaria__c} icon={Building2} />
          <DetailItem label="Dirección" value={inmueble.Direccion__c ?? inmueble.Direcci_n__c} icon={MapPin} />
          <DetailItem label="Ciudad" value={inmueble.Ciudad_Inmueble__c ?? inmueble.Ciudad__c} icon={MapPin} />
          <DetailItem label="Estado Operativo" value={inmueble.Proceso_entrega_inmueble__c ?? "N/A"} icon={CheckCircle2} />
        </div>
      </div>

      {/* Sección de Gestión de Pago */}
      <div className="bg-card rounded-xl border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-primary" /> Gestión de Predial
        </h3>

        {isPagado && pago ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DetailItem label="Fecha de Pago" value={pago.fecha_pago} icon={Calendar} />
              <DetailItem label="Valor Pagado" value={pago.valor_pago ? formatCurrency(pago.valor_pago) : undefined} icon={DollarSign} />
              <DetailItem label="Avalúo" value={pago.valor_avaluo ? formatCurrency(pago.valor_avaluo) : undefined} icon={DollarSign} />
            </div>
            {pago.notas && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Notas</p>
                <p className="text-sm text-foreground">{pago.notas}</p>
              </div>
            )}
            {pago.url_soporte && (
              <Button variant="outline" size="sm" asChild>
                <a href={pago.url_soporte} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" /> Ver Soporte PDF
                </a>
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <p className="text-muted-foreground text-sm">No se ha registrado pago para este inmueble.</p>
            <Button onClick={onRegistrarPago} className="bg-primary hover:bg-primary/90">
              <DollarSign className="w-4 h-4 mr-1" /> Registrar Pago
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }: { label: string; value?: string | null; icon: any }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}
