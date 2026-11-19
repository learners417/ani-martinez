"use client";
import { useState } from "react";
import { useTamim } from "@/lib/store";
import { ANI, LUGARES } from "@/lib/contenido";
import { vibrar } from "@/lib/util";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import { Llama } from "@/components/Kit";
import { IcoSalir } from "@/components/Iconos";

function Comunidad() {
  const { estado, sesion } = useTamim();
  const [copiado, setCopiado] = useState(false);
  const graduada = Boolean(estado.radiografias?.salida);
  const admin = sesion?.rol === "admin";

  const invitar = async () => {
    vibrar();
    const datos = { title: "El Amanecer · Ani Martínez", text: "Te paso la comunidad abierta de Ani. Entra gratis.", url: ANI.amanecerUrl };
    try {
      if (navigator.share) return await navigator.share(datos);
      await navigator.clipboard.writeText(ANI.amanecerUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {}
  };

  return (
    <main className="pantalla">
      <Marca />
      <p className="versalita">Tu comunidad</p>
      <h1 className="mt">Aquí caminas <em>acompañada</em>.</h1>

      <div className="tarjeta" style={{ borderColor: "var(--oro)", padding: "30px 24px" }}>
        <p className="versalita">Durante tu programa</p>
        <h2 className="mt">El Círculo</h2>
        <p className="bajada mt">Ani y las mujeres de tu grupo. Avisos, encuentros en vivo y tus avances.</p>
        <a className="boton mt2" href={ANI.circuloUrl} target="_blank" rel="noreferrer" onClick={() => vibrar()}>
          Entrar a El Círculo <IcoSalir />
        </a>
        <p className="nota">Entras con el mismo correo con el que te inscribiste.</p>
      </div>

      <div className="tarjeta">
        <p className="versalita">Dónde va cada cosa</p>
        {LUGARES.map((l) => (
          <div key={l.nombre} className="lugar">
            <p className="tit">{l.nombre} <em>· {l.para}</em></p>
            <p>{l.detalle}</p>
          </div>
        ))}
      </div>

      <div className="tarjeta" style={graduada || admin ? undefined : { opacity: 0.6 }}>
        <p className="versalita">{graduada ? "Lo que sigue" : "Se abre cuando te gradúas"}</p>
        <h2 className="mt">La Siembra</h2>
        <p className="bajada mt">Para sostener lo que ganaste. Un encuentro en vivo cada 15 días.</p>
        {(graduada || admin) && (
          <a className="boton claro mt2" href={ANI.siembraUrl} target="_blank" rel="noreferrer">
            Conocer La Siembra <IcoSalir />
          </a>
        )}
      </div>

      <div className="tarjeta quieta">
        <Llama alto={22} />
        <h3 className="mt" style={{ fontSize: 30 }}>¿Pensaste en una amiga?</h3>
        <p className="bajada mt">El Amanecer es la comunidad abierta de Ani. Pásale el link.</p>
        <button className="boton claro mt2" onClick={invitar}>{copiado ? "Link copiado" : "Invitarla a El Amanecer"}</button>
      </div>
    </main>
  );
}

export default function Page() {
  return <Protegida><Comunidad /></Protegida>;
}
