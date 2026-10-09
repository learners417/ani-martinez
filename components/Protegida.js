"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTamim } from "@/lib/store";
import Nav from "./Nav";
import DemoBarra from "./DemoBarra";

export const DEMO_SESION = { token: "demo", email: "demo", nombre: "Carolina", demo: true };
const SOLO_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

// Envuelve las pantallas de la consultante: si no entró con su link, la manda a /entrar.
export default function Protegida({ children, sinNav }) {
  const { listo, sesion, iniciarSesion } = useTamim();
  const router = useRouter();
  useEffect(() => {
    if (!listo || sesion) return;
    if (SOLO_DEMO) iniciarSesion(DEMO_SESION);
    else router.replace("/entrar");
  }, [listo, sesion, router, iniciarSesion]);
  if (!listo || !sesion) return null;
  return (
    <>
      {sesion.demo && <DemoBarra />}
      {children}
      {!sinNav && <Nav />}
    </>
  );
}
