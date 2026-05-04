
CREATE TABLE public.servicios_publicos_inmueble (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salesforce_id TEXT NOT NULL UNIQUE,
  obligacion_duppla BOOLEAN NOT NULL DEFAULT true,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.servicios_publicos_inmueble ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read servicios_publicos_inmueble" ON public.servicios_publicos_inmueble FOR SELECT USING (true);
CREATE POLICY "public insert servicios_publicos_inmueble" ON public.servicios_publicos_inmueble FOR INSERT WITH CHECK (true);
CREATE POLICY "public update servicios_publicos_inmueble" ON public.servicios_publicos_inmueble FOR UPDATE USING (true);
CREATE POLICY "public delete servicios_publicos_inmueble" ON public.servicios_publicos_inmueble FOR DELETE USING (true);

CREATE TYPE public.tipo_servicio_publico AS ENUM ('gas', 'agua', 'energia');

CREATE TABLE public.facturas_servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salesforce_id TEXT NOT NULL,
  tipo_servicio public.tipo_servicio_publico NOT NULL,
  referencia_pago TEXT,
  valor NUMERIC,
  fecha_vencimiento DATE,
  pagado BOOLEAN NOT NULL DEFAULT false,
  fecha_pago DATE,
  url_soporte TEXT,
  notas TEXT,
  alerta_enviada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facturas_servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read facturas_servicios" ON public.facturas_servicios FOR SELECT USING (true);
CREATE POLICY "public insert facturas_servicios" ON public.facturas_servicios FOR INSERT WITH CHECK (true);
CREATE POLICY "public update facturas_servicios" ON public.facturas_servicios FOR UPDATE USING (true);
CREATE POLICY "public delete facturas_servicios" ON public.facturas_servicios FOR DELETE USING (true);

CREATE INDEX idx_facturas_servicios_sf ON public.facturas_servicios(salesforce_id);
CREATE INDEX idx_facturas_servicios_venc ON public.facturas_servicios(fecha_vencimiento) WHERE pagado = false;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_servicios_publicos_inmueble_updated
BEFORE UPDATE ON public.servicios_publicos_inmueble
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_facturas_servicios_updated
BEFORE UPDATE ON public.facturas_servicios
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
