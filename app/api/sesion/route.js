// Valida el link personal y devuelve el avance guardado (para entrar desde otro teléfono).
import { leerToken } from "@/lib/auth";
import { leer } from "@/lib/db";

export async function POST(req) {
  const { token } = await req.json().catch(() => ({}));
  const p = leerToken(token);
  if (!p) return Response.json({ ok: false }, { status: 401 });
  const fila = await leer(p.email).catch(() => null);
  return Response.json({
    ok: true,
    email: p.email,
    nombre: fila?.nombre || p.nombre,
    estado: fila?.estado && Object.keys(fila.estado).length ? fila.estado : null,
  });
}
