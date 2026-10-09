"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTamim } from "@/lib/store";
import Marca from "@/components/Marca";
import { Antorcha } from "@/components/Kit";

function Entrar() {
  const q = useSearchParams();
  const router = useRouter();
  const { listo, sesion, iniciarSesion } = useTamim();
  const [msg, setMsg] = useState("Abriendo tu camino…");

  useEffect(() => {
    if (!listo) return;
    const t = q.get("t");
    if (q.get("demo") === "1") {
      iniciarSesion({ token: "demo", email: "demo", nombre: "Demo", demo: true });
      router.replace("/");
      return;
    }
    if (!t) {
      if (sesion) router.replace("/");
      else setMsg("");
      return;
    }
    fetch("/api/sesion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: t }) })
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) return setMsg("");
        iniciarSesion({ token: t, email: d.email, nombre: d.nombre }, d.estado);
        router.replace("/");
      })
      .catch(() => setMsg(""));
  }, [listo]); // eslint-disable-line

  return (
    <main className="pantalla">
      <Marca />
      {msg ? (
        <h2 className="mt2">{msg}</h2>
      ) : (
        <>
          <div className="mt2"><Antorcha alto={200} /></div>
          <p className="versalita mt2 centro">El Círculo de Restauración</p>
          <h1 className="mt centro">Entra con tu link <em>personal</em></h1>
          <p className="bajada mt">
            Te llegó por email cuando confirmaste tu lugar. Ábrelo desde este teléfono y entras directo, sin contraseña.
          </p>
          <p className="nota mt2">¿No lo encuentras? Escríbele a Ani y te lo reenvía.</p>
        </>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Entrar />
    </Suspense>
  );
}
