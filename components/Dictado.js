"use client";
import { useEffect, useRef, useState } from "react";
import { IcoMic } from "./Iconos";
import { vibrar } from "@/lib/util";

// Botón para dictar con la voz. Si el teléfono no lo soporta, no aparece.
export default function Dictado({ onTexto }) {
  const [ok, setOk] = useState(false);
  const [on, setOn] = useState(false);
  const rec = useRef(null);

  useEffect(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    const r = new SR();
    r.lang = "es-419";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      const t = Array.from(e.results).slice(e.resultIndex).map((x) => x[0].transcript).join(" ");
      if (t.trim()) onTexto(t.trim());
    };
    r.onend = () => setOn(false);
    rec.current = r;
    setOk(true);
    return () => { try { r.stop(); } catch {} };
  }, []); // eslint-disable-line

  if (!ok) return null;
  return (
    <button
      type="button"
      className={`mic ${on ? "on" : ""}`}
      aria-label={on ? "Detener dictado" : "Dictar con la voz"}
      onClick={() => {
        vibrar();
        if (on) { rec.current.stop(); setOn(false); }
        else { try { rec.current.start(); setOn(true); } catch {} }
      }}
    >
      <IcoMic />
    </button>
  );
}
