import { Building2, MapPin, Hash, FileText, Calendar, DollarSign, CheckCircle2, ExternalLink, Car, Package, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

interface InmuebleDetailProps {
  inmueble: Inmueble | null;
  pago: GestionPredial | undefined;
  onRegistrarPago: () => void;
}

function isValidField(val?: string | null): boolean {
  if (!val) return false;
  const n = val.trim().toLowerCase();
  return n !== "" && n !== "n/a" && n !== "no tiene" && n !== "-" && n !== "sin_chip" && n !== "sin_matricula";
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

  const sel = inmueble;
  const getFidName = (i: any) => i.Fiduciaria__r?.Name ?? i.Fiduciaria__c ?? "—";

  // Parking logic: "No" means show only "No" label, no other fields
  const parqIsNo = sel.Parqueadero__c != null && sel.Parqueadero__c === 0;
  const hasValidMatrParq = isValidField(sel.No_Matricula_Inmo_Parqueadero__c);
  const hasValidChipParq = isValidField(sel.chip_parqueadero__c);

  // Deposit logic: "No" means show only "No" label, no other fields
  const depIsNo = !!sel.Deposito__c && ["no", "0"].includes(sel.Deposito__c.trim().toLowerCase());
  const hasValidMatrDep = isValidField(sel.No_Matricula_Inmo_Deposito__c);
  const hasValidChipDep = isValidField(sel.chip_deposito__c);

  // CTL visibility
  const showCtlInm = isValidField(sel.Numero_matricula_inmobiliaria__c) || isValidField(sel.chip_apartamento__c);
  const showCtlParq = hasValidMatrParq || hasValidChipParq;
  const showCtlDep = hasValidMatrDep || hasValidChipDep;

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

      {/* Inmueble Info */}
      <div className="bg-card rounded-xl border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-primary" /> Información del Inmueble
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Col 1 */}
          <div className="space-y-3">
            <DetailItem label="Fiduciaria" value={getFidName(sel)} icon={Building2} />
            <DetailItem label="Municipio" value={sel.Municipio_del__c} icon={MapPin} />
            <DetailItem label="Departamento" value={sel.Departamento__c} icon={MapPin} />
            <DetailItem label="Ciudad Inmueble" value={sel.Ciudad_Inmueble__c} icon={MapPin} />
            <DetailItem label="Dirección" value={sel.Direccion__c} icon={MapPin} />
          </div>
          {/* Col 2 */}
          <div className="space-y-3">
            <DetailItem label="Nombre de edificio o conjunto" value={sel.Nombre_de_edificio_o_conjunto__c} icon={Building2} />
            <DetailItem label="Tipo de inmueble" value={sel.Tipo_de_inmueble__c} icon={Building2} />
            <DetailItem label="Número de apartamento" value={sel.Numero_de_apartamento__c} icon={Building2} />
            <DetailItem label="Torre" value={sel.Torre__c} icon={Layers} />
          </div>
          {/* Col 3 */}
          <div className="space-y-3">
            <DetailItem label="Fecha Firma Escritura" value={sel.Legales__r?.records?.[0]?.Fecha_firma_escritura__c ?? undefined} icon={Calendar} />
            <DetailItem label="No. Matricula Inmo Apto" value={sel.Numero_matricula_inmobiliaria__c} icon={FileText} />
            <DetailItem label="Chip Apartamento" value={sel.chip_apartamento__c === "SIN_CHIP" ? "Sin asignar" : (sel.chip_apartamento__c || "Sin asignar")} icon={Hash} />
          </div>
        </div>
        {showCtlInm && (
          <div className="border-t border-border/40 pt-3 mt-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> Ctl apto r2o</h3>
              {!sel.nombre_ctl_inmueble__c && !sel.nit_ctl_inmueble__c && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
              )}
            </div>
            <div className="space-y-1">
              <DetailItem label="Nombre" value={sel.nombre_ctl_inmueble__c} icon={FileText} />
              <DetailItem label="NIT" value={sel.nit_ctl_inmueble__c} icon={Hash} />
            </div>
          </div>
        )}
      </div>

      {/* Parqueadero Block */}
      <div className="bg-card rounded-xl border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <Car className="w-4 h-4 text-primary" /> Información Parqueadero
        </h3>
        {parqIsNo ? (
          <DetailItem label="Parqueadero" value="No" icon={Car} />
        ) : (
          <>
            <div className="space-y-1.5">
              <DetailItem label="Parqueadero" value={sel.Parqueadero__c != null ? `Sí (${sel.Parqueadero__c})` : undefined} icon={Car} />
              {isValidField(sel.numero_del_parqueadero__c) && (
                <DetailItem label="Número del parqueadero" value={sel.numero_del_parqueadero__c} icon={Hash} />
              )}
              {hasValidMatrParq && (
                <DetailItem label="No. Matricula Inmo Parqueadero" value={sel.No_Matricula_Inmo_Parqueadero__c} icon={FileText} />
              )}
              {hasValidChipParq && (
                <DetailItem label="Chip Parqueadero" value={sel.chip_parqueadero__c} icon={Hash} />
              )}
            </div>
            {showCtlParq && (
              <div className="border-t border-border/40 pt-3 mt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> Ctl Parqueadero</h3>
                  {!sel.nombre_ctl_parqueadero__c && !sel.nit_ctl_parqueadero__c && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                  )}
                </div>
                <div className="space-y-1">
                  <DetailItem label="Nombre" value={sel.nombre_ctl_parqueadero__c} icon={FileText} />
                  <DetailItem label="NIT" value={sel.nit_ctl_parqueadero__c} icon={Hash} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Depósito Block */}
      <div className="bg-card rounded-xl border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-primary" /> Información Depósito
        </h3>
        {depIsNo ? (
          <DetailItem label="Depósito" value="No" icon={Package} />
        ) : (
          <>
            <div className="space-y-1.5">
              {sel.Deposito__c && (
                <DetailItem label="Depósito" value={sel.Deposito__c} icon={Package} />
              )}
              {hasValidMatrDep && (
                <DetailItem label="No. Matricula Inmo Depósito" value={sel.No_Matricula_Inmo_Deposito__c} icon={FileText} />
              )}
              {hasValidChipDep && (
                <DetailItem label="Chip Depósito" value={sel.chip_deposito__c} icon={Hash} />
              )}
            </div>
            {showCtlDep && (
              <div className="border-t border-border/40 pt-3 mt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-primary" /> Ctl Bodega</h3>
                  {!sel.nombre_ctl_bodega__c && !sel.nit_ctl_bodega__c && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pendiente</span>
                  )}
                </div>
                <div className="space-y-1">
                  <DetailItem label="Nombre" value={sel.nombre_ctl_bodega__c} icon={FileText} />
                  <DetailItem label="NIT" value={sel.nit_ctl_bodega__c} icon={Hash} />
                </div>
              </div>
            )}
          </>
        )}
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