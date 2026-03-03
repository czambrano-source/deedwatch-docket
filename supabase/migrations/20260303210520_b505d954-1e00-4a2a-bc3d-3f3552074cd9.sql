CREATE TABLE public.recibos_predial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salesforce_id text NOT NULL,
  nombre_inmueble text,
  tipo_predio text NOT NULL DEFAULT 'inmueble',
  anio_vigencia integer,
  url_recibo text,
  notas text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.recibos_predial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to recibos_predial" ON public.recibos_predial
  FOR ALL USING (true) WITH CHECK (true);