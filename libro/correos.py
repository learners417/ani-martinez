# -*- coding: utf-8 -*-
"""Correos del embudo low de Ani: entrega, «Ani te escribe cada noche» (84) y la secuencia de quien no tomó la casilla."""
import json, os, re, html as H
from contenido import NOCHES, TIPOS, CAPITULOS

VSL = 'https://ani-martinez.com/vsl'
def utm(url, camp, cont):
    s = '&' if '?' in url else '?'
    return f'{url}{s}utm_source=correo&utm_medium=email&utm_campaign={camp}&utm_content={cont}'

# (asunto, nota de Ani) por noche
NOTAS = {
 1: ("Tu noche 1", "Esta noche no cambias nada. Solo miras. Es el paso que todas se quieren saltar, y el que más ordena todo lo demás."),
 2: ("¿Dónde guardas el día?", "El cuerpo guarda lo que la cabeza no dice. Esta noche solo le pones nombre."),
 3: ("Un juego, no un examen", "No hay respuestas malas. A veces una escena toca dos dimensiones, y eso ya es un descubrimiento."),
 4: ("Lo último que ves", "Lo último que miras antes de dormir también se acuesta contigo. Hoy solo lo anotas."),
 5: ("Que duerma en el papel", "Lo que da vueltas en la cabeza se calma cuando tiene dónde quedarse. Hoy le das un papel."),
 6: ("Una sola frase", "No hace falta una oración larga ni correcta. Una frase verdadera alcanza."),
 7: ("Tu primer capítulo", "Cerraste tu primera semana. Esta noche te cuento cómo era yo cuando creía que tenía todas las respuestas."),
 8: ("En paz me acostaré", "Léelo despacio, como quien toma un remedio a horario. Dos veces."),
 9: ("Lo que no le contaste a nadie", "Dios ya lo sabe. Contárselo es para ti, no para Él."),
 10: ("4, 4, 6", "La exhalación más larga que la inhalación le avisa a tu cuerpo que puede bajar la guardia."),
 11: ("La pregunta que no hiciste", "Las preguntas que no hacemos se quedan despiertas con nosotras."),
 12: ("Esto te lo entrego", "Entregar no es olvidarse. Es dejar de cargarlo sola esta noche."),
 13: ("Pecho o estómago", "Muchas veces lo que no se dijo está guardado ahí. Solo obsérvalo."),
 14: ("Enojada con Dios", "Esta noche te cuento cuando me enojé con Dios y no se lo dije. Capítulo 2."),
 15: ("Todo lo que ya probaste", "No es una lista de fracasos. Es la prueba de que te trataron una parte."),
 16: ("Tu sueño será suave", "Subraya la palabra que más necesites hoy."),
 17: ("¿Verdad o creencia?", "Hay creencias que cuestan más sueño que cualquier café. Esta noche las miras de frente."),
 18: ("Un paso, no un milagro", "Pide sabiduría para algo concreto. Lo concreto se puede hacer mañana."),
 19: ("Un nombre", "Pedir ayuda no es falta de fe. A veces Dios responde con una persona."),
 20: ("Una conversación que te haga bien", "Cinco minutos con alguien que te quiere también te alimentan."),
 21: ("Orar más fuerte", "Esta noche te cuento la noche del piso de mi cuarto. Capítulo 3."),
 22: ("Sin memoria", "Hoy háblale a Dios como le hablarías a alguien que está ahí. Porque está."),
 23: ("Guarda tu corazón", "Déjalo en tu mesa de noche. Que sea lo primero que veas al despertar."),
 24: ("Obligación o deseo", "No se trata de dejar de hacer cosas. Se trata de saber por qué las haces."),
 25: ("La silla", "Una herramienta del teatro: lo que imaginas sentado frente a ti te dice algo que sola no te dices."),
 26: ("Una cosa chica", "El perdón grande empieza con los chicos. Uno, en voz alta, esta noche."),
 27: ("Con la luz apagada", "Cinco veces. Si te distraes, empiezas de nuevo sin retarte."),
 28: ("La doble vida", "Cierras la raíz. Esta noche te cuento qué significa TamÍm, y por qué es la palabra de todo este camino."),
 29: ("Lo de afuera y lo de adentro", "Empieza la parte del alma. Dos columnas, sin juzgar ninguna."),
 30: ("La hora del cansancio", "Tu cansancio tiene un horario. Si lo conoces, puedes cuidarlo."),
 31: ("Las voces de tu noche", "La Jefa, la Jueza, la Adivina, la Archivista. Esta noche les pones nombre y les contestas."),
 32: ("Tu día queda afuera", "Un objeto del trabajo fuera de la habitación. Tu día también necesita una puerta."),
 33: ("La hora de cerrar", "Si el día no termina en ningún lado, sigue en la cama. Hoy le pones hora."),
 34: ("Una frase verdadera", "No hace falta contarlo todo. Una frase a una persona."),
 35: ("Funcional por fuera", "Esta noche te cuento cómo era trabajar, sonreír y cumplir con siete pastillas por día. Capítulo 5."),
 36: ("Todo lo pendiente", "Una hora antes de acostarte. Lo escribes y cierras el cuaderno. Tu cabeza ya no tiene que recordarlo."),
 37: ("Tres objetos", "Lo que no se ve no se puede mover. Esta noche tus preocupaciones tienen forma, y se quedan en una caja."),
 38: ("Cinco respiraciones", "La mente va a acelerar. Tú cuentas cinco y empiezas de nuevo cuando te pierdas."),
 39: ("Lo que depende de ti", "Separarlo te devuelve algo que la noche te quita: saber que algo sí puedes hacer."),
 40: ("Él tiene cuidado de ti", "Repítelo al apagar la luz. Es una entrega, no una fórmula."),
 41: ("Sin noticias", "Lo que no puedes cambiar no tiene que acostarse contigo."),
 42: ("La lista que no se apaga", "Esta noche, el capítulo 6: lo que aprendí en el teatro sobre las cosas que dan vueltas."),
 43: ("Mitad del camino", "Hoy haces tu radiografía de la noche 43. Ponla al lado de la primera. Sin juzgarte: solo mira."),
 44: ("Cuenta tus «sí»", "Detrás de muchas noches sin dormir hay un sí que tenía que ser un no."),
 45: ("Las máscaras de tu día", "La que puede con todo, la que no molesta, la que siempre está bien. ¿Cuál usaste hoy?"),
 46: ("Frente al espejo", "Una sola frase de las que hoy te callaste. En voz alta, una vez."),
 47: ("Tu no", "Escríbelo con palabras reales. Un no escrito ya está medio dicho."),
 48: ("Sí, sí; no, no", "Pide valor. Un no claro también puede ser un acto de amor."),
 49: ("Las máscaras", "Soy directora de teatro. Esta noche te cuento cuál fue la obra más larga que dirigí. Capítulo 7."),
 50: ("Lo que todavía pesa", "Escríbela con su fecha. Ponerle fecha la deja en el pasado, donde pertenece."),
 51: ("La carta que no se envía", "Esta carta no es para el otro. Es para sacarlo de tu noche."),
 52: ("En voz alta", "Leerla en voz alta la saca de tu cuerpo. Después decides si la guardas o la rompes."),
 53: ("Por su nombre", "«Te entrego…», y lo dices. Lo que se nombra se puede soltar."),
 54: ("Un suspiro largo", "Tres exhalaciones con sonido. Deja que salga."),
 55: ("Tu frase nueva", "Para cuando vuelva a las tres. Porque a veces vuelve, y esta vez vas a tener qué decirle."),
 56: ("Lo que pesa", "Cierras la parte del alma. Capítulo 8: perdonar no es decir que estuvo bien."),
 57: ("Escucha a tu cuerpo", "Empieza la parte del cuerpo. Esta noche lo recorres de los pies a la cabeza."),
 58: ("Tu último café", "Anota la hora. Muchas noches se deciden a las cinco de la tarde."),
 59: ("El semáforo de la noche", "Verde, amarillo o rojo. Después de las seis de la tarde, todo cuenta."),
 60: ("Dos horas antes", "Cena dos horas antes de acostarte y mañana anota cómo dormiste. Tu cuerpo te va a contestar."),
 61: ("Tu digestión", "Hinchazón, pesadez o nada. A mí el cuerpo me venía avisando desde niña."),
 62: ("Un minuto quieta", "Antes del teléfono, un minuto para ver cómo amaneció tu cuerpo."),
 63: ("El dolor de espalda", "Esta noche te cuento lo que me dijeron de mi espalda y lo que me cambió. Capítulo 9."),
 64: ("Agua desde la mañana", "Estar deshidratada se puede confundir con ansiedad. Hoy llevas tu botella a todos lados."),
 65: ("Proteína con vegetales", "Un desayuno con proteína te sostiene el día, y un día sostenido se duerme mejor."),
 66: ("Uno solo", "No te pido una dieta. Un alimento que te cae pesado, reemplazado por otra cosa."),
 67: ("Sin azúcar de noche", "El pico de azúcar de la noche trae una caída. Muchas veces esa caída te despierta."),
 68: ("Tres cambios", "Anótalos. Lo que tu cuerpo ya cambió es la prueba que tu cabeza necesita."),
 69: ("Gracias por mis piernas", "Agradecer por una parte concreta de tu cuerpo cambia cómo lo tratas."),
 70: ("No es un basurero", "Al carro le cambias el aceite. Esta noche, el capítulo 10."),
 71: ("El teléfono, afuera", "Esta noche se carga fuera de la habitación. Si te cuesta, es porque lo necesitabas."),
 72: ("Luz de la mañana", "Diez minutos afuera. Así tu cuerpo aprende qué hora es, y a la noche lo recuerda."),
 73: ("Tu bingo del descanso", "Dieciséis casillas. Una línea completa es tu bingo de la semana."),
 74: ("Una sola cosa del cuarto", "Luz, ruido, temperatura o desorden. Una sola."),
 75: ("Lo último que miras", "Esta noche lo eliges tú: un salmo, una lectura, una conversación."),
 76: ("Lo que te deja peor", "Una cuenta, una persona, un grupo. Escríbelo y decide si lo sigues mirando."),
 77: ("La lámpara del cuerpo", "Lo que miras antes de dormir se acuesta contigo. Capítulo 11."),
 78: ("Tu ritual", "Cinco pasos con su hora. El tuyo, no el de nadie."),
 79: ("Como en un estreno", "Esta noche haces tu ritual completo, de principio a fin."),
 80: ("Tus tres reglas", "Cópialas en tu carta de rescate. Son tuyas."),
 81: ("La noche que…", "Agradece por una noche de este camino, por su nombre."),
 82: ("Cuéntalo", "Lo que se comparte se queda."),
 83: ("No mires la hora", "Si te despiertas, usa tu afiche. Ya sabes qué hacer."),
 84: ("Noche 84", "Esta noche, el último capítulo, con mi historia, y tu radiografía final."),
}

