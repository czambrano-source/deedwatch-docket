import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Database, Search, Loader2, AlertTriangle, CheckCircle2, RefreshCw,
  Wrench, Eye, History, LayoutDashboard, FileText, FileX, TrendingUp,
  ShieldAlert, ShieldCheck, Shield, Building2, ChevronRight, ChevronDown,
  Hash, MapPin, DollarSign, Layers, Car, Package, Clock, Calendar as CalendarIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/predial/KpiCard";
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
  oportunidad: string;
  nombre_conjunto: string;
  direccion: string;
  proceso: string;
  discrepancias: Discrepancia[];
  raw: Inmueble;
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
        oportunidad: i.Opportunity__r?.Name || "",
        nombre_conjunto: i.Nombre_de_edificio_o_conjunto__c || "",
        direccion: i.Direccion__c || "",
        proceso: i.Proceso_entrega_inmueble__c || "",
        discrepancias: [],
        raw: i,
      });
    }
    return map.get(i.Id)!;
  };

  for (const inc of getInconsistencias(inmuebles)) {
    const p = ensure(inc.inmueble);
    for (const campo of inc.camposFaltantes) {
      p.discrepancias.push({
        tipo: inc.tipo === "parqueadero" ? "Parqueadero" : "Depósito",
        severidad: "media",
        campo: `${inc.tipo === "parqueadero" ? "Parqueadero" : "Depósito"} — ${campo}`,
        descripcion: `Campo "${campo}" faltante. Campos con datos: ${inc.camposPresentes.join(", ")}`,
      });
    }
  }

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
  if (s === "normalizacion") return "bg-blue-500/15 text-blue-600";
  return "bg-muted text-muted-foreground";
};

