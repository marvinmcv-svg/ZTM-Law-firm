/* ZTM Abogados: single source of truth for firm details.
   Source: ztm-abogados.com (scraped Oct 2026). Items marked TODO are not on the old site; fill them in. */
window.ZTM = {
  name: 'ZTM Abogados Asociados Soc. Civ.',
  phone: '(+591) 3 355 9955',
  phoneRaw: '+59133559955',
  whatsapp: '',                      // TODO: Bolivian mobile in international format, digits only, e.g. 59170000000. Empty = wa.me opens a contact picker.
  email: 'central@ztm-abogados.com',
  address: 'C. Dechia No. 29, Barrio Urbari, Santa Cruz de la Sierra, Bolivia',
  facebook: 'https://www.facebook.com/ztm.abogados/',
  since: 2011,
  stats: { since: 2011, experience: 50, areas: 10, offices: 2 },
  // Optional backends (see README). The UI falls back to mailto / WhatsApp when they are not deployed.
  chatEndpoint: '/api/chat',
  leadEndpoint: '/api/lead'
};
