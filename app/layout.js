import { BASE } from "@/lib/base";
// Tipografías de marca servidas desde la propia app (cargan rápido y sin depender de Google).
import "@fontsource/cormorant-garamond/latin-300.css";
import "@fontsource/cormorant-garamond/latin-300-italic.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-400-italic.css";
import "./globals.css";
import { TamimProvider } from "@/lib/store";

export const metadata = {
  title: "TamÍm · Ani Martínez",
  description: "Tu camino en El Círculo de Restauración",
  manifest: `${BASE}/manifest.json`,
  appleWebApp: { capable: true, title: "TamÍm", statusBarStyle: "default" },
};

export const viewport = { themeColor: "#F6F2EA", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href={`${BASE}/icono-192.png`} />
        <link rel="icon" type="image/png" href={`${BASE}/favicon.png`} />
      </head>
      <body>
        <TamimProvider>{children}</TamimProvider>
      </body>
    </html>
  );
}
