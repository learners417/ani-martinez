"use client";
import Link from "next/link";
import { useState } from "react";
import { useTamim } from "@/lib/store";
import { vibrar } from "@/lib/util";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Dictado from "@/components/Dictado";
import { Llama } from "@/components/Kit";

// Lo que escribe aquí no se guarda: se suelta.
function Descarga() {
  const { actualizar } = useTamim();
  const [texto, setTexto] = useState("");
  const [fase, setFase] = useState("escribir"); // escribir | soltando | suelto

  const soltar = () => {
    vibrar([20, 60, 20]);
    setFase("soltando");
    setTimeout(() => {
      actualizar((s) => ({ ...s, descargas: (s.descargas || 0) + 1 }));
      setTexto("");
      setFase("suelto");
    }, 1600);
  };

  if (fase === "suelto")
    return (
      <div className="centro contar">
        <div className="celebrar"><Llama viva alto={60} /></div>
        <h1>Ya no lo cargas en la cabeza.</h1>
        <p className="bajada mt">No se guardó en ningún lado. Lo que de verdad importa, llévalo a tu sesión con Ani.</p>
        <Link className="boton mt2" href="/herramientas/respirar">Respirar 2 minutos</Link>
        <button className="boton claro" onClick={() => setFase("escribir")}>Soltar algo más</button>
      </div>
    );

  return (
    <>
      <p className="versalita">Soltar la mente</p>
      <h1 className="mt">Escribe todo lo que tienes en la cabeza.</h1>
      <p className="bajada mt">Sin orden y sin corregir. Pendientes, miedos, conversaciones. Todo.</p>
      <textarea
        className="mt2"
        rows={10}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Empieza por lo primero que aparezca…"
        style={{
          transition: "all 1.5s ease-in",
          opacity: fase === "soltando" ? 0 : 1,
          transform: fase === "soltando" ? "translateY(-60px) scale(.96)" : "none",
          filter: fase === "soltando" ? "blur(6px)" : "none",
        }}
      />
      <div className="fila mt" style={{ justifyContent: "space-between" }}>
        <p className="nota" style={{ marginTop: 0 }}>Esto no se guarda. Es solo para soltar.</p>
        <Dictado onTexto={(t) => setTexto((v) => (v ? v + " " : "") + t)} />
      </div>
      <button className="boton mt2" disabled={texto.trim().length < 3 || fase !== "escribir"} onClick={soltar}>Soltar</button>
    </>
  );
}

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <Descarga />
      </main>
    </Protegida>
  );
}
