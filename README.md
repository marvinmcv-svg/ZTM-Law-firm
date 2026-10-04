# ZTM Abogados: premium website

Static, build-free site (HTML/CSS/JS) with a WebGL hero, GSAP motion, bilingual ES/EN, an AI receptionist and a WhatsApp widget. Designed with the [taste-skill](https://github.com/Leonxlnx/taste-skill) "Editorial Luxury" direction: ink + antique gold, Fraunces + Manrope, double-bezel cards, button-in-button CTAs, custom cubic-bezier motion, grain, floating glass nav.

## Run locally
Needs Node 18+ (nodejs.org). From the unzipped folder:
```
npm install      # one time (only needed to rebuild the 3D scene or images)
npm start        # http://localhost:3000
```
`npm start` serves the site and runs the `/api` functions, so the contact form and AI receptionist work end to end. Submitted leads print in the terminal. To enable LLM answers in the chat: `ANTHROPIC_API_KEY=sk-ant-... npm start` (Windows PowerShell: `$env:ANTHROPIC_API_KEY="sk-ant-..."; npm start`).
No Node? `python3 -m http.server 8000` also shows the site, but the form and chat then fall back to email/WhatsApp.

## Put it on the web
- **Vercel (recommended, supports /api):** `npx vercel` for a preview URL, `npx vercel --prod` for production. Add env vars `ANTHROPIC_API_KEY` and `LEAD_WEBHOOK_URL` in the Vercel dashboard (Project > Settings > Environment Variables). Or import the GitHub repo at vercel.com/new.
- **Netlify / any static host:** drag the folder in (netlify.com/drop). Everything works except `/api`: the form falls back to email and the chat to its built-in rules.
- Then point `www.ztm-abogados.com` at it from your domain provider.

## What is on the page
Preloader · floating glass nav + fullscreen menu · Three.js gold 3D object over a fluid shader gradient that shifts palette on scroll · masked headline reveal · marquee · scrubbed word-by-word manifesto · animated stats · pinned horizontal practice-area pan with 3D tilt · sticky-stack method · team · "why us" · testimonials · insights · FAQ · contact form + WhatsApp · legal disclaimer · cookie consent · SEO (meta, OG, JSON-LD `LegalService`) · reduced-motion support · mobile layouts.

## Widgets
- **WhatsApp**: floating button + contact CTA, prefilled message (`js/config.js` → `whatsapp`).
- **AI receptionist**: guided intake (area → urgency → summary → name → contact) that POSTs to `/api/lead`, falls back to a one-click WhatsApp hand-off. Free text is answered by `/api/chat` (Claude) if `ANTHROPIC_API_KEY` is set, otherwise by a local keyword engine. It never gives legal advice.

## Content source
Real content was taken from ztm-abogados.com (Oct 2026): firm history, mission/vision, 10 practice areas, partners and associates, address, phone, email, map and two news articles. Photos live in `assets/img/raw` and are optimised to WebP with `node scripts/optimize-images.mjs`.

## Still needed from the firm
1. **`js/config.js` → `whatsapp`**: a Bolivian mobile number (digits, international format, e.g. `59170000000`). Until set, WhatsApp buttons open WhatsApp's contact picker with the message prefilled.
2. Associate roles: the 7 associates are named from their photo filenames (the old site shows no names or roles). Confirm names, and say which belong to Litigation vs Corporate.
3. Larry Monasterios Torrico has no photo or bio on the old site (placeholder monogram).
4. Real testimonials/case results, if the firm wants them (none were published, so none are invented).

6. Vercel env vars: `ANTHROPIC_API_KEY` (optional, LLM answers in the chat) and `LEAD_WEBHOOK_URL` (Slack/Zapier/CRM; without it `/api/lead` returns 503 and the UI falls back to mailto/WhatsApp).
