"use client";
import { useState } from "react";
import { useTamim } from "@/lib/store";
import { hoyISO, vibrar } from "@/lib/util";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import { Llama } from "@/components/Kit";

function Gratitud() {
  const { estado, actualizar } = useTamim();
  const hoy = hoyISO();
  const [v, setV] = useState(estado.gratitud?.[hoy] || ["", "", ""]);
  const [listo, setListo] = useState(false);
  const pasados = Object.entries(estado.gratitud || {}).filter(([d]) => d !== hoy).sort(([a], [b]) => (a < b ? 1 : -1)).slice(0, 7);
  const ok = v.every((x) => x.trim());

  return (
    <>
      <p className="versalita">Tres gracias</p>
      <h1 className="mt">Tres cosas de hoy por las que das gracias.</h1>
      <p className="bajada mt">Chiquitas sirven. Un café caliente cuenta.</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="fila mt2">
          <Llama alto={26} />
          <input type="text" value={v[i]} onChange={(e) => { const n = [...v]; n[i] = e.target.value; setV(n); setListo(false); }} />
        </div>
      ))}
      <button
        className="boton mt2"
        disabled={!ok}
        onClick={() => { vibrar(30); actualizar((s) => ({ ...s, gratitud: { ...(s.gratitud || {}), [hoy]: v } })); setListo(true); }}
      >
        {listo ? "✓ Guardado" : "Guardar"}
      </button>
      {pasados.length > 0 && (
        <>
          <hr className="filete" />
          <p className="versalita">Tus días anteriores</p>
          {pasados.map(([d, items]) => (
            <div key={d} className="tarjeta quieta" style={{ padding: "16px 0", border: 0, marginTop: 4 }}>
              <p className="nota" style={{ textTransform: "capitalize" }}>{new Date(d + "T12:00").toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</p>
              <p style={{ fontSize: 19 }}>{items.join(" · ")}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <Gratitud />
      </main>
    </Protegida>
  );
}
