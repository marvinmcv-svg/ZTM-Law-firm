// Local dev server: serves the static site and runs the /api functions exactly like Vercel would.
// Usage: npm start   (optional env: ANTHROPIC_API_KEY, LEAD_WEBHOOK_URL, PORT)
// Without LEAD_WEBHOOK_URL, leads are just printed to this terminal (ALLOW_LOG_ONLY is enabled locally).
const http = require('http'), fs = require('fs'), path = require('path');
process.env.ALLOW_LOG_ONLY = process.env.ALLOW_LOG_ONLY || '1';
const root = __dirname, port = process.env.PORT || 3000;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x'); let p = decodeURIComponent(url.pathname);
  if (p.startsWith('/api/')) {
    const file = path.join(root, p + '.js');
    if (!file.startsWith(path.join(root, 'api')) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    let body = ''; for await (const c of req) body += c;
    req.body = body; res.status = c => { res.statusCode = c; return res; }; res.json = o => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
    try { return await require(file)(req, res); } catch (e) { console.error(e); res.statusCode = 500; return res.end(); }
  }
  if (p === '/') p = '/index.html';
  let f = path.join(root, p); if (!f.startsWith(root) || f.includes('node_modules') && !f.includes('assets')) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-cache' }); fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log(`\n  ZTM Abogados running at http://localhost:${port}\n  AI chat: ${process.env.ANTHROPIC_API_KEY ? 'LLM enabled' : 'local rules only (set ANTHROPIC_API_KEY for LLM answers)'}\n`));
