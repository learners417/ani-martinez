/* Cargador de las páginas del libro de Ani en GHL (ani-martinez.com).
   En GHL cada página tiene un solo bloque «Código personalizado» con dos líneas:
     <script>window.ALB_PAGINA='landing'</script>
     <script src="https://ani-martinez.vercel.app/libro/cargador.js"></script>
   Este archivo trae public/libro/src/ani-libro-<pagina>.html, apaga los estilos de GHL y la monta.
   GHL sigue haciendo lo suyo por detrás (estadísticas, atribución, píxel).
   En el editor de GHL no hace nada: solo corre en ani-martinez.com. */
(function (d, w) {
  if (w.__albCargador) return;
  if (!/(^|\.)ani-martinez\.com$/.test(location.hostname)) return;
  w.__albCargador = 1;
  var pagina = w.ALB_PAGINA || 'landing';
  var src = 'https://ani-martinez.vercel.app/libro/src/ani-libro-' + pagina + '.html';

  var tapa = d.createElement('style');
  tapa.id = 'alb-tapa';
  tapa.textContent = '#__nuxt,#teleports{display:none!important}html,body{background:#F6F2EA!important}';
  d.head.appendChild(tapa);

  function apagarGHL() {
    var l = d.querySelectorAll('head style, head link[rel~="stylesheet"]');
    for (var i = 0; i < l.length; i++) {
      var n = l[i];
      if (n.id === 'alb-tapa' || n.hasAttribute('data-alb')) continue;
      n.media = 'not all';
    }
  }

  function correr(viejo, sigue) {
    var s = d.createElement('script');
    if (viejo.src) { s.src = viejo.src; s.async = false; s.onload = s.onerror = sigue; viejo.parentNode.replaceChild(s, viejo); }
    else { s.text = viejo.text; viejo.parentNode.replaceChild(s, viejo); sigue(); }
  }

  fetch(src, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw r.status; return r.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      apagarGHL();
      try {
        new MutationObserver(function (m) { m.forEach(function (c) { [].forEach.call(c.addedNodes, function (n) {
          if (n.nodeType === 1 && !n.hasAttribute('data-alb') && n.id !== 'alb-tapa' && (n.tagName === 'STYLE' || (n.tagName === 'LINK' && /stylesheet/.test(n.rel)))) n.media = 'not all';
        }); }); }).observe(d.head, { childList: true });
      } catch (e) {}
      doc.head.querySelectorAll('link,style').forEach(function (n) {
        var c = d.importNode(n, true); c.setAttribute('data-alb', '1'); d.head.appendChild(c);
      });
      var t = doc.querySelector('title');
      if (t && !d.title) d.title = t.textContent;
      var raiz = d.createElement('div');
      raiz.id = 'alb-raiz';
      raiz.innerHTML = doc.body.innerHTML;
      d.body.appendChild(raiz);
      var scripts = [].slice.call(raiz.querySelectorAll('script'));
      (function siguiente() { var s = scripts.shift(); if (s) correr(s, siguiente); })();
    })
    .catch(function () {
      tapa.textContent = '';
    });
})(document, window);
