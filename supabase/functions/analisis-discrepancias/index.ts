import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, cache-control, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRIMARY_URL =
  Deno.env.get("N8N_ANALISIS_DISCREPANCIAS_URL") ??
  "https://n8n.duppla.co/webhook/analisis-discrepancias-ia";

const FALLBACK_URL = PRIMARY_URL.includes("/webhook/")
  ? PRIMARY_URL.replace("/webhook/", "/webhook-test/")
  : null;

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // ms between retries

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

function isRetryable(status: number): boolean {
  return [502, 503, 504, 429].includes(status);
}

async function callN8nWithRetry(url: string, payload: unknown) {
  let lastAttempt = await callN8n(url, payload);

  for (let i = 0; i < MAX_RETRIES && isRetryable(lastAttempt.response.status); i++) {
    const delay = RETRY_DELAYS[i] ?? 10000;
    console.log(`n8n returned ${lastAttempt.response.status}, retrying in ${delay}ms (attempt ${i + 2}/${MAX_RETRIES + 1})...`);
    await new Promise((r) => setTimeout(r, delay));
    lastAttempt = await callN8n(url, payload);
  }

  return lastAttempt;
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

    let attempt = await callN8nWithRetry(PRIMARY_URL, body);

    if (!attempt.response.ok && attempt.response.status === 404 && FALLBACK_URL) {
      attempt = await callN8nWithRetry(FALLBACK_URL, body);
    }

    if (!attempt.response.ok) {
      const isWebhookNotRegistered =
        attempt.response.status === 404 &&
        typeof attempt.parsed?.message === "string" &&
        attempt.parsed.message.toLowerCase().includes("not registered");

      const is502 = attempt.response.status === 502;

      const errorMessage = isWebhookNotRegistered
        ? "El webhook de n8n no está registrado/activo. Activa el workflow o confirma la URL de producción."
        : is502
          ? "n8n no está disponible temporalmente (502 Bad Gateway). Intenta de nuevo en unos segundos."
          : `n8n respondió ${attempt.response.status}`;

      console.error("n8n error:", attempt.response.status, attempt.text?.substring(0, 500));

      return new Response(
        JSON.stringify({
          ok: false,
          error: errorMessage,
          n8n_status: attempt.response.status,
          retryable: isRetryable(attempt.response.status),
          details: is502 ? undefined : attempt.parsed,
          hint: isWebhookNotRegistered
            ? "En n8n, activa el workflow y verifica que el Webhook URL de producción sea exactamente el configurado."
            : is502
              ? "El servidor de n8n puede estar reiniciándose. Espera unos segundos e intenta de nuevo."
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
