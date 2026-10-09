"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTamim } from "@/lib/store";
import Nav from "./Nav";

// Envuelve las pantallas de la consultante: si no entró con su link, la manda a /entrar.
export default function Protegida({ children, sinNav }) {
  const { listo, sesion } = useTamim();
  const router = useRouter();
  useEffect(() => {
    if (listo && !sesion) router.replace("/entrar");
  }, [listo, sesion, router]);
  if (!listo || !sesion) return null;
  return (
    <>
      {children}
      {!sinNav && <Nav />}
    </>
  );
}
