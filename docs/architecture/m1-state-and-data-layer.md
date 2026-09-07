# M1 — State and Data Layer

Status: implemented contract

This record closes M1.1 through M1.5. It assigns one owner to each state class, records the deliberately limited migrations, and defines rollback boundaries. It does not authorize framework, bundler, visual, or asset changes.

## Ownership decision table

| State class                                                                               | Owner                                         | Lifecycle and hydration                                                                                                              | Persistence                           | Errors, loading, and invalidation                                                                                                                                              |
| ----------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Component-local interaction (dialog open state, input drafts, carousel position)          | React component state                         | Created and destroyed with the component; identical server/client default                                                            | None                                  | Render local pending/error UI; no global invalidation                                                                                                                          |
| Cross-tree ephemeral UI (app navigation drawer and notifications)                         | Provider-scoped Zustand vanilla store         | One store per provider tree; deterministic initial state and reset seam; never shared across SSR requests                            | None                                  | Narrow selector hooks prevent unrelated subscribers from rerendering                                                                                                           |
| Wallet providers, signers, contracts, and chain state                                     | wagmi/ethers and existing provider boundaries | Hydrated from the wagmi cookie where supported; reset by wallet lifecycle                                                            | Existing wallet provider only         | Never copied into Zustand or a serializable query cache                                                                                                                        |
| Auth credentials, nonce, UUID, agreement, and favorites compatibility state               | Existing local-storage owner                  | Client-only guarded hydration; legacy auth-status read remains bounded                                                               | Existing named local-storage keys     | Raw credentials never enter query keys; query keys use a non-reversible per-session scope                                                                                      |
| Remote API, profile, account, catalogue, rental, and product state                        | TanStack Query                                | Public DEGEN page is prefetched in its Server Component and dehydrated; authenticated queries begin only after client auth hydration | Memory cache only                     | Semantic keys, abort signals, one retry for non-4xx failures, 30 s authenticated stale time, 5 min public stale time, reconnect refresh, explicit mutation invalidation/update |
| On-chain reads                                                                            | wagmi query owner                             | Existing wallet hydration and address/chain keys                                                                                     | wagmi query cache                     | Existing refetch seams and 10 s on-chain stale policy remain intact                                                                                                            |
| Shareable filters, pagination, sorting, leaderboard selection, and rental search/category | nuqs                                          | Typed parsers supply SSR/client defaults; invalid values normalize safely; shallow App Router updates                                | Browser URL/history                   | Push history for discrete choices and pagination; replace history for text search; no parallel Zustand or component copy                                                       |
| Smashers PlayFab user/session state                                                       | Existing SWR owner in `@nl/playfab`           | NextAuth/PlayFab boundary remains unchanged                                                                                          | SWR memory cache and existing session | Retained because there is no duplicate owner or measured benefit from a library-only rewrite                                                                                   |

## Per-app decision and migration order

| App        | Decision                                                                                                                                                       | Migration order                                                                                                                     | Rollback boundary                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `app`      | Adopt Zustand for navigation/notifications, TanStack Query for remote reads and favorite mutation, and nuqs for the DEGEN, leaderboard, and rental URL domains | Query client and parsers; remote reads; optimistic favorite mutation; URL consumers; remove legacy loader/bridges; scoped UI stores | Revert each owner independently. Query and URL changes retain the same HTTP endpoints, response shapes, routes, and storage keys. |
| `smashers` | Retain React local state and PlayFab SWR                                                                                                                       | No migration; one-shot login query token is an auth command, not durable UI state                                                   | Existing NextAuth/PlayFab boundary                                                                                                |
| `web`      | Retain server/static route state and component-local interaction                                                                                               | No justified shared or server cache migration                                                                                       | Existing route modules                                                                                                            |
| `docs`     | Retain Docusaurus static/build state                                                                                                                           | No client state domain to migrate                                                                                                   | Existing static build                                                                                                             |
| `template` | Retain component-local progress state                                                                                                                          | Use as a future experiment only if a cross-route owner appears                                                                      | Existing component                                                                                                                |
| `api`      | Out of scope for client state libraries                                                                                                                        | Preserve HTTP cache headers and server ownership                                                                                    | Existing Express handlers                                                                                                         |

The order is intentionally additive until each replacement is covered. No route changes URL, response media type, auth header, wallet initialization order, keyboard interaction, responsive breakpoint, theme class, loading state, or empty/error surface.

## Query policy

- Query keys are semantic and centralized in `apps/app/src/query/app-query.ts`. Authenticated keys contain only a non-reversible session scope, never a token or authorization header.
- Each query-enabled route boundary creates one `QueryClient` per mounted tree: the public DEGEN layout owns its lightweight client, while wallet routes create theirs inside the already deferred wallet runtime. Server prefetch creates a request-local client and dehydrates only the public DEGEN result. Unrelated public routes do not load TanStack Query.
- Query functions consume TanStack's `AbortSignal`. Four-hundred responses do not retry; other failures receive at most one retry. Mutations do not retry automatically.
- Public catalogue data is fresh for 5 minutes, matching its HTTP cache contract. Authenticated API data is fresh for 30 seconds. Existing on-chain wagmi reads keep their own 10-second policy.
- Favorite updates cancel the matching read, update local compatibility state optimistically, roll back on failure, and replace the exact cached profile-favorites value on success.
- Logout/login cannot reuse another session's authenticated cache because the scope changes with the credential. Wallet/provider objects and credentials are never serialized or dehydrated.