def cap_de(n):
    return next((c for c in CAPITULOS if c['sem'] * 7 == n), None)

PDS = {
 28: ("Si quieres ir más profundo con la raíz, conmigo al lado, en este video te explico cómo es el Círculo de Restauración", 'n28'),
 56: ("Si sientes que lo que pesa necesita más que un libro, en este video te cuento cómo acompaño uno a uno en el Círculo de Restauración", 'n56'),
 84: ("Si quieres seguir conmigo, uno a uno, en este video te explico cómo es el Círculo de Restauración", 'n84'),
 43: ("A la mitad del camino muchas mujeres me preguntan cómo es hacerlo conmigo. Te lo explico en este video", 'n43'),
 70: ("Si tu cuerpo te está pidiendo un proceso más profundo, en este video te cuento cómo es el Círculo de Restauración", 'n70'),
}

def html_correo(parrafos):
    out = []
    for p in parrafos:
        out.append(f'<p>{p}</p>')
        out.append('<p><br></p>')
    return ('<div style="font-family:Georgia,serif;font-size:18px;line-height:1.65;color:#242018">' + ''.join(out[:-1]) + '</div>')

def link(texto, url):
    return f'<a href="{url}" style="color:#8C7345;text-decoration:underline">{texto}</a>'

noches = []
for n in range(1, 85):
    asunto, nota = NOTAS[n]
    k, inv = NOCHES[n]
    tipo = TIPOS[k][0].capitalize() if k != 'cierra' else 'Cierra la semana'
    ps = ['Hola {{contact.first_name}}:', H.escape(nota, quote=False),
          f'<em>Tu invitación de esta noche · Noche {n} · {tipo}</em><br>{H.escape(inv, quote=False)}',
          'Cuando la hagas, marca la casilla en tu libro.', 'Ani']
    if n in PDS:
        t, c = PDS[n]
        ps.append('P. D. ' + t + ': ' + link('mirar el video', utm(VSL, 'cada-noche', c)) + '.')
    vista = H.escape(inv[:90], quote=False)
    noches.append({'n': n, 'asunto': f'Noche {n} · {asunto}', 'vista_previa': inv[:110], 'html': html_correo(ps)})

