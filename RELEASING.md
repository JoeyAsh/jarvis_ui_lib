# Releasing

Releases are published to npm by the `release` workflow when a GitHub release is published. It uses
npm Trusted Publishing (OIDC), so no `NPM_TOKEN` secret is needed, and publishes with provenance.

## First publish (manual, once)

Trusted publishing can only be configured for a package that already exists on npm, so the very
first version has to be published by hand:

```bash
npm login
npm ci
npm publish --access public   # runs prepublishOnly: typecheck, lint, test, build
```

Then on npmjs.com open the package, go to **Settings > Trusted Publisher** and add a GitHub Actions
publisher:

- Organization or user: `JoeyAsh`
- Repository: `jarvis_ui_lib`
- Workflow filename: `release.yml`
- Environment: leave empty

## Regular releases

1. Open a PR that bumps `version` in `package.json` (SemVer) and cut the changelog, then merge it
   with **Rebase and merge** (the only enabled merge method).
2. Create a GitHub release with tag `v<version>` (matching `package.json`).
3. The `release` workflow runs the checks and runs `npm publish --provenance --access public`.

The workflow fails if the tag does not match the `package.json` version.

If `jarvis-react-ui@<version>` already exists on npm (for example the manually published first release),
the workflow detects this, logs a notice and skips `npm publish` instead of failing.

Claude Code users: the `/release` skill runs these steps; see `.claude/rules/release.md`.
