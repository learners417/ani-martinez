"use client";
import { useState } from "react";
import { useTamim } from "@/lib/store";
import { hoyISO, vibrar } from "@/lib/util";
import { horasDormidas, resumenSueno } from "@/lib/progreso";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";

function Grafico7({ sueno }) {
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = hoyISO(d);
    return { iso, r: sueno?.[iso], letra: d.toLocaleDateString("es", { weekday: "narrow" }) };
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10, alignItems: "end", height: 190, marginTop: 18 }}>
      {dias.map(({ iso, r, letra }) => {
        const h = horasDormidas(r);
        return (
          <div key={iso} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 16, color: "var(--tinta-2)" }}>{h ?? ""}</span>
            <div style={{
              width: "100%", borderRadius: 12, minHeight: 6,
              height: h ? `${Math.min(100, (h / 10) * 100)}%` : 6,
              background: h ? `rgba(201,151,63,${0.35 + (r.calidad || 3) * 0.13})` : "var(--lino)",
              transition: "height .9s cubic-bezier(.2,.7,.2,1)",
            }} />
            <span style={{ fontSize: 16, textTransform: "uppercase" }}>{letra}</span>
          </div>
        );
      })}
    </div>
  );
}

function Sueno() {
  const { estado, actualizar } = useTamim();
  const hoy = hoyISO();
  const previo = estado.sueno?.[hoy] || {};
  const [r, setR] = useState({ acostarse: "23:00", levantarse: "06:30", despertares: null, calidad: null, ...previo });
  const [listo, setListo] = useState(Boolean(estado.sueno?.[hoy]));
  const res = resumenSueno(estado);
  const ok = r.despertares != null && r.calidad != null;
  const cambiar = (k, v) => { vibrar(); setR({ ...r, [k]: v }); setListo(false); };

  return (
    <>
      <p className="versalita">Mi sueño</p>
      <h1 className="mt">¿Cómo dormiste anoche?</h1>

      {res && (
        <div className="grid3 mt2">
          <div className="mini"><div className="numero">{res.horas ?? "–"}</div><div className="etq">horas promedio</div></div>
          <div className="mini"><div className="numero">{res.calidad ?? "–"}</div><div className="etq">calidad de 5</div></div>
          <div className="mini"><div className="numero">{res.noches}</div><div className="etq">noches anotadas</div></div>
        </div>
      )}

      <div className="tarjeta">
        <div className="grid3" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <label><span className="nota">Me acosté</span><input className="mt" type="time" value={r.acostarse} onChange={(e) => cambiar("acostarse", e.target.value)} /></label>
          <label><span className="nota">Me levanté</span><input className="mt" type="time" value={r.levantarse} onChange={(e) => cambiar("levantarse", e.target.value)} /></label>
        </div>
        <p className="mt2" style={{ fontSize: 19 }}>¿Cuántas veces te despertaste?</p>
        <div className="puntos5">
          {["0", "1", "2", "3+"].map((x, i) => (
            <button key={x} className={r.despertares === i ? "si" : ""} onClick={() => cambiar("despertares", i)}>{x}</button>
          ))}
        </div>
        <p className="mt2" style={{ fontSize: 19 }}>¿Cómo te levantaste?</p>
        <div className="puntos5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={r.calidad === n ? "si" : ""} onClick={() => cambiar("calidad", n)}>{n}</button>
          ))}
        </div>
        <div className="extremos"><span>Agotada</span><span>Descansada</span></div>
        <button
          className="boton mt2"
          disabled={!ok}
          onClick={() => { vibrar(30); actualizar((s) => ({ ...s, sueno: { ...(s.sueno || {}), [hoy]: r } })); setListo(true); }}
        >
          {listo ? "✓ Guardado" : "Guardar mi noche"}
        </button>
      </div>

      <div className="tarjeta">
        <p className="versalita">Tus últimos 7 días</p>
        <Grafico7 sueno={estado.sueno} />
        <p className="nota mt">Más alto = más horas. Más dorado = mejor descanso.</p>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <Sueno />
      </main>
    </Protegida>
  );
}
