// ─────────────────────────────────────────────────────────────
//  CONTENIDO DE LA APP — el único archivo que se completa a mano.
//  Todo lo que dice  [Ani completa]  lo define Ani. No se inventa.
//  Videos: ID de YouTube "no listado" (lo que va después de v=).
//  Audios y cuadernos: link de Google Drive con acceso "cualquiera con el link".
// ─────────────────────────────────────────────────────────────

export const ANI = {
  nombre: "Ani Martínez",
  programa: "El Círculo de Restauración",
  // Link de agenda de las sesiones 1 a 1 (calendario de sistema.tuclinica.digital)
  agendaUrl: "",
  // WhatsApp de Ani con código de país, sin + ni espacios. Ej: 593999999999
  whatsapp: "",
  // Link de La Siembra (comunidad para graduadas)
  siembraUrl: "",
  // Video de bienvenida (3 min)
  videoBienvenida: "",
  // Audio para las 3 de la mañana: "Mi cuerpo descansa"
  audio3am: "",
};

export const SEMANAS_TOTALES = 10;

// Las 5 estaciones del método. Una sesión 1 a 1 con Ani por estación.
// T·A·M·Í·M es el nombre de cada estación, no un acrónimo.
export const ESTACIONES = [1, 2, 3, 4, 5].map((n) => ({
  n,
  letra: ["T", "A", "M", "Í", "M"][n - 1],
  semanas: `Semanas ${n * 2 - 1} y ${n * 2}`,
  tema: `[Ani completa · tema de la sesión ${n}]`,
  bajada: "[Ani completa · en una frase, qué trabajamos en esta estación]",
  videoId: "",
  audioUrl: "",
  audioTitulo: "Audio guiado",
  cuadernoUrl: "",
  ejercicios: [
    "[Ani completa · ejercicio 1]",
    "[Ani completa · ejercicio 2]",
    "[Ani completa · ejercicio 3]",
  ],
}));

// Las 3 preguntas que llegan a Ani 24 h antes de cada sesión.
export const PREGUNTAS_PRE_SESION = [
  "¿Qué cambió en ti desde la última sesión?",
  "¿Qué fue lo que más te costó estas dos semanas?",
  "¿Qué quieres trabajar sí o sí en esta sesión?",
];

// La radiografía: se mide al entrar, en la semana 5 y al salir.
// 0 = nada · 10 = totalmente. Ani puede ajustar las preguntas.
export const DIMENSIONES = [
  {
    clave: "espiritu",
    nombre: "Espíritu",
    preguntas: [
      "¿Cuánta paz sientes por dentro, aunque afuera haya ruido?",
      "¿Qué tan conectada te sientes con Dios en tu día a día?",
      "¿Qué tan claro tienes para qué estás aquí?",
    ],
  },
  {
    clave: "alma",
    nombre: "Alma",
    preguntas: [
      "¿Qué tan en calma está tu mente al final del día?",
      "¿Cuánto manejas tú tus emociones, en vez de que ellas te manejen?",
      "¿Qué tan acompañada te sientes en lo que estás viviendo?",
    ],
  },
  {
    clave: "cuerpo",
    nombre: "Cuerpo",
    preguntas: [
      "¿Qué tan bien dormiste esta última semana?",
      "¿Con cuánta energía te levantas a la mañana?",
      "¿Qué tan en paz está tu cuerpo (tensión, digestión, dolores)?",
    ],
  },
];

export const MEDICIONES = {
  entrada: { nombre: "Radiografía de entrada", cuando: "Antes de tu primera sesión" },
  mitad: { nombre: "Radiografía de mitad de camino", cuando: "Semana 5" },
  salida: { nombre: "Radiografía de salida", cuando: "Semana 10" },
};

export const PACTO = [
  "Voy a mis 5 sesiones con Ani, en el horario que agendo.",
  "Hago mis ejercicios y escucho mi audio antes de cada sesión.",
  "Respondo mi radiografía con la verdad, aunque el número no me guste.",
  "Si me cuesta, lo digo. No desaparezco.",
];

// La palabra que sostiene el método. Aparece en Hoy y en la graduación.
export const PALABRA_ANCLA = {
  texto: "Y el mismo Dios de paz os santifique por completo; y todo vuestro ser, espíritu, alma y cuerpo, sea guardado irreprensible.",
  cita: "1 Tesalonicenses 5:23",
};

// Frase de cierre del manual de marca. Va en la graduación.
export const CIERRE = "Espero que hayas llegado al final de tu búsqueda.";

// Check-in diario: una sola pregunta por dimensión, 1 a 5 toques.
export const CHECKIN = [
  { clave: "espiritu", nombre: "Espíritu", pregunta: "¿Cuánta paz hay en ti hoy?" },
  { clave: "alma", nombre: "Alma", pregunta: "¿Qué tan en calma está tu mente?" },
  { clave: "cuerpo", nombre: "Cuerpo", pregunta: "¿Cómo dormiste anoche?" },
];
