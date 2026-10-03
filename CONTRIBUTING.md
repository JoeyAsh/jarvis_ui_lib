# Contributing

Thanks for helping out. `main` is protected: every change goes through a feature branch and a pull
request, and CI must be green before merging.

## Setup

```bash
git clone https://github.com/JoeyAsh/jarvis_ui_lib.git
cd jarvis_ui_lib
npm ci
npm run dev   # showcase at http://localhost:5173
```

Node 22 is used in CI. `.npmrc` sets `legacy-peer-deps=true`; keep it.

## Workflow

1. Branch from `main`: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`, `docs/<topic>`.
2. Make your change. New or changed components need tests and a showcase demo.
3. Run all checks locally (see below).
4. Open a pull request into `main` and fill in the template.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/): `feat(ui): ...`, `fix(window): ...`,
`docs: ...`, `chore: ...`, `test: ...`, `refactor: ...`.

## Checks

```bash
npm run typecheck
npm run lint            # 0 errors AND 0 warnings
npm run format:check    # npm run format to fix
npm test
npm run build           # library
npm run build:showcase
```

The `ci` workflow runs exactly these. See `CLAUDE.md` and `.claude/rules/` for the code rules
(one component per file, types in `.types.ts`, Tailwind first, no inline styles, no `any`).

## Releasing

See [RELEASING.md](RELEASING.md). Maintainers only.
