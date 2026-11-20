/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Libro «Lo que no te deja dormir»: las fuentes de las páginas y las imágenes se leen desde GHL; el PDF pago no se indexa.
  async headers() {
    return [
      { source: '/libro/src/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Cache-Control', value: 'no-cache' }] },
      { source: '/libro/img/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] },
      { source: '/libro/d/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};
export default nextConfig;
