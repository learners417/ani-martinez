# -*- coding: utf-8 -*-
"""Las páginas del embudo low de Ani Martínez: landing, encabezado del pago, sesión (oferta única) + pie, agenda y gracias.
Cada archivo es autocontenido (como los de Rosana) y va en un bloque «Código personalizado» de GHL."""
import os, sys

CDN = 'https://ani-martinez.vercel.app/'
IMG = CDN + 'libro/img/'
MARCA = CDN + 'marca/'
DOM = 'https://ani-martinez.com'
URL = {
 'pago': DOM + '/libro-pago',
 'sesion': DOM + '/libro-sesion',
 'agenda': DOM + '/libro-agenda',
 'gracias': DOM + '/libro-gracias',
 'pdf': CDN + 'libro/d/lfjc5z2sokpm/vuelve-a-dormir-12-semanas.pdf',
 'circulo': DOM + '/vsl',
}
CAL_ID = 'JdRaWLq4TpCIbHNgLGuG'
FOTO = '%%FOTO%%'

def I(k, s=24, c='currentColor', w=1.5):
    p = {
     'flecha': '<path d="M5 12h14M13 6l6 6-6 6"/>',
     'luna': '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
     'libro': '<path d="M3 5.5c3-1.4 6-1.4 9 .5 3-1.9 6-1.9 9-.5V19c-3-1.4-6-1.4-9 .5-3-1.9-6-1.9-9-.5z"/><path d="M12 6v13.5"/>',
     'dado': '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r=".9"/><circle cx="15" cy="9" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="9" cy="15" r=".9"/><circle cx="15" cy="15" r=".9"/>',
     'termo': '<path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
     'carta': '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/>',
     'mesa': '<path d="M3 17a9 9 0 0 1 18 0"/><path d="M2 17h20"/><path d="M12 4v2.5M5.6 6.6l1.7 1.7M18.4 6.6l-1.7 1.7"/>',
     'cal': '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
     'check': '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12.5l3 3 5-6"/>',
     'pluma': '<path d="M4 20l1.2-4.4L15.8 5a1.8 1.8 0 0 1 2.6 0l.6.6a1.8 1.8 0 0 1 0 2.6L8.4 18.8z"/><path d="M14 6.8l3.2 3.2"/>',
     'llama': '<path d="M12 3c1.6 2.8 4.2 4.8 4.2 8.3a4.2 4.2 0 0 1-8.4 0C7.8 7.8 10.4 5.8 12 3z"/>',
     'corazon': '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z"/>',
     'mano': '<path d="M3 9c3-3 6 3 9 0s6-3 9 0"/><path d="M3 15c3-3 6 3 9 0s6-3 9 0"/>',
     'video': '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/>',
     'descarga': '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>',
     'reloj': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    }[k]
    return (f'<svg viewBox="0 0 24 24" class="ic" width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{p}</svg>')

