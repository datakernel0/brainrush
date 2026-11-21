# BrainRush

**Play smart. Beat your best.** A static, mobile-first browser arcade with 15 mini-games.

## Requirements

- Node.js 20.9 or newer
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For browser smoke tests, install the Playwright Chromium browser once (`npx playwright install chromium`) and run `npm run test:e2e`. After a successful build, preview the static export with `python -m http.server 8000 --directory out` and open http://localhost:8000.

The production build uses Next.js static export and writes the deployable website to `out/`. No application server, API, database, authentication or admin dashboard is required.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Use the default Next.js build command (`npm run build`).
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain, without a trailing slash.
5. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` to a real monitored address.
6. Deploy. The static export is generated in `out/`.

For static hosting outside Vercel, publish the contents of `out/` and configure the host to serve directory `index.html` files. Keep trailing-slash URLs enabled to match exported routes.

## Environment variables

Copy `.env.example` to `.env.local` for local configuration. All `NEXT_PUBLIC_` values are public and must never contain secrets.

- `NEXT_PUBLIC_SITE_URL`: canonical production origin; update before launch.
- `NEXT_PUBLIC_CONTACT_EMAIL`: real public contact address; otherwise the Contact page displays a setup notice.
- `NEXT_PUBLIC_ADSTERRA_SCRIPT_URL`: reserved for an approved provider integration. The included `AdSlot` remains a safe placeholder; it does not load an arbitrary script URL. Add the exact code supplied by the publisher after approval and review applicable consent rules.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: optional Plausible domain; when set, the site loads the cookieless Plausible script and records page views plus game events. Review legal/consent requirements for your visitors before enabling.
- `NEXT_PUBLIC_ANALYTICS_ID`: reserved; not currently used.

## Game library

1. Reaction Time Test
2. Click Speed Challenge
3. Aim Trainer
4. Typing Speed Test
5. Fast Tap Challenge
6. Memory Grid
7. Number Memory
8. Sequence Recall
9. Pattern Memory
10. Odd One Out
11. Color Match
12. Number Sequence Puzzle
13. Quick Math Challenge
14. Daily Brain Challenge
15. Daily Reaction Challenge

Every game has a static URL at `/games/<slug>/`.

## Data and privacy model

- Scores, recent games and daily completion flags use browser `localStorage` only.
- Storage reads are validated and storage failures are handled without crashing the game.
- Records do not sync between devices and are not globally verified.
- Daily challenge seeds include game identifier, UTC date and version `v1`.
- No custom backend, database, user accounts or admin dashboard exists.

## Advertising

Advertising is disabled by default. Do not enable ads until the site and format are approved by the provider. Keep ad slots visually distinct from gameplay controls, add only provider-issued code, and implement consent where required. Revenue is not guaranteed.

## Important launch tasks

- Replace `https://brainrush.example` with the actual domain through `NEXT_PUBLIC_SITE_URL`.
- Configure a real contact email.
- Review legal templates for the actual owner, jurisdiction, analytics and advertising providers. These templates are not legal advice.
- Check brand/trademark and domain availability.
- Apply for Adsterra approval and implement only the exact approved ad code and consent flow.
- Test current production URLs on desktop Chrome/Edge and mobile Chrome/Safari.
- Connect Google Search Console and submit `/sitemap.xml` after deployment.

## Project structure

```text
src/
  app/                 Next.js pages, metadata, sitemap and robots
  components/          Shared shell, cards, ad slot and game runtime
  games/<slug>/Game.tsx  Independent game view entry points (15 routes)
  games/shared/         Reusable, game-specific UI primitives
  data/games.ts        Single typed game catalog and per-game copy
  lib/                 Local storage, deterministic random and sharing
 tests/                 Unit tests for deterministic generation
```

## Notes

The site is static-export compatible. The client game runtime is isolated from the public page layout. Browser timers are cleaned up on restart/unmount. A few game scores are intentionally local-only and should never be presented as certified measurements.
