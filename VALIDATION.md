# Validation record

Checks completed while preparing this source archive:

- All TypeScript/TSX files passed a TypeScript transpilation syntax check.
- The source tree passed a structural TypeScript check using temporary ambient declarations for external packages.
- The main stylesheet passed a PostCSS parse check.
- The static game catalog contains exactly 15 entries.
- Deterministic random checks passed: same UTC date/version gives the same seed, the next UTC date changes it, and seeded sequences repeat.

Checks that could not be run in this environment:

- `npm install`, `npm run typecheck` against the real Next/React package types, `npm run lint`, `npm test`, `npm run build` and Playwright browser tests require downloading npm packages. The package registry hostname could not be resolved from this environment, so dependencies could not be installed. No successful production build is claimed.

Before deployment, run the commands in the README on a machine with npm registry access. Fix any environment-specific dependency or browser issues before publishing. Adsterra, Plausible, the real domain and the public contact email must be configured by the site owner.
