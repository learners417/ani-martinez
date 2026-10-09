"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTamim } from "@/lib/store";
import { ANI, CHECKIN, ESTACIONES, MEDICIONES, PACTO, PALABRA_ANCLA, SEMANAS_TOTALES } from "@/lib/contenido";
import { siguientePaso, semanaActual, porcentaje, estacionHecha, est, ejerciciosListos, racha } from "@/lib/progreso";
import { hoyISO, saludo, vibrar, cuentaRegresiva, fechaLarga, descargarICS } from "@/lib/util";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Video from "@/components/Video";
import { IcoCalendario, IcoFlecha, IcoLuna } from "@/components/Iconos";
import { Arco, Llama } from "@/components/Kit";

/* ── Onboarding: bienvenida → instalar → pacto ───────────── */
function Onboarding() {
  const { sesion, actualizar } = useTamim();
  const [paso, setPaso] = useState(0);
  const [marcas, setMarcas] = useState(PACTO.map(() => false));
  const [firma, setFirma] = useState(sesion?.nombre || "");
  const nombre = (sesion?.nombre || "").split(" ")[0];

  const barra = (
    <div className="pasos">{[0, 1, 2].map((i) => <span key={i} className={i < paso ? "si" : i === paso ? "ahora" : ""} />)}</div>
  );

  if (paso === 0)
    return (
      <div key="p0" className="contar">
        {barra}
        <Arco conLlama className="arco mt" />
        <p className="versalita mt">Bienvenida</p>
        <h1 className="mt">{nombre ? `${nombre}, ` : ""}empieza tu <em>restauración</em>.</h1>
        <p className="bajada mt">10 semanas. 5 sesiones conmigo. Un paso por día.</p>
        <Video id={ANI.videoBienvenida} titulo="Bienvenida" />
        <button className="boton mt2" onClick={() => { vibrar(); setPaso(1); }}>Ya lo vi, sigo</button>
      </div>
    );

  if (paso === 1)
    return (
      <div key="p1" className="contar">
        {barra}
        <p className="versalita mt">Tenla a mano</p>
        <h1 className="mt">Ponla en tu pantalla de inicio.</h1>
        <p className="bajada mt">Así la abres con un toque, como cualquier app.</p>
        <div className="tarjeta">
          <p className="versalita">iPhone</p>
          <p className="mt" style={{ fontSize: 20 }}>Toca <em>Compartir</em> abajo en Safari → <em>Agregar a inicio</em>.</p>
          <hr className="filete" />
          <p className="versalita">Android</p>
          <p className="mt" style={{ fontSize: 20 }}>Toca los <em>tres puntos</em> arriba en Chrome → <em>Instalar app</em>.</p>
        </div>
        <button className="boton mt2" onClick={() => { vibrar(); setPaso(2); }}>Listo, sigo</button>
      </div>
    );

  const todo = marcas.every(Boolean) && firma.trim().length > 2;
  return (
    <div key="p2" className="contar">
      {barra}
      <p className="versalita mt">Tu pacto</p>
      <h1 className="mt">Esto es lo que te comprometes a hacer.</h1>
      <div className="tarjeta">
        {PACTO.map((t, i) => (
          <button key={i} className={`check ${marcas[i] ? "si" : ""}`} onClick={() => { vibrar(); setMarcas(marcas.map((m, j) => (j === i ? !m : m))); }}>
            <span className="caja" />
            <span>{t}</span>
          </button>
        ))}
      </div>
      <div className="tarjeta quieta">
        <p className="cita">Si haces el trabajo, no te suelto hasta que <em>termines</em>.</p>
        <p className="versalita mt">Ani</p>
      </div>
      <p className="mt2">Firma con tu nombre completo</p>
      <input className="mt" type="text" value={firma} onChange={(e) => setFirma(e.target.value)} />
      <button
        className="boton mt2"
        disabled={!todo}
        onClick={() => { vibrar(30); actualizar((s) => ({ ...s, pacto: { fecha: new Date().toISOString(), firma: firma.trim() } })); }}
      >
        Firmo mi pacto
      </button>
    </div>
  );
}

