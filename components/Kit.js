import { BASE } from "@/lib/base";
// Elementos gráficos oficiales del kit de Ani (public/marca). No se redibujan.
export const Llama = ({ tono = "oro", viva, alto = 18 }) => (
  <img src={`${BASE}/marca/llama-${tono}.png`} alt="" aria-hidden="true" className={viva ? "llama-viva" : ""} style={{ height: alto, width: "auto", flex: "none" }} />
);

export const Arco = ({ tono = "oro", conLlama, className = "arco", style }) => (
  <img src={conLlama ? `${BASE}/marca/arco-con-llama-oro.png` : `${BASE}/marca/arco-de-luz-${tono}.png`} alt="" aria-hidden="true" className={className} style={style} />
);

export const Antorcha = ({ tono = "oro", alto = 220 }) => (
  <img src={`${BASE}/marca/antorcha-${tono}.png`} alt="Antorcha" className="antorcha" style={{ height: alto }} />
);

export const LockupTamim = ({ tono = "tinta", ancho = 220 }) => (
  <img src={`${BASE}/marca/lockup-tamim-${tono}.png`} alt="TamÍm" style={{ width: ancho, height: "auto", display: "block" }} />
);
