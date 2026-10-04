// Builds dist/ztm-preview.html: index.html with CSS, JS, fonts and images inlined (for previews that can't load sibling files).
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
const mime = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', woff2: 'font/woff2' };
const uri = f => `data:${mime[f.split('.').pop()]};base64,${readFileSync(f).toString('base64')}`;
let html = readFileSync('index.html', 'utf8');
let css = readFileSync('css/styles.css', 'utf8').replace(/url\("\.\.\/([^"]+)"\)/g, (_, p) => `url("${uri(p)}")`);
html = html.replace(/<link rel="stylesheet" href="css\/styles.css">/, () => `<style>${css}</style>`);
html = html.replace(/<link rel="preload"[^>]*>\n?/g, '');
html = html.replace(/<link rel="icon" href="([^"]+)"[^>]*>/, (m, p) => `<link rel="icon" href="${uri(p)}">`);
html = html.replace(/<script src="([^"]+)"( defer)?><\/script>/g, (_, p) => `<script>${readFileSync(p, 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(/(src|href)="(assets\/img\/[^"]+\.(?:webp|svg|jpg))"/g, (_, a, p) => `${a}="${uri(p)}"`);
mkdirSync('dist', { recursive: true }); writeFileSync('dist/ztm-preview.html', html);
console.log('dist/ztm-preview.html', (html.length / 1024 / 1024).toFixed(2) + ' MB');
