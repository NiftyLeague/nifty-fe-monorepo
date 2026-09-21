# Nifty League Contracts API

The API and the operational NFT/Immutable tooling now live in the monorepo at
`apps/api`. The public HTTP contract is unchanged; the app uses the repository's
shared TypeScript, ESLint, and Prettier configuration.

## Local development

From the monorepo root:

```bash
bun install
bun --filter api dev
```

Focused checks:

```bash
bun --filter api type-check
bun --filter api lint
bun --filter api format:check
bun --filter api test
bun --filter api build
```

The deployed API smoke checks are intentionally separate from the hermetic
suite. Run them explicitly against a reachable deployment:

```bash
bun --filter api test:live
```

The API's local environment file is `apps/api/.env.local` and is ignored by
Git. Copy the variables from `.env.example` or sync them from the team
secret store. Every value is server-side configuration; never expose these
names through client-visible env prefixes (`VITE_*`/`PUBLIC_*`) or import
`node-config-ts` from a client bundle.

## Deployment

Production runs the `nifty-league-api` Cloudflare Worker (`src/worker.ts`),
deployed by the `Cloudflare Production` workflow from `main`. Runtime values
are Worker secrets (`wrangler secret put KEY`); `wrangler.jsonc` aliases the
`node-config-ts` import to a shim that bundles `config/default.json` and
resolves its `@@ENV` placeholders from the Worker bindings.

`config/default.json` contains only placeholders. The build copies it to both
the compiled app and the serverless function bundle so `node-config-ts` can
load it at runtime without embedding secret values in source control.

The webhook secret is accepted only through the parameterized webhook route,
is never advertised by `GET /`, and is compared without logging the payload.
Keep the configured webhook URL private.

## Shared assets

The NFT generators reuse the canonical monorepo assets:

- Comics read `assets/img/comics/page/*.webp` while retaining their historical
  public `.png` upload names.
- Marketplace items read `assets/img/items/full/*.gif`; item IDs `101–107`
  map to shared files `1–7` without copying them.
- Generated degen images are written to the ignored `apps/api/.data/` folder.

Unused source-only binaries, generated TypeChain output, and unused Immutable
deployment declarations are intentionally not duplicated in the monorepo.

## Public routes

| Route family         | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `/`                  | API metadata and public route descriptions        |
| `/NFTL/supply*`      | NFTL supply resolvers                             |
| `/degens/burn-list`  | Burned degen token IDs                            |
| `/:network/degen/*`  | Degen metadata, images, and background attributes |
| `/imx/marketplace/*` | Immutable marketplace metadata and images         |

Use `scripts/audit-endpoints.mjs` for a deployed contract audit:

```bash
BASE_URL=https://api.niftyleague.com \
AUDIT_NETWORK=sepolia \
node apps/api/scripts/audit-endpoints.mjs
```

The live audit and smoke checks require network access and a deployed API; unit
and integration tests are hermetic and remain part of the default test suite.
