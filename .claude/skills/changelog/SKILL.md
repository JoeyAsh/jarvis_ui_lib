---
name: changelog
description: Add a CHANGELOG.md entry under [Unreleased] for the current change, or cut a release (pick SemVer bump, move Unreleased to a dated version heading, update compare links, bump package.json). Use when a PR has a user-facing change, when asked to update or write the changelog or release notes, or when preparing, cutting or tagging a release or version bump.
allowed-tools: Bash(git diff *) Bash(git log *) Bash(git status *) Bash(npm version *) Bash(npx prettier *)
---

# Changelog

`CHANGELOG.md` follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and SemVer.
Categories: Added, Changed, Deprecated, Removed, Fixed, Security.

## A. Add an entry (every user-facing PR)

1. Inspect the change: `git diff main...HEAD` and `git log main..HEAD --oneline`.
2. Decide if it is user-facing: new/changed/removed component, prop, export, token, sound, behavior
   or visual change, bug fix, security fix. Pure refactors, tests, CI, docs and tooling need no entry
   (tick "not needed" in the PR checklist).
3. Add concise bullets under `## [Unreleased]` in the right category (create the `###` heading if
   missing, keep the category order above). Write for consumers: name the component or export and
   the effect, e.g. `- \`Panel\`: new \`collapsed\` prop.`Mark breaking changes with`**BREAKING:**`.
4. Run `npx prettier --write CHANGELOG.md`.

## B. Cut a release

1. Pick the bump from the `[Unreleased]` entries: any `Removed` or `**BREAKING:**` -> major;
   `Added` / `Changed` / `Deprecated` -> minor; only `Fixed` / `Security` -> patch.
   While the version is 0.x, breaking changes may bump minor instead; state the choice.
2. Replace the `[Unreleased]` block with an empty `## [Unreleased]` and a new
   `## [x.y.z] - YYYY-MM-DD` heading (today's date) holding the moved entries.
3. Update the bottom links: `[Unreleased]: .../compare/vx.y.z...HEAD` and
   `[x.y.z]: .../compare/v<previous>...vx.y.z` (first release: `.../releases/tag/vx.y.z`), base URL
   `https://github.com/JoeyAsh/jarvis_ui_lib`.
4. Bump the version: `npm version x.y.z --no-git-tag-version`.
5. Open a PR with these changes; after merge, create a GitHub release with tag `vx.y.z`. That
   triggers the `release` workflow, which publishes to npm (see `RELEASING.md`). The tag must match
   the `package.json` version.
