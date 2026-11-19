import { DIMENSIONES } from "@/lib/contenido";
import { promedios } from "@/lib/progreso";

// Barras por dimensión: entrada (contorno) · mitad · salida (oro).
export default function Grafico({ radiografias }) {
  const series = [
    ["entrada", "Entrada", "transparent"],
    ["mitad", "Semana 5", "var(--oro-suave)"],
    ["salida", "Salida", "var(--oro)"],
  ].filter(([k]) => radiografias?.[k]);
  if (!series.length) return null;
  const vals = Object.fromEntries(series.map(([k]) => [k, promedios(radiografias[k])]));
  return (
    <div>
      {DIMENSIONES.map((d) => (
        <div key={d.clave} className="mt">
          <div className="fila" style={{ justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 24 }}>{d.nombre}</span>
            <span style={{ fontFamily: "var(--serif)", fontSize: 26, color: "var(--oro-profundo)" }}>
              {series.map(([k]) => vals[k][d.clave]).join(" → ")}
            </span>
          </div>
          {series.map(([k, label, color]) => (
            <div key={k} className="fila" style={{ marginTop: 8 }}>
              <span style={{ width: 92, fontSize: 16, color: "var(--tinta-2)" }}>{label}</span>
              <div className="pista">
                <div
                  style={{
                    width: `${vals[k][d.clave] * 10}%`, height: "100%", borderRadius: 99,
                    background: color === "transparent" ? "var(--tinta-2)" : color,
                    transition: "width 1s cubic-bezier(.2,.7,.2,1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
