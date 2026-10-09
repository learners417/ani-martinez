"use client";
import { useRouter } from "next/navigation";
import { useTamim } from "@/lib/store";
import { estadoInicial } from "@/lib/progreso";
import { SESION_ADMIN, SESION_USUARIA, estadoAdmin } from "@/lib/demo";
import { vibrar } from "@/lib/util";
import Marca from "@/components/Marca";
import { Arco } from "@/components/Kit";

// Puerta del modo prueba. No usa datos reales ni guarda nada en el servidor.
export default function Prueba() {
  const router = useRouter();
  const { iniciarSesion } = useTamim();

  const entrar = (sesion, estado) => {
    vibrar(20);
    iniciarSesion(sesion, estado);
    router.push("/");
  };

  return (
    <main className="pantalla">
      <Marca />
      <Arco conLlama className="arco mt" />
      <p className="versalita mt centro">Modo prueba</p>
      <h1 className="mt centro">¿Cómo quieres <em>verla</em>?</h1>
      <p className="bajada mt centro">Nada de lo que hagas aquí se guarda ni llega a Ani.</p>

      <button className="tarjeta" style={{ width: "100%", textAlign: "left", borderColor: "var(--oro)" }} onClick={() => entrar(SESION_ADMIN, estadoAdmin())}>
        <p className="versalita">Modo admin</p>
        <h2 className="mt">Todo abierto</h2>
        <p className="bajada mt">Las 5 estaciones, las 3 radiografías y la graduación, con datos de ejemplo de una consultante en la semana 3.</p>
        <span className="boton mt2">Entrar como admin</span>
      </button>

      <button className="tarjeta" style={{ width: "100%", textAlign: "left" }} onClick={() => entrar(SESION_USUARIA, estadoInicial())}>
        <p className="versalita">Modo usuaria</p>
        <h2 className="mt">Como la vive ella</h2>
        <p className="bajada mt">Empieza de cero: bienvenida, pacto, radiografía y una estación a la vez. Todo lo demás está bloqueado hasta que avanza.</p>
        <span className="boton claro mt2">Entrar como usuaria</span>
      </button>

      <button className="tarjeta quieta" style={{ width: "100%", textAlign: "left" }} onClick={() => router.push("/ani?ejemplo=1")}>
        <p className="versalita">Lo que ve Ani</p>
        <h3 className="mt">Panel de Ani, con 3 consultantes de ejemplo</h3>
      </button>
    </main>
  );
}
