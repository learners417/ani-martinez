"use client";

// Firma oficial del manual (logotipo horizontal). Sobre noche usa la versión crema.
export default function Marca({ derecha, noche }) {
  return (
    <div className="marca">
      <img src={noche ? "/marca/logotipo-crema.png" : "/marca/logotipo-tinta.png"} alt="Ani Martínez" />
      {derecha}
    </div>
  );
}
