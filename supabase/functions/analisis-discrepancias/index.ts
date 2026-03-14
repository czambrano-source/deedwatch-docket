import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRIMARY_URL =
  Deno.env.get("N8N_ANALISIS_DISCREPANCIAS_URL") ??
  "https://n8n.duppla.co/webhook/analisis-discrepancias-ia";

const FALLBACK_URL = PRIMARY_URL.includes("/webhook/")
  ? PRIMARY_URL.replace("/webhook/", "/webhook-test/")
  : null;

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    if (!body?.codigo_inmueble) {
      return new Response(JSON.stringify({ ok: false, error: "codigo_inmueble es requerido" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let attempt = await callN8n(PRIMARY_URL, body);

    if (!attempt.response.ok && attempt.response.status === 404 && FALLBACK_URL) {
      attempt = await callN8n(FALLBACK_URL, body);
    }

    if (!attempt.response.ok) {
      const isWebhookNotRegistered =
        attempt.response.status === 404 &&
        typeof attempt.parsed?.message === "string" &&
        attempt.parsed.message.toLowerCase().includes("not registered");

      const errorMessage = isWebhookNotRegistered
        ? "El webhook de n8n no está registrado/activo. Activa el workflow o confirma la URL de producción."
        : `n8n respondió ${attempt.response.status}`;

      console.error("n8n error:", attempt.response.status, attempt.text);

      return new Response(
        JSON.stringify({
          ok: false,
          error: errorMessage,
          n8n_status: attempt.response.status,
          details: attempt.parsed,
          hint: isWebhookNotRegistered
            ? "En n8n, activa el workflow y verifica que el Webhook URL de producción sea exactamente el configurado."
            : undefined,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, payload: attempt.parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("proxy error:", e);
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
