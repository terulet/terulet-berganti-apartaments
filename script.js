/* ====== EL BERGANTÍ · script.js ====== */
(function () {
  'use strict';

  /* ====== Multiidioma (i18n) ====== */
  var currentLang = 'es';
  function applyLang(lang){
    if(typeof I18N==='undefined' || !I18N[lang]) return;
    currentLang = lang;
    var dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    // textos
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n'); if(dict[k]!=null) el.textContent=dict[k];
    });
    // textos con HTML (em, br, strong)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var k=el.getAttribute('data-i18n-html'); if(dict[k]!=null) el.innerHTML=dict[k];
    });
    // placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      var k=el.getAttribute('data-i18n-ph'); if(dict[k]!=null) el.setAttribute('placeholder',dict[k]);
    });
    // estado activo del selector
    document.querySelectorAll('.lang a[data-lang]').forEach(function(a){
      a.classList.toggle('on', a.getAttribute('data-lang')===lang);
    });
    try{ localStorage.setItem('berganti_lang', lang); }catch(e){}
  }
  // listeners del selector
  document.querySelectorAll('.lang a[data-lang]').forEach(function(a){
    a.addEventListener('click', function(){ applyLang(a.getAttribute('data-lang')); });
  });
  // idioma inicial: guardado > idioma del navegador > es
  (function initLang(){
    var saved=null;
    try{ saved=localStorage.getItem('berganti_lang'); }catch(e){}
    var nav=(navigator.language||'es').slice(0,2).toLowerCase();
    var supported=['es','ca','fr','en','de','nl'];
    var pick = saved || (supported.indexOf(nav)>=0 ? nav : 'es');
    applyLang(pick);
  })();

  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menú móvil */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Reveal on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(el);
  });

  /* Selector de packs (compra preparada) */
  var packs = document.querySelectorAll('.pack');
  var packInput = document.getElementById('packsel');
  packs.forEach(function (p) {
    p.addEventListener('click', function () {
      packs.forEach(function (x) { x.classList.remove('active'); });
      p.classList.add('active');
      if (packInput) packInput.value = p.getAttribute('data-pack');
    });
  });

  /* Formulario "compra preparada"
     Estado actual: NO envía a ningún backend. Solo muestra confirmación.
     PARA ACTIVAR EL ENVÍO en el futuro, elige UNA opción:

     A) Web3Forms (sin servidor, gratis): crea tu access key en https://web3forms.com
        y descomenta el bloque fetch de más abajo, poniendo tu YOUR_ACCESS_KEY.

     B) WhatsApp: en vez de fetch, abre un mensaje prerrellenado:
        window.open('https://wa.me/34696906510?text='+encodeURIComponent(resumen));

     C) Email simple: cambia el <form> por action="mailto:info@elberganti.com".
  */
  var form = document.getElementById('precompraForm');
  var msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nombre = document.getElementById('nombre').value.trim();
      var email = document.getElementById('email').value.trim();
      var llegada = document.getElementById('llegada').value;
      var pack = document.getElementById('packsel').value;
      var detalle = document.getElementById('detalle').value.trim();

      if (!nombre || !email) {
        if (msg) { msg.style.color = '#f0c0a0'; msg.textContent = (I18N[currentLang]&&I18N[currentLang]['pre.err'])||'Por favor, indícanos al menos tu nombre y email.'; }
        return;
      }

      /* --- ENVÍO REAL (desactivado). Descomenta para activar con Web3Forms ---
      fetch('https://api.web3forms.com/submit', {
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          access_key:'YOUR_ACCESS_KEY',
          subject:'Compra preparada · El Bergantí',
          from_name:nombre, email:email,
          llegada:llegada, pack:pack, detalle:detalle
        })
      });
      ------------------------------------------------------------------------ */

      if (msg) {
        msg.style.color = '';
        var okMsg=(I18N[currentLang]&&I18N[currentLang]['pre.ok'])||'Gracias, {name}. Hemos recibido tu solicitud y te contactaremos para confirmar los detalles.';
        msg.textContent = okMsg.replace('{name}', nombre);
      }
      form.reset();
      packs.forEach(function (x) { x.classList.remove('active'); });
    });
  }

  /* Smooth scroll para anclas internas (con compensación de nav) */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
})();
