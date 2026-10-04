/* ZTM Abogados — single source of truth for firm details.
   !! Everything below is PLACEHOLDER data. Replace with real values before launch. */
window.ZTM = {
  name: 'ZTM Abogados',
  phone: '+34 900 000 000',
  phoneRaw: '+34900000000',
  whatsapp: '34600000000',          // international format, digits only
  email: 'contacto@ztm-abogados.com',
  address: 'Calle Ejemplo 1, 1º, 28001 Madrid',
  linkedin: 'https://www.linkedin.com/',
  instagram: 'https://www.instagram.com/',
  stats: { years: 20, cases: 1500, success: 96, response: 24 },
  // Optional backends (see README). Leave '' to fall back to WhatsApp / mailto.
  chatEndpoint: '/api/chat',        // AI receptionist LLM proxy (Vercel function in /api)
  leadEndpoint: '/api/lead'         // receives contact form + chat leads
};
