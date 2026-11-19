// Qué está conectado. Solo dice sí o no: nunca muestra una clave.
import { conexiones } from "@/lib/conexiones";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(conexiones());
}
