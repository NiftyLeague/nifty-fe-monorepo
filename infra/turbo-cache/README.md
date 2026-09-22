# Turborepo remote cache Worker

The self-hosted Turborepo remote cache: a Cloudflare Worker (`nifty-turbo-cache`)
in front of the `nifty-turbo-cache` R2 bucket. CI reaches it through the
`TURBO_API` variable and the `TURBO_TOKEN` secret / `TURBO_TEAM` variable; the
same three values work for local runs (see the root `README.md`).

`nifty-world` shares this Worker and bucket, so both repos hit the same artifacts.

## Protocol surface

Turbo uses a small slice of the remote-cache protocol, and this Worker
implements exactly that:

| Route                       | Method | Behavior                                            |
| --------------------------- | ------ | --------------------------------------------------- |
| `/v8/artifacts/:hash?slug=` | GET    | Stream the artifact: edge cache, then R2.           |
| `/v8/artifacts/:hash?slug=` | HEAD   | Same headers, no body, never cached.                |
| `/v8/artifacts/:hash?slug=` | PUT    | Stream the request body into R2, purge edge.        |
| `/v8/artifacts/status`      | GET    | Availability probe; returns `{"status":"enabled"}`. |
| `/v8/artifacts/events`      | POST   | Notification sink; returns `{}`.                    |

Every request is authenticated with `Authorization: Bearer $TURBO_TOKEN`, and
`slug` must equal `TURBO_TEAM` (anything else is a 403). Artifacts are stored per
team at `<slug>/<hash>`.

The status route exists because turbo probes it before transferring anything and
treats a missing route as an unreachable cache: without it every turbo run logs
`Remote caching unavailable`, even though artifact transfers are working.

## Caching

Artifacts are content-addressed: the hash is derived from the task inputs, so the
bytes behind a hash never change. That makes an artifact entry safe to treat as
immutable.

Two things follow, and both are load-bearing:

- **Artifacts are served with `Cache-Control: public, max-age=31536000, immutable`.**
- **The edge copy is written through the Cache API under a credential-free key.**
  Turbo sends `Authorization` on every request and Cloudflare never caches a
  response to an authorized request, so a response that is only given
  `Cache-Control` is still an R2 read every time. `cacheKey()` rebuilds the URL
  without the credential for `cache.match` / `cache.put`.

The response carries `x-turbo-cache` to say what happened: `HIT` (served from the
edge cache), `MISS` (served from R2 and written to the edge), `BYPASS` (served
from R2 and deliberately not cached — a `HEAD`, or an artifact over
`MAX_EDGE_CACHE_BYTES`). A `MISS` that never becomes a `HIT` means the edge entry
is not landing; check Workers Logs for `turbo cache: edge … failed`.

Two deliberate limits:

- **Artifacts over 25 MB are not edge-cached.** Writing the edge copy tees the R2
  stream, and a tee buffers whatever its slower consumer has not drained; with a
  128 MB isolate cap and ~100 MB artifacts in this repo, that is a memory risk for
  little gain. Oversize artifacts stream straight from R2 and report `BYPASS`.
- **A 404 is never cached**, on the edge or anywhere else — a miss is turbo's cue
  to rebuild, so caching it would stop the artifact from ever being used. `PUT`
  responses and errors are `no-store` for the same reason, and a `PUT` purges the
  edge entry so a re-upload can never be answered from a stale one.

R2 keeps entries for 30 days (`expire-old-cache-artifacts`); a pruned artifact is
simply a cache miss on the next build.

## Deploying

Wrangler is a root devDependency, so no install step is needed:

```sh
bunx wrangler deploy --config infra/turbo-cache/wrangler.jsonc
```

Secrets (values are per-deployment; never commit them):

```sh
bunx wrangler secret put TURBO_TOKEN --config infra/turbo-cache/wrangler.jsonc
bunx wrangler secret put TURBO_TEAM  --config infra/turbo-cache/wrangler.jsonc
```

Then confirm the caching contract against the live Worker:

```sh
bun scripts/turbo-cache-probe.mjs --api https://nifty-turbo-cache.nifty-league.workers.dev
```

The probe PUTs a throwaway artifact, reads it twice, and asserts the second read
is an edge `HIT` with the immutable header — it deletes the object afterwards.
It needs `TURBO_TOKEN` and `TURBO_TEAM` in the environment.

### Pink Binder

The Pink Binder account runs the same Worker source from its own repo
(`pinkbinder-turbo-cache`, bucket of the same name, account
`e9b73b1b6c312b889732f29b884a5166`). Keep the two `src/index.ts` files in step
when changing the caching logic here.