ENTREGA = {
 'asunto': 'Tu libro está aquí · Lo que no te deja dormir',
 'vista_previa': 'Tu noche 1 puede ser hoy: tres pasos, diez minutos.',
 'html': html_correo([
   'Hola {{contact.first_name}}:',
   'Gracias por tu compra. Aquí está tu libro:',
   link('→ Descargar «Lo que no te deja dormir»', 'https://ani-martinez.vercel.app/libro/d/lfjc5z2sokpm/lo-que-no-te-deja-dormir.pdf'),
   'Es un PDF que completas en la pantalla o imprimes. Si lo completas en la pantalla, guárdalo cada vez que escribas.',
   '<em>Tu noche 1, hoy:</em><br>1. Haz tu mapa de la noche (página 16).<br>2. Completa tu radiografía (página 18).<br>3. Haz tu primera invitación y marca la casilla (página 21).',
   'Diez minutos. Esta noche no cambias nada: solo miras.',
   'Ani']),
}

# para quien no tomó la casilla: 4 correos en 10 días (se corta si agenda o compra el Círculo)
SESION = {
 'asunto': 'Tu sesión conmigo · elige tu horario',
 'vista_previa': 'Elige el día y la hora, y trae tu mapa de la noche.',
 'html': html_correo([
   'Hola {{contact.first_name}}:',
   'Gracias por reservar tu primera sesión conmigo. Son 45 minutos por videollamada.',
   'Si todavía no elegiste el día y la hora, hazlo aquí:',
   link('→ Elige tu horario', 'https://ani-martinez.com/libro-agenda'),
   'Antes de la sesión, completa en tu libro el mapa de la noche (página 16) y tu radiografía (página 18). Respóndeme este correo con las dos cosas. Así llego sabiendo de ti.',
   'Y si después quieres hacer el Círculo de Restauración conmigo, los USD 97 de esta sesión se descuentan si entras en los 7 días siguientes.',
   'Ani']),
}

