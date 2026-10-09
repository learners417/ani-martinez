// Las 3 preguntas previas a la sesión → webhook de GHL (workflow que le manda el mail a Ani).
import { leerToken } from "@/lib/auth";

export async function POST(req) {
  const { token, estacion, respuestas } = await req.json().catch(() => ({}));
  const p = leerToken(token);
  if (!p) return Response.json({ ok: false }, { status: 401 });
  const hook = process.env.GHL_PRESESION_WEBHOOK;
  if (!hook) return Response.json({ ok: true, enviado: false });
  const r = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: p.email,
      nombre: p.nombre,
      estacion,
      respuesta_1: respuestas?.[0] || "",
      respuesta_2: respuestas?.[1] || "",
      respuesta_3: respuestas?.[2] || "",
    }),
  }).catch(() => null);
  return Response.json({ ok: true, enviado: Boolean(r?.ok) });
}
