// Supabase por REST. Tabla: tamim_consultantes (ver supabase.sql).
const URL = () => process.env.SUPABASE_URL;
const KEY = () => process.env.SUPABASE_SERVICE_KEY;
export const hayBase = () => Boolean(URL() && KEY());

const headers = () => ({
  apikey: KEY(),
  Authorization: `Bearer ${KEY()}`,
  "Content-Type": "application/json",
});

export async function guardar({ email, nombre, estado }) {
  if (!hayBase()) return false;
  const fila = { email, updated_at: new Date().toISOString() };
  if (nombre) fila.nombre = nombre;
  if (estado) fila.estado = estado;
  const r = await fetch(`${URL()}/rest/v1/tamim_consultantes?on_conflict=email`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(fila),
    cache: "no-store",
  });
  return r.ok;
}

export async function leer(email) {
  if (!hayBase()) return null;
  const r = await fetch(
    `${URL()}/rest/v1/tamim_consultantes?email=eq.${encodeURIComponent(email)}&select=*`,
    { headers: headers(), cache: "no-store" }
  );
  if (!r.ok) return null;
  const filas = await r.json();
  return filas[0] || null;
}

export async function todas() {
  if (!hayBase()) return null;
  const r = await fetch(
    `${URL()}/rest/v1/tamim_consultantes?select=*&order=updated_at.desc`,
    { headers: headers(), cache: "no-store" }
  );
  return r.ok ? r.json() : null;
}
