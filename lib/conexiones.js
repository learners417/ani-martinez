// Qué está conectado. Solo dice sí o no: nunca muestra una clave.
import { hayBase } from "./db";

export function conexiones() {
  return {
    accesos: Boolean(process.env.TAMIM_SECRET),
    panel: Boolean(process.env.ANI_PANEL_KEY),
    base: hayBase(),
    ia: Boolean(process.env.ANTHROPIC_API_KEY),
    altaGHL: Boolean(process.env.TAMIM_WEBHOOK_KEY),
    hitosGHL: Boolean(process.env.GHL_HITOS_WEBHOOK),
    preSesionGHL: Boolean(process.env.GHL_PRESESION_WEBHOOK),
  };
}

