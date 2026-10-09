"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTamim } from "@/lib/store";
import { ANI } from "@/lib/contenido";
import { siguientePaso } from "@/lib/progreso";
import { vibrar } from "@/lib/util";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Dictado from "@/components/Dictado";
import Respirador from "@/components/Respirador";
import AudioAni from "@/components/AudioAni";
import { Antorcha } from "@/components/Kit";

// En el modo prueba no hay IA conectada: respuestas de muestra con el tono del manual.
const DEMO = {
  "estoy agotada": "Te creo. Llevas mucho tiempo sosteniendo todo por fuera. Hoy no te pido más: toma agua, come algo de verdad y acuéstate media hora antes. Somos espíritu, alma y cuerpo, y tu cuerpo te está hablando. ¿Qué es lo que más te pesa hoy?",
  "me cuesta un ejercicio": "Está bien que cueste: ahí es donde se trabaja. Escribe aunque sea una frase, con tus palabras, sin corregir. Si no te salen, toca el micrófono y dilo en voz alta. Lo que no puedas resolver lo llevamos a tu sesión con Ani.",
  "quiero orar": "Hagámoslo juntas. Cierra los ojos y respira lento. Señor, aquí estoy, cansada y con la mente llena. Pongo en tus manos lo que no puedo controlar. Dame paz para descansar y sabiduría para mañana. Amén.",
  "no sé qué siento": "Empecemos por el cuerpo, que no miente. ¿Dónde lo sientes: en el pecho, en el estómago, en los hombros? Ponle una palabra, aunque sea imperfecta. Con eso ya tenemos por dónde empezar.",
  "no puedo dormir": "Estás despierta y no estás sola. Suelta la mandíbula y los hombros. Inhala en 4, sostén en 4, suelta en 6. Hazlo tres veces conmigo. No pienses en mañana: ahora solo importa este aire.",
  "tengo la cabeza a mil": "Saca todo de la cabeza: ve a Soltar la mente y escribe sin orden. Lo que está escrito ya no tienes que sostenerlo despierta. Después vuelve aquí y respiramos.",
  "tengo miedo": "El miedo de madrugada siempre se ve más grande. Dime en una frase qué es lo que temes. Y recuerda: no tienes que resolverlo ahora, solo atravesar esta noche.",
};
const respuestaDemo = (t, noche) =>
  DEMO[t.toLowerCase()] ||
  (noche
    ? "Estoy aquí. Respira lento conmigo: inhala 4, sostén 4, suelta 6. Cuéntame qué sientes en el cuerpo ahora mismo."
    : "Gracias por contármelo. Esto es una respuesta de muestra: en la app real te respondo con la voz y el método de Ani, según la estación en la que estás.");

const ATAJOS_DIA = ["Estoy agotada", "Me cuesta un ejercicio", "Quiero orar", "No sé qué siento"];
const ATAJOS_NOCHE = ["No puedo dormir", "Tengo la cabeza a mil", "Quiero orar", "Tengo miedo"];

function Compania() {
  const q = useSearchParams();
  const noche = q.get("modo") === "3am";
  const { estado, actualizar, sesion } = useTamim();
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [respirar, setRespirar] = useState(false);
  const fin = useRef(null);
  const chat = estado.chat || [];
  const paso = siguientePaso(estado);

  useEffect(() => {
    document.body.classList.toggle("cuerpo-noche", noche);
    return () => document.body.classList.remove("cuerpo-noche");
  }, [noche]);
  useEffect(() => { if (chat.length) fin.current?.scrollIntoView({ behavior: "smooth" }); }, [chat.length, pensando]);

  const enviar = async (t0) => {
    const t = (t0 ?? texto).trim();
    if (!t || pensando) return;
    vibrar();
    const mensajes = [...chat, { rol: "yo", texto: t }];
    actualizar((s) => ({ ...s, chat: mensajes.slice(-60) }));
    setTexto("");
    setPensando(true);
    const r = sesion.demo
      ? await new Promise((ok) => setTimeout(() => ok({ texto: respuestaDemo(t, noche) }), 1100))
      : await fetch("/api/ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sesion.token, mensajes, nombre: sesion.nombre,
        estacion: paso.tipo === "estacion" ? paso.n : null,
        modo: noche ? "3am" : "dia",
      }),
    }).then((x) => x.json()).catch(() => ({ texto: "No pude responderte ahora. Vuelve a intentar en un minuto." }));
    actualizar((s) => ({ ...s, chat: [...(s.chat || []), { rol: "ia", texto: r.texto }].slice(-60) }));
    setPensando(false);
  };

  return (
    <main className={`pantalla ${noche ? "noche" : ""}`} style={noche ? { maxWidth: "none" } : undefined}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <Marca noche={noche} />
        {noche && <div style={{ margin: "8px 0 18px" }}><Antorcha tono="crema" alto={150} /></div>}
        <p className="versalita">{noche ? "Modo 3 de la mañana" : "Tu compañía 24/7"}</p>
        <h1 className="mt">{noche ? "Estás despierta. No estás sola." : "Escríbeme lo que te pasa."}</h1>

        {noche ? (
          <>
            <p className="bajada mt">Baja el brillo de la pantalla. Primero, el cuerpo.</p>
            {respirar ? (
              <Respirador noche onFin={() => setRespirar(false)} />
            ) : (
              <button className="boton mt2" onClick={() => { vibrar(); setRespirar(true); }}>Respirar conmigo</button>
            )}
            {ANI.audio3am && (
              <div className="tarjeta"><p className="versalita">Mi cuerpo descansa · audio de Ani</p><AudioAni url={ANI.audio3am} titulo="Mi cuerpo descansa" /></div>
            )}
          </>
        ) : (
          <p className="bajada mt">Te respondo con el método TamÍm, a cualquier hora. Lo importante lo seguimos en tu sesión con Ani.</p>
        )}

        <div className="mt2">
          {chat.map((m, i) => <div key={i} className={`burbuja ${m.rol}`}>{m.texto}</div>)}
          {pensando && <div className="burbuja ia" style={{ color: "var(--tinta-2)" }}>…</div>}
          <div ref={fin} />
        </div>

        {!pensando && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
            {(noche ? ATAJOS_NOCHE : ATAJOS_DIA).map((a) => (
              <button key={a} onClick={() => enviar(a)} style={{ padding: "12px 18px", borderRadius: 999, border: "1px solid var(--oro)", fontSize: 17, background: "var(--blanco)" }}>
                {a}
              </button>
            ))}
          </div>
        )}

        <div className="fila mt2" style={{ alignItems: "flex-end" }}>
          <textarea rows={2} value={texto} placeholder={noche ? "¿Qué estás sintiendo ahora?" : "Escribe o dicta aquí"} onChange={(e) => setTexto(e.target.value)} />
          <Dictado onTexto={(t) => setTexto((v) => (v ? v + " " : "") + t)} />
        </div>
        <button className="boton mt" disabled={!texto.trim() || pensando} onClick={() => enviar()}>Enviar</button>
        <p className="nota mt2">Esta compañía acompaña tu proceso. Ante una emergencia, llama al 911.</p>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Protegida>
      <Suspense fallback={null}><Compania /></Suspense>
    </Protegida>
  );
}
