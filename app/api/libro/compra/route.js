// Libro «Vuelve a dormir»: lo que pasa cuando alguien paga en el embudo del libro.
// La llaman los flujos «Low ·» de GHL con la acción Webhook (POST), una por producto:
//   https://ani-martinez.vercel.app/api/libro/compra?evento=libro&k=CLAVE
//   https://ani-martinez.vercel.app/api/libro/compra?evento=casilla&k=CLAVE
//   https://ani-martinez.vercel.app/api/libro/compra?evento=sesion&k=CLAVE
// libro   → etiqueta low-libro, guarda la fecha y manda el correo con el libro.
// casilla → etiqueta low-casilla y pone «Libro · noche» en 0: esa noche a las 21 h sale la noche 1.
// sesion  → etiqueta low-sesion (corta la secuencia de 10 días).
import CORREOS from "@/lib/libro-correos.json";
import { hayToken, contacto, etiquetar, guardar, enviar, hoyEcuador, numero, campo, CAMPOS } from "@/lib/libro-ghl";

export const dynamic = "force-dynamic";

const CLAVE = process.env.LIBRO_CLAVE || "5PwvARptHkRVHZxE";

function idDe(body) {
  return body?.contact_id || body?.contactId || body?.contact?.id || body?.customData?.contact_id || null;
}

export async function POST(req) {
  const u = new URL(req.url);
  if (u.searchParams.get("k") !== CLAVE) return Response.json({ ok: false }, { status: 401 });
  const evento = u.searchParams.get("evento");
  if (!["libro", "casilla", "sesion"].includes(evento)) return Response.json({ ok: false, motivo: "evento" }, { status: 400 });
  if (!hayToken()) return Response.json({ ok: true, hecho: [], motivo: "sin GHL_TOKEN" });

  let body = {};
  try { body = await req.json(); } catch {}
  const id = idDe(body);
  if (!id) return Response.json({ ok: false, motivo: "sin contacto" }, { status: 400 });
  const c = await contacto(id);
  if (!c) return Response.json({ ok: false, motivo: "contacto no encontrado" }, { status: 404 });

  const hecho = [];
  if (evento === "libro") {
    await etiquetar(id, ["low-libro"]);
    if (!campo(c, CAMPOS.comprado)) await guardar(id, { comprado: hoyEcuador(), secuencia: 0 });
    const r = await enviar(c, CORREOS.entrega.asunto, CORREOS.entrega.html);
    hecho.push("low-libro", r.ok ? "correo entrega" : `correo entrega falló ${r.status}`);
  }
  if (evento === "casilla") {
    await etiquetar(id, ["low-casilla"]);
    if (numero(c, CAMPOS.noche) === 0) await guardar(id, { noche: 0 });
    hecho.push("low-casilla");
  }
  if (evento === "sesion") {
    await etiquetar(id, ["low-sesion"]);
    hecho.push("low-sesion");
  }
  return Response.json({ ok: true, evento, contacto: id, hecho });
}