SECUENCIA = [
 {'dia': 1, 'asunto': '¿Hiciste tu noche 1?', 'vista_previa': 'Diez minutos y una casilla marcada.',
  'html': html_correo(['Hola {{contact.first_name}}:',
    'Ayer te llegó tu libro. Si todavía no hiciste tu noche 1, esta noche es un buen momento.',
    'Tu mapa de la noche, tu radiografía y tu primera invitación. Diez minutos. No cambias nada: solo miras cómo es tu noche hoy.',
    'Las mujeres que más cambian en este camino no son las que más leen. Son las que marcan la casilla.',
    'Ani'])},
 {'dia': 3, 'asunto': 'Lo que nadie miró', 'vista_previa': 'Me trataron la mente. Mi cuerpo y mi espíritu siguieron igual.',
  'html': html_correo(['Hola {{contact.first_name}}:',
    'Durante siete años me trataron una sola parte. Yo oraba más fuerte y los médicos ajustaban las pastillas. Mi cuerpo, que me venía avisando desde niña, no lo miró nadie.',
    'Por eso el libro empieza por el espíritu. No para que reces más, sino para que hables de verdad, con tus palabras, de lo tuyo.',
    'Esta semana miras tu noche tal como es. La semana que viene empiezas a hablar.',
    'Ani'])},
 {'dia': 6, 'asunto': 'Que nadie lo note', 'vista_previa': 'Que nadie lo note no significa que estés bien.',
  'html': html_correo(['Hola {{contact.first_name}}:',
    'Muchas de las mujeres que acompaño lideran una empresa, un equipo o una casa entera. Son las que resuelven. Y llegan a mí porque la que resuelve todo no puede resolver su noche.',
    'El libro es el camino para recorrer sola, una noche por vez. Hay mujeres que quieren ir más profundo y más rápido, conmigo al lado.',
    'Para ellas está el Círculo de Restauración: diez semanas y cinco sesiones uno a uno, con el método TamÍm completo y medido con tu radiografía.',
    link('→ En este video te explico cómo es', utm(VSL, 'libro-secuencia', 'd6')),
    'Ani'])},
 {'dia': 10, 'asunto': 'Tu primera semana', 'vista_previa': 'Cerraste o estás por cerrar tu primera semana.',
  'html': html_correo(['Hola {{contact.first_name}}:',
    'Si seguiste el libro, ya cerraste tu primera semana y leíste el capítulo de la mujer que tenía todas las respuestas. Esa era yo.',
    'Si te quedaste en la noche 3, no empieces de nuevo: sigue desde donde quedaste. No se empieza de nuevo el lunes.',
    'Y si sientes que esto pide más que un libro, en el Círculo trabajo con pocas mujeres por vez, por postulación.',
    link('→ Mira el video y postúlate', utm(VSL, 'libro-secuencia', 'd10')),
    'Ani'])},
]

