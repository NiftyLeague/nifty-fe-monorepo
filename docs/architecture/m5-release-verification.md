# M5.3 — Release path verification

Issue: [#1841](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1841) (M5.3). The
direct-to-`main` workflow is the release mechanism; this document records every gate it
relies on with the evidence that each holds, so none of it stays implicit. Verified
2026-09-12 on `main`.

## The release path

1. Work lands on a `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `docs/*`, or `test/*` branch
   using Conventional Commit subjects (Release Please versions from them).
2. Pushing the branch triggers `draft-pr.yml`, which opens the pull request **as a draft**;
   `draft-enforcement.yml` (Draft Guard) converts ready-then-reopened PRs back to draft and
   keeps runner-heavy validation off until `ready_for_review`.
3. Marking the PR ready triggers `validation.yml`: Format, Lint, Type-Check, Build (all
   five apps), Unit, Integration, E2E, Performance, Smoke, Eval, CodeQL, dependency audit.
   The required check is **`Validation / Gate`**.
4. Merge is **squash-only** into `main`. The branch ruleset `code-foundry-main`
   (rulesets API, active on `refs/heads/main`) enforces `pull_request`,
   `required_status_checks` → `Validation / Gate`, `required_linear_history`,
   `non_fast_forward`, and `deletion`. `code-foundry.yml` sets `merge_strategy: squash` and
   `git_workflow: direct`; the release job hard-fails on any other strategy rather than
   defaulting (observed in the release workflow's guard).
5. Every push to `main` runs `release.yml` (Release Please, `v1.28.14` runtime). Cumulative
   Conventional Commit changes open one grouped version PR — `chore(main): release
${version}` — which is merged by the same squash rules; merging tags and publishes the
   GitHub release. `release-integrity.yml` re-verifies published immutable releases.
6. Deployments: Vercel builds the affected projects on `main` only, and the tag runs the
   Release workflow. Production is never touched by branch or preview activity.

## Verified assumptions

| Assumption                                                                                                        | Evidence (2026-09-12)                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `main` is protected: PRs required, linear history, no force-push, no deletion, required check `Validation / Gate` | ruleset `code-foundry-main` (id 20147256), `enforcement: active`                                                                                                                                                                                 |
| Merge method is squash-only                                                                                       | `code-foundry.yml` `merge_strategy: squash`; the release job throws on any other value; every release and topic PR in the history is a squash commit                                                                                             |
| Draft PRs are created automatically and enforced                                                                  | `draft-pr.yml` + `draft-enforcement.yml`; exercised by every PR merged on 2026-09-12 (#1909–#1917), each auto-opened as draft and validated only after `gh pr ready`                                                                             |
| Preview/branch deploy cost is controlled                                                                          | `git.deploymentEnabled` = `codex/*: false`, `**: false`, `main: true` and the shared `ignoreCommand` on all five `vercel.json` files, pinned by `test/contract/vercel-build-policy.test.ts`; affected-project logic unit-tested in the same file |
| Clean `main` builds from the canonical command                                                                    | `bun run build` → 5/5 apps, on `main` after each of today's merges                                                                                                                                                                               |
| Every production surface is healthy                                                                               | smoke 2026-09-12: niftyleague.com, app.niftyleague.com, niftysmashers.com, docs.niftyleague.com/overview/intro, api.niftyleague.com — all HTTP 200 with expected content                                                                         |
| The Release workflow covers all apps and shared packages                                                          | release-coverage guard below; config and manifest now list the root, all five apps, and all six versioned packages                                                                                                                               |
| Release merges use the canonical squash path                                                                      | release-please opens the version PR; it merges under the same ruleset with `release_merge_strategy: squash` enforced by the job guard                                                                                                            |

## Fixed while verifying: release coverage gaps

Release Please tracks only the packages in `release-please-config.json` / `.release-please-manifest.json`, and both had drifted:

- **`apps/api` was absent from both** — commits to the contract backend produced no release bumps, despite `apps/api` carrying a version.
- **`packages/astro-config` (added by the M4 migration, #1896) and `packages/contracts` were absent from both** — the same silent gap for two shared packages the migrations touched.
- **`.release-please-manifest.json` still listed `packages/theme`**, a package deleted in the MUI removal long ago.

All four are corrected here, and `test/contract/release-coverage.test.ts` now fails on any
versioned workspace package missing from Release Please, or any tracked package that no
longer exists.

## Known non-release packages (explicit, not implicit)

- `packages/eslint-config`, `packages/prettier-config` — empty untracked leftovers.
- `packages/sentry-client` — untracked local `dist`/`node_modules` residue; not a workspace
  package (no `package.json` in git).
- `packages/theme` — deleted; its manifest residue is removed by this PR.

## Re-verify

```sh
bun run build                                   # clean builds, all five apps
bun run budgets:evaluate --baseline benchmarks/results/m0-production-2026-09-07.json \
  --build-baseline benchmarks/results/m0-build-2026-09-07.json \
  --current benchmarks/results/m5-production-2026-09-12.json
bun test test/contract/release-coverage.test.ts # release coverage guard
gh api repos/NiftyLeague/nifty-fe-monorepo/rulesets --jq '.[] | .name, .enforcement'
```
