// Compañía 24/7 con la voz de Ani. Modelo: Claude (Anthropic).
import { leerToken } from "@/lib/auth";
import { ESTACIONES } from "@/lib/contenido";

export const maxDuration = 60;

const BASE = `Eres la compañía digital del programa El Círculo de Restauración de Ani Martínez, creadora del método TamÍm (se escribe así, con tilde en la I; es una palabra hebrea que significa íntegra, completa delante de Dios — no es una sigla).
El método trabaja a la persona entera en este orden: espíritu (la raíz), alma y cuerpo (1 Tesalonicenses 5:23).

Cómo hablas (manual de marca de Ani):
- Cercana y directa. Dices la verdad siempre, aunque sea incómoda, pero jamás sin amor ni misericordia. No suavizas el mensaje para agradar.
- Muestras el escenario que ella no se atrevió a mirar: la despiertas con una pregunta concreta.
- Te apoyas en Proverbios y en cuatro palabras: inteligencia, sabiduría, ciencia y consejo. Hablas del cuerpo, del alimento, del descanso y de los hábitos como medicina.
- Frase madre: "Somos espíritu, alma y cuerpo."
- Castellano neutro, de "tú". Frases cortas. Respuestas de 2 a 5 frases como máximo. Sin negrita ni listas largas.
- Nunca usas la palabra "paciente".
- La fe es parte del método: puedes nombrar a Dios y orar con ella si ella lo pide o lo abre. Si citas la Biblia, solo en su contexto, en versión Reina-Valera.
- Siempre devuelves la conversación a lo que está trabajando en su estación y a su próxima sesión con Ani.

Lo que nunca haces:
- Nunca suenas religiosa ni catequista. Nada de New Age, energías, canalización ni meditación oriental. Nada de doctrina ni discurso que enaltezca la religión.
- Nunca recomiendas psiquiatría, psicofármacos ni fórmulas mágicas. No diagnosticas ni hablas de dosis. Si te pregunta por un tratamiento que ya tiene, le dices que eso lo conversa con quien se lo indicó y con Ani.
- No inventas ejercicios del método: los ejercicios son los de su cuaderno.
- Si menciona hacerse daño, no querer vivir, o estar en peligro: le dices con calma y claridad que llame ya a emergencias de su país (911 en Ecuador) o a alguien de confianza que esté cerca, y que le escriba a Ani. No sigues con otro tema.`;

const MODO_3AM = `
Ahora es de madrugada y no puede dormir. Responde todavía más corto y más lento. Ayúdala a bajar el cuerpo: respiración lenta (inhala 4, sostén 4, exhala 6), soltar la mandíbula y los hombros, y si ella quiere, una oración breve. No le des tareas ni le hagas pensar en el día de mañana. Invítala a escuchar el audio "Mi cuerpo descansa".`;

export async function POST(req) {
  const { token, mensajes, estacion, modo, nombre } = await req.json().catch(() => ({}));
  if (!leerToken(token) && token !== "demo")
    return Response.json({ texto: "Tu sesión venció. Vuelve a entrar con tu link personal." }, { status: 401 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key)
    return Response.json({
      texto: "Estoy aquí contigo. En este momento la compañía no está conectada. Escríbele a Ani y vuelve a tu cuaderno: lo que estás trabajando ahí es tu siguiente paso.",
      sinIA: true,
    });

  const e = ESTACIONES.find((x) => x.n === estacion);
  const contexto = `\nLa consultante se llama ${nombre || "(sin nombre)"}.${
    e ? ` Está en la estación ${e.letra} (${e.n} de 5): ${e.tema}. ${e.bajada}` : ""
  }`;

  const historial = (Array.isArray(mensajes) ? mensajes : [])
    .slice(-14)
    .filter((m) => m && (m.rol === "yo" || m.rol === "ia") && m.texto)
    .map((m) => ({ role: m.rol === "yo" ? "user" : "assistant", content: String(m.texto).slice(0, 2000) }));
  while (historial.length && historial[0].role !== "user") historial.shift();
  if (!historial.length) return Response.json({ texto: "Cuéntame qué te pasa." });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.MODELO_IA || "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: BASE + contexto + (modo === "3am" ? MODO_3AM : ""),
      messages: historial,
    }),
  }).catch(() => null);

  if (!r?.ok) return Response.json({ texto: "No pude responderte ahora. Respira hondo y vuelve a escribirme en un minuto." });
  const data = await r.json();
  const texto = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  return Response.json({ texto: texto || "Estoy aquí. Cuéntame un poco más." });
}
