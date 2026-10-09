import "./globals.css";
import { TamimProvider } from "@/lib/store";

export const metadata = {
  title: "TamÍm · Ani Martínez",
  description: "Tu camino en El Círculo de Restauración",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "TamÍm", statusBarStyle: "default" },
};

export const viewport = { themeColor: "#F6F2EA", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lora:ital,wght@0,400;1,400&display=swap"
        />
        <link rel="apple-touch-icon" href="/icono-192.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <TamimProvider>{children}</TamimProvider>
      </body>
    </html>
  );
}
