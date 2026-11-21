# BrainRush development handoff

## Team split

### Developer 1 — platform and frontend
- Maintain the brand system, navigation, homepage and footer.
- Maintain the games directory, game page template and legal/informational pages.
- Review responsive layouts, accessibility and SEO metadata.
- Maintain static export configuration, Vercel deployment and final integration.

### Developer 2 — game engineering
- Own the individual game modules under `src/games/<slug>/`.
- Maintain scoring, timers, touch/mouse input and game-specific state transitions in `src/components/GameClient.tsx` and `src/games/shared/GameViews.tsx`.
- Maintain local records and daily challenge generation under `src/lib/`.
- Add unit tests for deterministic challenge logic and browser tests for gameplay.

### Shared integration contract
- Route ID and URL slug are the `id` and `slug` in `src/data/games.ts`.
- Every game module exports a default view component and receives `GameViewProps` from `src/games/shared/GameViews.tsx`.
- `GameClient` owns common game lifecycle, result display, record writes and sharing.
- Each view owns its own presentation and delegates player actions through typed callbacks.
- `saveRecord` uses a stable game key; daily brain and daily reaction keep separate `daily` and `practice` keys.
- Daily puzzle seeds are `hash(gameId + UTC date + version)`. Increment the version whenever a challenge algorithm changes.
- Browser storage is optional: all storage calls must continue to fail gracefully when localStorage is blocked.

## Pull request checklist

- [ ] Game route exists in `src/data/games.ts` and `generateStaticParams` picks it up.
- [ ] A game view module exists under `src/games/<slug>/`.
- [ ] Start, restart, scoring, result and share paths work.
- [ ] Personal best uses the correct comparison direction (higher or lower is better).
- [ ] Timers are cleared on completion and unmount.
- [ ] Touch, mouse and keyboard interactions are usable.
- [ ] No score is represented as globally verified.
- [ ] Daily variants are deterministic by UTC date and challenge version.
- [ ] `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass.
- [ ] Check the static export and mobile layout before merge.
