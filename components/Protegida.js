"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTamim } from "@/lib/store";
import Nav from "./Nav";
import DemoBarra from "./DemoBarra";

const SOLO_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

// Envuelve las pantallas de la consultante: si no entró con su link, la manda a /entrar.
export default function Protegida({ children, sinNav }) {
  const { listo, sesion } = useTamim();
  const router = useRouter();
  useEffect(() => {
    if (!listo || sesion) return;
    router.replace(SOLO_DEMO ? "/prueba" : "/entrar");
  }, [listo, sesion, router]);
  if (!listo || !sesion) return null;
  return (
    <>
      {sesion.demo && <DemoBarra />}
      {children}
      {!sinNav && <Nav />}
    </>
  );
}
