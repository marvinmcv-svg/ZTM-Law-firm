// Resizes assets/img/raw/*.jpg into web-ready WebP (portraits 640px wide).
import sharp from 'sharp'; import { readdirSync, mkdirSync } from 'fs';
mkdirSync('assets/img/raw', { recursive: true });
for (const f of readdirSync('assets/img/raw').filter(f => f.endsWith('.jpg'))) {
  const out = 'assets/img/' + f.replace('.jpg', '.webp');
  const i = await sharp('assets/img/raw/' + f).resize({ width: f.startsWith('team-') ? 640 : 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  console.log(out, i.width + 'x' + i.height, Math.round(i.size / 1024) + 'KB');
}
