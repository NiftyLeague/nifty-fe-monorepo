# Changelog

## [2.1.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/api-v2.0.0...api-v2.1.0) (2026-09-22)


### Features

* **assets:** serve website media from the CDN ([#2011](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2011)) ([3f0e354](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3f0e3548739f00f14a311599f8b537f65de1b218))

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/api-v1.0.0...api-v2.0.0) (2026-09-21)


### ⚠ BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))

### Features

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate public degen assets from AWS S3 to Cloudflare R2 ([#1953](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1953)) ([2d23882](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2388286e5edda283df8f031424c679eecaa43c))
* **smashers:** pin store-link vars + guard the worker runtime env contract ([#2001](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2001)) ([c0308e1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0308e11fd330333bb1efa9b214e38f0c556942e))
* standardize degen imagery on WebP across all sizes ([#1956](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1956)) ([8801084](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8801084d181ed9d14c087e1cefc63085f1c6b3ca))


### Bug Fixes

* **api:** register webhook handler directly ([#1865](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1865)) ([36df800](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/36df8001b99dace02186b2ff3075df256c0de240))
* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* make root Bun test suite isolation-safe ([#1945](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1945)) ([7f615e6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7f615e6dbf2924fd9dd5d265e6f81e072fc7dac8))
* stale-code test timeouts and sign util unit tests ([#1954](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1954)) ([8db12b2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8db12b2336f8bbd2d2b29b8b97c80aa2107cff81))
* testnet-dev-workflow ([#2000](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2000)) ([b329735](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b329735fa1dbbe69bf7ea1782d531c93d862cef1))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))
