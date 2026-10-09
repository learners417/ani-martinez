"use client";
import { useEffect, useRef, useState } from "react";
import { useTamim } from "@/lib/store";
import { vibrar } from "@/lib/util";

// Inhala 4 · sostén 4 · exhala 6 → ciclo de 14 segundos.
const FASES = [
  { nombre: "Inhala", seg: 4, escala: 1 },
  { nombre: "Sostén", seg: 4, escala: 1 },
  { nombre: "Suelta", seg: 6, escala: 0.55 },
];

export default function Respirador({ noche, onFin }) {
  const { actualizar } = useTamim();
  const [min, setMin] = useState(2);
  const [t, setT] = useState(-1); // segundos transcurridos; -1 = sin empezar
  const timer = useRef(null);
  const total = min * 60;

  useEffect(() => () => clearInterval(timer.current), []);
  useEffect(() => {
    if (t >= total && t > 0) {
      clearInterval(timer.current);
      vibrar([30, 80, 30]);
      actualizar((s) => ({ ...s, respiraciones: (s.respiraciones || 0) + min }));
      onFin?.();
    }
  }, [t]); // eslint-disable-line

  const empezar = () => {
    vibrar();
    setT(0);
    clearInterval(timer.current);
    timer.current = setInterval(() => setT((x) => x + 1), 1000);
  };

  let fase = FASES[2], resto = 0;
  if (t >= 0) {
    let c = t % 14;
    for (const f of FASES) { if (c < f.seg) { fase = f; resto = f.seg - c; break; } c -= f.seg; }
  }
  const terminado = t >= total;
  const activo = t >= 0 && !terminado;
  const anillo = noche ? "var(--oro-suave)" : "var(--oro)";

  return (
    <div className="centro">
      <div style={{ height: 300, display: "grid", placeItems: "center" }}>
        <div style={{
          width: 260, height: 260, borderRadius: "50%", border: `1px solid ${anillo}`,
          display: "grid", placeItems: "center",
          transform: `scale(${activo ? fase.escala : 0.75})`,
          transition: `transform ${activo ? fase.seg : 1}s ease-in-out`,
        }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: anillo, opacity: 0.35 }} />
        </div>
      </div>
      {activo ? (
        <>
          <p className="grande">{fase.nombre}</p>
          <p className="bajada mt">{resto}</p>
          <p className="nota mt2">{Math.ceil((total - t) / 60)} min restantes</p>
          <button className="boton claro mt2" onClick={() => { clearInterval(timer.current); setT(-1); }}>Parar</button>
        </>
      ) : terminado ? (
        <>
          <h2>Listo. Tu cuerpo ya bajó un cambio.</h2>
          <button className="boton mt2" onClick={empezar}>Otra vez</button>
        </>
      ) : (
        <>
          <p className="bajada">Inhala 4 · sostén 4 · suelta 6</p>
          <div className="puntos5 mt2">
            {[1, 2, 5].map((m) => (
              <button key={m} className={min === m ? "si" : ""} onClick={() => { vibrar(); setMin(m); }}>{m} min</button>
            ))}
          </div>
          <button className="boton mt2" onClick={empezar}>Empezar</button>
        </>
      )}
    </div>
  );
}

