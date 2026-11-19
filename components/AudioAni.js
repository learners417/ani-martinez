import { embedAudio } from "@/lib/util";

export default function AudioAni({ url, titulo }) {
  const a = embedAudio(url);
  if (!a) return null;
  if (a.tipo === "audio") return <audio controls src={a.src} style={{ width: "100%", marginTop: 16 }} />;
  if (a.tipo === "iframe")
    return (
      <div style={{ marginTop: 16, borderRadius: 16, overflow: "hidden", height: 80, background: "var(--lino)" }}>
        <iframe src={a.src} title={titulo || "Audio"} style={{ width: "100%", height: 80, border: 0 }} allow="autoplay" />
      </div>
    );
  return <a className="boton claro mt" href={a.src} target="_blank" rel="noreferrer">Escuchar el audio</a>;
}
