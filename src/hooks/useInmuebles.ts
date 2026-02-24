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
    staleTime: 5 * 60 * 1000,
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
