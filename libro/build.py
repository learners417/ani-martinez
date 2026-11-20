# -*- coding: utf-8 -*-
"""Arma «Lo que no te deja dormir» (Ani Martínez) en HTML y PDF completable (WeasyPrint)."""
import math, os, sys, html as H
from contenido import *

BASE = os.path.dirname(os.path.abspath(__file__))
MUESTRA = '--muestra' in sys.argv
M = 'file://' + BASE + '/marca/'
F = 'file:///home/claude/fonts/'

ORO, OROP, ORON, TINTA, CREMA, LINO, NOCHE = '#C3A878', '#8C7345', '#D5BE9C', '#242018', '#F6F2EA', '#EFEADF', '#1A1815'

_n = [0]
def fid(p='f'):
    _n[0] += 1
    return f'{p}{_n[0]}'
def cb(cls='cb'):
    return f'<input type="checkbox" class="{cls}" name="{fid("c")}">'
def tx(cls='tx'):
    return f'<input type="text" class="{cls}" name="{fid("t")}">'
def ta(h='22mm', cls='ta'):
    return f'<textarea class="{cls}" style="height:{h}" name="{fid("a")}"></textarea>'
def e(s):
    return H.escape(s, quote=False)

# ---------- íconos de línea (oro profundo)
def ico(k, s=13, c=OROP):
    p = {
     'escribe': '<path d="M4 20l1.2-4.4L15.8 5a1.8 1.8 0 0 1 2.6 0l.6.6a1.8 1.8 0 0 1 0 2.6L8.4 18.8z"/><path d="M14 6.8l3.2 3.2"/>',
     'respira': '<path d="M3 9c3-3 6 3 9 0s6-3 9 0"/><path d="M3 15c3-3 6 3 9 0s6-3 9 0"/>',
     'suelta':  '<path d="M6 13.5V7.5a1.5 1.5 0 0 1 3 0v4"/><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 11V6.5a1.5 1.5 0 0 1 3 0V12"/><path d="M15 12V9a1.5 1.5 0 0 1 3 0v4.5c0 4-2.6 6.5-6.2 6.5-2.6 0-4-1-5.3-3L4 13.6a1.5 1.5 0 0 1 2.4-1.8L8 13.5"/>',
     'conversa':'<path d="M12 3c1.6 2.8 4.2 4.8 4.2 8.3a4.2 4.2 0 0 1-8.4 0C7.8 7.8 10.4 5.8 12 3z"/><path d="M12 13.2v6.8M9 20h6"/>',
     'lee':     '<path d="M3 5.5c3-1.4 6-1.4 9 .5 3-1.9 6-1.9 9-.5V19c-3-1.4-6-1.4-9 .5-3-1.9-6-1.9-9-.5z"/><path d="M12 6v13.5"/>',
     'escucha': '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z"/>',
     'nutre':   '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M9 7c0-1.3 1-1.6 1-3M13 7c0-1.3 1-1.6 1-3"/>',
     'escena':  '<path d="M4 5h16v5.5a8 8 0 0 1-16 0z"/><path d="M8.3 9.3h2M13.7 9.3h2M9 13.5c1.8 1.4 4.2 1.4 6 0"/>',
     'juega':   '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r=".9"/><circle cx="15" cy="9" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="9" cy="15" r=".9"/><circle cx="15" cy="15" r=".9"/>',
     'cierra':  '<path d="M3 17a9 9 0 0 1 18 0"/><path d="M2 17h20"/><path d="M12 4v2.5M5.6 6.6l1.7 1.7M18.4 6.6l-1.7 1.7"/>',
     'luna':    '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
     'termo':   '<path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
     'marca':   '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12.5l3 3 5-6"/>',
     'pregunta':'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6"/><circle cx="12" cy="16.8" r=".6"/>',
     'lupa':    '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
     'comillas':'<path d="M5 17c0-4 1-7 4-9M12 17c0-4 1-7 4-9"/>',
     'calendario':'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
     'carta':   '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/>',
     'flecha':  '<path d="M5 12h14M13 6l6 6-6 6"/>',
    }[k]
    return (f'<svg class="ico" width="{s}pt" height="{s}pt" viewBox="0 0 24 24" fill="none" stroke="{c}" '
            f'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{p}</svg>')

def lab(texto, k=None, cls='lab'):
    i = ico(k, 11) if k else f'<img class="llamita" src="{M}llama-oro-profundo.png">'
    return f'<p class="{cls}">{i}<span>{e(texto)}</span></p>'

def pg(cuerpo, cls='', pid=None, page=None):
    a = f' id="{pid}"' if pid else ''
    s = f' style="page:{page}"' if page else ''
    return f'<section class="pg {cls}"{a}{s}>{cuerpo}</section>\n'

def ps(parrafos, cls=''):
    return ''.join(f'<p class="{cls}">{p}</p>' for p in parrafos)

