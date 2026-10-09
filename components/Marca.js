"use client";
import { BASE } from "@/lib/base";

// Firma oficial del manual (logotipo horizontal). Sobre noche usa la versión crema.
export default function Marca({ derecha, noche }) {
  return (
    <div className="marca">
      <img src={`${BASE}/marca/logotipo-${noche ? "crema" : "tinta"}.png`} alt="Ani Martínez" />
      {derecha}
    </div>
  );
}
