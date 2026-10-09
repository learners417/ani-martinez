# App TamÍm · Ani Martínez

Acompaña a cada consultante del Círculo durante 10 semanas:
pacto → radiografía de entrada → 5 estaciones T·A·M·Í·M (una sesión 1 a 1 con Ani cada 2 semanas) → radiografía de semana 5 → radiografía de salida → graduación (antes/después + Compromiso TamÍm o La Siembra).

## Versión 2: qué suma
- Hoy: saludo según la hora · racha de días presente · check-in de 10 segundos (espíritu, alma, cuerpo) · cuenta regresiva a la sesión con Ani + archivo de calendario con aviso 24 h y 1 h antes · palabra ancla (1 Tes 5:23) · de noche aparece el botón del Modo 3 AM arriba
- Bienvenida en 3 pasos: video → instalar en la pantalla de inicio → pacto
- Estación paso a paso: 7 pantallas (clase, 3 ejercicios de a uno, audio, preguntas para Ani, sesión) con barra de avance y celebración al terminar
- Dictado por voz en ejercicios, preguntas, descarga y compañía
- Audios de Drive se reproducen dentro de la app
- Herramientas: Respirar (4-4-6, 1/2/5 min) · Soltar la mente (no se guarda) · Mi sueño (registro + gráfico de 7 días) · Tres gracias
- Compañía: atajos de un toque · Modo 3 AM con pantalla de noche y respiración
- Camino: mapa de los 70 días, radiografía y sueño
- Panel de Ani: semáforo (oro al día · gris tibia · rojo sin entrar 5+ días o check-in bajo), racha, horas de sueño y próxima sesión. Primero las que necesitan atención.

## Pantallas
- `/` Hoy: un solo paso por vez
- `/camino`: las 5 estaciones, las 3 mediciones y la evolución
- `/herramientas`: respirar, soltar, sueño, gracias
- `/estacion/1…5`: clase, cuaderno de 3 ejercicios, audio, 3 preguntas previas, sesión con Ani
- `/compania`: IA 24/7 con la voz de Ani · `/compania?modo=3am` para las noches sin dormir
- `/graduacion`: antes y después
- `/ani`: panel de Ani (clave ANI_PANEL_KEY)
- `/entrar?demo=1`: vista demo sin guardar nada

## Marca (manual unificado de octubre 2026)
- Paleta oficial: crema papel #F6F2EA · lino #EFEADF · tinta #242018 · noche cálida #1A1815 · oro empolvado #C3A878 · oro profundo #8C7345 (micro-labels) · oro claro #D5BE9C sobre noche.
- Tipografías: Cormorant Garamond 300 (títulos y cifras) + Lora 400 (cuerpo y micro-labels). Sin negrita: el énfasis va en itálica.
- Elementos oficiales del kit en `public/marca/` (bajados del Drive de Ani, carpeta ELEMENTOS GRÁFICOS): logotipo tinta y crema, lockup TamÍm, antorcha, llama, arco de luz, arco con llama. El ícono de la app sale del favicon oficial. Fuera el destello de 4 puntas que Ani rechazó.
- Un elemento abre, uno firma y uno dice: máximo tres por pantalla.
- La IA habla con el tono del manual: cercana y directa, Proverbios, cuerpo y hábitos como medicina. Nunca suena religiosa ni recomienda psiquiatría ni psicofármacos.

## Lo único que se completa a mano
`lib/contenido.js` → temas, ejercicios, videos (ID de YouTube no listado), audios, links de agenda, WhatsApp y La Siembra.

## Puesta en marcha
1. GitHub (learners417) → repo nuevo `tamim-ani` → subir el contenido de esta carpeta.
2. Supabase → SQL Editor → pegar `supabase.sql` → Run.
3. Vercel → importar el repo → cargar las variables de `.env.example` → Deploy.
4. GHL → workflow "Pago Círculo": Payment Received → Webhook POST a `https://TU-APP/api/alta`
   header `x-api-key: TAMIM_WEBHOOK_KEY`, body `{"email":"{{contact.email}}","nombre":"{{contact.name}}"}`
   → guardar `url` de la respuesta en el campo `acceso_tamim` → Email con ese link.
5. (Opcional) GHL → workflow con trigger Inbound Webhook → Send Email a Ani → pegar la URL en `GHL_PRESESION_WEBHOOK`.
6. Prueba: alta con tu email → abrir el link en el teléfono → recorrer hasta la estación 1.
