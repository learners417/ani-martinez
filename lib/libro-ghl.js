// Libro «Vuelve a dormir»: lo que la app hace en GHL (subcuenta de Ani) para el embudo del libro.
// Todo pasa por GHL_TOKEN (integración privada de la subcuenta: contacts.readonly, contacts.write,
// conversations/message.write). Sin GHL_TOKEN, las rutas no hacen nada.

export const API = "https://services.leadconnectorhq.com";
export const LOC = process.env.GHL_LOCATION || "yPUoxthajqalLogz3Kyi";

// Campos de contacto creados en la subcuenta de Ani.
export const CAMPOS = {
  noche: process.env.GHL_CAMPO_NOCHE || "z8KXtVVjo3TUpim0WtKE", // Libro · noche (0 a 84)
  comprado: "7eNWYw2cPmv3JPJSwhZ9", // Libro · comprado (AAAA-MM-DD, hora de Ecuador)
  secuencia: "D83mYm5bHOJWshhQE304", // Libro · secuencia (correos de la secuencia ya enviados, 0 a 4)
};

export const hayToken = () => Boolean(process.env.GHL_TOKEN);

export function cab(version) {
  return { Authorization: `Bearer ${process.env.GHL_TOKEN}`, Version: version, "Content-Type": "application/json", Accept: "application/json" };
}

export async function buscarPorTag(tag) {
  const todos = [];
  let page = 1;
  for (;;) {
    const r = await fetch(`${API}/contacts/search`, {
      method: "POST", headers: cab("2021-07-28"),
      body: JSON.stringify({ locationId: LOC, page, pageLimit: 100, filters: [{ field: "tags", operator: "contains", value: tag }] }),
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

export async function contacto(id) {
  const r = await fetch(`${API}/contacts/${id}`, { headers: cab("2021-07-28") });
  if (!r.ok) return null;
  const j = await r.json();
  return j.contact || null;
}

export function campo(c, id) {
  const f = (c?.customFields || []).find((x) => x.id === id);
  return f?.value ?? f?.fieldValue ?? null;
}

export function numero(c, id) {
  const v = parseInt(campo(c, id) ?? "0", 10);
  return Number.isFinite(v) ? v : 0;
}

export async function guardar(id, valores) {
  const customFields = Object.entries(valores).map(([k, v]) => ({ id: CAMPOS[k], field_value: v }));
  return fetch(`${API}/contacts/${id}`, { method: "PUT", headers: cab("2021-07-28"), body: JSON.stringify({ customFields }) });
}

export async function etiquetar(id, tags) {
  return fetch(`${API}/contacts/${id}/tags`, { method: "POST", headers: cab("2021-07-28"), body: JSON.stringify({ tags }) });
}

export function conNombre(html, c) {
  const nombre = (c?.firstName || c?.firstNameLowerCase || "").trim();
  const n = nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1) : "";
  return html.replace("Hola {{contact.first_name}}:", n ? `Hola ${n}:` : "Hola:");
}

export async function enviar(c, asunto, html) {
  return fetch(`${API}/conversations/messages`, {
    method: "POST", headers: cab("2021-04-15"),
    body: JSON.stringify({ type: "Email", contactId: c.id, subject: asunto, html: conNombre(html, c), emailFrom: process.env.GHL_REMITENTE || undefined }),
  });
}

// Fecha de hoy en Ecuador (UTC-5, sin horario de verano), como AAAA-MM-DD.
export function hoyEcuador(ahora = Date.now()) {
  return new Date(ahora - 5 * 3600 * 1000).toISOString().slice(0, 10);
}

export function diasDesde(fecha, ahora = Date.now()) {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}/.test(fecha)) return null;
  const a = Date.parse(`${fecha.slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${hoyEcuador(ahora)}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}
