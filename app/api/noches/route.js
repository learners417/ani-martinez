// Libro «Lo que no te deja dormir»: los correos que salen solos, una vez por día a las 21 h de Ecuador
// (vercel.json · 02:00 UTC).
// 1 · «Ani te escribe cada noche»: contactos con la etiqueta low-casilla. Les manda la noche que sigue
//     (campo «Libro · noche» + 1) y guarda el número. En la 84 suma la etiqueta low-casilla-fin.
// 2 · Secuencia de 10 días: contactos con low-libro que no tomaron la casilla. Correos los días 1, 3, 6 y 10
//     desde la compra (campo «Libro · comprado»). Se corta si compra la sesión, agenda o entra al Círculo.
// Necesita GHL_TOKEN (ver lib/libro-ghl.js). Sin GHL_TOKEN no hace nada.
import NOCHES from "@/lib/libro-noches.json";
import CORREOS from "@/lib/libro-correos.json";
import { hayToken, buscarPorTag, numero, campo, guardar, etiquetar, enviar, diasDesde, CAMPOS } from "@/lib/libro-ghl";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CORTAN = ["low-casilla", "low-sesion", "low-secuencia-fin"];
const corta = (tags = []) => tags.some((t) => CORTAN.includes(t) || /circulo|agend/i.test(t));

async function casilla() {
  const hecho = [];
  for (const c of await buscarPorTag("low-casilla")) {
    if ((c.tags || []).includes("low-casilla-fin")) continue;
    const n = numero(c, CAMPOS.noche) + 1;
    const correo = NOCHES.find((x) => x.n === n);
    if (!correo || !c.email) continue;
    const r = await enviar(c, correo.asunto, correo.html);
    if (!r.ok) { hecho.push({ id: c.id, n, ok: false, status: r.status }); continue; }
    await guardar(c.id, { noche: n });
    if (n >= 84) await etiquetar(c.id, ["low-casilla-fin"]);
    hecho.push({ id: c.id, n, ok: true });
  }
  return hecho;
}

async function secuencia() {
  const hecho = [];
  for (const c of await buscarPorTag("low-libro")) {
    if (corta(c.tags) || !c.email) continue;
    const dias = diasDesde(campo(c, CAMPOS.comprado));
    if (dias === null) continue;
    const i = numero(c, CAMPOS.secuencia);
    const correo = CORREOS.secuencia[i];
    if (!correo || dias < correo.dia) continue;
    const r = await enviar(c, correo.asunto, correo.html);
    if (!r.ok) { hecho.push({ id: c.id, dia: correo.dia, ok: false, status: r.status }); continue; }
    await guardar(c.id, { secuencia: i + 1 });
    if (i + 1 >= CORREOS.secuencia.length) await etiquetar(c.id, ["low-secuencia-fin"]);
    hecho.push({ id: c.id, dia: correo.dia, ok: true });
  }
  return hecho;
}

export async function GET(req) {
  const secreto = process.env.CRON_SECRET;
  if (secreto && req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  if (!hayToken()) return Response.json({ ok: true, enviados: 0, motivo: "sin GHL_TOKEN" });
  const noches = await casilla();
  const sec = await secuencia();
  return Response.json({
    ok: true,
    noches: { enviados: noches.filter((x) => x.ok).length, detalle: noches },
    secuencia: { enviados: sec.filter((x) => x.ok).length, detalle: sec },
  });
}
