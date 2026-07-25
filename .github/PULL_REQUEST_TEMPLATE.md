## Description

<!-- Summarize the change. Link to any related issues. -->

## Type

- [ ] **feat** — New feature or enhancement
- [ ] **fix** — Bug fix
- [ ] **chore** — Tooling, config, CI, dependencies
- [ ] **refactor** — Code change with no functional change
- [ ] **docs** — Documentation only
- [ ] **test** — Adding or updating tests
- [ ] **style** — Formatting, imports, whitespace (no logic change)

## Target Branch

- [ ] `staging` (default — all PRs target staging)
- [ ] `main` (release only — must originate from `staging`)

## CI Status (do not merge until all pass)

- [ ] `Build, Format, Lint & Type Check` — `bun run lint && bun run type:check && bun run build`
- [ ] `Test` — `bun test`
- [ ] Preview deployment passes (if applicable)

## Compliance Checklist

- [ ] My commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`type(scope): message`)
- [ ] I have run `bun run format:fix` before committing (or let lint-staged handle it)
- [ ] New dependencies — used `bun --filter <workspace> add <pkg>`, not `npm`/`yarn`/`pnpm`
- [ ] No `.env*.local`, `node_modules`, or lockfile churn from another package manager
- [ ] No generated artifacts committed (cache output, build output, etc.)

## Additional Context

<!-- Anything reviewers should know: migration steps, env changes, breaking changes, related PRs. -->
