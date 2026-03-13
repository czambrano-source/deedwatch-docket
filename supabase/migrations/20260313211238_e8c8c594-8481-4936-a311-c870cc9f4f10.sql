CREATE TABLE public.historial_cambios_sf (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  codigo_inmueble text NOT NULL,
  salesforce_id text,
  campo_corregido text NOT NULL,
  valor_anterior text,
  valor_nuevo text,
  fuente text,
  aprobado_por text NOT NULL
);

ALTER TABLE public.historial_cambios_sf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to historial_cambios_sf"
ON public.historial_cambios_sf
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);