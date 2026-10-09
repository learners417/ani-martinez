"use client";
import { useEffect, useState } from "react";
import { ESTACIONES, PREGUNTAS_PRE_SESION } from "@/lib/contenido";
import { siguientePaso, semanaActual, estacionesHechas, est, racha, resumenSueno } from "@/lib/progreso";
import { cuentaRegresiva } from "@/lib/util";
import Marca from "@/components/Marca";
import Grafico from "@/components/Grafico";

const K = "tamim_panel_key";

// Semáforo: rojo = 5+ días sin entrar o un check-in en 1-2 · gris = 3-4 días · oro = al día.
function semaforo(c) {
  const s = c.estado || {};
  const dias = Math.floor((Date.now() - new Date(c.updated_at).getTime()) / 86400000);
  const ult = Object.entries(s.checkins || {}).sort(([a], [b]) => (a < b ? 1 : -1))[0]?.[1];
  const bajo = ult && Object.values(ult).some((v) => v <= 2);
  if (dias >= 5 || bajo) return { color: "var(--rojo)", txt: bajo ? "Check-in bajo" : "Sin entrar", nivel: 2 };
  if (dias >= 3) return { color: "var(--tinta-2)", txt: "Tibia", nivel: 1 };
  return { color: "var(--oro)", txt: "Al día", nivel: 0 };
}

function Ficha({ c }) {
  const [abierta, setAbierta] = useState(false);
  const s = c.estado || {};
  const paso = s.pacto ? siguientePaso(s) : { tipo: "pacto" };
  const donde =
    paso.tipo === "pacto" ? "Todavía no firmó el pacto"
    : paso.tipo === "radiografia" ? `Le toca: radiografía (${paso.medicion})`
    : paso.tipo === "graduacion" ? "Graduada"
    : `Estación ${ESTACIONES[paso.n - 1].letra} (${paso.n} de 5)`;
  const dias = Math.floor((Date.now() - new Date(c.updated_at).getTime()) / 86400000);
  const sem = semaforo(c);
  const sueno = resumenSueno(s);
  const sesionTxt = cuentaRegresiva(s.proximaSesion);
  const ultima = [...ESTACIONES].reverse().find((e) => est(s, e.n).preEnviada);

  return (
    <div className="tarjeta">
      <button style={{ width: "100%", textAlign: "left" }} onClick={() => setAbierta(!abierta)}>
        <div className="fila" style={{ justifyContent: "space-between" }}>
          <h3>{c.nombre || c.email}</h3>
          <span className="versalita">{s.pacto ? `Semana ${semanaActual(s)}` : "—"}</span>
        </div>
        <p className="bajada mt">{donde} · {estacionesHechas(s)} de 5 sesiones</p>
        <div className="fila mt" style={{ gap: 18, flexWrap: "wrap", fontSize: 17 }}>
          <span style={{ color: sem.color }}>● {sem.txt}</span>
          <span>Racha {racha(s)} {racha(s) === 1 ? "día" : "días"}</span>
          {sueno?.horas && <span>Duerme {sueno.horas} h</span>}
          {sesionTxt && <span>Sesión: {sesionTxt}</span>}
        </div>
        <p className="nota" style={{ color: dias >= 5 ? "var(--rojo)" : undefined }}>
          {dias === 0 ? "Activa hoy" : `Última actividad hace ${dias} día${dias > 1 ? "s" : ""}`}
        </p>
      </button>
      {abierta && (
        <div className="mt2">
          {s.radiografias?.entrada && <Grafico radiografias={s.radiografias} />}
          {ultima && (
            <>
              <hr className="filete" />
              <p className="versalita">Antes de la sesión {ultima.n}</p>
              {PREGUNTAS_PRE_SESION.map((q, i) => (
                <div key={i} className="mt">
                  <p style={{ fontFamily: "var(--serif)", fontSize: 21 }}>{q}</p>
                  <p>{est(s, ultima.n).pre?.[i]}</p>
                </div>
              ))}
            </>
          )}
          {ESTACIONES.filter((e) => (est(s, e.n).ejercicios || []).some((x) => x)).map((e) => (
            <div key={e.n}>
              <hr className="filete" />
              <p className="versalita">Cuaderno · Estación {e.letra}</p>
              {e.ejercicios.map((ej, i) => (
                <div key={i} className="mt">
                  <p style={{ fontFamily: "var(--serif)", fontSize: 21 }}>{ej}</p>
                  <p style={{ whiteSpace: "pre-wrap" }}>{est(s, e.n).ejercicios?.[i] || "—"}</p>
                </div>
              ))}
            </div>
          ))}
          <p className="nota mt2">{c.email}</p>
        </div>
      )}
    </div>
  );
}

export default function Panel() {
  const [clave, setClave] = useState("");
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  const cargar = async (k) => {
    setError("");
    const r = await fetch("/api/panel", { headers: { "x-panel-key": k } }).catch(() => null);
    const d = r ? await r.json() : { error: "Sin conexión" };
    if (d.error) return setError(d.error);
    try { localStorage.setItem(K, k); } catch {}
    setDatos(d.consultantes);
  };

  useEffect(() => {
    try { const k = localStorage.getItem(K); if (k) { setClave(k); cargar(k); } } catch {}
  }, []);

  return (
    <main className="pantalla" style={{ paddingBottom: 60 }}>
      <Marca derecha={<span className="versalita">Panel de Ani</span>} />
      {!datos ? (
        <>
          <h1>Tus consultantes</h1>
          <input className="mt2" type="password" placeholder="Clave del panel" value={clave} onChange={(e) => setClave(e.target.value)} />
          <button className="boton mt" onClick={() => cargar(clave)}>Entrar</button>
          {error && <p className="nota" style={{ color: "var(--rojo)" }}>{error}</p>}
        </>
      ) : (
        <>
          <h1>Tus consultantes</h1>
          <div className="grid3 mt2">
            <div className="mini"><div className="numero">{datos.length}</div><div className="etq">en el Círculo</div></div>
            <div className="mini"><div className="numero" style={{ color: "var(--oro)" }}>{datos.filter((c) => semaforo(c).nivel === 0).length}</div><div className="etq">al día</div></div>
            <div className="mini"><div className="numero" style={{ color: "var(--rojo)" }}>{datos.filter((c) => semaforo(c).nivel === 2).length}</div><div className="etq">necesitan tu mensaje</div></div>
          </div>
          <p className="bajada mt2">Primero las que necesitan atención. Toca un nombre para ver todo.</p>
          {[...datos].sort((a, b) => semaforo(b).nivel - semaforo(a).nivel).map((c) => <Ficha key={c.email} c={c} />)}
          <button className="boton claro mt2" onClick={() => cargar(clave)}>Actualizar</button>
        </>
      )}
    </main>
  );
}
