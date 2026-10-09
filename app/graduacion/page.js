"use client";
import Link from "next/link";
import { useTamim } from "@/lib/store";
import { ANI, CIERRE } from "@/lib/contenido";
import { Antorcha, Arco } from "@/components/Kit";
import { sinMovimiento } from "@/lib/progreso";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import Grafico from "@/components/Grafico";

function Graduacion() {
  const { estado, sesion } = useTamim();
  if (!estado.radiografias?.salida)
    return (
      <>
        <h1>Tu graduación se abre en la semana 10.</h1>
        <Link className="boton mt2" href="/">Ir a mi paso de hoy</Link>
      </>
    );
  const quietas = sinMovimiento(estado);
  const wa = ANI.whatsapp
    ? `https://wa.me/${ANI.whatsapp}?text=${encodeURIComponent(`Hola Ani, soy ${sesion?.nombre || ""}. Terminé mi camino TamÍm.`)}`
    : null;
  return (
    <>
      <Antorcha alto={180} />
      <p className="versalita mt2 centro">Graduación</p>
      <h1 className="mt centro">{(sesion?.nombre || "").split(" ")[0] ? `${sesion.nombre.split(" ")[0]}, lo hiciste.` : "Lo hiciste."}</h1>
      <p className="bajada mt">Diez semanas. Cinco sesiones. Este es tu antes y tu después.</p>
      <div className="tarjeta"><Grafico radiografias={estado.radiografias} /></div>

      {quietas.length > 0 ? (
        <div className="tarjeta">
          <p className="versalita">Compromiso TamÍm</p>
          <h2 className="mt">Seguimos juntas.</h2>
          <p className="bajada mt">
            {quietas.join(" y ")} todavía no se movió como queremos. Tienes hasta 5 sesiones más conmigo, sin costo, hasta que se mueva.
          </p>
          {wa && <a className="boton mt2" href={wa} target="_blank" rel="noreferrer">Agendar mis sesiones extra</a>}
        </div>
      ) : (
        <div className="tarjeta">
          <p className="versalita">Lo que sigue</p>
          <h2 className="mt">La Siembra</h2>
          <p className="bajada mt">La comunidad de las que terminaron el Círculo. Un encuentro en vivo cada 15 días para sostener lo que ganaste.</p>
          {ANI.siembraUrl && <a className="boton mt2" href={ANI.siembraUrl} target="_blank" rel="noreferrer">Quiero seguir en La Siembra</a>}
          {wa && <a className="boton claro" href={wa} target="_blank" rel="noreferrer">Escribirle a Ani</a>}
        </div>
      )}
      <Arco className="arco mt2" />
      <p className="cita centro" style={{ marginTop: -30, fontSize: 28 }}>“{CIERRE}”</p>
      <p className="versalita centro mt">Ani</p>
    </>
  );
}

export default function Page() {
  return (
    <Protegida>
      <main className="pantalla">
        <Marca />
        <Graduacion />
      </main>
    </Protegida>
  );
}
