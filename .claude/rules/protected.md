# Protected files

- **`src/ui/orb/orbEngine.ts`** is a Three.js engine treated as a black box. Never modify it — not
  for lint, typing, formatting by hand or refactors. Adapt on the consumer side
  (`src/ui/orb/ThreeOrb/`). If a change really seems necessary, stop and ask the user.
- `ThreeOrb`, `createOrb` and `OrbEngine` stay **out of** `src/ui/index.ts` (separate lazy chunk);
  consumers use `@ui/orb`.
- The alias lists in `tsconfig.json` and `vite.config.ts` must stay in sync; do not rename aliases.
- Do not loosen `eslint.config.js` rules or add `eslint-disable` to get a green lint.
- `public/sounds/**` are generated binaries: add or replace via `/add-sound`, never edit by hand.