CSS = '''html,body{margin:0;background:#F6F2EA}
#alb{font-variant-numeric:lining-nums;--cr:#F6F2EA;--li:#EFEADF;--pa:#FBF8F2;--ti:#242018;--no:#1A1815;--oro:#C3A878;--orp:#8C7345;--orc:#D5BE9C;--mu:#5E5547;--fi:#DCCDAE;
 font-family:"Lora",Georgia,serif;color:var(--ti);background:var(--cr);font-size:19px;line-height:1.62;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
#alb *{box-sizing:border-box;margin:0;padding:0}
#alb img{display:block;max-width:100%;height:auto}
#alb a{color:inherit}
#alb .wrap{max-width:1080px;margin:0 auto;padding:0 22px}
#alb .narrow{max-width:720px}
#alb .sec{padding:78px 0}
#alb .lino{background:var(--li)}
#alb .noche{background:var(--no);color:var(--orc)}
#alb .lab{display:flex;align-items:center;gap:10px;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--orp);margin-bottom:18px}
#alb .noche .lab{color:var(--oro)}
#alb .lab .ic{width:19px;height:19px}
#alb h1,#alb h2,#alb .serif{font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;font-variant-numeric:lining-nums}
#alb h1{font-size:clamp(46px,11.5vw,82px);line-height:1;letter-spacing:-.01em}
#alb h1 em,#alb h2 em{font-style:italic;color:var(--orp)}
#alb h2{font-size:clamp(34px,8vw,54px);line-height:1.06;margin-bottom:22px}
#alb .noche h2{color:#F6F2EA}
#alb .noche h2 em{color:var(--orc)}
#alb h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:26px;line-height:1.15}
#alb p{margin-bottom:18px}
#alb .lead{font-size:clamp(20px,2.6vw,23px);line-height:1.58;color:#3A332A;max-width:660px}
#alb .noche .lead{color:#E9DDC6}
#alb .mu{color:var(--mu)}
#alb em{font-style:italic}
#alb .ic{width:26px;height:26px;flex:none}
/* barra */
#alb .bar{display:flex;justify-content:center;align-items:center;padding:22px 22px 18px;max-width:1080px;margin:0 auto}
#alb .bar img{height:24px;width:auto}
#alb .bar span{display:none;font-size:14px;letter-spacing:.18em;color:var(--orp);white-space:nowrap}
/* botón */
#alb .cta{display:inline-flex;align-items:center;justify-content:center;gap:12px;background:var(--ti);color:#F6F2EA;text-decoration:none;font-family:"Lora",Georgia,serif;font-size:21px;line-height:1.2;
 padding:22px 28px;border-radius:14px;width:100%;min-height:66px;text-align:center;box-shadow:0 16px 34px -18px rgba(36,32,24,.7);transition:transform .2s,background .2s;letter-spacing:.01em}
#alb .cta:hover{background:#3A332A;transform:translateY(-2px)}
#alb .cta .ic{width:24px;height:24px}
#alb .noche .cta{background:#F6F2EA;color:var(--ti)}
#alb .micro{font-size:16px;letter-spacing:.04em;color:var(--mu);margin-top:14px}
#alb .noche .micro{color:var(--oro)}
/* héroe */
#alb .hero{padding:24px 0 74px}
#alb .hgrid{display:grid;gap:40px;align-items:center}
#alb .eyb{display:inline-block;font-size:15px;letter-spacing:.18em;color:var(--orp);border:1px solid var(--fi);border-radius:999px;padding:8px 16px;margin-bottom:22px}
#alb .hero .lead{margin:24px 0 30px}
#alb .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
#alb .chip{display:inline-flex;align-items:center;gap:8px;background:var(--pa);border:1px solid var(--fi);border-radius:999px;padding:9px 16px;font-size:16px}
#alb .chip .ic{width:19px;height:19px;color:var(--orp)}
/* libro 3D */
#alb .bk3{--w:250px;--h:353px;--d:18px;position:relative;width:var(--w);height:var(--h);margin:10px auto 36px;perspective:1700px}
#alb .bk{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateY(-26deg) rotateX(5deg);animation:albflot 7s ease-in-out infinite}
#alb .bkf,#alb .bkb{position:absolute;inset:0;border-radius:3px 9px 9px 3px}
#alb .bkf{background:var(--cover) center/cover no-repeat;transform:translateZ(calc(var(--d) / 2));box-shadow:inset 6px 0 9px -5px rgba(0,0,0,.25),0 0 0 1px #D9CBAE}
#alb .bkf::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.22) 34%,rgba(255,255,255,0) 58%,rgba(0,0,0,.06) 100%)}
#alb .bkb{background:#E6DCC8;transform:translateZ(calc(var(--d) / -2)) rotateY(180deg)}
#alb .bks{position:absolute;top:0;left:calc(var(--d) / -2);width:var(--d);height:100%;transform:rotateY(-90deg);background:linear-gradient(90deg,#D9CBAE,#EFE6D3 45%,#E2D5BA)}
#alb .bkp{position:absolute;top:4px;right:calc(var(--d) / -2);width:var(--d);height:calc(100% - 8px);transform:rotateY(90deg);background:repeating-linear-gradient(90deg,#FFFCF6 0 2px,#E8DFCF 2px 3px)}
#alb .bksh{position:absolute;left:8%;right:-4%;bottom:-28px;height:34px;border-radius:50%;background:radial-gradient(closest-side,rgba(80,60,25,.28),rgba(80,60,25,0));filter:blur(4px)}
@keyframes albflot{0%,100%{translate:0 0}50%{translate:0 -8px}}
/* escena */
#alb .quote{background:var(--no);color:#F6F2EA;border-radius:22px;padding:36px 30px;margin:32px 0}
#alb .quote p{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(30px,6.4vw,42px);line-height:1.12;margin-bottom:14px}
#alb .quote span{font-size:14px;letter-spacing:.18em;color:var(--oro)}
/* rasgos */
#alb .feat{display:grid;gap:14px;margin:30px 0 18px}
#alb .fi{display:flex;gap:16px;align-items:flex-start;background:var(--pa);border:1px solid var(--fi);border-radius:16px;padding:22px}
#alb .lino .fi{background:var(--pa)}
#alb .fi .ic{width:30px;height:30px;color:var(--orp);margin-top:2px}
#alb .fi h3{margin-bottom:4px}
#alb .fi p{margin:0;color:#4A4236;font-size:18px}
/* semana */
#alb .spread{border-radius:14px;overflow:hidden;box-shadow:0 34px 64px -30px rgba(70,50,20,.45);background:#CDBF9F;margin:8px 0 16px}
#alb .cap{font-size:17px;color:var(--mu);text-align:center;margin-bottom:34px}
#alb .strip{display:grid;grid-auto-flow:column;grid-auto-columns:46%;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px;-webkit-overflow-scrolling:touch}
#alb .th{scroll-snap-align:start}
#alb .th img{border-radius:10px;box-shadow:0 14px 28px -18px rgba(70,50,20,.6);border:1px solid var(--fi)}
#alb .th p{font-size:16px;color:var(--orp);margin:10px 0 0;text-align:center}
/* dimensiones */
#alb .dims{display:grid;gap:14px;margin-top:30px}
#alb .dim{background:var(--pa);border-radius:20px;padding:24px 22px;border:1px solid var(--fi);position:relative}
#alb .dim .n{font-family:"Cormorant Garamond",Georgia,serif;font-size:44px;line-height:1;color:var(--oro);position:absolute;right:22px;top:18px}
#alb .dim .k{font-size:14px;letter-spacing:.16em;color:var(--orp);text-transform:uppercase;margin-bottom:6px}
#alb .dim h3{font-size:30px;margin-bottom:8px}
#alb .dim p{font-size:18px;line-height:1.5;margin:0;color:#4A4236}
#alb .tres{display:block;margin:6px auto 0;width:min(340px,86%)}
/* camino */
#alb .path{display:grid;gap:12px;margin-top:30px}
#alb .st{display:flex;align-items:center;gap:18px;background:var(--pa);border:1px solid var(--fi);border-radius:16px;padding:18px 20px}
#alb .st .lt{flex:none;width:56px;height:56px;border-radius:50%;border:1px solid var(--oro);color:var(--orp);display:flex;align-items:center;justify-content:center;font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;font-variant-numeric:lining-nums}
#alb .st h3{font-size:25px}
#alb .st .dd{font-size:15px;letter-spacing:.06em;color:var(--orp)}
#alb .st p{margin:2px 0 0;font-size:17px;color:#4A4236;line-height:1.4}
/* radiografía */
#alb .tcard{background:var(--pa);color:var(--ti);border-radius:22px;padding:22px 16px;margin-top:30px;box-shadow:0 34px 64px -34px rgba(0,0,0,.7)}
#alb .trow{display:grid;grid-template-columns:1fr repeat(3,56px);gap:8px;align-items:center;padding:12px 4px;border-bottom:1px dashed var(--fi)}
#alb .trow:last-child{border-bottom:0}
#alb .trow.h{font-size:14px;letter-spacing:.06em;color:var(--orp);text-align:center;border-bottom:1px solid var(--oro)}
#alb .trow.h span:first-child{text-align:left}
#alb .trow span{font-size:17px;line-height:1.3}
#alb .trow span small{display:block;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:var(--orp)}
#alb .tb{height:44px;border:1px solid var(--oro);border-radius:9px;background:#fff}
/* autora */
#alb .agrid{display:grid;gap:30px}
#alb .afoto{border-radius:20px;overflow:hidden;aspect-ratio:4/5;background:var(--li)}
#alb .afoto img{width:100%;height:100%;object-fit:cover}
#alb .aq{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(30px,6vw,40px);line-height:1.14;color:var(--orp)}
#alb .sig{font-size:14px;letter-spacing:.18em;color:var(--orp);margin-top:14px}
/* para quién */
#alb .who{display:grid;gap:12px;margin-top:26px}
#alb .wi{display:flex;gap:14px;align-items:flex-start;font-size:20px;line-height:1.45;background:var(--pa);border:1px solid var(--fi);border-radius:16px;padding:20px}
#alb .wi .ic{color:var(--orp);width:28px;height:28px;margin-top:1px}
/* oferta */
#alb .offer{background:var(--pa);border-radius:24px;padding:32px 22px;box-shadow:0 44px 84px -44px rgba(70,50,20,.5);border:1px solid var(--fi);display:grid;gap:26px;align-items:center}
#alb .offer .bk3{--w:190px;--h:268px;--d:14px;margin:6px auto 26px}
#alb .ot{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(32px,6.4vw,42px);line-height:1.05}
#alb .os{font-size:15px;letter-spacing:.12em;color:var(--orp);margin:10px 0 20px}
#alb .inc{list-style:none;display:grid;gap:11px;margin-bottom:24px}
#alb .inc li{display:flex;gap:12px;align-items:flex-start;font-size:18px;line-height:1.4}
#alb .inc .ic{width:24px;height:24px;color:var(--orp)}
#alb .price{font-family:"Cormorant Garamond",Georgia,serif;font-size:64px;line-height:1;margin-bottom:8px;font-variant-numeric:lining-nums}
#alb .price small{font-family:"Lora",Georgia,serif;font-size:20px;color:var(--mu)}
#alb .pnote{font-size:17px;color:var(--mu);margin-bottom:22px}
/* preguntas */
#alb details{background:var(--pa);border:1px solid var(--fi);border-radius:16px;padding:0 20px;margin-bottom:12px}
#alb summary{list-style:none;cursor:pointer;font-size:20px;line-height:1.35;padding:20px 34px 20px 0;position:relative}
#alb summary::-webkit-details-marker{display:none}
#alb summary::after{content:"+";position:absolute;right:0;top:14px;font-size:30px;color:var(--orp)}
#alb details[open] summary::after{content:"–"}
#alb details p{font-size:18px;color:#4A4236;padding-bottom:20px;margin:0}
/* cierre */
#alb .final{text-align:center}
#alb .final .lead{margin:0 auto 30px}
#alb .final .arco{width:180px;margin:0 auto 26px;opacity:.9}
#alb .foot{text-align:center;font-size:14px;letter-spacing:.12em;color:var(--mu);padding:36px 22px}
/* páginas del recorrido */
#alb .conf{display:flex;gap:16px;align-items:center;background:var(--pa);border:1px solid var(--fi);border-radius:22px;padding:22px 20px;margin:12px 0 30px}
#alb .conf .ic{width:44px;height:44px;color:var(--orp)}
#alb .conf b{display:block;font-weight:400;font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;line-height:1.1}
#alb .conf span{font-size:18px;color:var(--mu)}
#alb .once{display:inline-block;font-size:14px;letter-spacing:.18em;background:var(--ti);color:#F6F2EA;border-radius:8px;padding:8px 14px;margin-bottom:18px}
#alb .steps{display:grid;gap:14px;margin:28px 0}
#alb .step{display:flex;gap:16px;align-items:flex-start;background:var(--pa);border-radius:16px;padding:20px;border:1px solid var(--fi)}
#alb .sn{flex:none;width:46px;height:46px;border-radius:50%;border:1px solid var(--oro);color:var(--orp);font-family:"Cormorant Garamond",Georgia,serif;font-size:24px;display:flex;align-items:center;justify-content:center;font-variant-numeric:lining-nums}
#alb .step h3{font-size:24px;margin-bottom:4px}
#alb .step p{margin:0;font-size:18px;color:#4A4236}
#alb .acu{background:var(--no);color:#F6F2EA;border-radius:22px;padding:26px 22px;margin:8px 0 28px}
#alb .acu .lab{color:var(--oro)}
#alb .acu ol{list-style:none;display:grid;gap:10px;counter-reset:a}
#alb .acu li{counter-increment:a;display:flex;gap:12px;align-items:center;border:1px solid rgba(213,190,156,.35);border-radius:12px;padding:13px 14px;font-size:18px}
#alb .acu li::before{content:counter(a);flex:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--orc);color:var(--orc);display:flex;align-items:center;justify-content:center;font-family:"Cormorant Garamond",Georgia,serif;font-size:20px}
#alb .cred{border:1px dashed var(--oro);border-radius:22px;padding:22px;margin-bottom:28px;background:var(--pa)}
#alb .cred p{margin:0;font-size:19px}
#alb .calw{background:var(--pa);border-radius:22px;border:1px solid var(--fi);padding:10px;min-height:120px}
#alb .no{display:block;text-align:center;margin:26px 0 6px;font-size:18px;color:var(--mu);text-decoration:underline;text-underline-offset:4px}
#alb .firma{margin-top:30px;font-family:"Cormorant Garamond",Georgia,serif;font-size:28px}
#alb .firma span{display:block;font-family:"Lora",Georgia,serif;font-size:14px;letter-spacing:.16em;color:var(--orp);margin-top:4px}
#alb .ph{display:flex;gap:18px;align-items:center;background:var(--pa);border:1px solid var(--fi);border-radius:22px;padding:16px 18px;margin-bottom:18px}
#alb .ph img{width:78px;border-radius:3px 7px 7px 3px;box-shadow:0 10px 20px -10px rgba(70,50,20,.5)}
#alb .ph b{display:block;font-weight:400;font-family:"Cormorant Garamond",Georgia,serif;font-size:27px;line-height:1.15}
#alb .ph span{font-size:17px;color:var(--mu)}
#alb .rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
#alb .rv.in{opacity:1;transform:none}
@media (min-width:760px){
 #alb{font-size:20px}
 #alb .sec{padding:108px 0}
 #alb .hgrid{grid-template-columns:1.15fr .85fr}
 #alb .cta{width:auto}
 #alb .offer .cta,#alb .dl{width:100%}
 #alb .bk3{--w:300px;--h:424px;--d:22px}
 #alb .feat{grid-template-columns:1fr 1fr}
 #alb .strip{grid-auto-flow:row;grid-template-columns:repeat(6,1fr);grid-auto-columns:auto;overflow:visible}
 #alb .dims{grid-template-columns:repeat(3,1fr)}
 #alb .path{grid-template-columns:1fr 1fr 1fr}
 #alb .trow{grid-template-columns:1fr repeat(3,90px);padding:14px 10px}
 #alb .tcard{padding:28px 30px}
 #alb .agrid{grid-template-columns:.8fr 1.2fr;align-items:center}
 #alb .who{grid-template-columns:1fr 1fr}
 #alb .offer{grid-template-columns:.8fr 1.2fr;padding:46px}
 
 #alb .bar{justify-content:space-between}
 #alb .bar span{display:inline}
}
@media (prefers-reduced-motion:reduce){#alb .bk{animation:none}#alb .rv{opacity:1;transform:none;transition:none}}'''

