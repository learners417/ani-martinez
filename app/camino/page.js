"use client";
import Link from "next/link";
import { useTamim } from "@/lib/store";
import { ESTACIONES, MEDICIONES } from "@/lib/contenido";
import { estacionAbierta, estacionHecha, mapa70, racha, resumenSueno } from "@/lib/progreso";
import Grafico from "@/components/Grafico";
import { LockupTamim, Llama } from "@/components/Kit";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";

function Hito({ titulo, cuando, hecho, href }) {
  return (
    <Link href={href} className="fila" style={{ textDecoration: "none", padding: "14px 0 14px 70px", color: "var(--tinta-2)" }}>
      <span className="versalita" style={{ color: hecho ? "var(--oro)" : "var(--tinta-2)" }}>
        {hecho ? "✓ " : ""}{titulo} · {cuando}
      </span>
    </Link>
  );
}

function Camino() {
  const { estado } = useTamim();
  const r = estado.radiografias || {};
  const sueno = resumenSueno(estado);
  return (
    <main className="pantalla">
      <Marca />
      <LockupTamim ancho={210} />
      <p className="versalita mt2">Tu camino</p>
      <h1 className="mt">Cinco estaciones. Una sesión conmigo en cada una.</h1>
      <p className="bajada mt">Espíritu, alma y cuerpo. Cada estación se abre cuando terminas la anterior.</p>

      <div className="mt2">
        <Hito titulo={MEDICIONES.entrada.nombre} cuando="Inicio" hecho={!!r.entrada} href="/radiografia?m=entrada" />
        {ESTACIONES.map((e) => {
          const hecha = estacionHecha(estado, e.n);
          const abierta = estacionAbierta(estado, e.n);
          return (
            <div key={e.n}>
              {e.n === 3 && (
                <Hito titulo={MEDICIONES.mitad.nombre} cuando="Semana 5" hecho={!!r.mitad} href="/radiografia?m=mitad" />
              )}
              <Link
                href={abierta ? `/estacion/${e.n}` : "#"}
                className="tarjeta fila"
                style={{ textDecoration: "none", gap: 18, opacity: abierta ? 1 : 0.45, marginTop: 10 }}
              >
                <span className={`letra ${hecha ? "hecha" : abierta ? "actual" : ""}`} style={{ flex: "none" }}>{e.letra}</span>
                <span>
                  <span className="versalita">{e.semanas}</span>
                  <br />
                  <span style={{ fontFamily: "var(--serif)", fontSize: 24, lineHeight: 1.15 }}>{e.tema}</span>
                  <br />
                  <span className="nota">{hecha ? "Completa" : abierta ? "Abierta" : "Se abre al terminar la anterior"}</span>
                </span>
              </Link>
            </div>
          );
        })}
        <Hito titulo={MEDICIONES.salida.nombre} cuando="Semana 10" hecho={!!r.salida} href="/radiografia?m=salida" />
      </div>
      {r.salida && <Link className="boton mt2" href="/graduacion">Ver mi graduación</Link>}

      <hr className="filete" style={{ marginTop: 44 }} />
      <p className="versalita">Tu evolución</p>
      <h2 className="mt">Lo que ya <em>cambió</em>.</h2>

      <div className="tarjeta">
        <div className="fila" style={{ justifyContent: "space-between" }}>
          <p className="versalita">Tus 70 días</p>
          <p className="versalita">{racha(estado)} {racha(estado) === 1 ? "día" : "días"} seguidos</p>
        </div>
        <div className="mapa">
          {mapa70(estado).map((d) => <span key={d.iso} className={d.estado} title={d.iso} />)}
        </div>
        <p className="nota mt">Cada punto dorado es un día que hiciste tu check-in.</p>
      </div>

      {r.entrada && (
        <div className="tarjeta">
          <p className="versalita">Tu radiografía</p>
          <Grafico radiografias={r} />
        </div>
      )}

      {sueno && (
        <Link href="/herramientas/sueno" className="tarjeta fila" style={{ textDecoration: "none", justifyContent: "space-between" }}>
          <span><span className="versalita">Tu sueño · últimos 7 días</span><br /><span className="numero">{sueno.horas ?? "–"} h</span> <span className="nota">por noche</span></span>
          <span style={{ color: "var(--oro)", fontSize: 28 }}>→</span>
        </Link>
      )}
    </main>
  );
}

export default function Page() {
  return <Protegida><Camino /></Protegida>;
}
