// Panel de Ani. Header: x-panel-key = ANI_PANEL_KEY
import { claveOk } from "@/lib/auth";
import { todas, hayBase } from "@/lib/db";

export async function GET(req) {
  if (!claveOk(req, "x-panel-key", "ANI_PANEL_KEY"))
    return Response.json({ error: "clave incorrecta" }, { status: 401 });
  if (!hayBase()) return Response.json({ error: "falta conectar Supabase" }, { status: 500 });
  const filas = await todas();
  return Response.json({ consultantes: filas || [] });
}