JS = '''<script>(function(){var r=document.getElementById('alb');if(!r)return;var l=r.querySelectorAll('.rv');
if(!('IntersectionObserver' in window)){l.forEach(function(e){e.classList.add('in')});return}
var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
l.forEach(function(e){o.observe(e)});setTimeout(function(){l.forEach(function(e){e.classList.add('in')})},4000)})();</script>'''

def doc(titulo, cuerpo, extra_js='', noindex=False):
    ni = '<meta name="robots" content="noindex">' if noindex else ''
    return (f'<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{titulo}</title>{ni}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            f'<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">'
            f'<style>{CSS}</style></head><body><div id="alb" style="--cover:url({IMG}cover.webp)">{cuerpo}</div>{JS}{extra_js}</body></html>')

BAR = f'<div class="bar"><img src="{MARCA}logotipo-tinta.png" alt="Ani Martínez" width="210" height="24"><span>MÉTODO TAMÍM</span></div>'
LIBRO3D = '<div class="bk3" aria-hidden="true"><div class="bk"><div class="bkb"></div><div class="bkp"></div><div class="bks"></div><div class="bkf"></div></div><div class="bksh"></div></div>'
CTA = f'<a class="cta" href="{URL["pago"]}" target="_top">Quiero volver a dormir{I("flecha")}</a>'
FOOT = '<p class="foot">ANI MARTÍNEZ · MÉTODO TAMÍM · ani-martinez.com</p>'