/* ── Check-in de 10 segundos ─────────────────────────────── */
function CheckIn() {
  const { estado, actualizar } = useTamim();
  const hoy = hoyISO();
  const guardado = estado.checkins?.[hoy];
  const [v, setV] = useState({});
  const [abierto, setAbierto] = useState(false);

  if (guardado && !abierto)
    return (
      <button className="tarjeta fila" style={{ width: "100%", justifyContent: "space-between", textAlign: "left" }} onClick={() => { setV(guardado); setAbierto(true); }}>
        <span>
          <span className="versalita">✓ Check-in de hoy</span>
          <br />
          <span style={{ fontSize: 18, color: "var(--tinta-2)" }}>
            {CHECKIN.map((c) => `${c.nombre} ${guardado[c.clave]}`).join(" · ")}
          </span>
        </span>
        <span className="nota" style={{ marginTop: 0 }}>Cambiar</span>
      </button>
    );

  const elegir = (clave, n) => {
    vibrar();
    const nuevo = { ...v, [clave]: n };
    setV(nuevo);
    if (CHECKIN.every((c) => nuevo[c.clave])) {
      vibrar(30);
      setTimeout(() => {
        actualizar((s) => ({ ...s, checkins: { ...(s.checkins || {}), [hoy]: nuevo } }));
        setAbierto(false);
      }, 350);
    }
  };

  return (
    <div className="tarjeta">
      <p className="versalita">Check-in · 10 segundos</p>
      <h3 className="mt" style={{ fontSize: 28 }}>¿Cómo llegas hoy?</h3>
      {CHECKIN.map((c) => (
        <div key={c.clave} className="mt2">
          <p style={{ fontSize: 19 }}><em style={{ fontStyle: "normal" }}>{c.nombre}</em> · {c.pregunta}</p>
          <div className="puntos5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={v[c.clave] === n ? "si" : ""} onClick={() => elegir(c.clave, n)}>{n}</button>
            ))}
          </div>
        </div>
      ))}
      <div className="extremos"><span>Nada</span><span>Mucho</span></div>
    </div>
  );
}

/* ── Próxima sesión con Ani ──────────────────────────────── */
function ProximaSesion() {
  const { estado, actualizar } = useTamim();
  const [editar, setEditar] = useState(false);
  const [valor, setValor] = useState("");
  const [, forzar] = useState(0);
  useEffect(() => { const t = setInterval(() => forzar((x) => x + 1), 60000); return () => clearInterval(t); }, []);
  const iso = estado.proximaSesion;
  const cuenta = cuentaRegresiva(iso);

  if (!cuenta || editar)
    return (
      <div className="tarjeta">
        <div className="fila"><span style={{ color: "var(--oro)" }}><IcoCalendario /></span><p className="versalita">Tu próxima sesión</p></div>
        <h3 className="mt" style={{ fontSize: 26 }}>¿Cuándo te ve Ani?</h3>
        <input className="mt" type="datetime-local" value={valor} onChange={(e) => setValor(e.target.value)} />
        <button
          className="boton mt"
          disabled={!valor}
          onClick={() => { vibrar(); actualizar((s) => ({ ...s, proximaSesion: new Date(valor).toISOString() })); setEditar(false); }}
        >
          Guardar
        </button>
        {ANI.agendaUrl && <a className="boton claro" href={ANI.agendaUrl} target="_blank" rel="noreferrer">Todavía no agendé</a>}
      </div>
    );

  return (
    <div className="tarjeta">
      <div className="fila" style={{ justifyContent: "space-between" }}>
        <div className="fila"><span style={{ color: "var(--oro)" }}><IcoCalendario /></span><p className="versalita">Tu sesión con Ani</p></div>
        <button className="nota" style={{ marginTop: 0 }} onClick={() => setEditar(true)}>Cambiar</button>
      </div>
      <p className="grande mt">{cuenta}</p>
      <p className="bajada mt">{fechaLarga(iso).replace(/^./, (c) => c.toUpperCase())}</p>
      <button
        className="boton claro mt"
        onClick={() => descargarICS({ titulo: "Sesión con Ani · TamÍm", inicio: iso, detalle: "Responde tus 3 preguntas en la app 24 h antes." })}
      >
        Agregar a mi calendario
      </button>
    </div>
  );
}

