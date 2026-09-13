# M5.4 — Architecture decisions, runbook, and residual risks

Issue: [#1842](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1842) (M5.4). This
is the closeout record for the optimization program: what was decided, where the evidence
lives, how to operate the result, and what remains open with owners. The original goal —
recover and exceed the pre-migration performance and quality posture after four framework
migrations — is **met**: every route passes the agreed CWV and Lighthouse budgets with
thirteen recorded, attributed exceptions (`m5-performance-budgets.md`).

## Architecture decisions (each linked to its measurement)

| Decision                                                                                                                                                                 | Evidence                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| web, docs, smashers → Astro (static, static+Starlight, SSR); app → TanStack Start + Nitro on Vercel's Build Output API                                                   | migrations #1866/#1868, #1870, #1869, #1872; before/after in `m5-performance-budgets.md` (docs transfer −72%, app build −75%)    |
| Shared UI (`packages/ui`): primitives, GTM loader/events/gate, image-attribute core, deferred-activation schedule                                                        | M4.0–M4.2 inventory `m4-shared-code-inventory.md`; contract suite (`gtm-source`, `shared-asset-reuse`, `shared-a11y-primitives`) |
| Media delivery: animation-as-video (H.264 + poster), image pre-generation (web)                                                                                          | #1907 (smashers transfer 4.14 MB → 862 KB, LCP −26%); web `prepare-images.mjs`                                                   |
| Response headers: per-platform sources — vercel.json (Vercel) and the Workers `_headers` file — pinned in sync; security headers single-sourced in the app's vercel.json | #1912 + `vercel-build-policy.test.ts`, `cache-surface.test.ts`                                                                   |
| Analytics: one web-vitals payload (web/smashers shape) and production-only gates                                                                                         | #1903/#1919; `gtm-source.test.ts`                                                                                                |
| Performance budgets: the M0 decision table, evaluated mechanically                                                                                                       | `m5-performance-budgets.md`; `scripts/evaluate-budgets.mjs`; Budget Gate workflow                                                |

## Runbook

**Local validation** (from a clean checkout):

```sh
bun install
bun run format:check && bun run lint && bun run type-check
bun test test/contract/          # 608 contract invariants
bun run test                     # workspace suites
bun run build                    # all five apps
```

**Performance measurement:**

```sh
bun run benchmark:m0 --output benchmarks/results/<label>.json   # production CWV/weights
bun run lighthouse:<app> --base-url <prod-url> --label <label>  # per-route Lighthouse
bun run budgets:evaluate --baseline <file> --build-baseline <file> \
  --current <file> --strict                                     # the budget gate
```

**Release/deploy flow**: Conventional-Commit branch → auto-draft PR → `ready_for_review`
triggers validation → required `Validation / Gate` → squash merge → Release Please version
PR → squash → tag. Full detail and evidence: `m5-release-verification.md`.

**Deployment cost controls**: branch deploys disabled except `main`; the shared
`ignoreCommand` builds only affected projects; runner tiers per job class.

**Rollback**: Vercel project → Deployments → roll back to the previous production
deployment (instant, no build); code rollback is `git revert` + the normal PR flow. GitHub
releases are verified post-publication by `release-integrity.yml`.

**Cleanup**: branch deletion is enforced by the ruleset on merge; local worktrees are
pruned with `git fetch --prune`; known non-package leftovers (`packages/eslint-config`,
`packages/prettier-config`, untracked `packages/sentry-client` residue) are documented in
`m5-release-verification.md`.

## Residual risk register

| Risk                                                                             | Owner / bound                                                                                                                    | Next review                  |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| smashers-home JS +21% and heap +46% vs the Next era (island runtime + hydration) | M5.6 #1883 per-island audit                                                                                                      | when #1883 closes            |
| app-degens request count 63 → 129 (chunk granularity, bytes down)                | #1885 per-route chunk groups                                                                                                     | when #1885 closes            |
| web-home transfer/JS/requests/memory growth is third-party (GTM: GA4, Clarity)   | analytics owner, #1903 decision recorded                                                                                         | when tag consolidation ships |
| roadmap satoshi `left/top` animation contributes ~0.1 CLS                        | transform rewrite needs the container height as a CSS value (design input) or a measurement island; reduced-motion guard shipped | next roadmap design pass     |
| web true-cold build ~236 s (WebP pre-generation)                                 | deliberate pipeline trade; M5.9's CI gate watches build times                                                                    | if builds exceed budget      |
| Visual baselines (#1913)                                                         | generated on CI via `visual-baselines.yml`; committed per route change                                                           | first route-change PR        |
| Authenticated browser coverage (#1915)                                           | needs a PlayFab test identity (secrets)                                                                                          | when the identity exists     |
| Effect backend evaluation (#1880)                                                | separate milestone, outside this repository's frontend program                                                                   | own milestone                |

## Completion status

The M0 optimization goal — restore and exceed the pre-migration posture, with budgets
instead of open-ended optimization — is **complete**: LCP improved or held on every route
(worst 1152 ms against a 2500 ms budget), INP ≤ 48 ms, CLS ≤ 0.0037 outside the documented
satoshi exception, builds faster on three of five apps and within budget on the rest, and
every remaining gap is an owned, bounded follow-up.