def landing():
    feats = [('luna', '84 invitaciones', 'Una por noche, de 5 a 10 minutos, para hacer en tu vida real.'),
             ('libro', '12 capítulos', 'Uno por semana: una historia mía, lo que hay debajo y tu regla.'),
             ('dado', '6 juegos', 'Para entender tu noche sin culparte.'),
             ('termo', 'Tu descanso, medido', 'Las noches 1, 43 y 84, con los mismos seis números.'),
             ('carta', '8 cartas de rescate', 'Para tener a mano si te despiertas de madrugada.'),
             ('mesa', 'Un afiche para tu mesa de noche', 'Cuatro pasos para las tres de la mañana.')]
    feat = ''.join(f'<div class="fi rv">{I(k)}<div><h3>{t}</h3><p>{d}</p></div></div>' for k, t, d in feats)
    thumbs = ''.join(f'<div class="th"><img src="{IMG}{f}.webp" alt="{a} del libro" width="320" loading="lazy"><p>{a}</p></div>'
                     for f, a in [('cap', 'El capítulo'), ('frase', 'La frase'), ('juego', 'El juego'), ('radio', 'Tu radiografía'), ('cartas', 'Tus cartas'), ('afiche', 'El afiche')])
    dims = [('1', 'La raíz', 'Espíritu', 'Tu relación con Dios, con tus palabras. Lo primero que nadie miró.'),
            ('2', 'La mente que no se apaga', 'Alma', 'Tus pensamientos, tus emociones y lo que cargas sin decir.'),
            ('3', 'El cuerpo que descansa', 'Cuerpo', 'Lo que comes, la luz que ves, la hora a la que cenas.')]
    dimh = ''.join(f'<div class="dim rv"><span class="n">{n}</span><p class="k">{k}</p><h3>{d}</h3><p>{t}</p></div>' for n, k, d, t in dims)
    path = [('1', 'Espíritu', 'Semanas 1 a 4', 'Dejas de pelear sola con la noche.'),
            ('2', 'Alma', 'Semanas 5 a 8', 'Dejas de fingir que estás bien.'),
            ('3', 'Cuerpo', 'Semanas 9 a 12', 'Tu cuerpo vuelve a saber dormir.')]
    pathh = ''.join(f'<div class="st rv"><span class="lt">{n}</span><div><h3>{t}</h3><span class="dd">{d}</span><p>{x}</p></div></div>' for n, t, d, x in path)
    filas = [('Espíritu', 'Paz al acostarte'), ('', 'Cercanía con Dios'), ('Alma', 'Calma de tu mente de noche'),
             ('', 'Cómo te hablas a ti misma'), ('Cuerpo', 'Cómo duermes'), ('', 'Energía al despertar')]
    trows = ''.join(f'<div class="trow"><span>{"<small>"+d+"</small>" if d else ""}{t}</span><i class="tb"></i><i class="tb"></i><i class="tb"></i></div>' for d, t in filas)
    who = ['Sostienes todo por fuera y a la noche la cabeza no se apaga.', 'Te despiertas de madrugada y te cuesta volver a dormir.',
           'Ya probaste muchas cosas y vuelves a lo de antes.', 'Quieres entender qué te pasa, a tu ritmo y con Dios en el centro.']
    whoh = ''.join(f'<div class="wi rv">{I("check")}<span>{w}</span></div>' for w in who)
    inc = ['84 invitaciones, una para cada noche', '12 capítulos, uno por semana', '6 juegos con sus respuestas',
           'Tu radiografía de las noches 1, 43 y 84', '8 cartas de rescate y el afiche de tu mesa de noche', '139 páginas para completar en la pantalla o imprimir']
    inch = ''.join(f'<li>{I("check")}<span>{x}</span></li>' for x in inc)
    faq = [('¿Trae una rutina fija para dormir?', 'Trae algo que te sirve más: una invitación por noche para mirar qué te quita el sueño y un capítulo por semana para entender por qué. Tu ritual lo escribes tú, la última semana, con lo que descubriste.'),
           ('¿Cuánto tiempo me lleva?', 'De 5 a 10 minutos por noche, y media hora la noche que cierras la semana con el capítulo.'),
           ('¿Cómo lo recibo?', 'Apenas pagas, te llega a tu correo. Es un PDF que completas en la pantalla o imprimes.'),
           ('¿Y si una noche no puedo?', 'Sigues la noche siguiente. No se empieza de nuevo el lunes.'),
           ('¿Es religioso?', 'Es una relación, no una religión. El espíritu es una de las tres dimensiones del método, y el libro te invita a hablar con Dios con tus palabras, sin fórmulas.'),
           ('¿Reemplaza a mi médico o mi tratamiento?', 'No. Es un libro para mirar tu noche en espíritu, alma y cuerpo. Si tienes un diagnóstico o tomas medicación, sigue con quien te atiende y no cambies nada por tu cuenta.'),
           ('¿Y si quiero hacerlo acompañada?', 'Al final del libro te cuento cómo es el Círculo de Restauración: doce semanas, conmigo, uno a uno.')]
    faqh = ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faq)
    foto = (f'<div class="afoto rv"><img src="{FOTO}" alt="Ani Martínez" loading="lazy"></div>' if FOTO and not FOTO.startswith('%%')
            else f'<div class="rv"><p class="aq">«Somos tres. A mí me trataron una sola parte.»</p><p class="sig">ANI MARTÍNEZ</p></div>')
    c = f'''{BAR}
<section class="hero"><div class="wrap hgrid">
 <div><span class="eyb">LIBRO DIGITAL · 12 SEMANAS</span>
  <h1>Un libro para volver a <em>dormir de verdad</em></h1>
  <p class="lead">84 noches, una invitación chica por noche, en tu vida real. Lo escribí para las mujeres que sostienen todo por fuera y a las tres de la mañana siguen despiertas.</p>
  {CTA}<p class="micro">USD 27 · lo recibes en tu correo al instante</p>
  <div class="chips"><span class="chip">{I("luna")}84 noches</span><span class="chip">{I("libro")}12 capítulos</span><span class="chip">{I("dado")}6 juegos</span></div>
 </div>
 <div>{LIBRO3D}</div>
</div></section>

<section class="sec lino"><div class="wrap narrow">
 <p class="lab">{I("luna")}Lo que se repite</p>
 <h2 class="rv">Son las tres de la mañana y estás despierta</h2>
 <p class="lead rv">La casa en silencio, el teléfono boca abajo para no ver la hora y la cabeza encendida como si fuera mediodía. Repasas la reunión de mañana. Haces la cuenta de cuántas horas te quedan. Y al otro día te levantas, diriges, decides y sostienes. Nadie lo nota.</p>
 <div class="quote rv"><p>Que nadie lo note no significa que estés bien.</p><span>ANI MARTÍNEZ</span></div>
 <p class="lead rv">No te falta voluntad ni información. Lo que pasa a las tres tiene un orden, y se puede mirar. Para eso escribí este libro: para que recuperes tus noches una por vez.</p>
</div></section>

<section class="sec"><div class="wrap">
 <p class="lab">{I("libro")}El libro</p>
 <h2 class="rv">Un libro para hacer, no para leer y guardar</h2>
 <div class="feat">{feat}</div>
 <p class="mu rv">Son 139 páginas que completas en la pantalla o imprimes.</p>
</div></section>

<section class="sec lino"><div class="wrap">
 <p class="lab">{I("cal")}Por dentro</p>
 <h2 class="rv">Así es una semana</h2>
 <div class="spread rv"><img src="{IMG}spread.webp" alt="Una semana del libro: siete noches con su invitación y su casilla" width="1126" loading="lazy"></div>
 <p class="cap rv">Cada noche, una invitación con su casilla. La séptima, cierras la semana con el capítulo.</p>
 <div class="strip">{thumbs}</div>
</div></section>

<section class="sec"><div class="wrap">
 <p class="lab">{I("llama")}El método</p>
 <h2 class="rv">Te trataron <em>una sola parte</em></h2>
 <p class="lead rv">Pastillas, terapia, tés, aplicaciones para dormir: casi todo lo que probaste trabajó una parte, la mente. Pero somos espíritu, alma y cuerpo, los tres al mismo tiempo. En el libro trabajas los tres, en orden.</p>
 <div class="dims">{dimh}</div>
</div></section>

<section class="sec lino"><div class="wrap">
 <p class="lab">{I("flecha")}El camino</p>
 <h2 class="rv">Doce semanas, tres partes</h2>
 <div class="path">{pathh}</div>
</div></section>

<section class="sec noche"><div class="wrap narrow">
 <p class="lab">{I("termo")}Medible</p>
 <h2 class="rv">Tu cambio, en <em>números tuyos</em></h2>
 <p class="lead rv">La noche 1 haces tu radiografía: seis números del 0 al 10, dos por dimensión. La repites la noche 43 y la noche 84. No te lo cuento yo: lo ves tú.</p>
 <div class="tcard rv"><div class="trow h"><span>Tu radiografía</span><span>Noche 1</span><span>Noche 43</span><span>Noche 84</span></div>{trows}</div>
</div></section>

<section class="sec"><div class="wrap agrid">
 {foto}
 <div class="rv"><p class="lab">{I("pluma")}Quién lo escribió</p>
  <h2>Ani Martínez</h2>
  <p>Directora teatral y creadora del método TamÍm, que integra espíritu, alma y cuerpo con Dios en el centro. Lo validó con su tutor de tesis y hoy acompaña a mujeres a recorrerlo, uno a uno.</p>
  <p>Pasé siete años con un diagnóstico que llamaron incurable y siete pastillas por día. Por fuera trabajaba, sonreía y cumplía. Hoy duermo, me levanto y no finjo. Este libro es el camino que recorrí, noche por noche.</p></div>
</div></section>

<section class="sec lino"><div class="wrap">
 <p class="lab">{I("check")}Para quién es</p>
 <h2 class="rv">Es para ti si…</h2>
 <div class="who">{whoh}</div>
</div></section>

<section class="sec" id="libro"><div class="wrap">
 <div class="offer rv">
  <div>{LIBRO3D}</div>
  <div><p class="ot">Vuelve a dormir en 12 semanas</p><p class="os">LIBRO DIGITAL · 139 PÁGINAS · ANI MARTÍNEZ</p>
   <ul class="inc">{inch}</ul>
   <p class="price">USD 27</p><p class="pnote">Pagas con tarjeta, en una sola vez. Lo recibes en tu correo al instante.</p>
   {CTA}</div>
 </div>
</div></section>

<section class="sec lino"><div class="wrap narrow">
 <p class="lab">{I("pluma")}Preguntas</p>
 <h2 class="rv">Lo que suelen preguntarme</h2>
 {faqh}
</div></section>

<section class="sec noche final"><div class="wrap narrow">
 <img class="arco" src="{MARCA}arco-con-llama-oro.png" alt="" width="180">
 <h2 class="rv">Tu noche 1 puede ser hoy</h2>
 <p class="lead rv">Una invitación chica, cinco minutos, y la casilla marcada.</p>
 <a class="cta" href="{URL["pago"]}" target="_top">Quiero volver a dormir{I("flecha")}</a><p class="micro">USD 27 · libro digital</p>
</div></section>
{FOOT}'''
    return doc('Vuelve a dormir en 12 semanas · el libro de Ani Martínez', c)

