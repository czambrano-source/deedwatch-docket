import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL_SERVICIOS");

// Días de anticipación para alertar
const DAYS_AHEAD = 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!SLACK_WEBHOOK_URL) throw new Error("SLACK_WEBHOOK_URL_SERVICIOS no configurado");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const today = new Date();
    const limit = new Date(today.getTime() + DAYS_AHEAD * 86400000).toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);

    // Facturas próximas a vencer o vencidas, no pagadas, sin alerta enviada
    const { data: facturas, error } = await supabase
      .from("facturas_servicios")
      .select("*")
      .eq("pagado", false)
      .eq("alerta_enviada", false)
      .lte("fecha_vencimiento", limit)
      .not("fecha_vencimiento", "is", null);
    if (error) throw error;
    if (!facturas || facturas.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Todas las facturas registradas son de inmuebles "En Proceso de Venta" — obligación Duppla
    const aAlertar = facturas;

    // Construir mensaje Slack
    const tipoEmoji: Record<string, string> = { gas: "🔥", agua: "💧", energia: "⚡" };
    const lines = aAlertar.map((f) => {
      const venc = f.fecha_vencimiento;
      const vencida = venc < todayStr;
      const tag = vencida ? "🚨 VENCIDA" : "⏰ próxima";
      const valor = f.valor ? ` — $${Number(f.valor).toLocaleString("es-CO")}` : "";
      return `${tipoEmoji[f.tipo_servicio] ?? "•"} *${f.tipo_servicio.toUpperCase()}* — Inmueble \`${f.salesforce_id}\` — vence *${venc}* ${tag}${valor}${f.referencia_pago ? ` — Ref: ${f.referencia_pago}` : ""}`;
    });

    const text = `*Servicios públicos de inmuebles salientes — Alertas de vencimiento*\n${lines.join("\n")}`;

    const slackRes = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!slackRes.ok) throw new Error(`Slack error ${slackRes.status}`);

    // Marcar como alerta enviada
    const ids = aAlertar.map((f) => f.id);
    await supabase.from("facturas_servicios").update({ alerta_enviada: true }).in("id", ids);

    return new Response(JSON.stringify({ ok: true, sent: aAlertar.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("alerta-servicios-vencimiento error:", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
