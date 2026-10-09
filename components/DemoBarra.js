"use client";
import { useRouter } from "next/navigation";
import { useTamim } from "@/lib/store";
import { vibrar } from "@/lib/util";

// Barra del modo prueba: dice en qué modo estás y te deja cambiar.
export default function DemoBarra() {
  const router = useRouter();
  const { sesion } = useTamim();
  const admin = sesion?.rol === "admin";
  return (
    <div className="demo-barra">
      <span className="versalita" style={{ fontSize: 13 }}>{admin ? "Modo admin" : "Modo usuaria"}</span>
      <button onClick={() => { vibrar(); router.push("/prueba"); }}>Cambiar</button>
    </div>
  );
}