def pago():
    c = f'''{BAR}
<section style="padding:6px 0 26px"><div class="wrap narrow">
 <div class="ph"><img src="{IMG}cover.webp" alt="Vuelve a dormir en 12 semanas" width="78"><div><b>Vuelve a dormir en 12 semanas</b><span>Libro digital · 139 páginas · lo recibes en tu correo al instante.</span></div></div>
 <p class="mu" style="font-size:17px;margin:0">Pagas con tarjeta, en una sola vez. Completa tus datos aquí abajo.</p>
</div></section>'''
    return doc('Tu libro · Vuelve a dormir', c, noindex=True)

def sesion():
    c = f'''{BAR}
<section style="padding:6px 0 0"><div class="wrap narrow">
 <div class="conf">{I("check")}<div><b>Listo, tu libro va en camino</b><span>Te llega a tu correo en unos minutos.</span></div></div>
 <span class="once">UNA SOLA VEZ</span>
 <h1 style="font-size:clamp(42px,10vw,66px);margin-bottom:18px">Tu primera sesión <em>conmigo</em></h1>
 <p class="lead">45 minutos por videollamada para mirar juntas tu noche en espíritu, alma y cuerpo, y salir con un plan para las próximas dos semanas. Esta propuesta aparece solo ahora.</p>
 <div class="steps">
  <div class="step"><span class="sn">1</span><div><h3>Antes</h3><p>Me mandas tu radiografía de la noche 1 y tu mapa de la noche. Así llego a la sesión sabiendo de ti.</p></div></div>
  <div class="step"><span class="sn">2</span><div><h3>En la sesión</h3><p>Miramos juntas en qué dimensión se te va el descanso, espíritu, alma o cuerpo, y qué lo dispara.</p></div></div>
  <div class="step"><span class="sn">3</span><div><h3>Al final</h3><p>Te llevas tus tres acuerdos para las próximas dos semanas, escritos, con día y hora.</p></div></div>
 </div>
 <div class="acu"><p class="lab">Con lo que sales</p><ol><li>Tu primer acuerdo, con día y hora</li><li>Tu segundo acuerdo, con día y hora</li><li>Tu tercer acuerdo, con día y hora</li></ol></div>
 <div class="cred"><p><em>Y si después quieres hacer el Círculo de Restauración conmigo</em>, los USD 97 de esta sesión se descuentan si entras en los 7 días siguientes.</p></div>
 <p class="price">USD 97</p>
 <p class="pnote">Pagas con tarjeta. Completas tus datos aquí abajo y en el paso siguiente eliges tu horario. Abro cuatro horarios por semana para estas sesiones.</p>
</div></section>'''
    return doc('Tu primera sesión con Ani', c, noindex=True)