if __name__ == '__main__':
    os.makedirs('correos', exist_ok=True)
    json.dump({'entrega': ENTREGA, 'sesion': SESION, 'cada_noche': noches, 'secuencia': SECUENCIA}, open('correos/correos.json', 'w'), ensure_ascii=False, indent=1)
    # documento legible para revisar
    md = ['# Correos del libro «Lo que no te deja dormir» · Ani Martínez\n',
          '## Entrega (al pagar el libro)\n', f"**{ENTREGA['asunto']}**  \n_{ENTREGA['vista_previa']}_\n"]
    md.append(f"\n## Sesión pagada (al pagar la sesión de USD 97)\n\n**{SESION['asunto']}**  \n_{SESION['vista_previa']}_\n")
    md.append('\n## Secuencia de 10 días (quien no tomó la casilla; se corta si agenda o compra)\n')
    for c in SECUENCIA:
        md.append(f"- Día {c['dia']} · **{c['asunto']}** — _{c['vista_previa']}_")
    md.append('\n## Ani te escribe cada noche (84 correos, 21:00)\n')
    for c in noches:
        md.append(f"- {c['asunto']}")
    open('correos/correos.md', 'w').write('\n'.join(md))
    # lo que lee la app (Vercel): entrega y secuencia al comprar, y las 84 noches del cron
    json.dump({'entrega': ENTREGA, 'sesion': SESION, 'secuencia': SECUENCIA}, open('../lib/libro-correos.json', 'w'), ensure_ascii=False)
    json.dump([{'n': c['n'], 'asunto': c['asunto'], 'html': c['html']} for c in noches], open('../lib/libro-noches.json', 'w'), ensure_ascii=False)
    print(len(noches), 'noches')
