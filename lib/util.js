// Utilidades del navegador (solo cliente).

export const hoyISO = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

export const vibrar = (ms = 12) => {
  try { navigator.vibrate?.(ms); } catch {}
};

// Link de Drive → reproductor embebido. Cualquier otro link se usa tal cual.
export function embedAudio(url) {
  if (!url) return null;
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  if (m) return { tipo: "iframe", src: `https://drive.google.com/file/d/${m[1]}/preview` };
  if (/\.(mp3|m4a|wav|ogg|aac)(\?|$)/i.test(url)) return { tipo: "audio", src: url };
  return { tipo: "link", src: url };
}

export function saludo() {
  const h = new Date().getHours();
  if (h < 5) return "Todavía es de noche";
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

// Archivo de calendario con dos recordatorios: 24 h antes (preguntas) y 1 h antes.
export function descargarICS({ titulo, inicio, minutos = 60, detalle = "" }) {
  const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ini = new Date(inicio);
  const fin = new Date(ini.getTime() + minutos * 60000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TamIm//ES", "BEGIN:VEVENT",
    `UID:${ini.getTime()}@tamim`, `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(ini)}`, `DTEND:${f(fin)}`,
    `SUMMARY:${titulo}`, `DESCRIPTION:${detalle}`,
    "BEGIN:VALARM", "TRIGGER:-PT24H", "ACTION:DISPLAY", "DESCRIPTION:Responde tus 3 preguntas en la app", "END:VALARM",
    "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", "DESCRIPTION:Tu sesión con Ani es en 1 hora", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "sesion-con-ani.ics";
  a.click();
}

export function cuentaRegresiva(iso) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms < -3 * 3600000) return null;
  if (ms <= 0) return "Es hoy";
  const dias = Math.floor(ms / 86400000);
  const horas = Math.floor((ms % 86400000) / 3600000);
  if (dias === 0) return horas <= 1 ? "En menos de 2 horas" : `En ${horas} horas`;
  return dias === 1 ? "Mañana" : `En ${dias} días`;
}

export const fechaLarga = (iso) =>
  new Date(iso).toLocaleString("es", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