def sesion_pie():
    return f'''<div id="alb"><div class="wrap narrow" style="padding-bottom:40px">
 <a class="no" href="{URL["gracias"]}" target="_top">No, gracias. Prefiero empezar con el libro.</a>
 <p class="firma">Ani Martínez<span>MÉTODO TAMÍM</span></p>
</div></div>
<style>#alb .steps{{grid-template-columns:1fr!important}}</style>'''

def agenda():
    cal = (f'''<script>(function(){{var ID="{CAL_ID}",w=document.getElementById('cal');if(!w)return;
var q=location.search||'';var f=document.createElement('iframe');f.src='https://api.leadconnectorhq.com/widget/booking/'+ID+q;
f.style.cssText='width:100%;border:0;min-height:760px;border-radius:16px;background:#FBF8F2';f.setAttribute('scrolling','no');f.id=ID+'_alb';w.appendChild(f);
var s=document.createElement('script');s.src='https://link.msgsndr.com/js/form_embed.js';document.body.appendChild(s);}})();</script>''')
    c = f'''{BAR}
<section style="padding:6px 0 60px"><div class="wrap narrow">
 <div class="conf">{I("check")}<div><b>Listo, tu sesión está reservada</b><span>Ahora elige el día y la hora.</span></div></div>
 <p class="lab">{I("cal")}Elige tu horario</p>
 <p class="lead" style="margin-bottom:24px">45 minutos por videollamada. Apenas eliges, te llega la confirmación a tu correo con el link para entrar.</p>
 <div class="calw" id="cal"></div>
 <p class="firma">Nos vemos pronto.<span>ANI MARTÍNEZ · MÉTODO TAMÍM</span></p>
</div></section>'''
    return doc('Elige tu horario · sesión con Ani', c, extra_js=cal, noindex=True)

