# 별빛 사주 | Starlight Saju

A Korean Saju fortune-telling web app powered by OpenAI GPT-4o-mini. Get personalized readings based on your birth date and time using the traditional Four Pillars of Destiny (사주팔자) system.

## Features

- **Personal Saju Reading** — 17-item deep analysis of your four pillars (year, month, day, hour)
- **Compatibility Reading** — Relationship compatibility between two people
- **2026 Annual Fortune** — Personalized fortune forecast with monthly breakdowns
- **Pregnancy Mode** — Lucky items, parenting tips, and energy readings for expectant parents
- **Korean / English** — Full bilingual support (한국어 / English)
- **Image Sharing** — Share your Saju readings as images
- **Payment System** — Toss Payments integration for premium readings
- **PWA Support** — Installable as a mobile app

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| AI | OpenAI GPT-4o-mini (streaming) |
| Payment | Toss Payments SDK |
| Image Export | html2canvas |
| Language | TypeScript |
| Styling | Global CSS (dark cosmic theme) |
| Testing | Vitest, Testing Library |

## Live Demo

[https://saju-app-snowy.vercel.app/](https://saju-app-snowy.vercel.app/)

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/PPorongee/saju.app.git
cd saju-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and add your API keys

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Deploying to Vercel

### Step-by-step instructions

1. **Push to GitHub**
   - Create a new repository on [github.com](https://github.com)
   - Push your local code: `git push -u origin main`

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **"Add New Project"**
   - Select **"Import Git Repository"** and choose your GitHub repo
   - Vercel auto-detects Next.js — no framework changes needed

3. **Add environment variables**
   - In the Vercel project settings, go to **Settings > Environment Variables**
   - Add the required keys (see table below)
   - Apply to **Production**, **Preview**, and **Development** environments

4. **Deploy**
   - Click **"Deploy"**
   - Vercel builds and deploys automatically — your live URL appears when complete
   - Every push to `main` triggers an automatic re-deployment

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key from [platform.openai.com](https://platform.openai.com) | Yes |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | Toss Payments client key | Yes (for payments) |
| `TOSS_SECRET_KEY` | Toss Payments secret key (server-only) | Yes (for payments) |

## Project Structure

```
saju-app/
├── public/
│   ├── favicon.svg              # App icon
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── saju/route.ts    # Streaming AI API route
│   │   │   └── payment/confirm/route.ts  # Toss payment confirmation
│   │   ├── payment/             # Payment flow (checkout, success, fail)
│   │   ├── privacy/             # Privacy policy page
│   │   ├── terms/               # Terms of service page
│   │   ├── refund/              # Refund policy page
│   │   ├── globals.css          # Global styles (~1115 lines)
│   │   ├── layout.tsx           # Root layout + metadata
│   │   └── page.tsx             # Main page
│   ├── components/
│   │   └── SajuApp.tsx          # Main UI component (~3760 lines)
│   └── lib/
│       ├── saju-calc.ts         # Saju calculation engine
│       ├── saju-prompt.ts       # AI system prompt
│       ├── saju-prompt-builder.ts  # Structured prompt builder
│       ├── saju-advanced-prompt.ts # Extended classical knowledge
│       ├── saju-references.ts   # RAG classical reference library
│       ├── saju-ref-selector.ts # Reference selection by topic
│       ├── payment-config.ts    # Payment & business configuration
│       ├── payment-provider.ts  # Payment provider abstraction
│       ├── lunar-solar.ts       # Lunar-to-solar calendar conversion
│       └── i18n.ts              # Internationalization (KO/EN)
├── .env.example                 # Environment variable template
├── next.config.ts               # Next.js configuration
├── vitest.config.ts             # Test configuration
└── package.json
```

## License

MIT
