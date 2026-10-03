# Release rule

This rule is mandatory and always loaded. Releases follow `/release` (`.claude/skills/release/SKILL.md`)
and `RELEASING.md`.

- `main` is protected by a ruleset. Changes MUST go through a feature branch and a pull request.
  Required checks: `ci` and `changelog`; the branch MUST be up to date with `main`.
- The merge method is **Rebase and merge** (squash and merge commits are disabled to keep history
  clear). Use squash only if the user explicitly asks for it.
- You MUST NOT merge pull requests yourself (the permission system blocks it anyway). When a PR is
  green, ask the user to merge it and wait for confirmation.
- You MUST NEVER run `npm publish` from a local machine. The one-time bootstrap publish is done.
  Every release goes through a GitHub release `vX.Y.Z`, which triggers `release.yml`, which publishes
  via npm Trusted Publishing (OIDC; npm user `gronzul`, repo `JoeyAsh/jarvis_ui_lib`, workflow
  `release.yml`; no `NPM_TOKEN`). The tag MUST equal the `package.json` version; the workflow skips
  publishing if that version already exists on npm.
- You MUST NEVER force-push, rewrite history, or delete tags or releases without an explicit user
  instruction. NEVER unpublish from npm; ship a new patch version instead.
- Versioning is SemVer with the pre-1.0 rules from `.claude/rules/changelog.md`. The changelog MUST
  be cut (`[Unreleased]` -> `## [x.y.z] - YYYY-MM-DD`) in the release PR before the release is created.
