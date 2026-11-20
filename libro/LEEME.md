# Libro «Vuelve a dormir en 12 semanas» · el embudo low de Ani

Emula el embudo low de Rosana (libro 27 → casilla → sesión 97 → agenda → gracias), con la marca y el método de Ani.

## El recorrido (dominio ani-martinez.com, embudo «Libro» en GHL)
| Paso | Ruta | Qué es | Fuente |
|---|---|---|---|
| 1 | /libro | Landing del libro, USD 27 | public/libro/src/ani-libro-landing.html |
| 2 | /libro-pago | Formulario de pedido de GHL (libro 27 + casilla 17) | public/libro/ghl/ani-libro-pago-encabezado.html (pegado arriba del formulario) |
| 3 | /libro-sesion | Oferta única: sesión 1 a 1 de 45 min, USD 97 (se descuenta del Círculo en 7 días) | public/libro/ghl/ani-libro-sesion.html + ani-libro-sesion-pie.html (pegados arriba y abajo del formulario) |
| 4 | /libro-agenda | Calendario «Sesión con Ani · Libro» | ani-libro-agenda.html |
| 5 | /libro-gracias | Descarga del libro y la noche 1 | ani-libro-gracias.html |

Las páginas 1, 4 y 5 son un bloque «Código personalizado» con el cargador (public/libro/cargador.js), que trae el HTML de public/libro/src. Cambiar esas páginas = cambiar el código y hacer push. Las páginas 2 y 3 llevan el formulario de pedido nativo de GHL, así que su HTML se pega en GHL: si cambia, se vuelve a pegar el bloque de public/libro/ghl.

## Automático
- Workflows de GHL «Low · Libro pagado → entrega», «Low · Casilla pagada → noches» y «Low · Sesión pagada → agenda»: disparo «Pago recibido» con el producto, etiqueta (low-libro / low-casilla / low-sesion) y Webhook POST a `/api/libro/compra?evento=…&k=…`.
- `/api/libro/compra`: entrega del libro por correo, arranque de la casilla, correo de la sesión con el link de la agenda.
- `/api/noches` (cron de Vercel, 21 h de Ecuador): las 84 noches de la casilla y la secuencia de 10 días (días 1, 3, 6 y 10) para quien compró el libro sin la casilla. La secuencia se corta con low-casilla, low-sesion o etiquetas del Círculo o de agenda.
- Campos de contacto: «Libro · noche», «Libro · comprado», «Libro · secuencia» (ids en lib/libro-ghl.js).
- Todo depende de `GHL_TOKEN` en Vercel (integración privada de la subcuenta: contacts.readonly, contacts.write, conversations/message.write). Sin token, las rutas responden y no hacen nada.

## Productos
- Libro «Vuelve a dormir en 12 semanas» · USD 27 · PDF completable de 139 páginas: public/libro/d/lfjc5z2sokpm/vuelve-a-dormir-12-semanas.pdf (no se indexa).
- Casilla «Ani te escribe cada noche» · USD 17 · 84 correos a las 21 h (libro/correos/correos.json → cada_noche).
- Sesión con Ani · USD 97 · 45 min por videollamada.
- Capítulo 1 sin costo (puerta de entrada): public/libro/capitulo-1-vuelve-a-dormir.pdf.

## Cómo se rehace
Libro: `cd libro && python3 build.py --pdf vuelve-a-dormir-12-semanas.pdf` (y `--muestra` para el capítulo 1). Necesita WeasyPrint 70 y las fuentes Cormorant Garamond y Lora (instancias estáticas).
Páginas: `python3 paginas.py ../public/libro/src` (escribe también public/libro/ghl). Correos: `python3 correos.py` (escribe también lib/libro-correos.json y lib/libro-noches.json).
