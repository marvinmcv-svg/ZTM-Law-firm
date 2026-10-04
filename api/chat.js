// Vercel serverless function: LLM brain for the AI receptionist.
// Set ANTHROPIC_API_KEY in the project env. Without it the widget falls back to its local keyword engine.
const SYSTEM = (lang) => `You are the virtual receptionist of ZTM Abogados, a premium law firm.
Reply in ${lang === 'en' ? 'English' : 'Spanish'}, warm, concise (max 3 short sentences).
You may explain what the firm does, hours (Mon-Fri 9-19), the free first orientation, that fees are quoted in writing, confidentiality, and offer to log the visitor's matter so an attorney calls back within 24h.
NEVER give legal advice, predict outcomes, or interpret laws. If asked, say an attorney must review it and offer intake.
For emergencies (arrest, court summons, imminent deadlines) tell them to call the firm immediately.
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