def gracias():
    c = f'''{BAR}
<section style="padding:6px 0 60px"><div class="wrap narrow">
 <h1 style="font-size:clamp(46px,11vw,74px);margin:10px 0 12px">Listo. <em>Ya es tuyo.</em></h1>
 <p class="lead">También te lo mandé a tu correo.</p>
 <div class="ph"><img src="{IMG}cover.webp" alt="Vuelve a dormir en 12 semanas" width="78"><div><b>Vuelve a dormir en 12 semanas</b><span>PDF · 139 páginas</span></div></div>
 <a class="cta dl" href="{URL["pdf"]}" target="_blank" rel="noopener">{I("descarga")}Descargar mi libro</a>
 <p class="lab" style="margin-top:46px">{I("luna")}Tu noche 1, hoy</p>
 <div class="steps" style="grid-template-columns:1fr">
  <div class="step"><span class="sn">1</span><div><h3>Haz tu mapa de la noche</h3><p>Página 16. Como es hoy, no como te gustaría.</p></div></div>
  <div class="step"><span class="sn">2</span><div><h3>Completa tu radiografía</h3><p>Página 18. Seis números, sin pensarlo mucho.</p></div></div>
  <div class="step"><span class="sn">3</span><div><h3>Haz tu primera invitación</h3><p>Página 21. Y marca la casilla.</p></div></div>
 </div>
 <p style="font-size:18px"><em>Si reservaste tu sesión</em>, te llega la confirmación con el link de la videollamada.</p>
 <p style="font-size:18px"><em>Si elegiste que te escriba cada noche</em>, mi primer correo te llega a las nueve de la noche.</p>
 <p class="firma">Nos vemos en la noche 1.<span>ANI MARTÍNEZ · MÉTODO TAMÍM</span></p>
</div></section>
{FOOT}'''
    return doc('Ya es tuyo · Vuelve a dormir', c, noindex=True)

