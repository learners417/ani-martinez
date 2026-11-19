"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { estadoInicial, hitos } from "./progreso";

const Ctx = createContext(null);
const K_ESTADO = "tamim_estado";
const K_SESION = "tamim_sesion";

const leerLS = (k) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};
const escribirLS = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// Avisa a GHL cada hito nuevo, una sola vez (queda anotado en este teléfono).
const K_HITOS = "tamim_hitos";
function avisarHitos(prev, next, ses) {
  if (!ses?.token || ses.demo) return;
  const antes = new Set([...hitos(prev), ...(leerLS(K_HITOS) || [])]);
  const nuevos = hitos(next).filter((h) => !antes.has(h));
  if (!nuevos.length) return;
  escribirLS(K_HITOS, [...antes, ...nuevos]);
  nuevos.forEach((hito) =>
    fetch("/api/hito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: ses.token, hito }),
    }).catch(() => {})
  );
}

export function TamimProvider({ children }) {
  const [listo, setListo] = useState(false);
  const [sesion, setSesionState] = useState(null); // { token, email, nombre, demo }
  const [estado, setEstado] = useState(estadoInicial());
  const timer = useRef(null);

  useEffect(() => {
    setSesionState(leerLS(K_SESION));
    setEstado({ ...estadoInicial(), ...(leerLS(K_ESTADO) || {}) });
    setListo(true);
  }, []);

  const sync = useCallback((s, ses) => {
    if (!ses?.token || ses.demo) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: ses.token, estado: s }),
      }).catch(() => {});
    }, 1200);
  }, []);

  const actualizar = useCallback(
    (fn) => {
      setEstado((prev) => {
        const next = typeof fn === "function" ? fn(structuredClone(prev)) : fn;
        escribirLS(K_ESTADO, next);
        const ses = leerLS(K_SESION);
        sync(next, ses);
        avisarHitos(prev, next, ses);
        return next;
      });
    },
    [sync]
  );

  const iniciarSesion = useCallback((ses, estadoGuardado) => {
    escribirLS(K_SESION, ses);
    setSesionState(ses);
    const base = { ...estadoInicial(), ...(estadoGuardado || leerLS(K_ESTADO) || {}) };
    escribirLS(K_ESTADO, base);
    setEstado(base);
  }, []);

  const salir = useCallback(() => {
    try {
      localStorage.removeItem(K_SESION);
      localStorage.removeItem(K_ESTADO);
      localStorage.removeItem(K_HITOS);
    } catch {}
    setSesionState(null);
    setEstado(estadoInicial());
  }, []);

  return (
    <Ctx.Provider value={{ listo, sesion, estado, actualizar, iniciarSesion, salir }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTamim = () => useContext(Ctx);
