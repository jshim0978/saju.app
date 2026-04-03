# 별빛 사주 | Starlight Saju

A Korean Saju fortune-telling web app powered by OpenAI GPT-4o. Get personalized readings based on your birth date and time using the traditional Four Pillars of Destiny (사주팔자) system.

## Features

- **Personal Saju Reading** — Detailed analysis of your four pillars (year, month, day, hour)
- **Compatibility Reading** — Relationship compatibility between two people
- **2026 Annual Fortune** — Personalized fortune forecast for the year ahead
- **Pregnancy Mode** — Auspicious timing and energy readings for expectant parents
- **Korean / English** — Full bilingual support (한국어 / English)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| AI | OpenAI GPT-4o (streaming) |
| Language | TypeScript |
| Styling | CSS Modules / globals |

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/saju-app.git
cd saju-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and add your OpenAI API key

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
   - Add the key `OPENAI_API_KEY` with your OpenAI secret key as the value
   - Apply to **Production**, **Preview**, and **Development** environments

4. **Deploy**
   - Click **"Deploy"**
   - Vercel builds and deploys automatically — your live URL appears when complete
   - Every push to `main` triggers an automatic re-deployment

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key from [platform.openai.com](https://platform.openai.com) | Yes |

## Project Structure

```
saju-app/
├── public/
│   └── favicon.svg          # App icon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── saju/
│   │   │       └── route.ts # Streaming AI API route
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout + metadata
│   │   └── page.tsx         # Main page
│   └── lib/
│       └── saju-prompt.ts   # System prompts (KO/EN)
├── .env.example             # Environment variable template
├── next.config.ts           # Next.js configuration
└── package.json
```

## License

MIT