# ---------- portada: 84 puntos en tres arcos (cada punto una noche)
def arco_noches(w=420, h=250, llama=True, color=ORO, fondo=None, marcar=None):
    cx, cy = w / 2, h - 18
    radios = [92, 140, 188]  # espíritu (raíz) adentro, alma, cuerpo afuera
    out = []
    n = 0
    for ri, r in enumerate(radios):
        for i in range(28):
            n += 1
            a = math.pi - (i + 0.5) * math.pi / 28
            x, y = cx + r * math.cos(a), cy - r * math.sin(a)
            rad = 2.6 + ri * 0.55 + i * 0.03
            fill = color if (marcar and n <= marcar) else 'none'
            if n == 84 and llama:
                continue
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.2f}" fill="{fill}" stroke="{color}" stroke-width="0.9"/>')
    last = ''
    if llama:
        a = math.pi - (27.5) * math.pi / 28
        x, y = cx + 188 * math.cos(a), cy - 188 * math.sin(a)
        last = (f'<image href="{M}llama-oro.png" x="{x-5:.1f}" y="{y-15:.1f}" width="10" height="24"/>')
    return (f'<svg class="arco" viewBox="0 0 {w} {h}" width="100%">' + ''.join(out) + last + '</svg>')

# ---------- diagrama de las tres dimensiones con el corazón al centro
def tres_circulos(w=380, h=320, campos=False, etiquetas=None, color=OROP):
    r = 92
    DT = 'font-family="Cormorant" font-size="22" fill="#242018" text-anchor="middle"'
    RT = 'font-family="Lora" font-style="italic" font-size="10.5" fill="#8C7345" text-anchor="middle"'
    rel = etiquetas or ['Con Dios', 'Contigo', 'Con los demás']
    s = [f'<svg viewBox="0 0 {w} {h}" width="270pt" class="tres">']
    for x, y in [(190, 118), (130, 216), (250, 216)]:
        s.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{ORO}" stroke-width="1.1"/>')
    s.append(f'<text x="190" y="72" {DT}>Espíritu</text>')
    s.append(f'<text x="88" y="252" {DT}>Alma</text>')
    s.append(f'<text x="292" y="252" {DT}>Cuerpo</text>')
    s.append(f'<text x="147" y="160" {RT}>{rel[0]}</text>')
    s.append(f'<text x="233" y="160" {RT}>{rel[1]}</text>')
    s.append(f'<text x="190" y="256" {RT}>{rel[2]}</text>')
    s.append(f'<image href="{M}llama-oro.png" x="185" y="170" width="10" height="24"/>')
    s.append(f'<text x="190" y="210" font-family="Lora" font-size="9" letter-spacing="1.6" fill="#8C7345" text-anchor="middle">CORAZÓN</text>')
    s.append('</svg>')
    return ''.join(s)

# ====================================================================== páginas
paginas = []
add = paginas.append
INDICE = []  # (texto, id, nivel)

def marca_ix(texto, pid, nivel=1):
    INDICE.append((texto, pid, nivel))

# 1 · portada
add(pg(f'''
<div class="tapa">
  <img class="tapa-logo" src="{M}logotipo-tinta.png">
  <div class="tapa-arco">{arco_noches()}</div>
  <p class="tapa-nota">cada punto es una noche</p>
  <h1 class="tapa-t">Lo que no te<br>deja dormir<br><em>84 noches</em></h1>
  <p class="tapa-b">{e(BAJADA)}</p>
</div>''', cls='portada', page='portada'))

# 2 · créditos
add(pg(f'''
<div class="creditos">
 <p class="cr-t">Lo que no te deja dormir</p>
 <p>Ani Martínez · creadora del método TamÍm</p>
 <p>Primera edición · 2026</p>
 <hr class="filete">
 <p>Las historias de este libro son mías. Las escenas en segunda persona no son de una persona en particular: son de muchas mujeres, y probablemente también tuyas.</p>
 <p>Este libro acompaña tu proceso. No reemplaza la atención de un profesional de la salud. Si tienes un diagnóstico, tomas medicación o estás embarazada, habla con quien te atiende antes de cambiar tu alimentación o tus rutinas. No dejes ni cambies ninguna medicación por tu cuenta.</p>
 <p>Si roncas fuerte, te despiertas sin aire o hace más de tres meses que duermes mal casi todas las noches, consulta también con un médico.</p>
 <p>Si en algún momento tienes pensamientos de hacerte daño, busca ayuda hoy mismo: llama a la línea de emergencias de tu país o pídele a alguien de confianza que te acompañe.</p>
 <p>Las citas bíblicas son de la versión Reina-Valera de 1909.</p>
 <p class="cr-pdf">Este PDF se completa en la pantalla o se imprime. Si lo completas en la pantalla, guarda el archivo cada vez que escribas.</p>
</div>''', cls='plano'))

# 3 · índice (se completa al final)
add('%%INDICE%%')

# 4 · cómo usar
marca_ix('Cómo usar este libro', 'como')
add(pg(f'''
{lab('Cómo usar este libro', 'lee')}
<h2>Una noche por vez, en tu vida real</h2>
<p class="lead">Este libro son 84 noches, una por vez.</p>
{ps([
 'Cada noche tiene una invitación: algo chico para hacer en tu vida, no en la pantalla, de cinco a diez minutos. La haces y marcas la casilla.',
 'Cada semana tiene un capítulo: una historia, lo que hay debajo, tu ejercicio y tu regla. Lo lees la noche que cierra la semana. Es tu media hora con el libro.',
 'Las noches 1, 43 y 84 haces tu radiografía: seis números, siempre los mismos. Ahí ves tu cambio, en números tuyos.',
 'Si una noche no puedes, sigues la siguiente. No se empieza de nuevo el lunes.'])}
<div class="nota-oro"><p><em>Ten a mano un cuaderno y un lápiz.</em> Escribir con la mano le da a tu cabeza un lugar donde dejar lo que da vueltas.</p></div>
''', pid='como'))

