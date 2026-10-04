/* ZTM Abogados — motion choreography (GSAP + ScrollTrigger + Lenis + Three scene). */
(function () {
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const C = window.ZTM, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  gsap.registerPlugin(ScrollTrigger);
  const EASE = 'expo.out', SOFT = 'power4.out';

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target, o) => lenis ? lenis.scrollTo(target, Object.assign({ offset: -10, duration: 1.6 }, o)) : (typeof target === 'string' ? $(target).scrollIntoView({ behavior: 'smooth' }) : window.scrollTo(0, target));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const h = a.getAttribute('href'); if (h.length < 2 || a.hasAttribute('data-open-chat') || a.hasAttribute('data-open-cookies')) return;
    e.preventDefault(); closeMenu(); scrollTo(h);
  }));

  /* ---------- WhatsApp links ---------- */
  function waLink(text) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(text); }
  window.ZTM_waLink = waLink;
  $$('[data-wa]').forEach(a => a.href = waLink(window.ZTM_I18N.lang === 'en' ? 'Hello, I would like to request a consultation with ZTM Abogados.' : 'Hola, quisiera solicitar una consulta con ZTM Abogados.'));
  document.addEventListener('langchange', () => $$('[data-wa]').forEach(a => a.href = waLink(window.ZTM_I18N.lang === 'en' ? 'Hello, I would like to request a consultation with ZTM Abogados.' : 'Hola, quisiera solicitar una consulta con ZTM Abogados.')));

  /* ---------- text splitting ---------- */
  function wrapLines(el) { // masks each hero line so it can slide up
    $$('.line', el).forEach(l => { if (!l.querySelector('.inner')) l.innerHTML = '<span class="mask"><span class="inner">' + l.innerHTML + '</span></span>'; });
  }
  function splitWords(el) {
    const txt = el.textContent.trim(); el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(/\s+/).map(w => '<span class="w" aria-hidden="true">' + w + '</span>').join(' ');
    return $$('.w', el);
  }
  const hero = $('#heroTitle'); wrapLines(hero);

  /* ---------- preloader → hero intro ---------- */
  const intro = gsap.timeline({ paused: true, defaults: { ease: EASE } });
  gsap.set('.hero [data-reveal], .nav', { opacity: 0, y: 30 });
  gsap.set('.hero .inner', { yPercent: 115, rotate: 4 });
  intro
    .to('.loader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut' })
    .to('.hero .inner', { yPercent: 0, rotate: 0, duration: 1.5, stagger: .12 }, '-=.55')
    .to('.hero [data-reveal]', { opacity: 1, y: 0, duration: 1.2, stagger: .12 }, '-=1.1')
    .to('.nav', { opacity: 1, y: 0, duration: 1.1 }, '-=1.0')
    .add(() => { document.body.classList.add('is-ready'); $('.loader').style.display = 'none'; });
  const lt = gsap.timeline({ onComplete: () => intro.play() });
  lt.from('.loader__mark span', { yPercent: 120, opacity: 0, duration: .9, stagger: .12, ease: EASE })
    .to('.loader__line i', { scaleX: 1, duration: .9, ease: 'power3.inOut' }, '-=.3')
    .from('.loader__sub', { opacity: 0, letterSpacing: '1em', duration: .8, ease: SOFT }, '-=.6')
    .to({}, { duration: .25 });
  if (reduce) { lt.progress(1); }
  // re-wrap hero lines after a language change (the switcher replaces text)
  document.addEventListener('langchange', () => { wrapLines(hero); gsap.set('.hero .inner', { yPercent: 0, rotate: 0 }); });

  /* ---------- generic reveals ---------- */
  gsap.set('[data-reveal]:not(.hero [data-reveal])', { opacity: 0, y: 50, filter: 'blur(10px)' });
  ScrollTrigger.batch('[data-reveal]:not(.hero [data-reveal])', {
    start: 'top 88%', once: true,
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, stagger: .1, ease: EASE, overwrite: true })
  });
  $$('.h2, .display--md').forEach(h => gsap.from(h, { opacity: 0, y: 60, duration: 1.4, ease: EASE, scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));
  $$('.eyebrow:not(.hero .eyebrow)').forEach(e => gsap.from(e, { opacity: 0, x: -24, duration: 1, ease: EASE, scrollTrigger: { trigger: e, start: 'top 92%', once: true } }));

  /* ---------- manifesto: word-by-word scrubbed reveal ---------- */
  let words = splitWords($('#manifesto'));
  function bindManifesto() {
    gsap.fromTo(words, { opacity: .14 }, { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: .6 } });
  }
  bindManifesto();
  document.addEventListener('langchange', () => {
    ScrollTrigger.getAll().filter(t => t.trigger === $('#manifesto')).forEach(t => t.kill());
    words = splitWords($('#manifesto')); gsap.set(words, { opacity: .14 }); bindManifesto(); ScrollTrigger.refresh();
  });

  /* ---------- stats ---------- */
  $$('[data-count]').forEach(el => {
    const key = el.dataset.count.replace('cfg:', ''), end = C.stats[key], o = { v: 0 };
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const plain = el.hasAttribute('data-plain');
    const fmt = n => pre.replace('&lt;', '<') + (plain ? String(Math.round(n)) : Math.round(n).toLocaleString('en-US')) + suf;
    el.textContent = fmt(0);
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 2.4, ease: 'power3.out', onUpdate: () => el.textContent = fmt(o.v) }) });
  });

  /* ---------- practice areas: pinned horizontal pan ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    if (reduce) return;
    const track = $('.areas__track'), pin = $('.areas__pin');
    const dist = () => track.scrollWidth - window.innerWidth + 64;
    const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#areas', pin, start: 'top top', end: () => '+=' + dist() * 1.15, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 } });
    $$('.acard').forEach(c => {
      gsap.fromTo(c, { rotateY: 14, scale: .92, opacity: .5 }, { rotateY: -14, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left 105%', end: 'right -5%', scrub: true } });
    });
    return () => gsap.set([track, '.acard'], { clearProps: 'all' });
  });

  /* ---------- method: sticky stack that recedes ---------- */
  mm.add('(min-width: 900px)', () => {
    const steps = $$('.step');
    steps.forEach((s, i) => {
      const next = steps[i + 1]; if (!next) return;
      gsap.to(s, { scale: .92, opacity: .45, filter: 'blur(2px)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 25%', scrub: true } });
    });
  });

  gsap.fromTo('.partners__img img', { yPercent: -6, scale: 1.08 }, { yPercent: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: '.partners', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- team: parallax portraits ---------- */
  $$('.person__img span').forEach(s => gsap.fromTo(s, { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: s.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  mm.add('(min-width: 900px)', () => { $$('.person').forEach((p, i) => gsap.to(p, { y: i % 2 ? 60 : -20, ease: 'none', scrollTrigger: { trigger: '.team__grid', start: 'top bottom', end: 'bottom top', scrub: true } })); });

  /* ---------- why cards, footer, big type ---------- */
  gsap.from('.foot__big', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'top 30%', scrub: true } });
  gsap.to('.hero__copy', { yPercent: -12, opacity: .0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__card', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.marquee__track', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: .5 } });

  /* ---------- 3D tilt + glare ---------- */
  if (fine && !reduce) $$('[data-tilt]').forEach(el => {
    gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
    const rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: SOFT }), ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: SOFT });
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; ry(x * 12); rx(-y * 12); el.style.setProperty('--gx', (x + .5) * 100 + '%'); el.style.setProperty('--gy', (y + .5) * 100 + '%'); });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) $$('.magnetic').forEach(b => {
    const mx = gsap.quickTo(b, 'x', { duration: .5, ease: SOFT }), my = gsap.quickTo(b, 'y', { duration: .5, ease: SOFT });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .28); my((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('pointerleave', () => { mx(0); my(0); });
  });

  /* ---------- custom cursor ---------- */
  if (fine && !reduce) {
    const cur = $('.cursor'); document.body.classList.add('has-cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: .45, ease: SOFT }), cy = gsap.quickTo(cur, 'y', { duration: .45, ease: SOFT });
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => cur.classList.toggle('is-link', !!e.target.closest('a,button,summary,[data-tilt],input,select,textarea')));
  }

  /* ---------- nav: hide on scroll down, burger + overlay menu ---------- */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  let lastY = 0, menuOpen = false;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
    const y = s.scroll(); if (!menuOpen && document.body.classList.contains('is-ready')) gsap.to(nav, { yPercent: y > lastY && y > 200 ? -140 : 0, duration: .6, ease: SOFT, overwrite: 'auto' });
    nav.classList.toggle('is-solid', y > 40); lastY = y;
    $('.progress i').style.transform = 'scaleX(' + s.progress + ')';
  } });
  const mt = gsap.timeline({ paused: true, defaults: { ease: EASE } });
  mt.to(menu, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1, ease: 'power4.inOut' })
    .from('.menu nav a', { yPercent: 110, opacity: 0, duration: 1, stagger: .07 }, '-=.5')
    .from('.menu__foot', { opacity: 0, duration: .8 }, '-=.6');
  function openMenu() { menuOpen = true; menu.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true'); burger.classList.add('is-open'); lenis && lenis.stop(); mt.timeScale(1).play(); gsap.to(nav, { yPercent: 0, duration: .3 }); }
  function closeMenu() { if (!menuOpen) return; menuOpen = false; menu.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false'); burger.classList.remove('is-open'); lenis && lenis.start(); mt.timeScale(1.5).reverse(); }
  burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); window.ZTM_closeChat && window.ZTM_closeChat(); } });

  /* ---------- testimonials ---------- */
  const qs = $$('.quote'), dots = $$('.quotes__dots button'); let qi = 0, qt;
  gsap.set(qs, { opacity: 0, y: 30, pointerEvents: 'none' }); gsap.set(qs[0], { opacity: 1, y: 0, pointerEvents: 'auto' });
  function showQuote(n) {
    if (n === qi) return; const a = qs[qi], b = qs[n];
    gsap.to(a, { opacity: 0, y: -30, duration: .7, ease: 'power3.in', pointerEvents: 'none' });
    gsap.fromTo(b, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, delay: .5, ease: EASE, pointerEvents: 'auto' });
    dots[qi].classList.remove('is-active'); dots[n].classList.add('is-active'); qi = n;
  }
  const loop = () => { clearInterval(qt); qt = setInterval(() => showQuote((qi + 1) % qs.length), 6500); };
  dots.forEach((d, i) => d.addEventListener('click', () => { showQuote(i); loop(); })); loop();

  /* ---------- cookies ---------- */
  const ck = $('#cookie'); let consent = null; try { consent = localStorage.getItem('ztm-cookies'); } catch (e) {}
  const ckShow = on => { ck.classList.toggle('is-on', on); document.body.classList.toggle('ck-on', on); };
  if (!consent) setTimeout(() => ckShow(true), 4500);
  $$('[data-ck]').forEach(b => b.addEventListener('click', () => { try { localStorage.setItem('ztm-cookies', b.dataset.ck); } catch (e) {} ckShow(false); }));
  $$('[data-open-cookies]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); ckShow(true); }));

  /* ---------- contact form ---------- */
  const form = $('#contactForm'), msg = $('#formMsg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const en = window.ZTM_I18N.lang === 'en', fd = Object.fromEntries(new FormData(form));
    if (!fd.name || !/.+@.+\..+/.test(fd.email || '') || !fd.message || !fd.area || !fd.consent) { msg.className = 'form__msg is-err'; msg.textContent = en ? 'Please complete the required fields and accept the privacy policy.' : 'Complete los campos obligatorios y acepte la política de privacidad.'; return; }
    msg.className = 'form__msg'; msg.textContent = en ? 'Sending…' : 'Enviando…';
    try {
      const r = await fetch(C.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ source: 'form', lang: window.ZTM_I18N.lang }, fd)) });
      if (!r.ok) throw new Error('bad');
      msg.className = 'form__msg is-ok'; msg.textContent = en ? 'Thank you. An attorney from our team will contact you.' : 'Gracias. Un abogado de nuestro equipo se pondrá en contacto con usted.'; form.reset();
    } catch (err) { // graceful fallback: open the user's mail client
      location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Consulta web: ' + fd.area) + '&body=' + encodeURIComponent(fd.message + '\n\n' + fd.name + ' · ' + fd.email + ' · ' + (fd.phone || ''));
      msg.className = 'form__msg is-ok'; msg.textContent = en ? 'Opening your email app…' : 'Abriendo su aplicación de correo…';
    }
  });

  /* ---------- 3D scene (starts once the bundle has loaded) ---------- */
  addEventListener('load', () => {
    if (!window.ZTMScene) return;
    try {
      const st = ZTMScene.initScene($('#gl'), { reduceMotion: reduce });
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { st.scroll = s.progress; } });
      document.body.classList.add('gl-on');
    } catch (e) { console.warn('WebGL unavailable', e); }
    ScrollTrigger.refresh();
  });
})();
