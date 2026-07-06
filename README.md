# Jason Achilles — Live Terminal

React/Vite site for [jasonachilles.com](https://jasonachilles.com). Deploys to SiteGround on every push to `main` via GitHub Actions (see [DEPLOY.md](DEPLOY.md)).

## Run locally

**Prerequisites:** Node.js 20+

1. `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` if you use AI features.
3. `npm run dev` — opens at http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build → `dist/` |
| `npm test` | Vitest unit tests |
| `npm run lint` | TypeScript check |
