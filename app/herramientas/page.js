"use client";
import Link from "next/link";
import { useTamim } from "@/lib/store";
import { resumenSueno } from "@/lib/progreso";
import Protegida from "@/components/Protegida";
import Marca from "@/components/Marca";
import { IcoRespirar, IcoDescarga, IcoLuna, IcoTres } from "@/components/Iconos";

function Herramientas() {
  const { estado } = useTamim();
  const sueno = resumenSueno(estado);
  const items = [
    { href: "/herramientas/respirar", ico: <IcoRespirar />, tit: "Respirar", sub: "Baja el cuerpo en 2 minutos" },
    { href: "/herramientas/descarga", ico: <IcoDescarga />, tit: "Soltar la mente", sub: "Saca todo el ruido de la cabeza" },
    { href: "/herramientas/sueno", ico: <IcoLuna />, tit: "Mi sueño", sub: sueno?.horas ? `Promedio: ${sueno.horas} h por noche` : "Registra cómo dormiste" },
    { href: "/herramientas/gratitud", ico: <IcoTres />, tit: "Tres gracias", sub: "Tres cosas de hoy, en un minuto" },
  ];
  return (
    <main className="pantalla">
      <Marca />
      <p className="versalita">Herramientas</p>
      <h1 className="mt">Para el momento en que lo necesitas.</h1>
      <div className="grid3 mt2">
        <div className="mini"><div className="numero">{estado.respiraciones || 0}</div><div className="etq">minutos respirados</div></div>
        <div className="mini"><div className="numero">{estado.descargas || 0}</div><div className="etq">veces soltaste</div></div>
        <div className="mini"><div className="numero">{Object.keys(estado.gratitud || {}).length}</div><div className="etq">días de gracias</div></div>
      </div>
      {items.map((x) => (
        <Link key={x.href} href={x.href} className="herramienta">
          <span className="ico">{x.ico}</span>
          <span><span className="tit">{x.tit}</span><br /><span className="sub">{x.sub}</span></span>
        </Link>
      ))}
      <Link href="/compania?modo=3am" className="herramienta" style={{ background: "#2A251F", borderColor: "#2A251F" }}>
        <span className="ico" style={{ color: "var(--oro-suave)", borderColor: "var(--oro-suave)" }}><IcoLuna /></span>
        <span><span className="tit" style={{ color: "#EFE6D8" }}>Modo 3 de la mañana</span><br /><span className="sub" style={{ color: "#B8AC9B" }}>Para cuando no puedes dormir</span></span>
      </Link>
    </main>
  );
}

export default function Page() {
  return <Protegida><Herramientas /></Protegida>;
}
