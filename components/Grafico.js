import { DIMENSIONES } from "@/lib/contenido";
import { promedios } from "@/lib/progreso";

// La radiografía: un número del 1 al 10 por parte, al entrar, a la mitad y al terminar.
const MOMENTOS = [["entrada", "Al entrar"], ["mitad", "A la mitad"], ["salida", "Al terminar"]];

export default function Grafico({ radiografias }) {
  if (!radiografias?.entrada) return null;
  const vals = Object.fromEntries(MOMENTOS.map(([k]) => [k, promedios(radiografias[k])]));
  return (
    <div>
      <div className="radio-fila radio-cab">
        <span />
        {MOMENTOS.map(([k, txt]) => <span key={k}>{txt}</span>)}
      </div>
      {DIMENSIONES.map((d) => (
        <div key={d.clave} className="radio-fila">
          <span className="radio-parte">{d.nombre}</span>
          {MOMENTOS.map(([k]) => {
            const v = vals[k]?.[d.clave];
            const sube = k !== "entrada" && v != null && v > vals.entrada[d.clave];
            return <span key={k} className={`radio-num ${v == null ? "falta" : ""} ${sube ? "sube" : ""}`}>{v ?? "·"}</span>;
          })}
        </div>
      ))}
      <p className="nota">Del 1 al 10. El cambio lo ves tú.</p>
    </div>
  );
}
