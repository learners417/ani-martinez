"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTamim } from "@/lib/store";
import { estadoInicial } from "@/lib/progreso";
import { vibrar } from "@/lib/util";

const PANTALLAS = {
  "/": "Hoy", "/camino": "Camino", "/herramientas": "Herramientas", "/compania": "Hablar / Compañía",
  "/radiografia": "Radiografía", "/graduacion": "Graduación", "/herramientas/respirar": "Respirar",
  "/herramientas/descarga": "Soltar la mente", "/herramientas/sueno": "Mi sueño", "/herramientas/gratitud": "Tres gracias",
};
const nombrePantalla = (p) => PANTALLAS[p] || (p.startsWith("/estacion/") ? `Estación ${p.split("/")[2]}` : p);

// Barra del modo prueba: comentar por WhatsApp, abrir todo, empezar de cero. Nada se guarda en el servidor.
export default function DemoBarra() {
  const p = usePathname();
  const router = useRouter();
  const { estado, actualizar } = useTamim();
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const pantalla = nombrePantalla(p);

  const msg = `Comentario de la app TamÍm\nPantalla: ${pantalla}\n\n${texto.trim()}`;
  const linkWa = `https://wa.me/?text=${encodeURIComponent(msg)}`;

  return (
    <>
      <div className="demo-barra">
        <span className="versalita" style={{ fontSize: 13 }}>Modo prueba</span>
        <button onClick={() => { vibrar(); setAbierto(true); }}>Comentar</button>
      </div>
      {abierto && (
        <div className="demo-hoja" onClick={(e) => e.target === e.currentTarget && setAbierto(false)}>
          <div className="demo-panel contar">
            <p className="versalita">Tu comentario</p>
            <h2 className="mt" style={{ fontSize: 32 }}>Sobre: <em>{pantalla}</em></h2>
            <textarea className="mt" rows={5} value={texto} placeholder="Qué cambiarías, qué no se entiende, qué te encantó…" onChange={(e) => setTexto(e.target.value)} />
            <a
              className="boton mt"
              href={texto.trim() ? linkWa : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!texto.trim()}
              style={texto.trim() ? undefined : { opacity: 0.35, pointerEvents: "none" }}
              onClick={() => setTimeout(() => { setTexto(""); setAbierto(false); }, 300)}
            >
              Enviar por WhatsApp
            </a>
            <hr className="filete" />
            <p className="versalita">Para recorrerla</p>
            <button
              className="boton claro mt"
              onClick={() => { actualizar((s) => ({ ...s, demoAbierto: !s.demoAbierto })); setAbierto(false); }}
            >
              {estado.demoAbierto ? "Volver al recorrido real" : "Abrir todas las estaciones"}
            </button>
            <button className="boton claro" onClick={() => { actualizar(estadoInicial()); setAbierto(false); router.replace("/"); }}>
              Empezar de cero
            </button>
            <button className="nota mt" style={{ width: "100%" }} onClick={() => setAbierto(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
