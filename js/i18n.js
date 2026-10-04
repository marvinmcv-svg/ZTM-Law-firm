/* Lightweight ES/EN switcher. Spanish lives in the HTML; English lives here. */
(function () {
  const EN = {
    skip: 'Skip to content',
    'nav.firm': 'The Firm', 'nav.areas': 'Practice', 'nav.method': 'Method', 'nav.team': 'Team', 'nav.insights': 'News', 'nav.cta': 'Consult', 'nav.contact': 'Contact',
    'hero.eyebrow': 'Santa Cruz · La Paz · Bolivia', 'hero.l1': 'The law,', 'hero.l2': 'with <em>judgment</em>', 'hero.l3': 'and absolute discretion.',
    'hero.lead': 'We prevent contingencies and guide those facing complex, high-risk situations. Companies and individuals have trusted our counsel since 2011.',
    'hero.cta1': 'Request a consultation', 'hero.cta2': 'Talk to our AI reception',
    'hero.live': 'Reception available 24/7', 'hero.cardT': 'Request an attorney', 'hero.cardS': 'Tell us about your matter and our team will get in touch with you.', 'hero.scroll': 'Scroll',
    'firm.eyebrow': 'The Firm', 'firm.cap': 'The partners of ZTM Abogados Asociados',
    'firm.text': 'We are a team of legal professionals whose main goal is to prevent any contingency for those we advise, and to guide those in complex, high-risk situations. We offer not only a legal service but personal attention to every client, who becomes part of the growth of the firm.',
    'stats.since': 'Year founded in Santa Cruz', 'stats.exp': 'Years of experience in the legal field, nationally and internationally', 'stats.areas': 'Practice areas', 'stats.offices': 'Offices: Santa Cruz and La Paz',
    'areas.eyebrow': 'Practice areas', 'areas.title': 'Specialists in every area of law.',
    'a1.t': 'Agrarian Law', 'a1.d': 'Advice on land regulation, the legal regime of agricultural holdings and companies, real estate transactions, rural leases and agrotourism.', 'a1.l1': 'Land regulation', 'a1.l2': 'Agricultural companies', 'a1.l3': 'Rural land leases',
    'a2.t': 'Real Estate', 'a2.d': 'Advice to commercial developments, condominiums, housing, hotel complexes and individual transactions to secure your investment.', 'a2.l1': 'Sales, mortgages and exchanges', 'a2.l2': 'Legal audit of properties', 'a2.l3': 'Financing and securitization',
    'a3.t': 'Civil & Commercial', 'a3.d': 'Negotiation and signing of commercial and civil contracts for domestic and foreign clients, covering every risk of the transaction.', 'a3.l1': 'Commercial and civil contracts', 'a3.l2': 'Coordination with tax and labor', 'a3.l3': 'Domestic and foreign clients',
    'a4.t': 'Conciliation & Arbitration', 'a4.d': 'Specialist teams for conciliation and arbitration: fast, economical mechanisms with the validity of a court judgment.', 'a4.l1': 'Commercial and corporate disputes', 'a4.l2': 'Real estate and construction', 'a4.l3': 'Breach of contract',
    'a5.t': 'Administrative & Regulatory', 'a5.d': 'Regulatory requirements for your industry and obtaining Health Registrations to market regulated products in Bolivia.', 'a5.l1': 'Pharmaceuticals and veterinary', 'a5.l2': 'Food, beverages and cosmetics', 'a5.l3': 'Sanitary registrations',
    'a6.t': 'Tax, Customs & Finance', 'a6.d': 'Innovative advice to optimize your tax burden in strict compliance with Bolivian law, backed by customs expertise and double-taxation treaties.', 'a6.l1': 'Tax law', 'a6.l2': 'Customs procedures, permits and contracts', 'a6.l3': 'Work with audit firms',
    'a7.t': 'Employment', 'a7.d': 'Strategic management of your workforce under current labor and social security rules, in administrative and judicial proceedings.', 'a7.l1': 'Hiring and dismissals', 'a7.l2': 'Labor negotiation and conciliation', 'a7.l3': 'Administrative and judicial proceedings',
    'a8.t': 'Environmental', 'a8.d': 'Advice to companies across industries on environmental permits, licenses and authorizations, and compliance with environmental obligations.', 'a8.l1': 'Licenses and authorizations', 'a8.l2': 'Waste and soil management', 'a8.l3': 'Wastewater treatment',
    'a9.t': 'Intellectual Property', 'a9.d': 'A complete team to advise and protect your intangible assets.', 'a9.l1': 'Trademarks, patents and designs', 'a9.l2': 'Copyright and domain names', 'a9.l3': 'Litigation, licensing and counterfeiting',
    'a10.t': 'Corporate', 'a10.d': 'Comprehensive advice from the incorporation of a company to the end of its legal existence, with ongoing support.', 'a10.l1': 'Incorporation and bylaw reform', 'a10.l2': 'Share capital and share transfers', 'a10.l3': 'Governing bodies of companies',
    'method.eyebrow': 'Our method', 'method.title': 'A clear process, from first call to resolution.', 'method.sub': 'No surprises, no needless jargon. You always know where your matter stands.',
    'm1.t': 'Listening and diagnosis', 'm1.d': 'A confidential conversation to understand facts, goals and risks, and to guide you candidly.',
    'm2.t': 'Tailored strategy', 'm2.d': 'We design the legal route and the possible scenarios, with clarity on scope and fees.',
    'm3.t': 'Rigorous execution', 'm3.d': 'Specialists in each field act with precision and keep you informed at every stage.',
    'm4.t': 'Resolution and follow-up', 'm4.d': 'We close the matter and stay with you to prevent future contingencies.',
    'team.eyebrow': 'Team', 'team.title': 'The lawyers behind every case.', 'team.crew': 'Lawyers of the Litigation and Corporate departments',
    'tp1.r': 'Partner · Commercial Department', 'tp1.d': 'Business Law (Harvard, USA) · Master in Banking Law (Complutense University of Madrid)',
    'tp2.r': 'Partner · Civil and Corporate Department', 'tp2.d': 'Master in Constitutional and Labor Law (Andean University Simón Bolívar) · Law of Persons (Salamanca)',
    'tp3.r': 'Partner · La Paz Office', 'tp3.d': 'Head of the firm’s legal office in La Paz',
    'tp4.r': 'Associate Attorney', 'tp4.d': 'Master in Criminal Procedure Law (Gabriel René Moreno Autonomous University)',
    'why.1t': 'Prevention first', 'why.1d': 'Our main goal is to prevent contingencies before they become disputes.',
    'why.2t': 'Personal attention', 'why.2d': 'Every client receives direct service and becomes part of the growth of the firm.',
    'why.3t': 'Multidisciplinary team', 'why.3d': 'Corporate, tax and labor specialists coordinate to anticipate any risk.',
    'why.4t': 'National and international reach', 'why.4d': 'We advise companies and individuals in Bolivia and abroad from Santa Cruz and La Paz.',
    'q.eyebrow': 'Who we are',
    'q1.t': 'Founded in Santa Cruz de la Sierra in June 2011 by Drs. Agustín Zambrana and Luis Felipe Tirado, the firm grew with the addition of Dr. Larry Monasterios in La Paz.', 'q1.a': 'Our history',
    'q2.t': 'To provide specialized legal services at the highest standards, with personalized and efficient advice for companies, individuals, cooperatives and associations.', 'q2.a': 'Mission',
    'q3.t': 'To be the leading law firm nationwide with international prestige, growing together with our clients and our team.', 'q3.a': 'Vision',
    'ins.eyebrow': 'News', 'ins.title': 'Legal news, explained.', 'ins.more': 'Read more →',
    'ins.1c': 'Business · Dec 2016', 'ins.1t': 'Enforcement action (acción de cumplimiento)', 'ins.1d': 'What it is and when it applies: the defense action under Article 134 of the Constitution.',
    'ins.2c': 'Tax · Dec 2016', 'ins.2t': 'Tax alert', 'ins.2d': 'Client notice about the approval by the Santa Cruz de la Sierra Municipal Council.',
    'ins.3c': 'Archive', 'ins.3t': 'All legal news',
    'faq.eyebrow': 'FAQ', 'faq.title': 'What people ask before they begin.',
    'f1.q': 'How do I request a consultation?', 'f1.a': 'Fill in the form, message us on WhatsApp, call our office or use the AI reception. Our team will get in touch with you.',
    'f2.q': 'Do you serve individuals and companies?', 'f2.a': 'Yes. We advise commercial companies, individuals, cooperatives, associations and civil societies, in Bolivia and abroad.',
    'f3.q': 'Where are you located?', 'f3.a': 'Our head office is in Santa Cruz de la Sierra (C. Dechia No. 29, Barrio Urbari) and we have a legal office in La Paz.',
    'f4.q': 'How confidential is my information?', 'f4.a': 'Your information is covered by professional privilege and handled with the utmost discretion.',
    'f5.q': 'Does the AI reception give legal advice?', 'f5.a': 'No. The AI reception takes your matter and answers general questions at any hour; an attorney of the firm reviews every request and contacts you.',
    'c.eyebrow': 'Contact', 'c.title': 'Let’s talk about <em>your case.</em>', 'c.lead': 'Tell us the essentials and an attorney from our team will get in touch with you.',
    'c.addr': 'Head office', 'c.phone': 'Phone', 'c.hours': 'Availability', 'c.hoursV': 'AI reception 24/7', 'c.wa': 'Message on WhatsApp',
    'c.name': 'Full name', 'c.tel': 'Phone / WhatsApp', 'c.areaPh': 'Area of your matter', 'c.other': 'Other', 'c.msg': 'Briefly tell us about your case',
    'c.consent': 'I accept the privacy policy and the processing of my data to handle my enquiry.', 'c.send': 'Send enquiry',
    'foot.tag': 'ZTM Abogados Asociados Soc. Civ. We prevent contingencies and guide you through complex situations.', 'foot.nav': 'Navigate', 'foot.legal': 'Legal', 'foot.priv': 'Privacy policy', 'foot.terms': 'Legal notice', 'foot.cookies': 'Cookies', 'foot.follow': 'Follow',
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
    if (k === 'facebook') { el.target = '_blank'; el.rel = 'noopener'; }
  });
  document.getElementById('yr').textContent = new Date().getFullYear();

  let initial = 'es';
  try { initial = localStorage.getItem('ztm-lang') || 'es'; } catch (e) {}
  if (initial === 'en') apply('en');
  document.getElementById('lang').addEventListener('click', () => apply(window.ZTM_I18N.lang === 'es' ? 'en' : 'es'));
})();
