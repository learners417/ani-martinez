"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTamim } from "@/lib/store";
import { ANI, ESTACIONES, PREGUNTAS_PRE_SESION } from "@/lib/contenido";
import { est, estacionAbierta, estacionHecha, MIN_CARACTERES } from "@/lib/progreso";
import { vibrar } from "@/lib/util";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Video from "@/components/Video";
import AudioAni from "@/components/AudioAni";
import Dictado from "@/components/Dictado";
import { Arco } from "@/components/Kit";

// Una idea por pantalla: clase → 3 ejercicios → audio → preguntas para Ani → sesión.
const PANTALLAS = ["clase", "ej0", "ej1", "ej2", "audio", "pre", "sesion"];
const NOMBRES = { clase: "La clase", ej0: "Ejercicio 1", ej1: "Ejercicio 2", ej2: "Ejercicio 3", audio: "Audio", pre: "Para Ani", sesion: "Sesión" };

const completa = (p, k) => {
  if (k === "clase") return Boolean(p.claseVista);
  if (k.startsWith("ej")) return (p.ejercicios?.[Number(k[2])] || "").trim().length >= MIN_CARACTERES;
  if (k === "audio") return p.audio;
  if (k === "pre") return p.preEnviada;
  return p.sesion;
};

function Estacion() {
  const { n: nStr } = useParams();
  const n = Number(nStr);
  const e = ESTACIONES.find((x) => x.n === n);
  const { estado, actualizar, sesion } = useTamim();
  const p = est(estado, n);
  const inicial = useMemo(() => {
    const i = PANTALLAS.findIndex((k) => !completa(p, k));
    return i === -1 ? PANTALLAS.length - 1 : i;
  }, []); // eslint-disable-line
  const [i, setI] = useState(inicial);
  const [enviando, setEnviando] = useState(false);

  if (!e) return <h2>Esta estación no existe.</h2>;
  if (!estacionAbierta(estado, n))
    return (
      <>
        <p className="versalita">Estación {e.letra}</p>
        <h1 className="mt">Todavía no se abre.</h1>
        <p className="bajada mt">Se abre cuando terminas la estación anterior. Un paso a la vez.</p>
        <Link className="boton mt2" href="/">Ir a mi paso de hoy</Link>
      </>
    );

  const set = (fn) =>
    actualizar((s) => ({ ...s, estaciones: { ...s.estaciones, [n]: fn(structuredClone(est(s, n))) } }));

  if (estacionHecha(estado, n) && i === PANTALLAS.length)
    return (
      <div className="centro contar">
        <div className="celebrar quieta"><span className="grande" style={{ fontSize: 110 }}>{e.letra}</span></div>
        <Arco conLlama className="arco" style={{ marginTop: 8 }} />
        <p className="versalita">Estación {n} de 5</p>
        <h1 className="mt">Completaste esta estación.</h1>
        <p className="bajada mt">{n < 5 ? "La siguiente ya está abierta." : "Te queda tu radiografía de salida."}</p>
        <Link className="boton mt2" href="/">Ver mi siguiente paso</Link>
        <button className="boton claro" onClick={() => setI(0)}>Repasar esta estación</button>
      </div>
    );

  const k = PANTALLAS[i];
  const avanzar = () => {
    vibrar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (i === PANTALLAS.length - 1 && estacionHecha(estado, n)) return setI(PANTALLAS.length);
    setI(Math.min(i + 1, PANTALLAS.length - 1));
  };
  const puedeSeguir = completa(p, k);

  let cuerpo;
  if (k === "clase") {
    cuerpo = (
      <>
        <h2>Mira la clase</h2>
        <p className="bajada mt">Ponte cómoda. Dale play y después sigues.</p>
        <Video id={e.videoId} titulo={e.tema} />
        {!p.claseVista && (
          <button className="boton mt2" onClick={() => { set((x) => ({ ...x, claseVista: true })); avanzar(); }}>Ya la vi</button>
        )}
      </>
    );
  } else if (k.startsWith("ej")) {
    const j = Number(k[2]);
    const v = p.ejercicios?.[j] || "";
    const falta = Math.max(0, MIN_CARACTERES - v.trim().length);
    const escribir = (t) => set((x) => { const ej = [...(x.ejercicios || ["", "", ""])]; ej[j] = t; return { ...x, ejercicios: ej }; });
    cuerpo = (
      <>
        <p className="versalita">Tu cuaderno · {j + 1} de 3</p>
        <h2 className="mt">{e.ejercicios[j]}</h2>
        <textarea className="mt2" rows={7} value={v} placeholder="Escribe aquí, con tus palabras" onChange={(ev) => escribir(ev.target.value)} />
        <div className="fila mt" style={{ justifyContent: "space-between" }}>
          <p className="nota" style={{ marginTop: 0 }}>{falta > 0 ? `Te faltan ${falta} letras` : "✓ Guardado"}</p>
          <Dictado onTexto={(t) => escribir((v ? v + " " : "") + t)} />
        </div>
        {j === 0 && <p className="nota">Si te cuesta escribir, toca el micrófono y dilo en voz alta.</p>}
        {e.cuadernoUrl && <a className="boton claro mt2" href={e.cuadernoUrl} target="_blank" rel="noreferrer">Abrir el cuaderno completo</a>}
      </>
    );
  } else if (k === "audio") {
    cuerpo = (
      <>
        <h2>{e.audioTitulo}</h2>
        <p className="bajada mt">Con auriculares, en un lugar tranquilo. Cierra los ojos.</p>
        <AudioAni url={e.audioUrl} titulo={e.audioTitulo} />
        <button className={`check mt ${p.audio ? "si" : ""}`} onClick={() => { vibrar(); set((x) => ({ ...x, audio: !x.audio })); }}>
          <span className="caja" /> <span>Ya lo escuché</span>
        </button>
      </>
    );
  } else if (k === "pre") {
    const listas = [0, 1, 2].every((q) => (p.pre?.[q] || "").trim().length > 0);
    const enviar = async () => {
      setEnviando(true);
      await fetch("/api/pre-sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: sesion.token, estacion: `${e.letra} · ${e.tema}`, respuestas: p.pre }),
      }).catch(() => {});
      set((x) => ({ ...x, preEnviada: true }));
      setEnviando(false);
      vibrar(30);
    };
    cuerpo = (
      <>
        <h2>Antes de tu sesión</h2>
        <p className="bajada mt">Respóndelas 24 horas antes. Le llegan a Ani para preparar tu sesión.</p>
        {PREGUNTAS_PRE_SESION.map((q, j) => {
          const val = p.pre?.[j] || "";
          const escribir = (t) => set((x) => { const pre = [...(x.pre || ["", "", ""])]; pre[j] = t; return { ...x, pre }; });
          return (
            <div key={j} className="mt2">
              <p style={{ fontFamily: "var(--serif)", fontSize: 24, lineHeight: 1.25 }}>{q}</p>
              <div className="fila mt" style={{ alignItems: "flex-start" }}>
                <textarea rows={3} value={val} disabled={p.preEnviada} onChange={(ev) => escribir(ev.target.value)} />
                {!p.preEnviada && <Dictado onTexto={(t) => escribir((val ? val + " " : "") + t)} />}
              </div>
            </div>
          );
        })}
        {p.preEnviada ? (
          <p className="versalita mt2">✓ Enviado a Ani</p>
        ) : (
          <button className="boton mt2" disabled={!listas || enviando} onClick={enviar}>{enviando ? "Enviando…" : "Enviar a Ani"}</button>
        )}
      </>
    );
  } else {
    cuerpo = (
      <>
        <h2>Tu sesión {n} con Ani</h2>
        <p className="bajada mt">Llega 5 minutos antes, con agua y en un lugar donde puedas hablar tranquila.</p>
        {ANI.agendaUrl && <a className="boton claro mt2" href={ANI.agendaUrl} target="_blank" rel="noreferrer">Agendar o ver mi sesión</a>}
        <button className={`check mt ${p.sesion ? "si" : ""}`} onClick={() => { vibrar(); set((x) => ({ ...x, sesion: !x.sesion })); }}>
          <span className="caja" /> <span>Ya tuve mi sesión {n} con Ani</span>
        </button>
      </>
    );
  }

  return (
    <>
      <p className="versalita">Estación {e.letra} · {e.semanas} {e.ejemplo && <span className="chip">Ejemplo</span>}</p>
      <p style={{ fontFamily: "var(--serif)", fontSize: 24, marginTop: 6, lineHeight: 1.2 }}>{e.tema}</p>
      <div className="pasos">
        {PANTALLAS.map((x, j) => (
          <span key={x} className={j === i ? "ahora" : completa(p, x) ? "si" : ""} onClick={() => setI(j)} style={{ cursor: "pointer" }} />
        ))}
      </div>
      <p className="nota" style={{ marginTop: 4 }}>{NOMBRES[k]} · {i + 1} de {PANTALLAS.length}</p>

      <section key={k} className="tarjeta contar">{cuerpo}</section>

      <div className="fila mt2" style={{ gap: 12 }}>
        {i > 0 && <button className="boton claro" style={{ flex: 1, marginTop: 0 }} onClick={() => { vibrar(); setI(i - 1); }}>Atrás</button>}
        <button className="boton" style={{ flex: 2, marginTop: 0 }} disabled={!puedeSeguir} onClick={avanzar}>
          {i === PANTALLAS.length - 1 ? "Terminar estación" : "Siguiente"}
        </button>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <Estacion />
      </main>
    </Protegida>
  );
}
