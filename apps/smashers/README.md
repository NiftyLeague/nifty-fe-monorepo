# Nifty Smashers

Marketing site and player account surface for [niftysmashers.com](https://niftysmashers.com), built with **Astro SSR** and deployed to Vercel through the `@astrojs/vercel` adapter.

## Getting started

### Set up environment variables

Copy `.env.example` to `.env.local` (ignored by Git):

```bash
vercel env pull .env.local   # preferred: pulls from Vercel (source of truth)
# fallback: cp .env.example .env.local
```

### Run the development server

```bash
bun run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Layout

```
src/
  pages/            file-based routes
    index.astro       home (referral deep link opens the Play dialog)
    login.astro       PlayFab sign-in
    profile.astro     account surface (redirects to /login when signed out)
    loot.astro        loot tables (prerendered)
    404.astro
    robots.txt.ts / sitemap.xml.ts
    api/              endpoints (playfab, auth, edge-geo)
  layouts/          Base.astro (metadata, fonts, telemetry), Auth.astro
  components/       app components; interactive ones are React islands
  contexts/         PlayFab session + feature flags
  runtime/          framework shims: Image, metadata, telemetry, redirects
  middleware.ts     store + referral deep links
packages/playfab    shared PlayFab SDK, account components, OAuth helpers
```

Only interactive components are islands, marked per component:

```astro
<LoginClient client:only="react" sessionData={sessionData}>
  <div slot="fallback" role="status" aria-busy="true">…</div>
</LoginClient>
```

## Authentication

Identity is **PlayFab**. There is no next-auth dependency anywhere in this app or in `@nl/playfab`.

Two layers:

1. **PlayFab session** — an `iron-session` cookie (`iron_session_playfab`, sealed with `SESSION_SECRET`), created by `/api/playfab/login` and `/api/playfab/signup` and read through `src/utils/session.ts`. Endpoints take the `SessionTicket` from it to call PlayFab.
2. **OAuth social linking** — a local authorization-code flow that links a Google, Apple, Facebook or Twitch account to the signed-in PlayFab account:

   | Route                                     | Purpose                                                                                                |
   | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
   | `GET /api/auth/signin/[provider]`         | Mints `state` + PKCE, seals the flow into a short-lived `oauth_flow` cookie, redirects to the provider |
   | `GET\|POST /api/auth/callback/[provider]` | Validates state, exchanges the code, and calls PlayFab `LinkProvider` **server-side**                  |

   Provider secrets (`GOOGLE_CLIENT_ID`/`_SECRET`, and the same pair for `APPLE`, `FACEBOOK`, `TWITCH`) are read only on the server; no provider token is ever sent to the browser. `SESSION_SECRET` doubles as the flow-seal key.

`@nl/playfab` exports the reusable pieces: `auth/oauth` (provider registry, authorize URL, PKCE, code exchange, link credential selection) and `auth/flow` (sealed flow state). Apple is linked with its OIDC `id_token` and the others with their OAuth access token — see `getLinkCredential`.

Register the callback URL with each provider: `https://niftysmashers.com/api/auth/callback/<provider>`.

## Checks

```bash
bun run type-check   # astro check
bun run lint         # oxlint
bun run format       # oxfmt
bun run test         # bun test
bun run build        # astro build -> dist/ + .vercel/output
```

## Deploy

Vercel builds the app with `bun run build` and serves `.vercel/output`. The project deploys from `main`; feature branches deploy only when listed in `vercel.json` → `git.deploymentEnabled` **and** in `scripts/vercel-ignore-build.mjs` (both gates are required).
