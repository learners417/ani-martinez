"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTamim } from "@/lib/store";
import { DIMENSIONES, MEDICIONES } from "@/lib/contenido";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Grafico from "@/components/Grafico";
import Link from "next/link";
import { estacionHecha } from "@/lib/progreso";

const PREGUNTAS = DIMENSIONES.flatMap((d) => d.preguntas.map((texto, i) => ({ d, i, texto })));

function Radiografia() {
  const q = useSearchParams();
  const router = useRouter();
  const { estado, actualizar } = useTamim();
  const m = MEDICIONES[q.get("m")] ? q.get("m") : "entrada";
  const [idx, setIdx] = useState(0);
  const [resp, setResp] = useState({});
  const [fin, setFin] = useState(Boolean(estado.radiografias?.[m]));

  const bloqueada =
    (m === "mitad" && !estacionHecha(estado, 2)) ||
    (m === "salida" && ![1, 2, 3, 4, 5].every((n) => estacionHecha(estado, n)));
  if (bloqueada && !fin)
    return (
      <>
        <p className="versalita">{MEDICIONES[m].nombre}</p>
        <h1 className="mt">Todavía no es el momento.</h1>
        <p className="bajada mt">Esta medición se abre en la {MEDICIONES[m].cuando.toLowerCase()}.</p>
        <Link className="boton mt2" href="/">Ir a mi paso de hoy</Link>
      </>
    );

  if (fin)
    return (
      <>
        <p className="versalita">{MEDICIONES[m].nombre}</p>
        <h1 className="mt">Así estás hoy.</h1>
        <p className="bajada mt">Ani ya puede ver tus números. Este es el punto desde donde medimos tu avance.</p>
        <div className="tarjeta"><Grafico radiografias={estado.radiografias} /></div>
        <button className="boton mt2" onClick={() => router.push("/")}>Volver a Hoy</button>
      </>
    );

  const p = PREGUNTAS[idx];
  const clave = `${p.d.clave}-${p.i}`;
  const valor = resp[clave];

  const elegir = (v) => {
    const nuevo = { ...resp, [clave]: v };
    setResp(nuevo);
    setTimeout(() => {
      if (idx < PREGUNTAS.length - 1) return setIdx(idx + 1);
      const respuestas = Object.fromEntries(
        DIMENSIONES.map((d) => [d.clave, d.preguntas.map((_, i) => nuevo[`${d.clave}-${i}`] ?? 0)])
      );
      actualizar((s) => ({
        ...s,
        radiografias: { ...s.radiografias, [m]: { fecha: new Date().toISOString(), respuestas } },
      }));
      setFin(true);
    }, 280);
  };

  return (
    <>
      <div className="fila" style={{ justifyContent: "space-between" }}>
        <p className="versalita">{p.d.nombre}</p>
        <p className="versalita">{idx + 1} / {PREGUNTAS.length}</p>
      </div>
      <div className="barra mt"><span style={{ width: `${((idx + 1) / PREGUNTAS.length) * 100}%` }} /></div>
      <h2 className="mt2" key={idx} style={{ animation: "subir .45s both" }}>{p.texto}</h2>
      <div className="escala mt2">
        {Array.from({ length: 11 }, (_, v) => (
          <button key={v} className={valor === v ? "si" : ""} onClick={() => elegir(v)}>{v}</button>
        ))}
      </div>
      <div className="extremos"><span>Nada</span><span>Totalmente</span></div>
      {idx > 0 && (
        <button className="boton claro mt2" onClick={() => setIdx(idx - 1)}>Volver a la anterior</button>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <Suspense fallback={null}><Radiografia /></Suspense>
      </main>
    </Protegida>
  );
}
