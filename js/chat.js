/* AI Receptionist: guided intake + free-form Q&A.
   - Intake flow runs fully client-side and ends in a lead POST (/api/lead) or a WhatsApp hand-off.
   - Free text goes to /api/chat (LLM) when configured; otherwise a local keyword engine answers. */
(function () {
  const $ = s => document.querySelector(s), C = window.ZTM, I = window.ZTM_I18N;
  const chat = $('#chat'), log = $('#chatLog'), chips = $('#chatChips'), form = $('#chatForm'), input = $('#chatIn'), btn = $('#aiBtn');
  const en = () => I.lang === 'en';
  const L = (es, e) => en() ? e : es;
  const history = []; let open = false, started = false, flow = null, busy = false;
  const lead = {};

  const AREAS = [['Societario', 'Corporate'], ['Civil Comercial', 'Civil & Commercial'], ['Bienes Raíces', 'Real Estate'], ['Tributario / Aduanero', 'Tax / Customs'], ['Laboral', 'Employment'], ['Arbitraje', 'Arbitration'], ['Propiedad Intelectual', 'IP'], ['Medio Ambiente', 'Environmental'], ['Otro', 'Other']];

  function bubble(text, who) {
    const d = document.createElement('div'); d.className = 'msg msg--' + who; d.textContent = text; log.appendChild(d);
    gsap.fromTo(d, { y: 16, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: 'expo.out' });
    log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); return d;
  }
  function typing() { const d = document.createElement('div'); d.className = 'msg msg--bot msg--typing'; d.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function say(text, delay) { const t = typing(); await wait(delay || Math.min(1100, 350 + text.length * 14)); t.remove(); history.push({ role: 'assistant', content: text }); return bubble(text, 'bot'); }
  function setChips(list) {
    chips.innerHTML = ''; list.forEach(([label, fn]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.addEventListener('click', () => { chips.innerHTML = ''; user(label); fn(); }); chips.appendChild(b); });
    gsap.from(chips.children, { y: 12, opacity: 0, duration: .5, stagger: .05, ease: 'expo.out' });
  }
  function user(text) { history.push({ role: 'user', content: text }); bubble(text, 'user'); }

  /* ---------- guided intake ---------- */
  async function mainMenu() {
    flow = null;
    setChips([
      [L('Solicitar una consulta', 'Request a consultation'), startIntake],
      [L('Áreas de práctica', 'Practice areas'), () => answer('areas')],
      [L('Honorarios', 'Fees'), () => answer('fees')],
      [L('Horario y ubicación', 'Hours & location'), () => answer('hours')],
      [L('Hablar por WhatsApp', 'Talk on WhatsApp'), () => { say(L('Abriendo WhatsApp…', 'Opening WhatsApp…'), 300); window.open(window.ZTM_waLink(L('Hola, necesito ayuda legal.', 'Hello, I need legal help.')), '_blank'); }]
    ]);
  }
  async function greet() {
    started = true;
    await say(L('Hola, soy la recepción virtual de ZTM Abogados. Puedo resolver dudas generales y recoger su caso para que un abogado le contacte. No ofrezco asesoría jurídica. ¿En qué puedo ayudarle?', 'Hello, I am the virtual reception of ZTM Abogados. I can answer general questions and take down your matter so an attorney can contact you. I do not give legal advice. How can I help?'));
    mainMenu();
  }
  async function startIntake() {
    flow = 'area'; lead.area = lead.name = lead.contact = lead.summary = undefined;
    await say(L('Con gusto. Primero, ¿de qué área es su asunto?', 'Of course. First, which area does your matter fall under?'));
    setChips(AREAS.map(([es, e]) => [L(es, e), () => { lead.area = es; lead.areaLabel = L(es, e); askUrgency(); }]));
  }
  async function askUrgency() {
    flow = 'urgency';
    await say(L('¿Qué tan urgente es?', 'How urgent is it?'));
    setChips([[L('Urgente (hoy)', 'Urgent (today)'), () => { lead.urgency = 'urgent'; askSummary(); }], [L('Esta semana', 'This week'), () => { lead.urgency = 'week'; askSummary(); }], [L('Sin prisa', 'Not urgent'), () => { lead.urgency = 'normal'; askSummary(); }]]);
  }
  async function askSummary() { flow = 'summary'; await say(L('Cuénteme brevemente lo ocurrido o lo que necesita (2 o 3 frases bastan).', 'Briefly tell me what happened or what you need (2 or 3 sentences are enough).')); input.focus(); }
  async function askName() { flow = 'name'; await say(L('Gracias. ¿Cuál es su nombre completo?', 'Thank you. What is your full name?')); }
  async function askContact() { flow = 'contact'; await say(L('¿Y un teléfono o email para contactarle?', 'And a phone number or email to reach you?')); }
  async function confirm() {
    flow = 'confirm';
    await say(L(`Perfecto, ${lead.name}. Resumen: asunto de ${lead.areaLabel}, ${{ urgent: 'urgente', week: 'esta semana', normal: 'sin prisa' }[lead.urgency]}. ¿Envío su solicitud al despacho?`, `Perfect, ${lead.name}. Summary: ${lead.areaLabel} matter, ${{ urgent: 'urgent', week: 'this week', normal: 'not urgent' }[lead.urgency]}. Shall I send your request to the firm?`));
    setChips([[L('Sí, enviar', 'Yes, send'), submit], [L('Empezar de nuevo', 'Start over'), startIntake]]);
  }
  async function submit() {
    flow = null; const t = typing();
    let ok = false;
    try { const r = await fetch(C.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ source: 'ai-receptionist', lang: I.lang }, lead)) }); ok = r.ok; } catch (e) {}
    t.remove();
    const wa = window.ZTM_waLink(`${L('Hola, soy', 'Hello, I am')} ${lead.name}. ${L('Área', 'Area')}: ${lead.area}. ${lead.summary}. ${L('Contacto', 'Contact')}: ${lead.contact}`);
    if (ok) await say(L('Solicitud enviada. Un abogado del estudio se pondrá en contacto con usted' + (lead.urgency === 'urgent' ? ' (marcada como urgente).' : '.'), 'Request sent. An attorney from the firm will contact you' + (lead.urgency === 'urgent' ? ' (marked as urgent).' : '.')), 300);
    else await say(L('No pude enviarla automáticamente. Para no perder tiempo, puede enviarnos el resumen por WhatsApp con un clic.', 'I could not send it automatically. To save time, you can send us the summary on WhatsApp in one click.'), 300);
    setChips([[L('Enviar también por WhatsApp', 'Also send via WhatsApp'), () => window.open(wa, '_blank')], [L('Menú', 'Menu'), mainMenu]]);
  }

  /* ---------- local knowledge (fallback when no LLM endpoint) ---------- */
  const KB = {
    areas: () => L('Trabajamos en derecho societario, civil comercial, bienes raíces, conciliación y arbitraje, tributario, aduanero y financiero, laboral, medio ambiente, propiedad intelectual, agrario y administrativo y regulatorio.', 'We practice corporate, civil and commercial, real estate, conciliation and arbitration, tax, customs and finance, employment, environmental, intellectual property, agrarian, and administrative and regulatory law.'),
    fees: () => L('Los honorarios dependen de cada caso. Un abogado del estudio le explicará el alcance y le presentará una propuesta clara; si lo desea, registro su caso para que le contacten.', 'Fees depend on each matter. An attorney will explain the scope and give you a clear proposal; if you like, I can log your matter so they contact you.'),
    hours: () => L(`Nuestra oficina central está en ${C.address}, y tenemos una oficina legal en La Paz. Puede llamarnos al ${C.phone} o escribir a ${C.email}. Esta recepción funciona las 24 horas.`, `Our head office is at ${C.address}, and we have a legal office in La Paz. You can call us at ${C.phone} or email ${C.email}. This reception runs 24/7.`),
    lang: () => L('Atendemos en español.', 'We serve clients in Spanish.'),
    conf: () => L('Su información está amparada por el secreto profesional y se maneja con la máxima reserva.', 'Your information is covered by professional privilege and handled with the utmost discretion.'),
    urgent: () => L('Si es una urgencia (citación judicial, plazo inminente, medida cautelar), llámenos ahora al ' + C.phone + ' o escriba por WhatsApp. También puedo registrar su caso como urgente.', 'If it is urgent (court summons, imminent deadline, injunction), call us now at ' + C.phone + ' or message on WhatsApp. I can also log your matter as urgent.'),
    advice: () => L('No puedo ofrecer asesoría jurídica, pero un abogado de ZTM sí podrá orientarle. Si quiere, registro su caso para que le contacten.', 'I cannot give legal advice, but a ZTM attorney can guide you. If you like, I can log your matter so they contact you.')
  };
  function intent(t) {
    t = t.toLowerCase();
    if (/urgen|detenid|detenc|arrest|emergenc|hoy mismo|today|citaci|summon/.test(t)) return 'urgent';
    if (/honorar|precio|costo|cuesta|cobr|fee|price|cost|how much|cu[aá]nto/.test(t)) return 'fees';
    if (/horario|hora|ubicaci|direcci|donde|dónde|address|hours|where|location|open/.test(t)) return 'hours';
    if (/idioma|ingl[eé]s|english|spanish|espa[nñ]ol|language/.test(t)) return 'lang';
    if (/confiden|privac|secret|seguro/.test(t)) return 'conf';
    if (/[aá]rea|servicio|practice|services|especial|que hacen|qué hacen|what do you/.test(t)) return 'areas';
    if (/consulta|cita|agendar|book|appointment|contact|abogado|lawyer|attorney|hablar|speak/.test(t)) return 'intake';
    if (/deber[ií]a|puedo demandar|should i|can i sue|qu[eé] hago|ganar|win|legal advice|asesor/.test(t)) return 'advice';
    return null;
  }
  async function answer(key) { if (key === 'intake') return startIntake(); await say(KB[key]()); if (key === 'urgent' || key === 'advice') setChips([[L('Registrar mi caso', 'Log my matter'), () => { startIntake(); }], [L('Menú', 'Menu'), mainMenu]]); else mainMenu(); }

  async function freeText(text) {
    const k = intent(text);
    if (k) return answer(k);
    // try the LLM endpoint
    try {
      const t = typing();
      const r = await fetch(C.chatEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-12), lang: I.lang }) });
      t.remove(); if (!r.ok) throw new Error('no llm');
      const j = await r.json(); history.push({ role: 'assistant', content: j.reply }); bubble(j.reply, 'bot');
      setChips([[L('Solicitar una consulta', 'Request a consultation'), startIntake], [L('Menú', 'Menu'), mainMenu]]); return;
    } catch (e) { $('.msg--typing') && $('.msg--typing').remove(); }
    await say(L('Para darle una respuesta precisa, lo mejor es que un abogado revise su caso. ¿Quiere que lo registre?', 'For an accurate answer, it is best that an attorney review your matter. Shall I log it?'));
    setChips([[L('Sí, registrar', 'Yes, log it'), startIntake], [L('Menú', 'Menu'), mainMenu]]);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault(); const v = input.value.trim(); if (!v || busy) return; input.value = ''; chips.innerHTML = ''; user(v); busy = true;
    try {
      if (flow === 'summary') { lead.summary = v; await askName(); }
      else if (flow === 'name') { lead.name = v.slice(0, 80); await askContact(); }
      else if (flow === 'contact') {
        if (!/@|\d{6,}/.test(v.replace(/\s/g, ''))) await say(L('Parece que falta un teléfono o email válido. ¿Puede repetirlo?', 'That does not look like a valid phone or email. Could you repeat it?'));
        else { lead.contact = v; await confirm(); }
      }
      else await freeText(v);
    } finally { busy = false; }
  });

  /* ---------- open / close ---------- */
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  tl.fromTo(chat, { autoAlpha: 0, y: 40, scale: .92, transformOrigin: '100% 100%' }, { autoAlpha: 1, y: 0, scale: 1, duration: .8 });
  function openChat() { if (open) return; open = true; chat.setAttribute('aria-hidden', 'false'); btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('chat-open'); tl.timeScale(1).play(); if (!started) setTimeout(greet, 500); setTimeout(() => input.focus(), 600); }
  function closeChat() { if (!open) return; open = false; chat.setAttribute('aria-hidden', 'true'); btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('chat-open'); tl.timeScale(1.6).reverse(); }
  window.ZTM_closeChat = closeChat;
  btn.addEventListener('click', () => open ? closeChat() : openChat());
  $('#chatX').addEventListener('click', closeChat);
  document.querySelectorAll('[data-open-chat]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openChat(); }));
  // gentle proactive nudge after a while
  setTimeout(() => { if (!open) btn.classList.add('is-nudge'); }, 14000);
  document.addEventListener('langchange', () => { if (started && !flow) { log.innerHTML = ''; history.length = 0; greet(); } });
})();
