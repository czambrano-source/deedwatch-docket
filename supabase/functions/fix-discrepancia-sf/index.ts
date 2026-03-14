import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, cache-control, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRIMARY_URL =
  Deno.env.get("N8N_FIX_DISCREPANCIA_SF_URL") ??
  "https://n8n.duppla.co/webhook/fix-discrepancia-sf";

const FALLBACK_URL = PRIMARY_URL.includes("/webhook/")
  ? PRIMARY_URL.replace("/webhook/", "/webhook-test/")
  : null;

const CAMPO_ALIASES: Record<string, string[]> = {
  Deposito__c: ["Deposito__c", "deposito__c"],
  chip_deposito__c: ["chip_deposito__c", "Chip_deposito__c"],
  No_Matricula_Inmo_Deposito__c: ["No_Matricula_Inmo_Deposito__c", "no_matricula_inmo_deposito__c"],
  Numero_del_parqueadero__c: ["Numero_del_parqueadero__c", "numero_del_parqueadero__c"],
  chip_parqueadero__c: ["chip_parqueadero__c", "Chip_parqueadero__c"],
  No_Matricula_Inmo_Parqueadero__c: ["No_Matricula_Inmo_Parqueadero__c", "no_matricula_inmo_parqueadero__c"],
  Numero_de_apartamento__c: ["Numero_de_apartamento__c", "numero_de_apartamento__c"],
  Numero_matricula_inmobiliaria__c: ["Numero_matricula_inmobiliaria__c", "numero_matricula_inmobiliaria__c"],
  chip_apartamento__c: ["chip_apartamento__c", "Chip_apartamento__c"],
  Torre__c: ["Torre__c", "torre__c"],
  Direccion__c: ["Direccion__c", "direccion__c"],
  Municipio__c: ["Municipio__c", "municipio__c"],
  Departamento__c: ["Departamento__c", "departamento__c"],
  Ciudad_Inmueble__c: ["Ciudad_Inmueble__c", "ciudad_inmueble__c"],
  Fiduciaria__c: ["Fiduciaria__c", "fiduciaria__c"],
  Tipo_de_inmueble__c: ["Tipo_de_inmueble__c", "tipo_de_inmueble__c"],
  Nombre_de_edificio_o_conjunto__c: ["Nombre_de_edificio_o_conjunto__c", "nombre_de_edificio_o_conjunto__c"],
};

const NUMERIC_FIELDS = new Set([
  "Numero_del_parqueadero__c",
  "numero_del_parqueadero__c",
  "Parqueadero__c",
]);

const ALIAS_TO_CANONICAL = Object.entries(CAMPO_ALIASES).reduce<Record<string, string>>((acc, [canonical, aliases]) => {
  for (const alias of aliases) {
    acc[alias.trim().toLowerCase()] = canonical;
  }
  return acc;
}, {});

function uniq(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function resolveCampoCandidates(rawCampo: string): string[] {
  const trimmed = rawCampo.trim();
  if (!trimmed) return [];

  const canonical = ALIAS_TO_CANONICAL[trimmed.toLowerCase()];

  if (canonical) {
    return uniq([canonical, ...CAMPO_ALIASES[canonical]]);
  }

  if (/__c$/i.test(trimmed)) {
    return uniq([trimmed]);
  }

  return [];
}

function normalizeValorNuevo(campo: string, valorNuevo: unknown) {
  if (!NUMERIC_FIELDS.has(campo)) {
    return valorNuevo;
  }

  const raw = String(valorNuevo ?? "").trim();
  if (!/^\d+$/.test(raw)) {
    throw new Error(`El campo "${campo}" solo acepta números (ej: 56).`);
  }

  return Number(raw);
}

async function callN8n(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = { raw: text };
  }

  return { response, parsed, text };
}

async function callWithFallback(payload: unknown) {
  let attempt = await callN8n(PRIMARY_URL, payload);

  if (!attempt.response.ok && attempt.response.status === 404 && FALLBACK_URL) {
    attempt = await callN8n(FALLBACK_URL, payload);
  }

  return attempt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const rawCampo = String(body?.campo ?? "").trim();

    if (!body?.inmueble_id || !rawCampo || body?.valor_nuevo === undefined || body?.valor_nuevo === null) {
      return new Response(
        JSON.stringify({ ok: false, error: "inmueble_id, campo y valor_nuevo son requeridos" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const camposToTry = resolveCampoCandidates(rawCampo);

    if (camposToTry.length === 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Campo no soportado para corrección: ${rawCampo}`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let lastAttempt: Awaited<ReturnType<typeof callWithFallback>> | null = null;
    let lastCampo = rawCampo;

    for (const campo of camposToTry) {
      const payload = { ...body, campo };
      const attempt = await callWithFallback(payload);

      if (attempt.response.ok) {
        return new Response(
          JSON.stringify({ ok: true, payload: attempt.parsed, campo_enviado: campo }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      lastAttempt = attempt;
      lastCampo = campo;
    }

    const isWebhookNotRegistered =
      lastAttempt?.response.status === 404 &&
      typeof lastAttempt.parsed?.message === "string" &&
      lastAttempt.parsed.message.toLowerCase().includes("not registered");

    const errorMessage = isWebhookNotRegistered
      ? "El webhook de fix en n8n no está registrado/activo."
      : `n8n respondió ${lastAttempt?.response.status ?? 500}`;

    console.error("n8n error:", lastAttempt?.response.status, {
      campo_original: rawCampo,
      campo_intentado: lastCampo,
      campos_intentados: camposToTry,
      detail: lastAttempt?.text,
    });

    return new Response(
      JSON.stringify({
        ok: false,
        error: errorMessage,
        n8n_status: lastAttempt?.response.status ?? 500,
        details: lastAttempt?.parsed,
        campo_original: rawCampo,
        campo_intentado: lastCampo,
        campos_intentados: camposToTry,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("proxy error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});