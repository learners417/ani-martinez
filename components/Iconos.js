// Íconos de línea, trazo fino. Genéricos (no son elementos de marca).
const base = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

export const IcoRespirar = () => (
  <svg {...base}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="6.5" opacity=".6" /><circle cx="12" cy="12" r="10" opacity=".3" /></svg>
);
export const IcoDescarga = () => (
  <svg {...base}><path d="M5 18h14M5 14h9M5 10h6" /><path d="M17 11V3m0 0-3 3m3-3 3 3" /></svg>
);
export const IcoLuna = () => (
  <svg {...base}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>
);
export const IcoTres = () => (
  <svg {...base}><path d="M6 7h12M6 12h12M6 17h12" /><circle cx="3" cy="7" r=".6" /><circle cx="3" cy="12" r=".6" /><circle cx="3" cy="17" r=".6" /></svg>
);
export const IcoMic = () => (
  <svg {...base}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
);
export const IcoCalendario = () => (
  <svg {...base}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const IcoFlecha = () => (
  <svg {...base}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
);