/* ─── Main Component ─── */
export default function DataPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: rawInmuebles = [], isLoading } = useInmuebles();

  const [view, setView] = useState<"general" | "historial">("general");

  // Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [severidadFilter, setSeveridadFilter] = useState("all");
  const [parqueaderoFilter, setParqueaderoFilter] = useState<"all" | "si" | "no">("all");
  const [depositoFilter, setDepositoFilter] = useState<"all" | "si" | "no">("all");

  // Problemas sheet
  const [problemasInmueble, setProblemasInmueble] = useState<InmuebleProblema | null>(null);
  const [problemasSheetOpen, setProblemasSheetOpen] = useState(false);

  // Expanded row for inmueble details
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // AI Analysis
  const [selectedInmueble, setSelectedInmueble] = useState<InmuebleProblema | null>(null);
  const [analisisIA, setAnalisisIA] = useState<AnalisisIA | null>(null);
  const [analyzingIA, setAnalyzingIA] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const cancelAnalysisRef = useRef(false);
  const [dismissedKeys, setDismissedKeys] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("dismissed_discrepancias");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const getDiscKey = (d: Discrepancia, idx?: number) => d.campo || d.campo_sf || d.descripcion || `disc-${idx ?? 0}`;

  const dismissDiscrepancia = useCallback((sfId: string, campo: string) => {
    const key = `${sfId}::${campo}`;
    setDismissedKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      localStorage.setItem("dismissed_discrepancias", JSON.stringify([...next]));
      return next;
    });
    // Remove from IA panel immediately
    setAnalisisIA(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        discrepancias: (prev.discrepancias || []).filter(d => getDiscKey(d) !== campo),
      };
    });
    toast({ title: "Omitido", description: `"${campo}" omitido para este inmueble.` });
  }, [toast]);

  // Normalizar campos
  const [normalizando, setNormalizando] = useState(false);
  const [normalizarResult, setNormalizarResult] = useState<any>(null);
  const [normalizarModalOpen, setNormalizarModalOpen] = useState(false);

  // Fix modal
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [fixDiscrepancia, setFixDiscrepancia] = useState<Discrepancia | null>(null);
  const [fixValorNuevo, setFixValorNuevo] = useState("");
  const [fixAprobadorEmail, setFixAprobadorEmail] = useState("");
  const [fixingInProgress, setFixingInProgress] = useState(false);
  const [fixTipoParqueadero, setFixTipoParqueadero] = useState("");
  const [fixNumeroDeposito, setFixNumeroDeposito] = useState("");

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
  const filterCounts = useMemo(() => {
    const conParqueadero = inmuebles.filter(i => i.raw.Parqueadero__c != null && i.raw.Parqueadero__c > 0).length;
    const sinParqueadero = inmuebles.length - conParqueadero;
    const conDeposito = inmuebles.filter(i => {
      const d = i.raw.Deposito__c;
      return d != null && String(d).toLowerCase() !== "no" && String(d) !== "0";
    }).length;
    const sinDeposito = inmuebles.length - conDeposito;
    return { conParqueadero, sinParqueadero, conDeposito, sinDeposito };
  }, [inmuebles]);

  const filteredInmuebles = useMemo(() => {
    let result = [...inmuebles];
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (i) =>
          i.codigo.toLowerCase().includes(q) ||
          i.oportunidad.toLowerCase().includes(q) ||
          i.nombre_conjunto.toLowerCase().includes(q) ||
          i.direccion.toLowerCase().includes(q)
      );
    }
    if (severidadFilter !== "all") {
      result = result.filter((i) =>
        i.discrepancias.some((d) => (d.severidad || "baja").toLowerCase() === severidadFilter)
      );
    }
    if (parqueaderoFilter !== "all") {
      result = result.filter((i) => {
        const tiene = i.raw.Parqueadero__c != null && i.raw.Parqueadero__c > 0;
        return parqueaderoFilter === "si" ? tiene : !tiene;
      });
    }
    if (depositoFilter !== "all") {
      result = result.filter((i) => {
        const d = i.raw.Deposito__c;
        const tiene = d != null && String(d).toLowerCase() !== "no" && String(d) !== "0";
        return depositoFilter === "si" ? tiene : !tiene;
      });
    }
    return result.sort((a, b) => b.discrepancias.length - a.discrepancias.length);
  }, [inmuebles, searchFilter, severidadFilter, parqueaderoFilter, depositoFilter]);

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

  /* ─── Filter AI discrepancias: remove parking/deposit field errors when unit doesn't exist ─── */
  const filterIrrelevantDiscrepancias = (discrepancias: Discrepancia[], raw: Inmueble): Discrepancia[] => {
    const noParqueadero = raw.Parqueadero__c == null || raw.Parqueadero__c === 0;
    const depVal = raw.Deposito__c;
    const noDeposito = !depVal || ["no", "0"].includes(depVal.trim().toLowerCase());

    const camposParqueadero = ["chip_parqueadero__c", "no_matricula_inmo_parqueadero__c", "numero_del_parqueadero__c"];
    const camposDeposito = ["chip_deposito__c", "no_matricula_inmo_deposito__c"];

    return discrepancias.filter((d) => {
      const campo = (d.campo || "").toLowerCase().replace(/\s+/g, "_");
      if (noParqueadero && camposParqueadero.some((c) => campo.includes(c.replace(/__c$/, "").replace(/^no_/, "")))) return false;
      if (noDeposito && camposDeposito.some((c) => campo.includes(c.replace(/__c$/, "").replace(/^no_/, "")))) return false;
      return true;
    });
  };

  /* ─── AI Analysis (async: POST → poll Supabase) ─── */
  const handleAnalizarIA = async (inm: InmuebleProblema) => {
    setSelectedInmueble(inm);
    setAnalisisIA(null);
    setAnalyzingIA(true);
    setSheetOpen(true);
    cancelAnalysisRef.current = false;
    fetchHistorial();

    try {
      const candidateCodigos = [
        inm.raw?.Codigo_inmueble__c,
        inm.raw?.codigo_inmueble,
        inm.raw?.Codigo_Inmueble__c,
        inm.codigo,
      ]
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean)
        .filter((v, idx, arr) => arr.indexOf(v) === idx);

      let payload: AnalisisIA | null = null;
      let lastError: Error | null = null;

      for (const codigo of candidateCodigos) {
        try {
          // Step 1: POST via Edge Function proxy (avoids CORS)
          const { data: postJson, error: invokeError } = await supabase.functions.invoke("analisis-discrepancias", {
            body: { codigo_inmueble: codigo },
          });

          if (invokeError || !postJson?.job_id) {
            lastError = new Error(postJson?.error || invokeError?.message || "Error al iniciar análisis");
            continue;
          }

          const jobId = postJson.job_id;

          // Step 2: Poll Supabase every 4s, max 90s
          const POLL_INTERVAL = 4000;
          const MAX_POLL_TIME = 180000;
          const startTime = Date.now();

          let jobResult: any = null;

          while (Date.now() - startTime < MAX_POLL_TIME) {
            await new Promise((r) => setTimeout(r, POLL_INTERVAL));

            if (cancelAnalysisRef.current) break;

            const { data: rows, error: pollError } = await supabase
              .from("analisis_discrepancias_jobs")
              .select("*")
              .eq("id", jobId);

            if (pollError) {
              lastError = new Error(`Error consultando estado: ${pollError.message}`);
              break;
            }

            const job = rows?.[0];
            if (!job) continue;

            if (job.status === "processing") continue;

            if (job.status === "error") {
              lastError = new Error(job.error_msg || "Error en el análisis IA");
              break;
            }

            if (job.status === "completed") {
              jobResult = job.resultado;
              break;
            }
          }

          if (!jobResult && !lastError) {
            lastError = new Error("El análisis está tardando más de lo esperado. Intenta de nuevo.");
          }

          if (!jobResult) continue;

          // Parse resultado — same structure as before
          const base = (typeof jobResult === "string" ? JSON.parse(jobResult) : jobResult) as Record<string, any>;
          const baseIsObject = !!base && typeof base === "object";
          const rawOnlyEmpty =
            baseIsObject &&
            Object.keys(base).length === 1 &&
            Object.prototype.hasOwnProperty.call(base, "raw") &&
            String(base.raw ?? "").trim() === "";

          if (!baseIsObject || rawOnlyEmpty) {
            lastError = new Error(`Respuesta vacía del análisis IA para ${codigo}`);
            continue;
          }

          // Extract raw discrepancias
          const rawDiscs = Array.isArray(base.discrepancias)
            ? base.discrepancias
            : Array.isArray(base.resultado?.discrepancias)
              ? base.resultado.discrepancias
              : Array.isArray(base.data?.discrepancias)
                ? base.data.discrepancias
                : [];

          // MAP n8n field names (campo_sf, valor_sf) to component field names (campo, valor_actual)
          const mappedDiscs = rawDiscs.map((d: any) => ({
            ...d,
            campo: d.campo || d.campo_sf,
            valor_actual: d.valor_actual || d.valor_sf,
          }));

          // Map sf_actual → datos_actuales_sf for the SF panel
          const sfActual = base.sf_actual || base.resultado?.sf_actual || base.data?.sf_actual || null;

          const docsAnalizados = Array.isArray(base.documentos_analizados)
              ? base.documentos_analizados
              : Array.isArray(base.docs_analizados) ? base.docs_analizados
              : Array.isArray(base.resultado?.documentos_analizados) ? base.resultado.documentos_analizados
              : Array.isArray(base.resultado?.docs_analizados) ? base.resultado.docs_analizados
              : Array.isArray(base.data?.documentos_analizados) ? base.data.documentos_analizados
              : [];

          const docsFaltantes = Array.isArray(base.documentos_faltantes)
              ? base.documentos_faltantes
              : Array.isArray(base.docs_faltantes) ? base.docs_faltantes
              : Array.isArray(base.resultado?.documentos_faltantes) ? base.resultado.documentos_faltantes
              : Array.isArray(base.resultado?.docs_faltantes) ? base.resultado.docs_faltantes
              : Array.isArray(base.data?.documentos_faltantes) ? base.data.documentos_faltantes
              : [];

          payload = {
            ...base,
            datos_actuales_sf: sfActual,
            discrepancias: mappedDiscs,
            documentos_analizados: docsAnalizados,
            documentos_faltantes: docsFaltantes,
          };
          break;
        } catch (err: any) {
          lastError = err;
          continue;
        }
      }

      if (!payload) {
        throw lastError ?? new Error("No se pudo obtener respuesta válida del análisis IA");
      }

      // Filter out irrelevant discrepancias for properties without parking/deposit
      if (payload?.discrepancias) {
        payload.discrepancias = filterIrrelevantDiscrepancias(payload.discrepancias, inm.raw);

        // If AI confirms parking >= 1 and numero_del_parqueadero is missing, suggest finding it
        if (inm.raw.Parqueadero__c != null && inm.raw.Parqueadero__c >= 1 && !inm.raw.numero_del_parqueadero__c) {
          const alreadyHasNumero = payload.discrepancias.some((d: Discrepancia) =>
            (d.campo || "").toLowerCase().includes("numero") && (d.campo || "").toLowerCase().includes("parqueadero")
          );
          if (!alreadyHasNumero) {
            payload.discrepancias.push({
              tipo: "Parqueadero",
              severidad: "media",
              campo: "numero_del_parqueadero__c",
              descripcion: `El inmueble tiene ${inm.raw.Parqueadero__c} parqueadero(s) pero no tiene número asignado. Revise la escritura o documentos para identificar el número.`,
              valor_actual: "vacío",
              valor_documento: null,
              fuente: "Análisis automático",
            });
          }
        }

        // Helper: check if a discrepancy for a campo already exists
        const hasDisc = (campo: string) => payload!.discrepancias!.some((d: Discrepancia) =>
          (d.campo || "").toLowerCase() === campo.toLowerCase()
        );

        const isGenericOrEmpty = (val: string | null | undefined) => {
          if (!val) return true;
          const v = val.trim().toLowerCase();
          return !v || ["n/a", "no tiene", "-", "sin_chip", "sin_matricula", "0"].includes(v);
        };

        const chipApto = (inm.raw.chip_apartamento__c || "").trim();
        const matApto = (inm.raw.Numero_matricula_inmobiliaria__c || "").trim();

        // PARQUEADERO: detect missing chip/matricula
        if (inm.raw.Parqueadero__c != null && inm.raw.Parqueadero__c >= 1) {
          const chipParq = (inm.raw.chip_parqueadero__c || "").trim();
          const matParq = (inm.raw.No_Matricula_Inmo_Parqueadero__c || "").trim();

          if (chipParq && chipApto && chipParq === chipApto && chipParq.toUpperCase() !== "SIN_CHIP") {
            if (!hasDisc("chip_parqueadero__c")) {
              payload.discrepancias.push({
                tipo: "Normalización", severidad: "normalizacion", campo: "chip_parqueadero__c",
                descripcion: "El chip del parqueadero es el mismo que el del apartamento. Debe marcarse como SIN_CHIP.",
                valor_actual: chipParq, valor_documento: "SIN_CHIP", fuente: "Validación automática",
              });
            }
          } else if (isGenericOrEmpty(chipParq) && !hasDisc("chip_parqueadero__c")) {
            payload.discrepancias.push({
              tipo: "Parqueadero", severidad: "alta", campo: "chip_parqueadero__c",
              descripcion: "Tiene parqueadero pero falta chip. No hay documentos para verificar.",
              valor_actual: chipParq || "vacío", valor_documento: null, fuente: "Validación automática",
            });
          }

          if (matParq && matApto && matParq === matApto && matParq.toUpperCase() !== "SIN_MATRICULA") {
            if (!hasDisc("No_Matricula_Inmo_Parqueadero__c")) {
              payload.discrepancias.push({
                tipo: "Normalización", severidad: "normalizacion", campo: "No_Matricula_Inmo_Parqueadero__c",
                descripcion: "La matrícula del parqueadero es la misma que la del apartamento. Debe marcarse como SIN_MATRICULA.",
                valor_actual: matParq, valor_documento: "SIN_MATRICULA", fuente: "Validación automática",
              });
            }
          } else if (isGenericOrEmpty(matParq) && !hasDisc("No_Matricula_Inmo_Parqueadero__c")) {
            payload.discrepancias.push({
              tipo: "Parqueadero", severidad: "alta", campo: "No_Matricula_Inmo_Parqueadero__c",
              descripcion: "Tiene parqueadero pero falta matrícula. No hay documentos para verificar.",
              valor_actual: matParq || "vacío", valor_documento: null, fuente: "Validación automática",
            });
          }
        }

        // DEPOSITO: detect missing chip/matricula
        const depVal2 = inm.raw.Deposito__c;
        const hasDeposit = depVal2 && !["no", "0"].includes(depVal2.trim().toLowerCase());
        if (hasDeposit) {
          const chipDep = (inm.raw.chip_deposito__c || "").trim();
          const matDep = (inm.raw.No_Matricula_Inmo_Deposito__c || "").trim();

          if (chipDep && chipApto && chipDep === chipApto && chipDep.toUpperCase() !== "SIN_CHIP") {
            if (!hasDisc("chip_deposito__c")) {
              payload.discrepancias.push({
                tipo: "Normalización", severidad: "normalizacion", campo: "chip_deposito__c",
                descripcion: "El chip del depósito es el mismo que el del apartamento. Debe marcarse como SIN_CHIP.",
                valor_actual: chipDep, valor_documento: "SIN_CHIP", fuente: "Validación automática",
              });
            }
          } else if (isGenericOrEmpty(chipDep) && !hasDisc("chip_deposito__c")) {
            payload.discrepancias.push({
              tipo: "Depósito", severidad: "alta", campo: "chip_deposito__c",
              descripcion: "Tiene depósito pero falta chip. No hay documentos para verificar.",
              valor_actual: chipDep || "vacío", valor_documento: null, fuente: "Validación automática",
            });
          }

          if (matDep && matApto && matDep === matApto && matDep.toUpperCase() !== "SIN_MATRICULA") {
            if (!hasDisc("No_Matricula_Inmo_Deposito__c")) {
              payload.discrepancias.push({
                tipo: "Normalización", severidad: "normalizacion", campo: "No_Matricula_Inmo_Deposito__c",
                descripcion: "La matrícula del depósito es la misma que la del apartamento. Debe marcarse como SIN_MATRICULA.",
                valor_actual: matDep, valor_documento: "SIN_MATRICULA", fuente: "Validación automática",
              });
            }
          } else if (isGenericOrEmpty(matDep) && !hasDisc("No_Matricula_Inmo_Deposito__c")) {
            payload.discrepancias.push({
              tipo: "Depósito", severidad: "alta", campo: "No_Matricula_Inmo_Deposito__c",
              descripcion: "Tiene depósito pero falta matrícula. No hay documentos para verificar.",
              valor_actual: matDep || "vacío", valor_documento: null, fuente: "Validación automática",
            });
          }
        }
      }

      setAnalisisIA(payload);
    } catch (err: any) {
      toast({ title: "Error en análisis IA", description: err.message, variant: "destructive" });
      // Don't close the panel on error - let user retry or close manually
    } finally {
      setAnalyzingIA(false);
    }
  };

  /* ─── Normalizar campos ─── */
  const handleNormalizarCampos = async (inm: InmuebleProblema) => {
    setSelectedInmueble(inm);
    setNormalizando(true);
    setNormalizarResult(null);
    setNormalizarModalOpen(true);
    try {
      const { data, error } = await supabase.functions.invoke("normalizar-campos-sf", {
        body: { codigo_inmueble: inm.codigo, aprobado_por: "usuario@duppla.co" },
      });
      if (error) throw new Error(error.message);
      if ((data as any)?.ok === false) throw new Error((data as any).error ?? "Error");
      const payload = (data as any)?.payload ?? data;
      setNormalizarResult(payload);

      // Save each change to historial
      const cambios = payload?.cambios || payload?.changes || [];
      for (const c of cambios) {
        await supabase.from("historial_cambios_sf").insert({
          codigo_inmueble: inm.codigo,
          salesforce_id: inm.salesforce_id,
          campo_corregido: c.campo || c.field || "",
          valor_anterior: c.valor_anterior || c.old_value || null,
          valor_nuevo: c.valor_nuevo || c.new_value || null,
          fuente: "Normalización automática",
          aprobado_por: "usuario@duppla.co",
        });
      }
      if (cambios.length > 0) {
        fetchHistorial();
        queryClient.invalidateQueries({ queryKey: ["inmuebles"] });
      }
    } catch (err: any) {
      toast({ title: "Error al normalizar", description: err.message, variant: "destructive" });
      setNormalizarModalOpen(false);
    } finally {
      setNormalizando(false);
    }
  };

  /* ─── Fix flow ─── */
  const NUMERIC_FIX_FIELDS = new Set([
    "numero_del_parqueadero__c",
    "parqueadero__c",
  ]);

  const normalizeFixText = (disc?: Discrepancia | null) =>
    `${disc?.campo || ""} ${disc?.descripcion || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isDepositoBooleanDiscrepancia = (disc?: Discrepancia | null) => {
    const normalized = normalizeFixText(disc);
    return normalized.includes("deposito") && !normalized.includes("matricula") && !normalized.includes("chip");
  };

  const isNumericFixField = (campo?: string) => {
    const c = (campo || "").trim().toLowerCase();
    return NUMERIC_FIX_FIELDS.has(c);
  };

  const isParqueaderoNumeroField = (disc?: Discrepancia | null) => {
    const campo = (disc?.campo || disc?.campo_sf || "").toLowerCase();
    return campo.includes("numero") && campo.includes("parqueadero");
  };

  const isDepositoNumeroOrBoolean = (disc?: Discrepancia | null) => {
    return isDepositoBooleanDiscrepancia(disc);
  };

  const resolveCampoDiscrepancia = (disc?: Discrepancia | null) => {
    const rawCampo = (disc?.campo || "").trim();
    if (/__c$/i.test(rawCampo)) return rawCampo;

    const normalized = normalizeFixText(disc);

    // Depósito booleano (Si/No)
    if (normalized.includes("deposito") && !normalized.includes("matricula") && !normalized.includes("chip")) {
      return "Deposito__c";
    }

    // Mapeo por palabras clave en campo + descripción
    const keywordMap: [string[], string][] = [
      [["numero", "parqueadero"], "numero_del_parqueadero__c"],
      [["chip", "parqueadero"], "chip_parqueadero__c"],
      [["matricula", "parqueadero"], "No_Matricula_Inmo_Parqueadero__c"],
      [["chip", "deposito"], "chip_deposito__c"],
      [["matricula", "deposito"], "No_Matricula_Inmo_Deposito__c"],
      [["chip", "apartamento"], "chip_apartamento__c"],
      [["matricula", "apartamento"], "Numero_matricula_inmobiliaria__c"],
      [["matricula", "inmobiliaria"], "Numero_matricula_inmobiliaria__c"],
      [["fecha", "escritura"], "Fecha_firma_escritura__c"],
      [["direccion"], "Direccion__c"],
      [["fiduciaria"], "Fiduciaria__c"],
      [["municipio"], "Municipio__c"],
      [["torre"], "Torre__c"],
      [["numero", "apartamento"], "Numero_de_apartamento__c"],
    ];

    for (const [keywords, sfField] of keywordMap) {
      if (keywords.every((kw) => normalized.includes(kw))) return sfField;
    }

    return rawCampo || undefined;
  };

  const normalizeFixValor = (campo: string, valor: string) => {
    const trimmed = (valor || "").trim();

    if (isNumericFixField(campo)) {
      if (!/^\d+$/.test(trimmed)) {
        throw new Error(`El campo "${campo}" solo acepta números (ej: 56).`);
      }
      return Number(trimmed);
    }

    return trimmed;
  };

  const openFixModal = (disc: Discrepancia) => {
    setFixDiscrepancia(disc);

    const resolvedCampo = resolveCampoDiscrepancia(disc);

    if (isDepositoBooleanDiscrepancia(disc)) {
      const docValue = (disc.valor_documento || "").trim().toLowerCase();
      const initial = docValue === "si" ? "Si" : docValue === "no" ? "No" : "";
      setFixValorNuevo(initial);
    } else if (isNumericFixField(resolvedCampo)) {
      const sourceValue = disc.valor_documento ?? disc.valor_actual ?? "";
      const initial = String(sourceValue).replace(/[^0-9]/g, "");
      setFixValorNuevo(initial);
    } else {
      setFixValorNuevo(disc.valor_documento || "");
    }

    setFixAprobadorEmail("");
    setFixTipoParqueadero("");
    setFixNumeroDeposito("");
    setFixModalOpen(true);
  };

  const handleConfirmFix = async () => {
    if (!fixDiscrepancia || !selectedInmueble || !fixAprobadorEmail) return;

    const campoCorregido = resolveCampoDiscrepancia(fixDiscrepancia);
    if (!campoCorregido) {
      toast({ title: "Error al corregir", description: "No se pudo identificar el campo de Salesforce.", variant: "destructive" });
      return;
    }

    setFixingInProgress(true);
    try {
      const valorNormalizado = normalizeFixValor(campoCorregido, fixValorNuevo);
      const valorNormalizadoTexto = String(valorNormalizado);

      const payload = {
        inmueble_id: selectedInmueble.salesforce_id,
        campo: campoCorregido,
        valor_nuevo: valorNormalizado,
        fuente: fixDiscrepancia.fuente || "Escritura",
        aprobado_por: fixAprobadorEmail,
      };
      const { data, error } = await supabase.functions.invoke("fix-discrepancia-sf", { body: payload });
      if (error) throw new Error(error.message);
      if ((data as any)?.ok === false) throw new Error((data as any).error ?? "Error");

      // Si es parqueadero y seleccionaron tipo, actualizar Tipo_de_parqueadero__c tambien
      if (isParqueaderoNumeroField(fixDiscrepancia) && fixTipoParqueadero) {
        await supabase.functions.invoke("fix-discrepancia-sf", {
          body: { inmueble_id: selectedInmueble.salesforce_id, campo: "Tipo_de_parqueadero__c", valor_nuevo: fixTipoParqueadero, fuente: "Corrección manual", aprobado_por: fixAprobadorEmail }
        });
        await supabase.from("historial_cambios_sf").insert({
          codigo_inmueble: selectedInmueble.codigo, salesforce_id: selectedInmueble.salesforce_id,
          campo_corregido: "Tipo_de_parqueadero__c", valor_anterior: null, valor_nuevo: fixTipoParqueadero,
          fuente: "Corrección manual", aprobado_por: fixAprobadorEmail,
        });
      }

      // Si es deposito y escribieron numero, guardar en Supabase (SF aun no tiene el campo)
      if (isDepositoNumeroOrBoolean(fixDiscrepancia) && fixNumeroDeposito) {
        await supabase.from("notas_predial").insert({
          salesforce_id: selectedInmueble.salesforce_id,
          nombre_inmueble: selectedInmueble.codigo,
          tipo_predio: "deposito",
          nota: `Número de depósito: ${fixNumeroDeposito}`,
        });
      }

      await supabase.from("historial_cambios_sf").insert({
        codigo_inmueble: selectedInmueble.codigo,
        salesforce_id: selectedInmueble.salesforce_id,
        campo_corregido: campoCorregido,
        valor_anterior: fixDiscrepancia.valor_actual,
        valor_nuevo: valorNormalizadoTexto,
        fuente: fixDiscrepancia.fuente,
        aprobado_por: fixAprobadorEmail,
      });

      toast({ title: "Corregido", description: `Campo "${campoCorregido}" actualizado a "${valorNormalizadoTexto}".` });
      setFixModalOpen(false);
      // Remove the fixed discrepancy from the IA panel immediately
      setAnalisisIA(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          discrepancias: (prev.discrepancias || []).filter(d =>
            (d.campo || d.campo_sf) !== campoCorregido
          ),
        };
      });
      fetchHistorial();
      // Refresh inmuebles data from SF so the detail view updates immediately
      queryClient.invalidateQueries({ queryKey: ["inmuebles"] });
    } catch (err: any) {
      toast({ title: "Error al corregir", description: err.message, variant: "destructive" });
    } finally {
      setFixingInProgress(false);
    }
  };

  const inmuebleHistorial = useMemo(() => {
    if (!selectedInmueble?.codigo) return [];
    return historial.filter((h) => h.codigo_inmueble === selectedInmueble.codigo);
  }, [historial, selectedInmueble]);

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
    <div className="min-h-screen bg-background flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" /> Consistencia de Datos SF
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Análisis de inconsistencias en Salesforce</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={view === "general" ? "default" : "outline"}
                  className="text-xs gap-1.5"
                  onClick={() => setView("general")}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Vista General
                </Button>
                <Button
                  size="sm"
                  variant={view === "historial" ? "default" : "outline"}
                  className="text-xs gap-1.5"
                  onClick={() => setView("historial")}
                >
                  <History className="w-3.5 h-3.5" />
                  Historial
                </Button>
              </div>
            </div>

            {view === "general" && (
              <div className="space-y-6">
                {/* KPI Cards — same as Prediales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard
                    title="Total Inmuebles"
                    value={kpis.total}
                    subtitle="Analizados"
                    icon={Database}
                    iconBg="bg-duppla-blue-light"
                    iconColor="text-duppla-blue"
                  />
                  <KpiCard
                    title="Con Problemas"
                    value={kpis.conProblemas}
                    subtitle="Inmuebles con inconsistencias"
                    icon={AlertTriangle}
                    iconBg="bg-duppla-orange-light"
                    iconColor="text-duppla-orange"
                  />
                  <KpiCard
                    title="Severidad Alta"
                    value={kpis.alta}
                    subtitle="Discrepancias críticas"
                    icon={ShieldAlert}
                    iconBg="bg-duppla-red-light"
                    iconColor="text-destructive"
                  />
                  <KpiCard
                    title="Severidad Media"
                    value={kpis.media}
                    subtitle="Datos parciales"
                    icon={Shield}
                    iconBg="bg-duppla-orange-light"
                    iconColor="text-duppla-orange"
                  />
                </div>

                {/* Filters */}
                <div className="bg-card rounded-lg border p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                      <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Buscar código, oportunidad, dirección…"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-8 h-9 text-xs"
                      />
                    </div>
                    <Select value={severidadFilter} onValueChange={setSeveridadFilter}>
                      <SelectTrigger className="w-40 h-9 text-xs">
                        <SelectValue placeholder="Prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Prioridad</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={parqueaderoFilter} onValueChange={(v) => setParqueaderoFilter(v as any)}>
                      <SelectTrigger className="w-52 h-9 text-xs">
                        <SelectValue placeholder="Parqueadero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Parqueadero — Todos</SelectItem>
                        <SelectItem value="si">Con parqueadero ({filterCounts.conParqueadero})</SelectItem>
                        <SelectItem value="no">Sin parqueadero ({filterCounts.sinParqueadero})</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={depositoFilter} onValueChange={(v) => setDepositoFilter(v as any)}>
                      <SelectTrigger className="w-48 h-9 text-xs">
                        <SelectValue placeholder="Depósito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Depósito — Todos</SelectItem>
                        <SelectItem value="si">Con depósito ({filterCounts.conDeposito})</SelectItem>
                        <SelectItem value="no">Sin depósito ({filterCounts.sinDeposito})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* List — Prediales style */}
                {filteredInmuebles.length === 0 ? (
                  <div className="bg-card rounded-xl border p-12 flex flex-col items-center justify-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    <p className="text-sm font-medium text-foreground">Sin inconsistencias encontradas</p>
                    <p className="text-xs text-muted-foreground">Todos los inmuebles están sincronizados.</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border overflow-hidden divide-y">
                    {filteredInmuebles.map((inm) => {
                      const counts = severityCounts(inm.discrepancias);
                      const totalProblems = inm.discrepancias.length;
                      const isExpanded = expandedId === inm.salesforce_id;
                      return (
                        <div key={inm.salesforce_id}>
                          <div className="flex items-center gap-3 p-4 border-l-4 border-l-transparent hover:bg-muted/50 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">{inm.codigo}</p>
                              <p className="text-xs text-muted-foreground truncate">{inm.oportunidad || "—"}</p>
                            </div>
                            {/* Total problems badge — click to open modal */}
                            <button
                              onClick={() => { setProblemasInmueble(inm); setProblemasSheetOpen(true); }}
                              className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer",
                                counts.alta > 0
                                  ? "text-destructive bg-destructive/10 hover:bg-destructive/20"
                                  : counts.media > 0
                                    ? "text-duppla-orange bg-duppla-orange/10 hover:bg-duppla-orange/20"
                                    : "text-muted-foreground bg-muted hover:bg-muted/80"
                              )}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {totalProblems} {totalProblems === 1 ? "problema" : "problemas"}
                            </button>
                            {/* Chevron to expand inmueble details */}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : inm.salesforce_id)}
                              className="flex-shrink-0 text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Expanded: inmueble details */}
                          {isExpanded && (() => {
                            const sel = inm.raw;
                            const isValidField = (val?: string | number | null) => {
                              if (val == null) return false;
                              if (typeof val !== 'string') return false;
                              const n = val.trim().toLowerCase();
                              return n !== "" && n !== "n/a" && n !== "no tiene" && n !== "-" && n !== "sin_chip" && n !== "sin_matricula";
                            };
                            const getFidName = (i: any) => i.Fiduciaria__r?.Name ?? i.Fiduciaria__c ?? "—";
                            const hasParq = () => {
                              if (sel.Parqueadero__c != null && sel.Parqueadero__c > 0) return true;
                              if (isValidField(sel.numero_del_parqueadero__c)) return true;
                              if (isValidField(sel.No_Matricula_Inmo_Parqueadero__c)) return true;
                              if (isValidField(sel.chip_parqueadero__c)) return true;
                              return false;
                            };
                            const hasDep = () => {
                              if (sel.Deposito__c && sel.Deposito__c !== "No" && sel.Deposito__c !== "0" && !["n/a","no tiene","sin_matricula"].includes(sel.Deposito__c.toLowerCase())) return true;
                              if (isValidField(sel.No_Matricula_Inmo_Deposito__c)) return true;
                              if (isValidField(sel.chip_deposito__c)) return true;
                              return false;
                            };
                            const showCtlInm = isValidField(sel.Numero_matricula_inmobiliaria__c) || isValidField(sel.chip_apartamento__c);
                            const showCtlParq = isValidField(sel.No_Matricula_Inmo_Parqueadero__c) || isValidField(sel.chip_parqueadero__c);
                            const showCtlDep = isValidField(sel.No_Matricula_Inmo_Deposito__c) || isValidField(sel.chip_deposito__c);

                            return (
                              <div className="bg-muted/20 border-l-4 border-l-primary px-6 py-5 space-y-5">
                                <div className={cn("flex gap-5", sheetOpen && selectedInmueble?.salesforce_id === inm.salesforce_id ? "flex-col xl:flex-row xl:items-stretch" : "")}>
                                  {/* Left column: all property info */}
                                  <div className={cn("space-y-5 min-w-0", sheetOpen && selectedInmueble?.salesforce_id === inm.salesforce_id ? "xl:flex-1" : "flex-1")}>
                                {/* Inmueble Block */}
                                <div className="bg-card rounded-xl border p-5 space-y-4">
                                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-primary" /> Información del Inmueble
                                  </h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-3">
                                      <DItem label="Fiduciaria" value={getFidName(sel)} icon={Building2} />
                                      <DItem label="Municipio" value={sel.Municipio_del__c} icon={MapPin} />
                                      <DItem label="Departamento" value={sel.Departamento__c} icon={MapPin} />
                                      <DItem label="Ciudad Inmueble" value={sel.Ciudad_Inmueble__c} icon={MapPin} />
                                      <DItem label="Dirección" value={sel.Direccion__c} icon={MapPin} />
                                    </div>
                                    <div className="space-y-3">
                                      <DItem label="Nombre de edificio o conjunto" value={sel.Nombre_de_edificio_o_conjunto__c} icon={Building2} />
                                      <DItem label="Tipo de inmueble" value={sel.Tipo_de_inmueble__c} icon={Building2} />
                                      <DItem label="Número de apartamento" value={sel.Numero_de_apartamento__c} icon={Building2} />
                                      <DItem label="Torre" value={sel.Torre__c} icon={Layers} />
                                    </div>
                                    <div className="space-y-3">
                                      <DItem label="Fecha Firma Escritura" value={sel.Legales__r?.records?.[0]?.Fecha_firma_escritura__c ?? undefined} icon={CalendarIcon} />
                                      <DItem label="No. Matricula Inmo Apto" value={sel.Numero_matricula_inmobiliaria__c} icon={FileText} />
                                      <DItem label="Chip Apartamento" value={sel.chip_apartamento__c === "SIN_CHIP" ? "Sin asignar" : (sel.chip_apartamento__c || "Sin asignar")} icon={Hash} />
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
                                        <DItem label="Nombre" value={sel.nombre_ctl_inmueble__c} icon={FileText} />
                                        <DItem label="NIT" value={sel.nit_ctl_inmueble__c} icon={Hash} />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(() => {
                                  const parqIsNo = sel.Parqueadero__c == null || sel.Parqueadero__c === 0;
                                  return (
                                    <div className="bg-card rounded-xl border p-5 space-y-4">
                                      <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                                        <Car className="w-4 h-4 text-primary" /> Información Parqueadero
                                      </h3>
                                      {parqIsNo ? (
                                        <DItem label="Parqueadero" value="No" icon={Car} />
                                      ) : (
                                        <>
                                          <div className="space-y-1.5">
                                            <DItem label="Parqueadero" value={`Sí (${sel.Parqueadero__c})`} icon={Car} />
                                            <DItem label="Número del parqueadero" value={sel.numero_del_parqueadero__c} icon={Hash} />
                                            <DItem label="No. Matricula Inmo Parqueadero" value={sel.No_Matricula_Inmo_Parqueadero__c} icon={FileText} />
                                            <DItem label="Chip Parqueadero" value={sel.chip_parqueadero__c} icon={Hash} />
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
                                                <DItem label="Nombre" value={sel.nombre_ctl_parqueadero__c} icon={FileText} />
                                                <DItem label="NIT" value={sel.nit_ctl_parqueadero__c} icon={Hash} />
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  );
                                })()}
                                {(() => {
                                  const depIsNo = !sel.Deposito__c || ["no", "0"].includes(sel.Deposito__c.trim().toLowerCase());
                                  return (
                                    <div className="bg-card rounded-xl border p-5 space-y-4">
                                      <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                                        <Package className="w-4 h-4 text-primary" /> Información Depósito
                                      </h3>
                                      {depIsNo ? (
                                        <DItem label="Depósito" value="No" icon={Package} />
                                      ) : (
                                        <>
                                          <div className="space-y-1.5">
                                            <DItem label="Depósito" value={sel.Deposito__c} icon={Package} />
                                            <DItem label="Número del depósito" value={(sel as any).numero_del_deposito__c || "—"} icon={Hash} />
                                            <DItem label="No. Matricula Inmo Depósito" value={sel.No_Matricula_Inmo_Deposito__c} icon={FileText} />
                                            <DItem label="Chip Depósito" value={sel.chip_deposito__c} icon={Hash} />
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
                                                <DItem label="Nombre" value={sel.nombre_ctl_bodega__c} icon={FileText} />
                                                <DItem label="NIT" value={sel.nit_ctl_bodega__c} icon={Hash} />
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  );
                                })()}
                                  </div>
                                  </div>

                                  {/* Right: IA Analysis panel */}
                                  {sheetOpen && selectedInmueble?.salesforce_id === inm.salesforce_id && (
                                    <div className="xl:w-[420px] flex-shrink-0 bg-card rounded-xl border p-5 flex flex-col" style={{height: 'calc(100vh - 280px)', minHeight: '400px'}}>
                                      <div className="flex items-center justify-between flex-shrink-0 mb-4">
                                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                          <Eye className="w-4 h-4 text-primary" /> Análisis IA
                                        </h3>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { cancelAnalysisRef.current = true; setAnalyzingIA(false); setSheetOpen(false); }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        </Button>
                                      </div>
                                      <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-5">

                                      {analyzingIA && (
                                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                          <p className="text-sm text-muted-foreground text-center">
                                            Analizando documentos…<br />
                                            <span className="text-xs">consultando resultados del análisis…</span>
                                          </p>
                                        </div>
                                      )}

                                      {!analyzingIA && analisisIA && (
                                        <div className="space-y-5">
                                          {analisisIA.datos_actuales_sf && (
                                            <div>
                                              <h4 className="text-xs font-semibold text-foreground mb-2">Datos actuales en SF</h4>
                                              <div className="bg-muted rounded-lg p-3 space-y-1">
                                                {Object.entries(analisisIA.datos_actuales_sf).map(([key, val]) => (
                                                  <div key={key} className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">{key}</span>
                                                    <span className={cn("font-mono", !val && "bg-duppla-orange/10 px-1 rounded text-duppla-orange")}>
                                                      {val ? String(val) : "vacío"}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {(analisisIA.documentos_analizados?.length || analisisIA.documentos_faltantes?.length) ? (
                                            <div>
                                              <h4 className="text-xs font-semibold text-foreground mb-2">Documentos</h4>
                                              <div className="space-y-1">
                                                {analisisIA.documentos_analizados?.map((doc, i) => (
                                                  <div key={i} className="flex items-center gap-2 text-xs">
                                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-foreground">{doc}</span>
                                                    <span className="text-[10px] text-primary bg-duppla-green-light px-1.5 py-0.5 rounded">Analizado</span>
                                                  </div>
                                                ))}
                                                {analisisIA.documentos_faltantes?.map((doc, i) => (
                                                  <div key={i} className="flex items-center gap-2 text-xs">
                                                    <FileX className="w-3.5 h-3.5 text-destructive" />
                                                    <span className="text-muted-foreground">{doc}</span>
                                                    <span className="text-[10px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">Faltante</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : null}

                                          {/* Alertas: solo cantidad de parqueaderos/depositos, no errores de PDF */}
                                          {analisisIA.alertas?.filter((a: string) => !a.includes('pudo leer')).length > 0 && (
                                            <div className="space-y-1">
                                              {(analisisIA.alertas as string[]).filter((a: string) => !a.includes('pudo leer')).map((alerta: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-xs bg-duppla-orange/10 text-duppla-orange rounded px-2 py-1.5">
                                                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                                  <span>{alerta}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {/* Tabla comparativa por campos */}
                                          {(() => {
                                            // Support both old "campos" format and new "discrepancias" format
                                            const hasCampos = Array.isArray(analisisIA.campos) && analisisIA.campos.length > 0;
                                            const rawItems = hasCampos ? analisisIA.campos : (analisisIA.discrepancias || []);
                                            if (!rawItems.length) return (
                                              <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                                Sin discrepancias encontradas
                                              </div>
                                            );

                                            const sfId = selectedInmueble?.salesforce_id || "";

                                            // NEW format: discrepancias with campo_sf, valor_sf, valor_documento, fuente, descripcion
                                            if (!hasCampos) {
                                              const sevColor = (sev: string) => sev === 'alta' ? 'destructive' : sev === 'media' ? 'duppla-orange' : 'muted-foreground';
                                              return (
                                                <div className="space-y-2">
                                                  {rawItems.map((d: any, idx: number) => {
                                                    const dismissed = dismissedKeys.has(`${sfId}::${d.campo_sf || d.campo}`);
                                                    if (dismissed) return null;
                                                    const sev = d.severidad || 'media';
                                                    return (
                                                      <div key={idx} className={cn("border rounded-lg p-3 bg-background", sev === 'alta' ? "border-l-4 border-l-destructive" : sev === 'media' ? "border-l-4 border-l-duppla-orange" : "")}>
                                                        <div className="flex items-center justify-between mb-1">
                                                          <p className="text-sm font-semibold text-foreground">{d.campo || d.campo_sf}</p>
                                                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", sev === 'alta' ? "text-destructive bg-destructive/10" : "text-duppla-orange bg-duppla-orange/10")}>{d.tipo}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mb-2">{d.descripcion}</p>
                                                        <div className="space-y-1 text-xs">
                                                          <div className="flex items-center gap-2">
                                                            <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">SF:</span>
                                                            <span className={cn("font-mono px-2 py-0.5 rounded", !d.valor_sf || d.valor_sf === '-' ? "bg-duppla-orange/15 text-duppla-orange" : "bg-muted")}>{d.valor_sf || d.valor_actual || 'vacío'}</span>
                                                          </div>
                                                          {d.valor_documento && (
                                                            <div className="flex items-center gap-2">
                                                              <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">{d.fuente || 'Doc'}:</span>
                                                              <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">{d.valor_documento}</span>
                                                            </div>
                                                          )}
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                          {d.valor_documento && (
                                                            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7" onClick={() => openFixModal({ campo: d.campo_sf || d.campo, campo_sf: d.campo_sf || d.campo, valor_actual: d.valor_sf || d.valor_actual, valor_documento: d.valor_documento, fuente: d.fuente || 'Análisis IA' })}>
                                                              <Wrench className="w-3 h-3" /> Corregir
                                                            </Button>
                                                          )}
                                                          <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7 text-muted-foreground hover:text-foreground" onClick={() => dismissDiscrepancia(sfId, d.campo_sf || d.campo)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                            Omitir
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              );
                                            }

                                            // OLD format: campos with sf, escritura, ctl_compra, ctl_fiducia
                                            const sections = [...new Set(rawItems.map((c: any) => c.seccion || 'General'))];

                                            const renderSource = (src: any) => {
                                              if (!src) return <span className="text-muted-foreground">—</span>;
                                              if (src.status === 'ok' && src.value) return <span className="font-medium text-foreground bg-emerald-100 px-2 py-0.5 rounded">{src.value}</span>;
                                              if (src.status === 'vacio') return <span className="font-medium text-foreground bg-duppla-orange/15 px-2 py-0.5 rounded">No encontrado</span>;
                                              if (src.status === 'no_existe') return <span className="font-medium text-foreground bg-destructive/15 px-2 py-0.5 rounded">No existe documento</span>;
                                              if (src.status === 'error') return <span className="font-medium text-foreground bg-destructive/15 px-2 py-0.5 rounded">{src.label || 'No se pudo leer'}</span>;
                                              if (src.status === 'info') return <span className="text-foreground">—</span>;
                                              return <span className="text-foreground">—</span>;
                                            };

                                            const getBestValue = (campo: any) => {
                                              for (const src of [campo.ctl_fiducia, campo.ctl_compra, campo.escritura]) {
                                                if (src?.status === 'ok' && src.value) return src.value;
                                              }
                                              return null;
                                            };

                                            const getStatus = (campo: any): 'coincide' | 'falta_sf' | 'diferencia' | 'sin_datos' | 'no_aplica' => {
                                              if (campo.no_aplica || campo.solo_info) return 'no_aplica';
                                              const docValues = [campo.escritura, campo.ctl_compra, campo.ctl_fiducia]
                                                .filter((s: any) => s?.status === 'ok' && s.value)
                                                .map((s: any) => s.value.toLowerCase());
                                              if (docValues.length === 0) return 'sin_datos';
                                              if (!campo.sf) return 'falta_sf';
                                              const sfLower = campo.sf.toLowerCase();
                                              const allMatch = docValues.every((v: string) => v === sfLower);
                                              if (allMatch) return 'coincide';
                                              return 'diferencia';
                                            };

                                            return (
                                              <div className="space-y-4">
                                                {sections.map((section: string) => (
                                                  <div key={section}>
                                                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                                                      {section.includes('Apartamento') && <Building2 className="w-3.5 h-3.5 text-primary" />}
                                                      {section.includes('Parqueadero') && <Car className="w-3.5 h-3.5 text-primary" />}
                                                      {section.includes('Deposito') && <Package className="w-3.5 h-3.5 text-primary" />}
                                                      {section}
                                                    </h4>
                                                    <div className="space-y-2">
                                                      {rawItems.filter((c: any) => (c.seccion || 'General') === section).map((campo: any, idx: number) => {
                                                        const dismissed = dismissedKeys.has(`${sfId}::${campo.campo_sf}`);
                                                        if (dismissed) return null;
                                                        const status = getStatus(campo);
                                                        const bestVal = getBestValue(campo);

                                                        return (
                                                          <div key={idx} className={cn("border rounded-lg p-3 bg-background", status === 'diferencia' ? "border-l-4 border-l-destructive" : status === 'falta_sf' ? "border-l-4 border-l-duppla-orange" : campo.no_aplica ? "opacity-50" : "")}>
                                                            <div className="flex items-center justify-between mb-2">
                                                              <p className="text-sm font-semibold text-foreground">{campo.label}</p>
                                                              {status === 'diferencia' && (
                                                                <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">Valores diferentes</span>
                                                              )}
                                                              {status === 'falta_sf' && (
                                                                <span className="text-xs font-semibold text-duppla-orange bg-duppla-orange/10 px-2 py-0.5 rounded">Falta en SF</span>
                                                              )}
                                                              {status === 'coincide' && (
                                                                <span className="text-xs font-semibold text-primary bg-duppla-green-light px-2 py-0.5 rounded">Coincide</span>
                                                              )}
                                                            </div>
                                                            {!campo.no_aplica && campo.solo_info && (
                                                              <div className="text-xs">
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">Est. Títulos:</span>
                                                                  {renderSource(campo.escritura)}
                                                                </div>
                                                              </div>
                                                            )}
                                                            {!campo.no_aplica && campo.solo_valor && campo.campos_ctl && (
                                                              <div className="space-y-3 text-xs">
                                                                {campo.campos_ctl.map((sub: any, si: number) => (
                                                                  <div key={si}>
                                                                    <p className="text-xs font-medium text-muted-foreground mb-1">{sub.label}</p>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                      <span className="text-foreground w-[70px] flex-shrink-0 text-right font-medium">{campo.fuente_label || 'Doc'}:</span>
                                                                      <span className={cn("font-medium px-2 py-0.5 rounded", sub.valor_extraido ? "text-foreground bg-emerald-100" : "text-muted-foreground bg-muted")}>{sub.valor_extraido || 'No encontrado'}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                      <span className="text-muted-foreground w-[70px] flex-shrink-0 text-right">SF:</span>
                                                                      <span className={cn("font-mono px-2 py-0.5 rounded text-[11px]", !sub.sf ? "bg-duppla-orange/15 text-duppla-orange" : "bg-muted text-foreground")}>{sub.sf || 'vacío'}</span>
                                                                      {sub.valor_extraido && (
                                                                        <Button size="sm" variant="outline" className="gap-1 text-[11px] h-6 ml-auto" onClick={() => openFixModal({ campo: sub.campo_sf, campo_sf: sub.campo_sf, valor_actual: sub.sf, valor_documento: sub.valor_extraido, fuente: campo.fuente_label || 'CTL' })}>
                                                                          <Wrench className="w-3 h-3" /> Corregir
                                                                        </Button>
                                                                      )}
                                                                    </div>
                                                                  </div>
                                                                ))}
                                                              </div>
                                                            )}
                                                            {!campo.no_aplica && campo.solo_valor && !campo.campos_ctl && (
                                                              <div className="space-y-1.5 text-xs">
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">{campo.fuente_label || 'Documento'}:</span>
                                                                  <span className="font-medium text-foreground bg-emerald-100 px-2 py-0.5 rounded">{campo.valor_extraido || 'No encontrado'}</span>
                                                                </div>
                                                              </div>
                                                            )}
                                                            {!campo.no_aplica && !campo.solo_info && !campo.solo_valor && (
                                                              <div className="space-y-1.5 text-xs">
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">SF:</span>
                                                                  <span className={cn("font-medium text-foreground px-2 py-0.5 rounded", !campo.sf ? "bg-duppla-orange/15" : status === 'coincide' ? "bg-emerald-100" : "bg-muted")}>{campo.sf || 'vacío'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">Est. Títulos:</span>
                                                                  {renderSource(campo.escritura)}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">CTL Compra:</span>
                                                                  {renderSource(campo.ctl_compra)}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                  <span className="text-foreground w-[80px] flex-shrink-0 text-right font-medium">CTL Fiducia:</span>
                                                                  {renderSource(campo.ctl_fiducia)}
                                                                </div>
                                                              </div>
                                                            )}
                                                            {!campo.no_aplica && !campo.solo_valor && (
                                                              <div className="flex gap-2 mt-2">
                                                                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7" onClick={() => openFixModal({ campo: campo.campo_sf, campo_sf: campo.campo_sf, valor_actual: campo.sf, valor_documento: bestVal || '', fuente: 'Análisis IA' })}>
                                                                  <Wrench className="w-3 h-3" /> Corregir
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7 text-muted-foreground hover:text-foreground" onClick={() => dismissDiscrepancia(sfId, campo.campo_sf)}>
                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                                  Omitir
                                                                </Button>
                                                              </div>
                                                            )}
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            );
                                          })()}

                                          {inmuebleHistorial.length > 0 && (
                                            <div>
                                              <h4 className="text-xs font-semibold text-foreground mb-2">Cambios previos</h4>
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
                                      </div>{/* end scrollable wrapper */}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    className="gap-1.5 text-xs h-8"
                                    onClick={() => handleAnalizarIA(inm)}
                                    disabled={analyzingIA}
                                  >
                                    {analyzingIA && selectedInmueble?.salesforce_id === inm.salesforce_id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Eye className="w-3.5 h-3.5" />
                                    )}
                                    Analizar con IA
                                  </Button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── Historial View ─── */}
            {view === "historial" && (
              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-4">
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
                </div>

                {historialLoading ? (
                  <Skeleton className="h-64 rounded-lg" />
                ) : filteredHistorial.length === 0 ? (
                  <div className="bg-card rounded-xl border p-12 flex flex-col items-center justify-center gap-3">
                    <History className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No hay cambios registrados aún.</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-xs font-semibold">Fecha</TableHead>
                          <TableHead className="text-xs font-semibold">Inmueble</TableHead>
                          <TableHead className="text-xs font-semibold">Campo</TableHead>
                          <TableHead className="text-xs font-semibold">Valor Anterior</TableHead>
                          <TableHead className="text-xs font-semibold">Valor Nuevo</TableHead>
                          <TableHead className="text-xs font-semibold">Aprobó</TableHead>
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
                            <TableCell className="text-xs font-mono font-medium">{h.codigo_inmueble}</TableCell>
                            <TableCell className="text-xs font-medium">{h.campo_corregido}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{h.valor_anterior || "—"}</TableCell>
                            <TableCell className="text-xs font-medium text-primary">{h.valor_nuevo || "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{h.aprobado_por}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Problems Modal (like Prediales) ─── */}
      <Dialog open={problemasSheetOpen} onOpenChange={(v) => !v && setProblemasSheetOpen(false)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5 text-duppla-orange" />
              Reporte de Problemas — {problemasInmueble?.codigo}
            </DialogTitle>
          </DialogHeader>

          {problemasInmueble && (
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              <p className="text-xs text-muted-foreground mb-3">
                Se encontraron <span className="font-semibold text-foreground">{problemasInmueble.discrepancias.length}</span> problema(s) en este inmueble.
                {problemasInmueble.oportunidad && <span> — {problemasInmueble.oportunidad}</span>}
              </p>
              {problemasInmueble.discrepancias.map((d, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 space-y-2 bg-card"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{problemasInmueble.codigo}</p>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      {d.tipo || "General"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">📋 Campo:</p>
                      <p className="text-foreground font-medium">{d.campo || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">⚠️ Problema:</p>
                      <p className={cn(
                        "font-medium",
                        (d.severidad || "").toLowerCase() === "alta" && "text-destructive",
                        (d.severidad || "").toLowerCase() === "media" && "text-duppla-orange",
                        (d.severidad || "").toLowerCase() !== "alta" && (d.severidad || "").toLowerCase() !== "media" && "text-muted-foreground",
                      )}>
                        {d.descripcion || "Sin detalle disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Fix Confirmation Modal ─── */}
      <Dialog open={fixModalOpen} onOpenChange={setFixModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar corrección en Salesforce</DialogTitle>
            <DialogDescription>Se actualizará el siguiente campo en Salesforce.</DialogDescription>
          </DialogHeader>
          {fixDiscrepancia && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs text-muted-foreground">Campo</label>
                  <p className="font-medium text-foreground">{resolveCampoDiscrepancia(fixDiscrepancia) || fixDiscrepancia.campo || fixDiscrepancia.descripcion || "—"}</p>
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
                <label className="text-xs text-muted-foreground">{isParqueaderoNumeroField(fixDiscrepancia) ? "Cant. Parqueadero (SF: Parqueadero__c)" : isDepositoBooleanDiscrepancia(fixDiscrepancia) ? "Deposito (SF: Deposito__c)" : `${resolveCampoDiscrepancia(fixDiscrepancia) || "Valor nuevo"}`}</label>
                {isDepositoBooleanDiscrepancia(fixDiscrepancia) ? (
                  <Select value={fixValorNuevo} onValueChange={setFixValorNuevo}>
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Si">Si</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : isNumericFixField(resolveCampoDiscrepancia(fixDiscrepancia)) ? (
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={fixValorNuevo}
                    onChange={(e) => setFixValorNuevo(e.target.value)}
                    className="mt-1 text-sm"
                    placeholder="Solo números"
                  />
                ) : (
                  <Input value={fixValorNuevo} onChange={(e) => setFixValorNuevo(e.target.value)} className="mt-1 text-sm" />
                )}
              </div>
              {isParqueaderoNumeroField(fixDiscrepancia) && (
                <div>
                  <label className="text-xs text-muted-foreground">Tipo de parqueadero (SF: Tipo_de_parqueadero__c)</label>
                  <Select value={fixTipoParqueadero} onValueChange={setFixTipoParqueadero}>
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unico">Unico</SelectItem>
                      <SelectItem value="Servidumbre">Servidumbre</SelectItem>
                      <SelectItem value="Sin parqueadero">Sin parqueadero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isDepositoNumeroOrBoolean(fixDiscrepancia) && (
                <div>
                  <label className="text-xs text-muted-foreground">Numero de deposito (se guarda local, SF aun no tiene campo)</label>
                  <Input
                    value={fixNumeroDeposito}
                    onChange={(e) => setFixNumeroDeposito(e.target.value)}
                    className="mt-1 text-sm"
                    placeholder="Ej: 101, B-3"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground">Email del aprobador</label>
                <Input
                  type="email"
                  placeholder="correo@duppla.co"
                  value={fixAprobadorEmail}
                  onChange={(e) => setFixAprobadorEmail(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFixModalOpen(false)} disabled={fixingInProgress}>Cancelar</Button>
            <Button onClick={handleConfirmFix} disabled={fixingInProgress || !fixValorNuevo || !fixAprobadorEmail}>
              {fixingInProgress && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirmar corrección
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Normalizar Campos Modal ─── */}
      <Dialog open={normalizarModalOpen} onOpenChange={setNormalizarModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Normalizar campos — {selectedInmueble?.codigo}
            </DialogTitle>
            <DialogDescription>Limpieza automática de valores basura en Salesforce.</DialogDescription>
          </DialogHeader>

          {normalizando && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground text-center">
                Normalizando campos en SF…<br />
                <span className="text-xs">Esto puede tardar unos segundos</span>
              </p>
            </div>
          )}

          {!normalizando && normalizarResult && (() => {
            const cambios = normalizarResult?.cambios || normalizarResult?.changes || [];
            return (
              <div className="space-y-4 py-2">
                {cambios.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    No se encontraron campos para normalizar. Todo está limpio.
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">
                      Se normalizaron <span className="font-semibold text-foreground">{cambios.length}</span> campo(s):
                    </p>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                      {cambios.map((c: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-3 bg-muted/30 space-y-1">
                          <p className="text-xs font-semibold text-foreground">{c.campo || c.field}</p>
                          <div className="flex gap-4 text-[11px]">
                            <div>
                              <span className="text-muted-foreground">Antes: </span>
                              <span className="font-mono text-destructive">{c.valor_anterior || c.old_value || "vacío"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Ahora: </span>
                              <span className="font-mono text-primary">{c.valor_nuevo || c.new_value || "—"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setNormalizarModalOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
