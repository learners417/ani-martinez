// GHL → webhook al recibir el pago del Círculo.
// Header: x-api-key = TAMIM_WEBHOOK_KEY · Body: { email, nombre }
// Devuelve { url } → GHL la manda por email/WhatsApp como link personal.
import { crearToken, claveOk } from "@/lib/auth";
import { guardar } from "@/lib/db";

export async function POST(req) {
  if (!claveOk(req, "x-api-key", "TAMIM_WEBHOOK_KEY"))
    return Response.json({ error: "no autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const nombre = String(body.nombre || body.first_name || "").trim();
  if (!email.includes("@")) return Response.json({ error: "falta email" }, { status: 400 });
  if (!process.env.TAMIM_SECRET) return Response.json({ error: "falta TAMIM_SECRET" }, { status: 500 });

  await guardar({ email, nombre }).catch(() => {});
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const url = `${base}/entrar?t=${crearToken({ email, nombre })}`;
  return Response.json({ url, email, nombre });
}
