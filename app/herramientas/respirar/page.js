"use client";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Respirador from "@/components/Respirador";

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <p className="versalita">Respirar</p>
        <h1 className="mt">Sigue el círculo.</h1>
        <Respirador />
      </main>
    </Protegida>
  );
}