## URL policy

- The DEGEN parser owns page, sort, text search, price, tribe, background, cosmetic, token, and wallet filters. Empty/default values are removed from the URL.
- Pagination and discrete selections push a history entry so Back/Forward restores prior state. Text search replaces the current entry to avoid a history entry per keystroke.
- Unsupported sort/game/time/category values and non-positive pages fall back to safe defaults. Filter arrays remove empty and repeated entries before use.
- The public DEGEN Server Component parses the same contract used by the client, prefetches the exact default 12-card query, and hydrates it under the request-local query client.
- Verification and login tokens remain direct read-only route inputs because they are commands/credentials, not reusable UI state.

## Removed duplicate paths

- Removed the custom `useFetch` reducer, per-hook cache, shared TTL map, and in-flight request map. All former production consumers now use TanStack Query.
- Removed the public DEGEN `DegenSearchParamsBoundary` synchronization component and manual `next/navigation` URL mutation in the migrated DEGEN and leaderboard paths.
- Consolidated the repeated favorite-DEGEN POST/effect logic from dashboard overview and dashboard DEGENs into one optimistic mutation hook.
- Removed the module-level `QueryClient`; public DEGEN and authenticated route trees now use provider-scoped clients without adding the query runtime to unrelated public routes.
- Retained `GamerProfileContext` only as a presentation aggregation boundary for loading flags used by its nested profile UI. It does not own or cache remote data.
- Retained `DegenOwnershipContext` only for the isolated mint provider boundary. The underlying remote/on-chain owner remains wagmi/TanStack Query.

## Evidence and acceptance

At the M0 commit `907444bd085e0b012702fdc918cbc3f961093c7b`, authenticated `useFetch` instances owned isolated caches, so two mounted consumers issued two requests. The M1 query contract test mounts equivalent concurrent reads against one semantic key and observes one query function call. The old production surface contained nine `useFetch` call sites plus its custom cache implementation; M1 contains zero.

Bundle and request-count acceptance uses the M0 profile and budgets without reinterpretation. The M1 evidence files record the exact baseline/candidate commits, individual samples, variance, and build output:

- `benchmarks/results/m1-app-before-2026-09-07.json` measures M0 commit `907444bd085e0b012702fdc918cbc3f961093c7b`.
- `benchmarks/results/m1-app-after-2026-09-07.json` measures M1 commit `395f27224c3289913b5f695b3cd7e7a958027a74`.
- `benchmarks/results/m1-app-build-after-2026-09-07.json` records three successful clean/incremental build pairs at the M1 commit.

| Same-host `/degens` median |          M0 |          M1 |  Change | Gate                                                            |
| -------------------------- | ----------: | ----------: | ------: | --------------------------------------------------------------- |
| LCP                        |      480 ms |      448 ms |   -6.7% | pass                                                            |
| Synthetic INP              |       16 ms |       16 ms |      0% | pass                                                            |
| CLS                        |      0.0037 |      0.0037 |      0% | pass                                                            |
| TTFB                       |      3.9 ms |     11.9 ms | +8.0 ms | pass; absolute increase is below the 250 ms rejection threshold |
| Total transfer             |   545,237 B |   580,272 B |   +6.4% | pass                                                            |
| JavaScript                 |   388,039 B |   422,478 B |   +8.9% | pass                                                            |
| Requests                   |          55 |          59 |   +7.3% | pass                                                            |
| Memory                     | 8,530,199 B | 8,834,271 B |   +3.6% | pass                                                            |

Compared with the M0 three-run build record, clean build median changed from 33,277.8 ms to 31,336.3 ms (-5.8%) and incremental build median changed from 20,060.2 ms to 16,397.2 ms (-18.3%). All six M1 build samples exited zero. Run route evidence with `bun scripts/m0-benchmark.mjs --config benchmarks/m1-app-routes.json --include-local`; add `--build --build-app app` for build timing. A route, build, bundle, or request-count regression beyond the M0 budget rejects the migration and rolls back the relevant owner without changing public contracts.

## Rollback and residual constraints

- Zustand rollback restores the two context reducers without touching consumers outside navigation/notification providers.
- Query rollback restores an individual specialized hook at its prior endpoint. Do not restore the deleted global custom cache as a second owner.
- nuqs rollback restores one route domain at a time; keep its current query-string spelling so deep links remain compatible.
- Smashers SWR, wagmi query ownership, auth storage, wallet providers, and all component-local dialog state are explicit non-migrations, not unfinished M1 work.
- Production field INP/RUM is still unmeasured as recorded by M0. M1 claims request/cache ownership and regression coverage, not field-performance improvement.
