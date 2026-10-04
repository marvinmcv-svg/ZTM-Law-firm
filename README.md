# ZTM Abogados: premium website

Static, build-free site (HTML/CSS/JS) with a WebGL hero, GSAP motion, bilingual ES/EN, an AI receptionist and a WhatsApp widget. Designed with the [taste-skill](https://github.com/Leonxlnx/taste-skill) "Editorial Luxury" direction: ink + antique gold, Fraunces + Manrope, double-bezel cards, button-in-button CTAs, custom cubic-bezier motion, grain, floating glass nav.

## Run
```
npm install
npx serve .          # any static server works
npm run build:scene  # only if you edit src/scene.js (rebundles Three.js)
```
Deploy on Vercel as-is (`/api` holds optional serverless functions).

## What is on the page
Preloader · floating glass nav + fullscreen menu · Three.js gold 3D object over a fluid shader gradient that shifts palette on scroll · masked headline reveal · marquee · scrubbed word-by-word manifesto · animated stats · pinned horizontal practice-area pan with 3D tilt · sticky-stack method · team · "why us" · testimonials · insights · FAQ · contact form + WhatsApp · legal disclaimer · cookie consent · SEO (meta, OG, JSON-LD `LegalService`) · reduced-motion support · mobile layouts.

## Widgets
- **WhatsApp**: floating button + contact CTA, prefilled message (`js/config.js` → `whatsapp`).
- **AI receptionist**: guided intake (area → urgency → summary → name → contact) that POSTs to `/api/lead`, falls back to a one-click WhatsApp hand-off. Free text is answered by `/api/chat` (Claude) if `ANTHROPIC_API_KEY` is set, otherwise by a local keyword engine. It never gives legal advice.

## Configure before launch
1. **`js/config.js`**: phone, WhatsApp number, email, address, social links, stats. **All values are placeholders.**
2. Replace placeholder content in `index.html` / `js/i18n.js`: team names/roles/photos, testimonials, insight articles, practice-area copy. The original site could not be fetched from the build environment, so copy was written generically.
3. Vercel env vars: `ANTHROPIC_API_KEY` (optional, enables LLM chat), `LEAD_WEBHOOK_URL` (Slack/Zapier/CRM; without it `/api/lead` returns 503 and the UI falls back to mailto/WhatsApp), optional `ANTHROPIC_MODEL`.
4. Add real privacy policy / legal notice pages and check bar-advertising rules for your jurisdiction.
