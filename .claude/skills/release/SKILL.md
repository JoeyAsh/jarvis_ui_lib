---
name: release
description: Cut and publish a new jarvis-react-ui version end to end (version PR, changelog cut, GitHub release, npm Trusted Publishing, verification). Use only when the user runs /release or explicitly asks to release, publish or ship a version.
argument-hint: '[patch|minor|major|x.y.z]'
disable-model-invocation: true
---

# Release

Rules: `.claude/rules/release.md`, `.claude/rules/identity.md`, `.claude/rules/changelog.md`. Never
merge the PR yourself, never `npm publish` locally, never force-push or delete tags.
Argument: `$ARGUMENTS` (bump keyword or explicit `x.y.z`; empty = derive from the changelog).

## 1. Preflight

```bash
git fetch --prune
git checkout main && git pull --ff-only
git status --porcelain                                  # must be empty
git config user.name; git config user.email             # JoeyAsh / 49749990+JoeyAsh@users.noreply.github.com
gh run list --branch main --workflow CI --limit 1      # last run must be completed + success
gh pr list --state open                                 # ask the user if any should go in first
```

`## [Unreleased]` in `CHANGELOG.md` MUST be non-empty, otherwise stop.

## 2. Determine the version

Use the argument, or derive it with the changelog skill rules (section B.1: Removed/breaking ->
major, Added/Changed/Deprecated -> minor, Fixed/Security only -> patch; pre-1.0 breaking may bump
minor). Confirm `x.y.z` with the user before continuing.

## 3. Release PR

```bash
git checkout -b release/x.y.z
```

Run the release-cut part of the `/changelog` skill (B.2-B.4): move `[Unreleased]` to
`## [x.y.z] - YYYY-MM-DD`, update the compare links, then
`npm version x.y.z --no-git-tag-version` and `npx prettier --write CHANGELOG.md`.

Run all checks; every one must pass:

```bash
npm ci
npm run typecheck && npm run lint && npm run format:check && npm test
npm run build && npm run build:showcase
npm pack --dry-run
```

Commit and open the PR (stage only `CHANGELOG.md`, `package.json`, `package-lock.json`):

```bash
git add CHANGELOG.md package.json package-lock.json
git commit -m "chore(release): x.y.z" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -u origin release/x.y.z
gh pr create --base main --title "chore(release): x.y.z" --body "<summary>

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
gh pr checks --watch
```

## 4. Merge (user)

STOP. Tell the user the PR is green and ask them to merge it with **Rebase and merge**. Wait for
their confirmation. Then verify:

```bash
git checkout main && git pull --ff-only
node -p "require('./package.json').version"   # must be x.y.z
```

## 5. GitHub release

Write the `[x.y.z]` section of `CHANGELOG.md` (without the heading line) to a notes file in the
scratchpad/temp directory, then:

```bash
gh release create vx.y.z --target main --title vx.y.z --notes-file <notes-file> --latest
```

`--target` must be a branch name or a FULL commit sha; short shas fail with HTTP 422.

## 6. Watch and verify

```bash
gh run list --workflow release.yml --limit 1
gh run watch <run-id> --exit-status
npm view jarvis-react-ui version dist-tags.latest   # both must be x.y.z
```

Report the version, release URL and workflow result.

## 7. Troubleshooting

- **Tag/version mismatch** ("Verify tag matches package version" fails): `package.json` on `main`
  differs from the tag. Do not delete anything; ask the user. Fix via a PR if needed and cut a new
  patch.
- **OIDC 404/403 on publish**: check the npm package settings (Trusted Publisher): GitHub Actions,
  owner `JoeyAsh`, repository `jarvis_ui_lib`, workflow `release.yml`, environment empty, and
  "Allow npm publish" checked. Then ask the user to re-run the failed workflow.
- **Version already on npm**: the workflow logs a notice and skips publish; nothing to do.
- **Checks fail in the workflow**: fix via a normal PR; delete no tag or release without explicit
  user instruction. If a broken version already shipped, cut a new patch release. Never unpublish.