/* ── El paso de hoy ──────────────────────────────────────── */
function Siguiente({ paso }) {
  const { estado } = useTamim();
  let sobre, titulo, bajada, href, cta;
  if (paso.tipo === "radiografia") {
    const m = MEDICIONES[paso.medicion];
    sobre = m.cuando; titulo = m.nombre; bajada = "9 preguntas · 3 minutos"; href = `/radiografia?m=${paso.medicion}`; cta = "Responder ahora";
  } else if (paso.tipo === "graduacion") {
    sobre = "Semana 10"; titulo = "Terminaste tu camino TamÍm."; bajada = "Mira tu antes y tu después."; href = "/graduacion"; cta = "Ver mi graduación";
  } else {
    const e = ESTACIONES[paso.n - 1];
    const p = est(estado, paso.n);
    const listos = ejerciciosListos(p);
    sobre = `Estación ${e.letra} · ${e.semanas}`;
    titulo = e.tema;
    bajada =
      listos < 3 ? `Clase y ejercicios · ${listos} de 3 listos`
      : !p.audio ? "Escucha tu audio guiado"
      : !p.preEnviada ? "Responde tus 3 preguntas para Ani"
      : "Ten tu sesión con Ani";
    href = `/estacion/${e.n}`; cta = "Seguir";
  }
  return (
    <div className="tarjeta" style={{ borderColor: "var(--oro)", padding: "30px 24px" }}>
      <p className="versalita">Tu paso de hoy</p>
      <p className="nota" style={{ marginTop: 6 }}>{sobre}</p>
      <h2 className="mt">{titulo}</h2>
      <p className="bajada mt">{bajada}</p>
      <Link className="boton mt2" href={href}>{cta} <IcoFlecha /></Link>
    </div>
  );
}

function Hoy() {
  const { estado, sesion } = useTamim();
  if (!estado.pacto)
    return (
      <main className="pantalla">
        <Marca />
        <Onboarding />
      </main>
    );
  const paso = siguientePaso(estado);
  const semana = semanaActual(estado);
  const pct = porcentaje(estado);
  const dias = racha(estado);
  const actual = paso.tipo === "estacion" ? paso.n : 0;
  const nombre = (sesion?.nombre || "").split(" ")[0];
  const h = new Date().getHours();
  const deNoche = h >= 22 || h < 6;

  return (
    <main className="pantalla">
      <Marca derecha={<span className="versalita">Semana {semana} de {SEMANAS_TOTALES}</span>} />
      <Arco className="arco arco-hero" />
      <div className="centro" style={{ position: "relative" }}>
        <p className="versalita">{saludo()}</p>
        <h1 className="mt" style={{ fontSize: 64 }}>{nombre || "Hola"}<em>.</em></h1>
      </div>

      {deNoche && (
        <Link href="/compania?modo=3am" className="boton mt2" style={{ background: "#2A251F" }}>
          <IcoLuna /> ¿No puedes dormir? Entra aquí
        </Link>
      )}

      <div className="grid3 mt2">
        <div className="mini"><div className="numero">{dias}</div><div className="etq">{dias === 1 ? "día presente" : "días presente"}</div></div>
        <div className="mini"><div className="numero">{actual ? ESTACIONES[actual - 1].letra : "✓"}</div><div className="etq">estación {actual || "–"} de 5</div></div>
        <div className="mini"><div className="numero">{pct}%</div><div className="etq">de tu camino</div></div>
      </div>

      <div className="estaciones">
        {ESTACIONES.map((e) => (
          <Link key={e.n} href={`/estacion/${e.n}`} className={`letra ${estacionHecha(estado, e.n) ? "hecha" : ""} ${actual === e.n ? "actual" : ""}`}>
            {e.letra}
          </Link>
        ))}
      </div>

      <CheckIn />
      <Siguiente paso={paso} />
      <ProximaSesion />

      <div className="tarjeta quieta">
        <Llama alto={22} />
        <p className="cita mt">“{PALABRA_ANCLA.texto}”</p>
        <p className="versalita mt">{PALABRA_ANCLA.cita}</p>
      </div>

      {!deNoche && (
        <Link href="/compania?modo=3am" className="herramienta">
          <span className="ico"><IcoLuna /></span>
          <span><span className="tit">Modo 3 de la mañana</span><br /><span className="sub">Para cuando no puedes dormir</span></span>
        </Link>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Protegida>
      <Hoy />
    </Protegida>
  );
}
