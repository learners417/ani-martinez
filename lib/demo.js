// Modo prueba: dos maneras de recorrer la app sin tocar datos reales.
// ADMIN = todo abierto y con datos de ejemplo · USUARIA = de cero, con los bloqueos reales.
import { estadoInicial } from "./progreso";

export const SESION_ADMIN = { token: "demo", email: "demo-admin", nombre: "Carolina", demo: true, rol: "admin" };
export const SESION_USUARIA = { token: "demo", email: "demo-usuaria", nombre: "Carolina", demo: true, rol: "usuaria" };

const dia = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
const rad = (e, a, c, diasAtras) => ({
  fecha: new Date(Date.now() - diasAtras * 86400000).toISOString(),
  respuestas: { espiritu: e, alma: a, cuerpo: c },
});
const texto = (t) => t;

// Una consultante de ejemplo en la semana 3, con historia cargada para ver todas las pantallas llenas.
export function estadoAdmin({ diasDesdeInicio = 18, nombre = "Carolina" } = {}) {
  const s = estadoInicial();
  s.demoAbierto = true;
  s.pacto = { fecha: new Date(Date.now() - diasDesdeInicio * 86400000).toISOString(), firma: `${nombre} (ejemplo)` };
  s.radiografias = {
    entrada: rad([3, 4, 3], [2, 3, 3], [2, 3, 2], diasDesdeInicio),
    mitad: rad([5, 6, 5], [5, 5, 4], [4, 5, 5], 2),
    salida: rad([8, 8, 7], [7, 8, 7], [7, 8, 8], 0),
  };
  const hecha = (ej) => ({
    claseVista: true, audio: true, sesion: true, preEnviada: true,
    ejercicios: ej.map(texto),
    pre: ["Duermo un poco mejor, pero sigo despertándome a las 3.", "Sostener la rutina de la noche.", "Quiero trabajar el miedo a no estar a la altura."],
  });
  s.estaciones = {
    1: hecha([
      "Me quita el sueño la empresa y sentir que si yo paro, todo se cae.",
      "Estoy sosteniendo sola la casa, el equipo y a mi mamá.",
      "Dormir de corrido y dejar de vivir en alerta.",
    ]),
    2: hecha([
      "En la playa con mis hijos, antes de abrir la empresa.",
      "\"Si no lo hago yo, nadie lo hace.\"",
      "Señor, enséñame a soltar lo que no me toca cargar. Dame descanso.",
    ]),
    3: { claseVista: true, audio: false, sesion: false, preEnviada: false, ejercicios: ["Lo primero que pienso es en todo lo que tengo pendiente para el día.", "", ""], pre: ["", "", ""] },
  };
  const ck = [[4, 3, 2], [4, 3, 3], [3, 3, 2], [4, 4, 3], [5, 4, 3], [4, 4, 4], [5, 4, 4], [4, 3, 3], [5, 4, 4], [5, 5, 4], [4, 4, 4], [5, 4, 5], [5, 5, 4], [5, 5, 5]];
  s.checkins = {};
  ck.forEach(([e, a, c], i) => {
    if (i === 5) return; // un día sin check-in, para que el mapa se vea real
    s.checkins[dia(-(ck.length - 1 - i))] = { espiritu: e, alma: a, cuerpo: c };
  });
  const noches = [["00:40", "06:10", 3, 2], ["00:15", "06:20", 2, 2], ["23:50", "06:30", 2, 3], ["23:40", "06:30", 1, 3], ["23:30", "06:40", 1, 4], ["23:20", "06:45", 1, 4], ["23:10", "06:45", 0, 5]];
  s.sueno = {};
  noches.forEach(([a, l, d, c], i) => { s.sueno[dia(-(6 - i))] = { acostarse: a, levantarse: l, despertares: d, calidad: c }; });
  s.gratitud = {
    [dia(-2)]: ["El café con mi hermana", "Dormí 6 horas seguidas", "Mi equipo resolvió sin mí"],
    [dia(-1)]: ["La oración de la mañana", "Caminar 20 minutos", "Mi hija me abrazó sin motivo"],
  };
  s.respiraciones = 14;
  s.descargas = 5;
  const prox = new Date(Date.now() + 2 * 86400000);
  prox.setHours(18, 0, 0, 0);
  s.proximaSesion = prox.toISOString();
  return s;
}

// Consultantes de ejemplo para ver el panel de Ani funcionando.
export function consultantesEjemplo() {
  const ahora = Date.now();
  const lucia = estadoInicial();
  lucia.pacto = { fecha: new Date(ahora - 4 * 86400000).toISOString(), firma: "Lucía (ejemplo)" };
  lucia.radiografias = { entrada: rad([2, 3, 2], [2, 2, 3], [1, 2, 2], 4) };
  lucia.checkins = { [dia(0)]: { espiritu: 2, alma: 1, cuerpo: 2 } };
  const mariana = estadoAdmin({ diasDesdeInicio: 30, nombre: "Mariana" });
  delete mariana.radiografias.salida;
  return [
    { email: "carolina@ejemplo.com", nombre: "Carolina (ejemplo)", estado: estadoAdmin(), updated_at: new Date(ahora).toISOString() },
    { email: "lucia@ejemplo.com", nombre: "Lucía (ejemplo)", estado: lucia, updated_at: new Date(ahora - 3600000).toISOString() },
    { email: "mariana@ejemplo.com", nombre: "Mariana (ejemplo)", estado: mariana, updated_at: new Date(ahora - 6 * 86400000).toISOString() },
  ];
}