# 5 · tus ritmos
add(pg(f'''
{lab('Tus ritmos', 'calendario')}
<h2>Tres ritmos, un mismo camino</h2>
<div class="ritmos">
 <div class="ritmo"><p class="r-k">Cada noche</p><p class="r-t">Tu invitación</p><p class="r-m">5 a 10 minutos</p><p>La haces en tu vida, no en la pantalla, y marcas la casilla.</p></div>
 <div class="ritmo"><p class="r-k">Cada semana</p><p class="r-t">Tu capítulo</p><p class="r-m">30 minutos</p><p>Lees la historia, entiendes qué hay debajo y escribes tu regla.</p></div>
 <div class="ritmo"><p class="r-k">Noches 1, 43 y 84</p><p class="r-t">Tu radiografía</p><p class="r-m">5 minutos</p><p>Mides tus tres dimensiones con los mismos seis números.</p></div>
</div>
<div class="arco-chico">{arco_noches(w=420, h=230)}</div>
<p class="pie-c">Cada punto es una noche. La 84 la enciendes tú.</p>
'''))

# 6 · invitaciones
tipos_html = ''.join(
    f'<div class="tipo">{ico(k, 15)}<p class="ti-n">{TIPOS[k][0]}</p><p>{e(TIPOS[k][1])}</p></div>'
    for k in ['escribe', 'respira', 'suelta', 'conversa', 'lee', 'escucha', 'nutre', 'escena'])
add(pg(f'''
{lab('Tus invitaciones', 'escribe')}
<h2>Cada noche, una invitación</h2>
<p>Algo chico para hacer en tu vida real, de cinco a diez minutos. Hay ocho tipos, y cada uno tiene su símbolo.</p>
<div class="tipos">{tipos_html}</div>
'''))

# 7 · cada semana igual
pasos = [('calendario', 'Tu recorrido', 'Siete noches, una invitación por noche, para marcar.'),
         ('juega', 'Un juego', 'Seis semanas traen uno, para entender tu noche sin culparte.'),
         ('lee', 'La historia', 'Una historia mía, o una escena que vas a reconocer.'),
         ('comillas', 'La frase', 'Una idea para llevarte, a página entera.'),
         ('lupa', 'Lo que hay debajo', 'Lo que veo yo, y en qué dimensión pasa.'),
         ('marca', 'Marca y completa', 'Lo que te pasa, con tus palabras.'),
         ('escribe', 'Tu ejercicio', 'Lo que hice yo, ahora tú.'),
         ('pregunta', 'Tu pregunta y tu regla', 'Para cerrar la semana con un renglón tuyo.')]
add(pg(f'''
{lab('Cada semana, siempre igual', 'calendario')}
<h2>Siempre en el mismo orden</h2>
<div class="pasos">{''.join(f'<div class="paso"><span class="p-n">0{i+1}</span>{ico(k, 14)}<p class="p-t">{t}</p><p>{d}</p></div>' for i,(k,t,d) in enumerate(pasos))}</div>
'''))

# 8 · el método
marca_ix('El método: somos tres', 'metodo')
add(pg(f'''
{lab('El método', 'lupa')}
<h2>Somos espíritu, alma y cuerpo</h2>
<p>«Que vuestro espíritu y alma y cuerpo sea guardado entero». <span class="cita">1 Tesalonicenses 5:23</span></p>
<div class="centro">{tres_circulos()}</div>
<div class="dims3">
 <div><p class="d-t">Espíritu</p><p>Tu relación con Dios, tu intuición, tu conciencia. La raíz.</p></div>
 <div><p class="d-t">Alma</p><p>Tu mente, tus emociones y tus decisiones.</p></div>
 <div><p class="d-t">Cuerpo</p><p>Lo que comes, tu descanso, tu movimiento. Lo que expresa.</p></div>
</div>
''', pid='metodo'))

# 9 · el camino
add(pg(f'''
{lab('El camino', 'flecha')}
<h2>Doce semanas, tres partes</h2>
<div class="camino">
 {''.join(f'<div class="tramo"><p class="tr-n">{p["n"]}</p><div><p class="tr-t">{p["dim"]} <em>· {e(p["nombre"])}</em></p><p class="tr-d">Semanas {p["semanas"][0]} a {p["semanas"][1]} · noches {p["noches"][0]} a {p["noches"][1]}</p><p>{e(p["lema"])}</p></div></div>' for p in PARTES)}
</div>
<div class="radios">
 <div><p class="ra-n">Noche 1</p><p>Tu punto de partida</p></div>
 <div><p class="ra-n">Noche 43</p><p>Mitad del camino</p></div>
 <div><p class="ra-n">Noche 84</p><p>Tu llegada</p></div>
</div>
<p class="pie-c">Empezamos por el espíritu porque es la raíz. Es el orden de 1 Tesalonicenses 5:23, y es el orden en que yo sané.</p>
'''))

