"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Llama } from "./Kit";

const ITEMS = [
  { href: "/", label: "Hoy", match: (p) => p === "/" },
  { href: "/camino", label: "Camino", match: (p) => /^\/(camino|estacion|radiografia|graduacion)/.test(p) },
  { href: "/herramientas", label: "Herramientas", match: (p) => p.startsWith("/herramientas") },
];

export default function Nav() {
  const p = usePathname();
  const enHablar = p.startsWith("/compania");
  return (
    <nav className="nav">
      <div>
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} className={i.match(p) ? "activo" : ""}>
            <span className="punto" />
            {i.label}
          </Link>
        ))}
        <Link href="/compania" className={`hablar ${enHablar ? "activo" : ""}`} aria-label="Hablar con la compañía">
          <Llama tono="crema" viva alto={17} /> Hablar
        </Link>
      </div>
    </nav>
  );
}
