// «Ani te escribe cada noche»: la casilla del libro «Vuelve a dormir».
// Vercel la corre una vez por día a las 21 h de Ecuador (vercel.json · 02:00 UTC).
// Busca en GHL los contactos con la etiqueta low-casilla, les manda la noche que sigue
// (campo «Libro · noche» + 1) y guarda el número. En la 84 suma la etiqueta low-casilla-fin.
// Necesita GHL_TOKEN (integración privada de la subcuenta de Ani: contacts.readonly, contacts.write,
// conversations/message.write). Sin GHL_TOKEN no hace nada.
import NOCHES from "@/lib/libro-noches.json";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const API = "https://services.leadconnectorhq.com";
const LOC = process.env.GHL_LOCATION || "yPUoxthajqalLogz3Kyi";
const CAMPO = process.env.GHL_CAMPO_NOCHE || "z8KXtVVjo3TUpim0WtKE";
const TAG = "low-casilla";

function cab(version) {
  return { Authorization: `Bearer ${process.env.GHL_TOKEN}`, Version: version, "Content-Type": "application/json", Accept: "application/json" };
}

async function contactos() {
  const todos = [];
  let page = 1;
  for (;;) {
    const r = await fetch(`${API}/contacts/search`, {
      method: "POST", headers: cab("2021-07-28"),
      body: JSON.stringify({ locationId: LOC, page, pageLimit: 100, filters: [{ field: "tags", operator: "contains", value: TAG }] }),
    });
    if (!r.ok) throw new Error(`search ${r.status}`);
    const j = await r.json();
    const lote = j.contacts || [];
    todos.push(...lote);
    if (lote.length < 100) break;
    page += 1;
  }
  return todos;
}

function nocheDe(c) {
  const f = (c.customFields || []).find((x) => x.id === CAMPO);
  const v = parseInt(f?.value ?? f?.fieldValue ?? "0", 10);
  return Number.isFinite(v) ? v : 0;
}

function conNombre(html, c) {
  const nombre = (c.firstName || c.firstNameLowerCase || "").trim();
  const n = nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1) : "";
  return html.replace("Hola {{contact.first_name}}:", n ? `Hola ${n}:` : "Hola:");
}

export async function GET(req) {
  const secreto = process.env.CRON_SECRET;
  if (secreto && req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  if (!process.env.GHL_TOKEN) return Response.json({ ok: true, enviados: 0, motivo: "sin GHL_TOKEN" });

  const lista = await contactos();
  const hecho = [];
  for (const c of lista) {
    if ((c.tags || []).includes("low-casilla-fin")) continue;
    const n = nocheDe(c) + 1;
    const correo = NOCHES.find((x) => x.n === n);
    if (!correo || !c.email) continue;
    const r = await fetch(`${API}/conversations/messages`, {
      method: "POST", headers: cab("2021-04-15"),
      body: JSON.stringify({ type: "Email", contactId: c.id, subject: correo.asunto, html: conNombre(correo.html, c), emailFrom: process.env.GHL_REMITENTE || undefined }),
    });
    if (!r.ok) { hecho.push({ id: c.id, n, ok: false, status: r.status }); continue; }
    await fetch(`${API}/contacts/${c.id}`, {
      method: "PUT", headers: cab("2021-07-28"),
      body: JSON.stringify({ customFields: [{ id: CAMPO, field_value: n }] }),
    });
    if (n >= 84) {
      await fetch(`${API}/contacts/${c.id}/tags`, { method: "POST", headers: cab("2021-07-28"), body: JSON.stringify({ tags: ["low-casilla-fin"] }) });
    }
    hecho.push({ id: c.id, n, ok: true });
  }
  return Response.json({ ok: true, contactos: lista.length, enviados: hecho.filter((x) => x.ok).length, detalle: hecho });
}