# 10 · las 84 noches de un vistazo
filas = ''
for s in range(1, 13):
    p = PARTES[(s - 1) // 4]
    casillas = ''.join(f'<span class="vc">{cb("cbg")}<i>{n}</i></span>' for n in range((s-1)*7+1, s*7+1))
    filas += f'<div class="vfila"><p class="vf-s">Semana {s}<span>{p["dim"]}</span></p><div class="vf-c">{casillas}</div></div>'
add(pg(f'''
{lab('Las 84 noches de un vistazo', 'calendario')}
<h2>Marca cada noche que haces</h2>
<div class="vistazo">{filas}</div>
'''))

# 11-12 · antes de la noche 1: tres de la mañana
marca_ix('Antes de la noche 1 · Tres de la mañana', 'apertura')
t = APERTURA['texto']
add(pg(f'''
{lab(APERTURA['sub'], 'luna')}
<h2 class="cap-t">{APERTURA['titulo']}</h2>
<p class="sub">Una historia mía, y tal vez también tuya</p>
<p class="capital">{t[0]}</p>
{ps(t[1:4])}
{ps(t[4:5], 'destacado')}
{ps(t[5:])}
<div class="separa"><img src="{M}arco-de-luz-oro.png"></div>
''', pid='apertura'))

# frase (noche)
def frase_pg(fr, autora='Ani Martínez'):
    return pg(f'''
<div class="frase-w"><p class="comi">«</p><p class="frase">{e(fr)}</p><p class="firma-f">{autora}</p></div>
<img class="frase-llama" src="{M}llama-oro.png">''', cls='noche', page='noche')
add(frase_pg('Somos tres. A mí me trataron una sola parte.'))

# lo que hay debajo 0
add(pg(f'''
{lab('Lo que hay debajo', 'lupa')}
<h2>{LO_QUE_HAY_DEBAJO_0['titulo']}</h2>
{ps(LO_QUE_HAY_DEBAJO_0['texto'])}
'''))

# antes de seguir 0
def marca_pg(items, completa):
    lis = ''.join(f'<div class="mk">{cb()}<span>{e(i)}</span></div>' for i in items)
    comp = ''.join(f'<p class="cf">{e(c)}</p>{ta("23mm")}' for c in completa)
    return pg(f'''
{lab('Antes de seguir', 'marca')}
<h2>Marca lo que te pasa</h2>
<div class="mks">{lis}</div>
{lab('Completa la frase', 'escribe')}
{comp}''')
add(marca_pg(['Me despierto de madrugada y no vuelvo a dormir', 'Me cuesta dormirme porque la cabeza no para',
              'Duermo, pero me levanto cansada', 'Ya probé muchas cosas y vuelvo a lo de antes',
              'Por fuera sostengo todo y nadie sabe cómo duermo'],
             ['Lo que más me cansa de no dormir es…', 'Si mis noches cambiaran, lo primero que haría es…']))

# tu mapa de la noche
horas = ['20', '21', '22', '23', '0', '1', '2', '3', '4', '5', '6', '7']
filas_m = ''
for fila in ['Me acosté', 'Me dormí', 'Me desperté', 'Me levanté']:
    filas_m += f'<tr><th>{fila}</th>' + ''.join(f'<td>{cb("cbm")}</td>' for _ in horas) + '</tr>'
add(pg(f'''
{lab('Tu ejercicio · Noche 1', 'escribe')}
<h2>Tu mapa de la noche</h2>
<p>Piensa en una noche común de esta semana. Marca a qué hora pasó cada cosa. Hazlo como es, no como te gustaría. La noche 84 vas a hacer otro al lado.</p>
<table class="mapa"><tr><th></th>{''.join(f'<td class="h">{h}</td>' for h in horas)}</tr>{filas_m}</table>
<div class="dos">
 <div><p class="cf">¿Cuántas veces te despertaste?</p>{tx()}</div>
 <div><p class="cf">¿Qué te despertó?</p>{tx()}</div>
</div>
<p class="cf">Lo que hago la última hora antes de acostarme es…</p>{ta('30mm')}
'''))

# una pregunta
def pregunta_pg(preg, sub='Contéstala hoy, y vuelve a leerla la noche 84.'):
    return pg(f'''
<div class="preg-w">{lab('Una pregunta para ti', 'pregunta')}
<p class="preg">{e(preg)}</p><p class="mu">{e(sub)}</p>{ta('45mm')}</div>''')
add(pregunta_pg('¿Desde cuándo no duermes de verdad?'))

# radiografía
def radiografia_pg(noche, titulo, pid=None):
    escala = ''.join(f'<td class="h">{i}</td>' for i in range(11))
    filas = ''
    dim_ant = None
    for dim, item in RADIOGRAFIA:
        d = f'<span class="rd">{dim}</span>' if dim != dim_ant else ''
        dim_ant = dim
        filas += f'<tr><th>{d}{e(item)}</th>' + ''.join(f'<td>{cb("cbr")}</td>' for _ in range(11)) + f'<td class="nro">{tx("txn")}</td></tr>'
    return pg(f'''
{lab(f'Tu radiografía · Noche {noche}', 'termo')}
<h2>{titulo}</h2>
<p>Seis números de hoy, dos por dimensión. No hay respuestas buenas ni malas: 0 es nada, 10 es lo mejor que te imaginas. Una casilla por fila, y el número a la derecha.</p>
<table class="radio"><tr><th></th>{escala}<td class="h">N.º</td></tr>{filas}</table>
<p class="mu">¿Cómo se lee? Si tus números de la noche 43 y de la noche 84 suben, es tu descanso volviendo.</p>''', pid=pid)
marca_ix('Tu radiografía · Noche 1', 'radio1')
add(radiografia_pg(1, 'Tu punto de partida', 'radio1'))

# ====================================================================== las tres partes
def cap_por_sem(s):
    return next(c for c in CAPITULOS if c['sem'] == s)

def noche_card(n):
    k, texto = NOCHES[n]
    nombre = TIPOS[k][0]
    return (f'<div class="nc"><div class="nc-n"><span>NOCHE</span><b>{n}</b></div>'
            f'<div class="nc-b"><p class="nc-k">{ico(k, 11)}{nombre}</p><p class="nc-t">{e(texto)}</p></div>'
            f'<div class="nc-c">{cb("cbn")}</div></div>')

def juego_pg(j):
    J = JUEGOS[j]
    tipo = J['tipo']
    cuerpo = ''
    if tipo == 'dimension':
        cab = '<tr><th></th><td class="h">Espíritu</td><td class="h">Alma</td><td class="h">Cuerpo</td></tr>'
        cuerpo = '<table class="jt">' + cab + ''.join(
            f'<tr><th><span class="jn">{i+1}</span>{e(it)}</th>' + ''.join(f'<td>{cb()}</td>' for _ in range(3)) + '</tr>'
            for i, it in enumerate(J['items'])) + '</table>'
    elif tipo == 'vf':
        cab = '<tr><th></th><td class="h">Verdad</td><td class="h">Creencia</td></tr>'
        cuerpo = '<table class="jt">' + cab + ''.join(
            f'<tr><th><span class="jn">{i+1}</span>{e(it)}</th>' + ''.join(f'<td>{cb()}</td>' for _ in range(2)) + '</tr>'
            for i, it in enumerate(J['items'])) + '</table>'
    elif tipo == 'semaforo':
        cab = '<tr><th></th><td class="h">Verde</td><td class="h">Amarillo</td><td class="h">Rojo</td></tr>'
        cuerpo = '<table class="jt">' + cab + ''.join(
            f'<tr><th><span class="jn">{i+1}</span>{e(it)}</th>' + ''.join(f'<td>{cb()}</td>' for _ in range(3)) + '</tr>'
            for i, it in enumerate(J['items'])) + '</table>'
    elif tipo == 'voces':
        cuerpo = '<div class="voces">' + ''.join(
            f'<div class="voz"><p class="v-n">{e(n)} <em>· {e(d)}</em></p><div class="v-2"><div><p class="v-k">Me dice</p>{tx()}{tx()}</div><div><p class="v-k">Le contesto</p>{tx()}{tx()}</div></div></div>'
            for n, d in J['items']) + '</div>'
    elif tipo == 'mascaras':
        cuerpo = '<div class="masc">' + ''.join(
            f'<div class="ms">{cb()}<span>{e(it)}</span>{tx("txm")}</div>' for it in J['items']) + '</div>'
    elif tipo == 'bingo':
        cuerpo = '<div class="bingo">' + ''.join(
            f'<div class="bc">{cb("cbb")}<span>{e(it)}</span></div>' for it in J['items']) + '</div>'
    sol = '<p class="mu">Las respuestas están al final del libro.</p>' if 'sol' in J else ''
    return pg(f'''
{lab(f'Juego {j} · Semana {J["sem"]}', 'juega')}
<h2>{e(J["titulo"])}</h2>
<p>{e(J["intro"])}</p>
{cuerpo}{sol}''', pid=f'juego{j}')

def ejercicio_html(ej):
    titulo, instr, tipo, cols = ej
    if tipo == 'dos_col':
        filas = ''.join(f'<tr><td>{tx()}</td><td>{tx()}</td></tr>' for _ in range(9))
        cuerpo = f'<table class="dcol"><tr><th>{cols[0]}</th><th>{cols[1]}</th></tr>{filas}</table>'
    elif tipo == 'carta':
        cuerpo = ''.join(f'<p class="cf">{e(c)}</p>{ta("24mm")}' for c in cols)
    elif tipo == 'tres':
        cuerpo = '<div class="tres-c">' + ''.join(
            f'<div class="tc"><p class="tc-t">{e(c)}</p>{tx()}{tx()}{tx()}{tx()}</div>' for c in cols) + '</div>'
    elif tipo == 'corazon':
        cuerpo = f'<div class="centro">{tres_circulos()}</div><div class="tres-c">' + ''.join(
            f'<div class="tc"><p class="tc-t">{e(c)}</p><p class="tc-k">Del 0 al 10</p>{tx("txn")}<p class="tc-k">En una palabra</p>{tx()}</div>' for c in cols) + \
            f'</div><p class="cf">Lo que mi corazón necesita hoy es…</p>{tx()}'
    elif tipo == 'mesa':
        cab = ''.join(f'<td class="h">{e(c)}</td>' for c in cols)
        filas = ''.join(f'<tr><th>{tx()}</th>' + ''.join(f'<td>{cb()}</td>' for _ in cols) + '</tr>' for _ in range(7))
        cuerpo = f'<table class="mesa"><tr><th class="h">Mi preocupación</th>{cab}</tr>{filas}</table>'
    elif tipo == 'tabla':
        cab = ''.join(f'<td class="h">{e(c)}</td>' for c in cols)
        dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
        filas = ''.join(f'<tr><th>{d}</th>' + ''.join(f'<td>{tx("txs")}</td>' for _ in cols) + '</tr>' for d in dias)
        cuerpo = f'<table class="sem"><tr><th></th>{cab}</tr>{filas}</table>'
    elif tipo == 'tabla3':
        cab = ''.join(f'<th>{e(c)}</th>' for c in cols)
        filas = ''.join('<tr>' + ''.join(f'<td>{tx()}</td>' for _ in cols) + '</tr>' for _ in range(6))
        cuerpo = f'<table class="dcol tres3"><tr>{cab}</tr>{filas}</table>'
    elif tipo == 'checklist':
        cuerpo = '<div class="mks dos-c">' + ''.join(f'<div class="mk">{cb()}<span>{e(c)}</span></div>' for c in cols) + \
                 f'</div><p class="cf">La cosa que voy a cambiar esta semana es…</p>{tx()}'
    elif tipo == 'ritual':
        cuerpo = '<table class="ritual"><tr><th class="h">Hora</th><th class="h">Paso</th></tr>' + ''.join(
            f'<tr><td class="rn">{tx("txh")}</td><td>{tx()}</td></tr>' for _ in range(5)) + '</table>'
    return f'{lab("Tu ejercicio", "escribe")}<h2>{e(titulo)}</h2><p>{e(instr)}</p>{cuerpo}'

def capitulo_pgs(c):
    out = []
    pid = f'cap{c["n"]}'
    marca_ix(f'Capítulo {c["n"]} · {c["titulo"]}', pid, 2)
    h = c['historia']
    out.append(pg(f'''
{lab(f'Capítulo {c["n"]} · Semana {c["sem"]}', 'lee')}
<h2 class="cap-t">{e(c["titulo"])}</h2>
<p class="sub">{e(c["sub"])}</p>
<p class="capital">{e(h[0])}</p>{ps([e(x) for x in h[1:]])}<div class="separa"><img src="{M}arco-de-luz-oro.png"></div>''', pid=pid))
    out.append(frase_pg(c['frase']))
    out.append(pg(f'''
{lab('Lo que hay debajo', 'lupa')}
<div class="dimtag">{''.join(f'<span class="{"on" if d==c["dim"] else ""}">{d}</span>' for d in ["Espíritu","Alma","Cuerpo"])}</div>
<h2>Lo que veo yo</h2>
{ps([e(x) for x in c["debajo"]])}'''))
    out.append(marca_pg(c['marca'], c['completa']))
    out.append(pg(ejercicio_html(c['ejercicio'])))
    out.append(pg(f'''
{lab('Tu pregunta', 'pregunta')}
<p class="preg2">{e(c["pregunta"])}</p>{ta('40mm')}
{lab('Tu regla de la semana', 'escribe')}
<p class="mu">Una sola línea, con tus palabras. Si no te sale, empieza por la mía.</p>
<p class="regla-ej"><img class="llamita" src="{M}llama-oro.png"><em>{e(c["regla"])}</em></p>
{tx('txr')}
{lab('Tus notas de la semana', 'carta')}
{ta('52mm', 'ta notas')}'''))
    return out

for p in PARTES:
    pid = f'parte{p["n"]}'
    marca_ix(f'Parte {p["n"]} · {p["dim"]} · {p["nombre"]}', pid, 1)
    add(pg(f'''
<div class="parte">
 <img class="parte-arco" src="{M}arco-de-luz-crema.png">
 <p class="pa-n">Parte {p["n"]}</p>
 <p class="pa-d">{p["dim"]}</p>
 <p class="pa-t"><em>{e(p["nombre"])}</em></p>
 <p class="pa-r">Semanas {p["semanas"][0]} a {p["semanas"][1]} · noches {p["noches"][0]} a {p["noches"][1]}</p>
 <p class="pa-l">«{e(p["lema"])}»</p>
</div>''', cls='noche', pid=pid, page='noche'))
    add(pg(f'''
{lab(f'Parte {p["n"]} · {p["dim"]}', None)}
<h2>{e(p["nombre"])}</h2>
{ps([e(x) for x in p["intro"]])}
<div class="centro">{tres_circulos()}</div>'''))
    for s in range(p['semanas'][0], p['semanas'][1] + 1):
        if s == 7:
            marca_ix('Tu radiografía · Noche 43', 'radio43')
            add(radiografia_pg(43, 'Mitad del camino', 'radio43'))
        n0 = (s - 1) * 7 + 1
        add(pg(f'''
<div class="rec-h">
 <div>{lab(f'Tu recorrido · {p["dim"]}', 'calendario')}
 <p class="rec-n">{s:02d}<span>noches {n0} a {n0+6}</span></p>
 <h2>{e(SEMANAS[s])}</h2></div>
 <div class="rec-a">{arco_noches(w=420, h=250, llama=False, marcar=n0-1)}<p>estás aquí</p></div>
</div>
<p class="nc-l">{ico('escribe', 11)} Tu invitación · 5 a 10 minutos</p>
{''.join(noche_card(n) for n in range(n0, n0+4))}'''))
        add(pg(f'''
{lab(f'Semana {s} · noches {n0+4} a {n0+6}', 'calendario')}
{''.join(noche_card(n) for n in range(n0+4, n0+7))}
<div class="sueno"><p class="cf">¿Cuántas noches de esta semana dormiste bien?</p>
<div class="sueno-c">{''.join(f'<span>{cb("cbg")}<i>{i}</i></span>' for i in range(1, 8))}</div></div>'''))
        if s in JUEGOS_EN:
            add(juego_pg(JUEGOS_EN[s]))
        for x in capitulo_pgs(cap_por_sem(s)):
            add(x)
        if MUESTRA and s == 1:
            break
    if MUESTRA:
        break

# ====================================================================== cierre
if MUESTRA:
    add(pg(f'''
<div class="circ">
 <img class="ci-arco" src="{M}arco-con-llama-oro.png">
 {lab('Tu primera semana', None)}
 <h2>Aquí termina tu primera semana</h2>
 {ps([
  'Hiciste siete noches. Miraste tu noche tal como es, sin cambiar nada, y leíste el primer capítulo. Ese es el primer paso del método.',
  'El libro completo sigue once semanas más: la raíz en el espíritu, la mente que no se apaga y el cuerpo que vuelve a descansar. 84 noches, seis juegos, tu radiografía de la noche 43 y de la 84, tus cartas de rescate y el afiche para tu mesa de noche.'])}
 <p class="cf">Sigue aquí, desde la noche 8:</p>
 <p class="link"><a href="https://ani-martinez.com/libro">ani-martinez.com/libro</a></p>
</div>''', cls='plano'))
else:
    marca_ix('Tu radiografía · Noche 84', 'radio84')
    add(radiografia_pg(84, 'Tu llegada', 'radio84'))

    marca_ix('Tu transformación', 'transf')
    filas = ''
    for dim, item in RADIOGRAFIA:
        filas += f'<tr><th>{e(item)}</th>' + ''.join(f'<td>{tx("txn")}</td>' for _ in range(3)) + '</tr>'
    add(pg(f'''
    {lab('Tu transformación', 'termo')}
    <h2>Noche 1, noche 43, noche 84</h2>
    <p>Pasa aquí tus tres radiografías. Es tu antes y tu después, en números tuyos.</p>
    <table class="transf"><tr><th></th><td class="h">Noche 1</td><td class="h">Noche 43</td><td class="h">Noche 84</td></tr>{filas}</table>
    <p class="cf">Lo que más cambió</p>{ta('30mm')}
    <p class="cf">Lo que todavía quiero sanar</p>{ta('30mm')}
    ''', pid='transf'))

    # mapa de la noche 84
    filas_m = ''
    for fila in ['Me acosté', 'Me dormí', 'Me desperté', 'Me levanté']:
        filas_m += f'<tr><th>{fila}</th>' + ''.join(f'<td>{cb("cbm")}</td>' for _ in horas) + '</tr>'
    add(pg(f'''
    {lab('Tu ejercicio · Noche 84', 'escribe')}
    <h2>Tu mapa de la noche, otra vez</h2>
    <p>El mismo mapa de la noche 1, con una noche común de esta semana. Después vuelve a la página del principio y ponlos uno al lado del otro.</p>
    <table class="mapa"><tr><th></th>{''.join(f'<td class="h">{h}</td>' for h in horas)}</tr>{filas_m}</table>
    <div class="dos">
     <div><p class="cf">¿Cuántas veces te despertaste?</p>{tx()}</div>
     <div><p class="cf">¿Qué cambió?</p>{tx()}</div>
    </div>
    <p class="cf">Y la pregunta del principio: ¿qué cambió en tus noches desde la noche 1?</p>{ta('30mm')}
    '''))

    # tus 12 semanas
    filas = ''.join(f'<div class="s12"><p>Semana {s}</p><div>{"".join(f"<span>{cb("cbg")}</span>" for _ in range(7))}</div></div>' for s in range(1, 13))
    add(pg(f'''
    {lab('Tus 12 semanas', 'calendario')}
    <h2>Las noches que dormiste bien</h2>
    <p>Pasa aquí lo que marcaste al final de cada recorrido. Una casilla por noche buena.</p>
    <div class="doce">{filas}</div>
    '''))

    # caja de herramientas
    marca_ix('Tu caja de herramientas', 'caja')
    reglas = ''.join(f'<div class="rg"><span class="rg-n">{c["n"]:02d}</span><p><em>{e(c["regla"])}</em></p></div>' for c in CAPITULOS)
    add(pg(f'''
    {lab('Tu caja de herramientas', 'carta')}
    <h2>Doce reglas, una por semana</h2>
    <p>Las mías. Al lado de cada una, pon la tuya si la escribiste distinta.</p>
    <div class="reglas">{reglas}</div>''', pid='caja'))

    # cartas de rescate
    marca_ix('Tus cartas de rescate', 'cartas')
    def carta(i, t, txt):
        cuerpo = f'<p>{e(txt)}</p>' if txt else f'{tx()}{tx()}{tx()}'
        return f'<div class="carta"><p class="ca-n">0{i}</p><p class="ca-t">{e(t)}</p>{cuerpo}<img class="ca-ll" src="{M}llama-oro.png"><p class="ca-m">Lo que no te deja dormir · Ani Martínez</p></div>'
    add(pg(f'''
    {lab('Tus cartas de rescate', 'carta')}
    <h2>Para recortar y tener a mano</h2>
    <div class="cartas">{''.join(carta(i+1, t, x) for i, (t, x) in enumerate(CARTAS[:4]))}</div>''', pid='cartas'))
    add(pg(f'''
    <div class="cartas">{''.join(carta(i+5, t, x) for i, (t, x) in enumerate(CARTAS[4:]))}</div>
    <p class="mu">Las dos últimas son tuyas: la 07, con tu regla favorita; la 08, con la frase que más te sostuvo.</p>'''))

    # afiche
    marca_ix('El afiche de tu mesa de noche', 'afiche')
    add(pg(f'''
    <div class="afiche">
     <img class="af-ll" src="{M}antorcha-oro.png">
     <p class="af-k">Para tu mesa de noche</p>
     <p class="af-t">{AFICHE["titulo"]}</p>
     {''.join(f'<div class="af-p"><span>{i+1}</span><div><p class="af-pt">{e(t)}</p><p>{e(d)}</p></div></div>' for i,(t,d) in enumerate(AFICHE["pasos"]))}
     <p class="af-f">Ani Martínez · método TamÍm</p>
    </div>''', pid='afiche'))

    # soluciones
    marca_ix('Las respuestas de los juegos', 'soluciones')
    sol = ''
    for j in (1, 2, 5):
        J = JUEGOS[j]
        sol += f'<div class="sol"><p class="so-t">Juego {j} · {e(J["titulo"])}</p>' + ''.join(
            f'<p><span class="jn">{i+1}</span>{e(J["items"][i])} <em>· {e(s)}</em></p>' for i, s in enumerate(J['sol'])) + '</div>'
    add(pg(f'''
    {lab('Las respuestas', 'juega')}
    <h2>Para mirar después de jugar</h2>
    {sol}
    <p class="mu">En el juego 1 no hay una sola respuesta: muchas escenas tocan dos dimensiones. Eso es justamente lo que el libro trabaja.</p>''', pid='soluciones'))

    # si quieres hacerlo acompañada
    marca_ix('Si quieres hacerlo acompañada', 'circulo')
    add(pg(f'''
    <div class="circ">
     <img class="ci-arco" src="{M}arco-con-llama-oro.png">
     {lab('Si quieres hacerlo acompañada', None)}
     <h2>El Círculo de Restauración</h2>
     {ps([
      'Este libro es el camino que puedes recorrer sola. Hay mujeres que quieren ir más profundo y más rápido, conmigo al lado. Para ellas está el Círculo de Restauración.',
      'Son diez semanas y cinco sesiones uno a uno conmigo, una cada dos semanas, con el método TamÍm completo: espíritu, alma y cuerpo, medido con tu radiografía al entrar, a la mitad y al salir.',
      'Trabajo con pocas mujeres por vez, y entran por postulación: elijo a quienes están comprometidas y dispuestas a seguir el método al pie de la letra.'])}
     <p class="cf">En este video te explico cómo es, paso a paso:</p>
     <p class="link"><a href="https://ani-martinez.com/vsl">ani-martinez.com/vsl</a></p>
    </div>''', cls='plano', pid='circulo'))

# sobre Ani + colofón
add(pg(f'''
<div class="autora">
 <img class="au-logo" src="{M}logotipo-tinta.png">
 <p>Ani Martínez es directora teatral y creadora del método TamÍm, que integra espíritu, alma y cuerpo con Dios en el centro. Lo validó con su tutor de tesis y acompaña a mujeres a recorrerlo uno a uno.</p>
 <p>Une la Teoterapia, el psicodrama y la escucha del cuerpo. Su camino empezó en su propia historia: siete años con un diagnóstico que llamaron incurable, y una restauración que hoy enseña.</p>
 <hr class="filete">
 <p class="mu">Lo que no te deja dormir · Primera edición · 2026<br>ani-martinez.com</p>
 <img class="au-lock" src="{M}lockup-tamim-tinta.png">
</div>''', cls='plano'))

# ====================================================================== índice
def indice_html():
    items = ''
    for texto, pid, nivel in INDICE:
        items += f'<p class="ix ix{nivel}"><a href="#{pid}">{e(texto)}</a></p>'
    return pg(f'{lab("Índice", "lee")}<h2>Lo que hay en este libro</h2><div class="indice">{items}</div>', pid='indice')

CSS = open(os.path.join(BASE, 'libro.css')).read().replace('%F%', F).replace('%M%', M)
cuerpo = ''.join(paginas).replace('%%INDICE%%', indice_html())
doc = f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>Lo que no te deja dormir</title>
<meta name="author" content="Ani Martínez"><style>{CSS}</style></head><body>{cuerpo}</body></html>'''
open(os.path.join(BASE, 'libro.html'), 'w').write(doc)

if '--pdf' in sys.argv:
    import weasyprint
    out = sys.argv[sys.argv.index('--pdf') + 1] if len(sys.argv) > sys.argv.index('--pdf') + 1 else 'lo-que-no-te-deja-dormir.pdf'
    weasyprint.HTML(string=doc).write_pdf(out, pdf_forms=True)
    print('PDF', out)
