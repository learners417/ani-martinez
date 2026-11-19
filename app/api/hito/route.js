// App → GHL. Cada hito del camino viaja al workflow «App · Hitos del camino»
// (trigger Inbound Webhook), que etiqueta el contacto y mueve su etapa en «Mi programa · Círculo».
// Sin GHL_HITOS_WEBHOOK no hace nada: la app sigue funcionando igual.
import { leerToken } from "@/lib/auth";

const HITOS = ["pacto", "estacion-1", "estacion-2", "estacion-3", "estacion-4", "estacion-5", "mitad", "graduada"];

export async function POST(req) {
  const { token, hito } = await req.json().catch(() => ({}));
  const p = leerToken(token);
  if (!p) return Response.json({ ok: false }, { status: 401 });
  if (!HITOS.includes(hito)) return Response.json({ ok: false }, { status: 400 });
  const hook = process.env.GHL_HITOS_WEBHOOK;
  if (!hook) return Response.json({ ok: true, enviado: false });
  const r = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: p.email, nombre: p.nombre, hito, etiqueta: `app-${hito}`, fecha: new Date().toISOString() }),
  }).catch(() => null);
  return Response.json({ ok: true, enviado: Boolean(r?.ok) });
}