def _reglas(css):
    reglas, prof, cur = [], 0, ''
    for ch in css:
        cur += ch
        if ch == '{': prof += 1
        elif ch == '}':
            prof -= 1
            if prof == 0: reglas.append(cur.strip()); cur = ''
    return reglas

def bloque(html, tambien=''):
    """Versión para pegar en un bloque «Código personalizado» de GHL: sin <html>/<head>,
    solo con el CSS que la página usa y sin el script de aparición."""
    import re
    if '<style>' not in html: return html
    s, e = html.find('<style>') + 7, html.find('</style>')
    css = html[s:e]
    cuerpo = html[html.find('<body>') + 6:html.find('</body>')].replace(JS, '')
    mira = cuerpo + tambien
    cls = set(c for u in re.findall(r'class="([^"]+)"', mira) for c in u.split())
    tags = set(re.findall(r'<([a-z0-9]+)', mira))
    def sirve(sel):
        cl = re.findall(r'\.([a-zA-Z0-9_-]+)', sel)
        if cl: return all(c in cls for c in cl)
        tg = re.findall(r'(?:^|\s|>)([a-z][a-z0-9]*)', sel.replace('#alb', ''))
        return all(t in tags or t in ('html', 'body') for t in tg)
    quedan = []
    for r in _reglas(css):
        sel = r[:r.find('{')]
        if sel.startswith('@keyframes'):
            if re.sub(r'@keyframes\s+', '', sel).strip() in css.replace(r, ''): quedan.append(r)
            continue
        if sel.startswith('@media'):
            sub = [x for x in _reglas(r[r.find('{') + 1:-1]) if any(sirve(p.strip()) for p in x[:x.find('{')].split(','))]
            if sub: quedan.append(sel + '{' + ''.join(sub) + '}')
            continue
        ps = [p.strip() for p in sel.split(',') if sirve(p.strip())]
        if ps: quedan.append(','.join(ps) + r[r.find('{'):])
    css = '\n'.join(quedan).replace('html,body{margin:0;background:#F6F2EA}', 'html,body{margin:0;background:#F6F2EA!important}')
    cab = html[html.find('<link rel="preconnect"'):html.find('<style>')]
    return f'{cab}<style>{css}</style>{cuerpo}'

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'src'
    os.makedirs(out, exist_ok=True)
    for nombre, f in [('ani-libro-landing', landing), ('ani-libro-pago-encabezado', pago), ('ani-libro-sesion', sesion),
                      ('ani-libro-sesion-pie', sesion_pie), ('ani-libro-agenda', agenda), ('ani-libro-gracias', gracias)]:
        open(os.path.join(out, nombre + '.html'), 'w').write(f())
    # Bloques para pegar en GHL (pago y sesión llevan el formulario de pedido nativo de GHL debajo).
    ghl = os.path.join(out, '..', 'ghl')
    os.makedirs(ghl, exist_ok=True)
    for nombre, txt in [('ani-libro-pago-encabezado', bloque(pago())), ('ani-libro-sesion', bloque(sesion(), sesion_pie())),
                        ('ani-libro-sesion-pie', sesion_pie())]:
        open(os.path.join(ghl, nombre + '.html'), 'w').write(txt)
    print('ok')
