import { leerToken } from "@/lib/auth";
import { guardar } from "@/lib/db";

export async function POST(req) {
  const { token, estado } = await req.json().catch(() => ({}));
  const p = leerToken(token);
  if (!p || !estado) return Response.json({ ok: false }, { status: 401 });
  const ok = await guardar({ email: p.email, estado }).catch(() => false);
  return Response.json({ ok });
}
