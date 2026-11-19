// Panel de Ani. Header: x-panel-key = ANI_PANEL_KEY
import { claveOk, crearToken } from "@/lib/auth";
import { todas, hayBase, guardar } from "@/lib/db";
import { conexiones } from "@/lib/conexiones";

export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!claveOk(req, "x-panel-key", "ANI_PANEL_KEY"))
    return Response.json({ error: "Clave incorrecta" }, { status: 401 });
  const filas = hayBase() ? await todas() : [];
  return Response.json({ consultantes: filas || [], conexiones: conexiones() });
}

// Dar acceso a una consultante: devuelve su link personal.
export async function POST(req) {
  if (!claveOk(req, "x-panel-key", "ANI_PANEL_KEY"))
    return Response.json({ error: "Clave incorrecta" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const nombre = String(body.nombre || "").trim();
  if (!nombre) return Response.json({ error: "Falta el nombre" }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Revisa el correo" }, { status: 400 });
  if (!process.env.TAMIM_SECRET) return Response.json({ error: "Falta TAMIM_SECRET en Vercel" }, { status: 500 });
  await guardar({ email, nombre }).catch(() => {});
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  return Response.json({ url: `${base}/entrar?t=${crearToken({ email, nombre })}`, email, nombre });
}
