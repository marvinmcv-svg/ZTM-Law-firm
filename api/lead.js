// Vercel serverless function: receives leads from the contact form and AI receptionist.
// Forwards to LEAD_WEBHOOK_URL (Slack/Zapier/Make/CRM) when set; always logs to function logs.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const lead = {
      source: String(b.source || 'unknown').slice(0, 40), lang: String(b.lang || '').slice(0, 5),
      name: String(b.name || '').slice(0, 120), email: String(b.email || '').slice(0, 160), phone: String(b.phone || '').slice(0, 40),
      contact: String(b.contact || '').slice(0, 160), area: String(b.area || '').slice(0, 60), urgency: String(b.urgency || '').slice(0, 20),
      message: String(b.message || b.summary || '').slice(0, 4000), at: new Date().toISOString()
    };
    if (!lead.name || !(lead.email || lead.contact || lead.phone)) return res.status(400).json({ error: 'invalid' });
    console.log('NEW LEAD', JSON.stringify(lead));
    if (process.env.LEAD_WEBHOOK_URL) {
      await fetch(process.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: `New ${lead.source} lead: ${lead.name} (${lead.email || lead.contact || lead.phone}) - ${lead.area} ${lead.urgency}\n${lead.message}`, lead }) });
    } else if (!process.env.ALLOW_LOG_ONLY) {
      return res.status(503).json({ error: 'not configured' }); // client falls back to mailto / WhatsApp
    }
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'server' }); }
};
