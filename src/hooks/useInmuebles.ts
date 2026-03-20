import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

const N8N_WEBHOOK = "https://n8n.duppla.co/webhook/prediales-nuevo";

export function useInmuebles() {
  return useQuery<Inmueble[]>({
    queryKey: ["inmuebles"],
    queryFn: async () => {
      const res = await fetch(N8N_WEBHOOK);
      if (!res.ok) throw new Error("Error fetching inmuebles");
      return res.json();
    },
    staleTime: 30 * 1000, // 30s — permite refresh rápido después de correcciones
  });
}

export function usePagos() {
  return useQuery<GestionPredial[]>({
    queryKey: ["gestion_predial"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gestion_predial")
        .select("*");
      if (error) throw error;
      return (data ?? []) as GestionPredial[];
    },
  });
}

export interface ReciboPredial {
  id: string;
  salesforce_id: string;
  nombre_inmueble?: string;
  tipo_predio: string;
  anio_vigencia?: number;
  url_recibo?: string;
  notas?: string;
  created_at?: string;
}

export function useRecibos() {
  return useQuery<ReciboPredial[]>({
    queryKey: ["recibos_predial"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recibos_predial")
        .select("*");
      if (error) throw error;
      return (data ?? []) as ReciboPredial[];
    },
  });
}
