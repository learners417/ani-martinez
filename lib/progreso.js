import { ESTACIONES, DIMENSIONES, SEMANAS_TOTALES } from "./contenido";

export const MIN_CARACTERES = 20;

export const estadoInicial = () => ({
  pacto: null, // { fecha, firma }
  radiografias: {}, // entrada | mitad | salida → { fecha, respuestas: {espiritu:[..],...} }
  estaciones: {}, // n → { ejercicios:[], audio:false, pre:[], preEnviada:false, sesion:false }
  chat: [],
  checkins: {}, // "2026-10-09" → { espiritu, alma, cuerpo } (1 a 5)
  sueno: {}, // "2026-10-09" → { acostarse:"23:30", levantarse:"06:40", despertares, calidad }
  gratitud: {}, // "2026-10-09" → ["", "", ""]
  descargas: 0, // veces que soltó la mente
  respiraciones: 0, // minutos respirados
  proximaSesion: null, // ISO de la próxima sesión con Ani
});

export const est = (s, n) =>
  s.estaciones?.[n] || { ejercicios: ["", "", ""], audio: false, pre: ["", "", ""], preEnviada: false, sesion: false };

export const ejerciciosListos = (e) =>
  [0, 1, 2].filter((i) => (e.ejercicios?.[i] || "").trim().length >= MIN_CARACTERES).length;

export const estacionHecha = (s, n) => {
  const e = est(s, n);
  return ejerciciosListos(e) === 3 && e.audio && e.sesion;
};

export const estacionesHechas = (s) => ESTACIONES.filter((x) => estacionHecha(s, x.n)).length;

export function estacionAbierta(s, n) {
  if (s.demoAbierto) return true;
  if (!s.pacto || !s.radiografias?.entrada) return false;
  if (n === 1) return true;
  if (!estacionHecha(s, n - 1)) return false;
  if (n === 3 && !s.radiografias?.mitad) return false;
  return true;
}

export function semanaActual(s) {
  if (!s.pacto?.fecha) return 1;
  const dias = Math.floor((Date.now() - new Date(s.pacto.fecha).getTime()) / 86400000);
  return Math.min(SEMANAS_TOTALES, Math.max(1, Math.floor(dias / 7) + 1));
}

// La única acción siguiente que ve la consultante en "Hoy".
export function siguientePaso(s) {
  if (!s.pacto) return { tipo: "pacto" };
  if (!s.radiografias?.entrada) return { tipo: "radiografia", medicion: "entrada" };
  for (const { n } of ESTACIONES) {
    if (n === 3 && estacionHecha(s, 2) && !s.radiografias?.mitad)
      return { tipo: "radiografia", medicion: "mitad" };
    if (!estacionHecha(s, n)) return { tipo: "estacion", n };
  }
  if (!s.radiografias?.salida) return { tipo: "radiografia", medicion: "salida" };
  return { tipo: "graduacion" };
}

// Promedio 0-10 por dimensión de una medición.
export function promedios(rad) {
  if (!rad?.respuestas) return null;
  const out = {};
  for (const d of DIMENSIONES) {
    const v = rad.respuestas[d.clave] || [];
    out[d.clave] = v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : 0;
  }
  return out;
}

// Compromiso TamÍm: dimensiones que no se movieron entre entrada y salida.
export function sinMovimiento(s) {
  const a = promedios(s.radiografias?.entrada);
  const b = promedios(s.radiografias?.salida);
  if (!a || !b) return [];
  return DIMENSIONES.filter((d) => b[d.clave] <= a[d.clave]).map((d) => d.nombre);
}

export function porcentaje(s) {
  let pasos = 0;
  if (s.pacto) pasos++;
  if (s.radiografias?.entrada) pasos++;
  pasos += estacionesHechas(s) * 3;
  if (s.radiografias?.mitad) pasos++;
  if (s.radiografias?.salida) pasos++;
  return Math.round((pasos / 19) * 100);
}

// ── Hábitos diarios ──────────────────────────────────────────
const isoDia = (d) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

// Racha: días seguidos con check-in, contando hasta hoy (o ayer si hoy todavía no).
export function racha(s) {
  const c = s.checkins || {};
  let n = 0;
  const d = new Date();
  if (!c[isoDia(d)]) d.setDate(d.getDate() - 1);
  while (c[isoDia(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// Los 70 días del programa desde el pacto → [{ iso, estado: "si" | "no" | "hoy" | "futuro" }]
export function mapa70(s) {
  if (!s.pacto?.fecha) return [];
  const ini = new Date(s.pacto.fecha);
  ini.setHours(12, 0, 0, 0);
  const hoy = isoDia(new Date());
  return Array.from({ length: 70 }, (_, i) => {
    const d = new Date(ini);
    d.setDate(d.getDate() + i);
    const iso = isoDia(d);
    const hecho = Boolean(s.checkins?.[iso]);
    return { iso, estado: hecho ? "si" : iso === hoy ? "hoy" : iso > hoy ? "futuro" : "no" };
  });
}

// Promedio de horas de sueño y calidad de los últimos 7 registros.
export function resumenSueno(s) {
  const regs = Object.entries(s.sueno || {}).sort(([a], [b]) => (a < b ? 1 : -1)).slice(0, 7);
  if (!regs.length) return null;
  const horas = regs.map(([, r]) => horasDormidas(r)).filter((h) => h != null);
  const cal = regs.map(([, r]) => r.calidad).filter((x) => x != null);
  const prom = (a) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null);
  return { horas: prom(horas), calidad: prom(cal), noches: regs.length };
}

export function horasDormidas(r) {
  if (!r?.acostarse || !r?.levantarse) return null;
  const [a, b] = [r.acostarse, r.levantarse].map((t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; });
  let min = b - a;
  if (min <= 0) min += 1440;
  return Math.round((min / 60) * 10) / 10;
}
