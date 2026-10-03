# Changelog rule

`CHANGELOG.md` follows Keep a Changelog 1.1.0 and SemVer. This rule is mandatory.

- Every **user-facing** change (feat, fix, breaking change, deprecation, removal, visual or
  behavioral change, new/changed sound) MUST add an entry under `## [Unreleased]` **in the same
  PR**. Pure internal refactors, tests, CI, docs and tooling need no entry.
- The entry MUST be in the correct category: Added, Changed, Deprecated, Removed, Fixed or Security.
  Write concise, consumer-facing bullets naming the component or export; mark breaking changes
  `**BREAKING:**`.
- CI fails PRs that touch `src/` or `public/` without touching `CHANGELOG.md`, unless the PR has the
  `skip-changelog` label (use only for genuinely internal changes).
- On release the `[Unreleased]` block MUST be moved to a new `## [x.y.z] - YYYY-MM-DD` heading, the
  compare links at the bottom updated, and `version` in `package.json` bumped
  (`npm version x.y.z --no-git-tag-version`). Bump: Removed/breaking -> major, Added/Changed/
  Deprecated -> minor, Fixed/Security only -> patch (pre-1.0: breaking may bump minor).
- Use the `/changelog` skill (`.claude/skills/changelog/SKILL.md`) to add entries or cut a release.
