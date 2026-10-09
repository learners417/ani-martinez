import crypto from "crypto";

const SECRET = () => process.env.TAMIM_SECRET || "";

const b64 = (s) => Buffer.from(s).toString("base64url");
const firma = (data) =>
  crypto.createHmac("sha256", SECRET()).update(data).digest("base64url");

// Token de acceso personal: datos + firma HMAC. Sin contraseñas.
export function crearToken({ email, nombre }) {
  const data = b64(JSON.stringify({ e: email.toLowerCase().trim(), n: nombre || "", t: Date.now() }));
  return `${data}.${firma(data)}`;
}

export function leerToken(token) {
  if (!token || !SECRET()) return null;
  const [data, sig] = String(token).split(".");
  if (!data || !sig) return null;
  const esperado = firma(data);
  if (sig.length !== esperado.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(esperado))) return null;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString());
    return { email: p.e, nombre: p.n };
  } catch {
    return null;
  }
}

export function claveOk(req, header, envVar) {
  const k = req.headers.get(header) || "";
  const real = process.env[envVar] || "";
  return real.length > 0 && k === real;
}
