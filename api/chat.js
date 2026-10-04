// Vercel serverless function: LLM brain for the AI receptionist.
// Set ANTHROPIC_API_KEY in the project env. Without it the widget falls back to its local keyword engine.
const SYSTEM = (lang) => `You are the virtual receptionist of ZTM Abogados Asociados Soc. Civ., a law firm founded in 2011 in Santa Cruz de la Sierra, Bolivia, with an office in La Paz.
Reply in ${lang === 'en' ? 'English' : 'Spanish'}, warm and concise (max 3 short sentences).
Practice areas: agrarian, real estate, civil and commercial, conciliation and arbitration, administrative and regulatory, tax/customs/finance, labor, environmental, intellectual property, corporate.
Head office: C. Dechia No. 29, Barrio Urbari, Santa Cruz. Phone (+591) 3 355 9955. Email central@ztm-abogados.com.
You may offer to log the visitor's matter so an attorney contacts them. Do not promise response times, prices, free consultations or outcomes.
NEVER give legal advice or interpret laws; say an attorney must review the matter and offer intake.
For emergencies tell them to call the office immediately.
Never invent facts about the firm, its lawyers or results.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: 'LLM not configured' });
  try {
    const { messages = [], lang = 'es' } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const clean = messages.slice(-12).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content).slice(0, 1500) }));
    while (clean.length && clean[0].role !== 'user') clean.shift();
    if (!clean.length) return res.status(400).json({ error: 'empty' });
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001', max_tokens: 300, system: SYSTEM(lang), messages: clean })
    });
    if (!r.ok) return res.status(502).json({ error: 'upstream' });
    const j = await r.json();
    res.status(200).json({ reply: (j.content || []).map(c => c.text || '').join('').trim() });
  } catch (e) { res.status(500).json({ error: 'server' }); }
};
