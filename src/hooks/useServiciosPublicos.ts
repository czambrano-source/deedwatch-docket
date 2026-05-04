import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TipoServicio = "gas" | "agua" | "energia";

export interface ServicioPublicoInmueble {
  id: string;
  salesforce_id: string;
  obligacion_duppla: boolean;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FacturaServicio {
  id: string;
  salesforce_id: string;
  tipo_servicio: TipoServicio;
  mes_pago?: string | null;
  referencia_pago?: string | null;
  valor?: number | null;
  fecha_vencimiento?: string | null;
  pagado: boolean;
  fecha_pago?: string | null;
  url_soporte?: string | null;
  notas?: string | null;
  alerta_enviada: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useServiciosPublicos() {
  return useQuery<ServicioPublicoInmueble[]>({
    queryKey: ["servicios_publicos_inmueble"],
    queryFn: async () => {
      const { data, error } = await supabase.from("servicios_publicos_inmueble").select("*");
      if (error) throw error;
      return (data ?? []) as ServicioPublicoInmueble[];
    },
  });
}

export function useFacturasServicios() {
  return useQuery<FacturaServicio[]>({
    queryKey: ["facturas_servicios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facturas_servicios")
        .select("*")
        .order("fecha_vencimiento", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as FacturaServicio[];
    },
  });
}
