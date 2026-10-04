/* Lightweight ES/EN switcher. Spanish lives in the HTML; English lives here. */
(function () {
  const EN = {
    skip: 'Skip to content',
    'nav.firm': 'The Firm', 'nav.areas': 'Practice', 'nav.method': 'Method', 'nav.team': 'Team', 'nav.insights': 'Insights', 'nav.cta': 'Consult', 'nav.contact': 'Contact',
    'hero.eyebrow': 'A law firm of distinction', 'hero.l1': 'The law,', 'hero.l2': 'with <em>judgment</em>', 'hero.l3': 'and absolute discretion.',
    'hero.lead': 'We advise companies, families and investors on their most delicate decisions. Sound strategy, clear communication and an unwavering commitment to your outcome.',
    'hero.cta1': 'Book a confidential consultation', 'hero.cta2': 'Talk to our AI reception',
    'hero.live': 'Reception available 24/7', 'hero.cardT': 'First guidance at no cost', 'hero.cardS': 'Tell us about your matter in minutes; an attorney will reply within 24 hours.', 'hero.scroll': 'Scroll',
    'firm.eyebrow': 'The Firm',
    'firm.text': 'We believe a good lawyer does not only know the law: they understand the business, the family and the moment of the person who hires them. That is why we pair technical rigor with direct, personal service, so every decision you make is backed, protected and well explained.',
    'stats.years': 'Years of practice', 'stats.cases': 'Matters handled', 'stats.success': 'Clients who recommend us', 'stats.response': 'First response time',
    'areas.eyebrow': 'Practice areas', 'areas.title': 'Specialists where it matters most.',
    'a1.t': 'Corporate Law', 'a1.d': 'Company formation, commercial contracts, mergers and acquisitions, corporate governance and regulatory compliance.', 'a1.l1': 'M&A and restructurings', 'a1.l2': 'Contracts and compliance', 'a1.l3': 'Foreign investment',
    'a2.t': 'Litigation & Arbitration', 'a2.d': 'Decisive defense of your interests before courts and arbitral tribunals, with a clear procedural strategy from day one.', 'a2.l1': 'Civil and commercial litigation', 'a2.l2': 'Domestic and international arbitration', 'a2.l3': 'Debt recovery',
    'a3.t': 'Real Estate', 'a3.d': 'Sales, leases, development and real estate finance with the due diligence your assets deserve.', 'a3.l1': 'Due diligence', 'a3.l2': 'Transactions and leases', 'a3.l3': 'Zoning and development',
    'a4.t': 'Family & Estates', 'a4.d': 'Sensitive yet firm support in divorce, custody, inheritance and family wealth planning.', 'a4.l1': 'Divorce and custody', 'a4.l2': 'Wills and inheritance', 'a4.l3': 'Family protocols',
    'a5.t': 'Criminal Law', 'a5.d': 'White-collar and personal criminal defense with maximum discretion, from investigation to trial.', 'a5.l1': 'Economic crimes', 'a5.l2': 'Defense during investigation', 'a5.l3': 'Corporate liability',
    'a6.t': 'Employment', 'a6.d': 'Preventive and contentious advice for employers and executives: hiring, dismissals, collective bargaining.', 'a6.l1': 'Executive contracts', 'a6.l2': 'Dismissals and claims', 'a6.l3': 'Labor compliance',
    'a7.t': 'Intellectual Property', 'a7.d': 'Protection of trademarks, patents, copyright and digital assets so your innovation stays yours.', 'a7.l1': 'Trademark registration', 'a7.l2': 'Licensing and transfer', 'a7.l3': 'Infringement defense',
    'a8.t': 'Immigration', 'a8.d': 'Residency, visas, citizenship and relocation of talent and investors with frictionless paperwork.', 'a8.l1': 'Residency and visas', 'a8.l2': 'Citizenship', 'a8.l3': 'Corporate mobility',
    'method.eyebrow': 'Our method', 'method.title': 'A clear process, from first call to resolution.', 'method.sub': 'No surprises, no needless jargon. You always know where your matter stands.',
    'm1.t': 'Listening and diagnosis', 'm1.d': 'A confidential conversation to understand facts, goals and risks. We tell you frankly what is viable and what is not.',
    'm2.t': 'Tailored strategy', 'm2.d': 'We design the legal route and the possible scenarios, with transparent fees agreed upfront.',
    'm3.t': 'Rigorous execution', 'm3.d': 'A dedicated team acts with precision and clear deadlines, keeping you informed at every key milestone.',
    'm4.t': 'Resolution and follow-up', 'm4.d': 'We close the matter with documented results and stay with you to prevent future disputes.',
    'team.eyebrow': 'Team', 'team.title': 'The lawyers behind every case.', 'team.r1': 'Corporate and Litigation', 'team.r2': 'Real Estate and Family', 'team.r3': 'White-collar and Employment', 'team.r4': 'IP and Immigration',
    'why.1t': 'Absolute confidentiality', 'why.1d': 'Professional privilege and security protocols in every communication.',
    'why.2t': 'Swift response', 'why.2d': 'First reply within 24 hours and urgent matters handled the same day.',
    'why.3t': 'Transparent fees', 'why.3d': 'Fixed or milestone-based budget, agreed in writing before we begin.',
    'why.4t': 'Bilingual service', 'why.4d': 'Full service in Spanish and English for local and international clients.',
    'q.eyebrow': 'Clients',
    'q1.t': '“They gave us clarity at a very complicated time. We always knew what to expect and when.”', 'q1.a': 'CEO, family business',
    'q2.t': '“A team that responds immediately and thinks about the business, not just the file.”', 'q2.a': 'Founder, technology company',
    'q3.t': '“Discretion, empathy and firmness. Exactly what we needed in our family matter.”', 'q3.a': 'Private client',
    'ins.eyebrow': 'Insights', 'ins.title': 'Legal knowledge, explained.', 'ins.more': 'Read more →',
    'ins.1c': 'Corporate', 'ins.1t': 'What to review before signing an investment agreement',
    'ins.2c': 'Family', 'ins.2t': 'Inheritance: how to plan and avoid conflict',
    'ins.3c': 'Real Estate', 'ins.3t': 'Buying property: the essential due diligence',
    'faq.eyebrow': 'FAQ', 'faq.title': 'What people ask before they begin.',
    'f1.q': 'Is the first consultation free?', 'f1.a': 'Initial guidance is free and confidential. If the matter needs deeper analysis, we give you a clear quote before going further.',
    'f2.q': 'How are fees calculated?', 'f2.a': 'Depending on the matter: fixed fee, milestones, or capped hourly. Everything is put in writing before we start.',
    'f3.q': 'How confidential is my information?', 'f3.a': 'Absolutely. It is covered by professional privilege and handled under security protocols.',
    'f4.q': 'Do you serve clients in other cities or countries?', 'f4.a': 'Yes. We work by video call, e-signature and secure messaging, in Spanish and English.',
    'f5.q': 'Can I use the AI reception for urgent matters?', 'f5.a': 'The AI reception collects and prioritizes your matter at any hour; it does not give legal advice. An attorney reviews every request and contacts you.',
    'c.eyebrow': 'Contact', 'c.title': 'Let’s talk about <em>your case.</em>', 'c.lead': 'Tell us the essentials. We will reply within 24 hours with a first approach, without obligation.',
    'c.addr': 'Office', 'c.phone': 'Phone', 'c.hours': 'Hours', 'c.hoursV': 'Mon–Fri 9:00–19:00 · AI reception 24/7', 'c.wa': 'Message on WhatsApp',
    'c.name': 'Full name', 'c.tel': 'Phone / WhatsApp', 'c.areaPh': 'Area of your matter', 'c.other': 'Other', 'c.msg': 'Briefly tell us about your case',
    'c.consent': 'I accept the privacy policy and the processing of my data to handle my enquiry.', 'c.send': 'Send enquiry',
    'foot.tag': 'Legal strategy with judgment, discretion and results.', 'foot.nav': 'Navigate', 'foot.legal': 'Legal', 'foot.priv': 'Privacy policy', 'foot.terms': 'Legal notice', 'foot.cookies': 'Cookies', 'foot.follow': 'Follow',
    'foot.disc': 'The information on this site is general in nature and does not constitute legal advice. Submitting a form or message does not create an attorney-client relationship until the firm expressly accepts the engagement. The AI reception does not provide legal advice.',
    'foot.rights': 'All rights reserved.',
    'ai.tip': 'Need help?', 'ai.name': 'ZTM Reception', 'ai.status': 'AI assistant · online', 'ai.ph': 'Type your message…',
    'ai.note': 'Automated assistant. It does not give legal advice or create an attorney-client relationship.',
    'ck.t': 'We use essential and analytics cookies to improve your experience.', 'ck.no': 'Decline', 'ck.yes': 'Accept'
  };
  const store = { es: {}, en: EN };
  const q = (s, r) => Array.from((r || document).querySelectorAll(s));
  // snapshot Spanish source text from the HTML
  q('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (!(k in store.es)) store.es[k] = el.textContent; });
  q('[data-i18n-html]').forEach(el => { const k = el.dataset.i18nHtml; if (!(k in store.es)) store.es[k] = el.innerHTML; });
  q('[data-i18n-ph]').forEach(el => { store.es[el.dataset.i18nPh] = el.placeholder; });

  function apply(lang) {
    const d = store[lang];
    q('[data-i18n]').forEach(el => { const v = d[el.dataset.i18n]; if (v != null) el.textContent = v; });
    q('[data-i18n-html]').forEach(el => { const v = d[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    q('[data-i18n-ph]').forEach(el => { const v = d[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
    document.documentElement.lang = lang; document.documentElement.dataset.lang = lang;
    try { localStorage.setItem('ztm-lang', lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }
  window.ZTM_I18N = { apply, store, get lang() { return document.documentElement.dataset.lang; }, t: k => (store[document.documentElement.dataset.lang] || {})[k] || k };

  // config-driven text/links
  const C = window.ZTM;
  q('[data-cfg]').forEach(el => { el.textContent = C[el.dataset.cfg] || ''; });
  q('[data-cfg-href]').forEach(el => {
    const k = el.dataset.cfgHref;
    el.href = k === 'tel' ? 'tel:' + C.phoneRaw : k === 'mailto' ? 'mailto:' + C.email : (C[k] || '#');
    if (k === 'linkedin' || k === 'instagram') { el.target = '_blank'; el.rel = 'noopener'; }
  });
  document.getElementById('yr').textContent = new Date().getFullYear();

  let initial = 'es';
  try { initial = localStorage.getItem('ztm-lang') || ((navigator.language || '').startsWith('en') ? 'en' : 'es'); } catch (e) {}
  if (initial === 'en') apply('en');
  document.getElementById('lang').addEventListener('click', () => apply(window.ZTM_I18N.lang === 'es' ? 'en' : 'es'));
})();
