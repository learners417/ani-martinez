# Libro «Vuelve a dormir en 12 semanas» · el embudo low de Ani

Emula el embudo low de Rosana (libro 27 → casilla → sesión 97 → agenda → gracias), con la marca y el método de Ani.

## El recorrido (dominio ani-martinez.com, embudo «Libro» en GHL)
| Paso | Ruta | Qué es | Fuente |
|---|---|---|---|
| 1 | /libro | Landing del libro, USD 27 | public/libro/src/ani-libro-landing.html |
| 2 | /libro-pago | Formulario de pedido de GHL (libro 27 + casilla 17) | ani-libro-pago-encabezado.html (arriba del formulario) |
| 3 | /libro-sesion | Oferta única: sesión 1 a 1 de 45 min, USD 97 (se descuenta del Círculo en 7 días) | ani-libro-sesion.html + ani-libro-sesion-pie.html |
| 4 | /libro-agenda | Calendario de la sesión | ani-libro-agenda.html (pide el id del calendario) |
| 5 | /libro-gracias | Descarga del libro y la noche 1 | ani-libro-gracias.html |

## Productos
- Libro «Vuelve a dormir en 12 semanas» · USD 27 · PDF completable de 139 páginas: public/libro/d/lfjc5z2sokpm/vuelve-a-dormir-12-semanas.pdf (no se indexa).
- Casilla «Ani te escribe cada noche» · USD 17 · 84 correos a las 21 h (libro/correos/correos.json → cada_noche).
- Sesión con Ani · USD 97 · 45 min por videollamada.
- Capítulo 1 sin costo (puerta de entrada): public/libro/capitulo-1-vuelve-a-dormir.pdf.

## Cómo se rehace
Libro: `cd libro && python3 build.py --pdf vuelve-a-dormir-12-semanas.pdf` (y `--muestra` para el capítulo 1). Necesita WeasyPrint 70 y las fuentes Cormorant Garamond y Lora (instancias estáticas).
Páginas: `python3 paginas.py ../public/libro/src`. Correos: `python3 correos.py`.
