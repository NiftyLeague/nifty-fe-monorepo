# Changelog

## [2.1.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v2.0.0...docs-v2.1.0) (2026-09-22)


### Features

* **build:** self-hosted turbo remote cache on Cloudflare + cached deploy builds ([#2007](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2007)) ([6bd036b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6bd036bd5112d45ee851019ded39cf9d4ab3b3d3))

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.8...docs-v2.0.0) (2026-09-21)


### ⚠ BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* **benchmarks:** unified Lighthouse harness, cache contracts, and the budget gate ([#1920](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1920)) ([416a00f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/416a00fad88b45d8a3469b242e51a0e2a36f963c))
* **docs:** M5.7 complete audit — performance, a11y, SEO, and the real cache surface ([#1884](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1884)) ([#1933](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1933)) ([b39065e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b39065e93253768721201408eabbe71be7ca1cee))
* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* **web:** serve degen 3D models as R2-hosted GLBs ([#1972](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1972)) ([f20b6f7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f20b6f73cb52e828b16e0fa71f7550108d288791))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **seo:** consolidate docs on the apex /docs surface and clean sitemaps ([#1976](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1976)) ([cbbc094](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cbbc094c1fc46f9056d95a212c7ef60e6429298a))
* **ui:** hydrate the console game island via lazy + Suspense ([#1957](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1957)) ([02f1294](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/02f1294d4c456c8f91d49aa80a23f6be8ca60b05))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))


### Performance

* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))
* post-migration modernization pass across web, smashers, and app ([#1946](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1946)) ([d462b8b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d462b8b2a0d09ab21b69edba1e8e8714f0387b3a))


### Maintenance

* **astro:** adopt the shared app config and Astro tsconfig base ([#1896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1896)) ([dd2d546](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd2d546183e2dcc8d668ac4f61c11c04a5098716)), refs [#1888](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1888)
* **docs:** dedupe the GTM loader and Astro app config (M4.0) ([#1892](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1892)) ([4fd12c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4fd12c6e124b0fa03bcd6a0ead4a1f0f05e6ee4b)), refs [#1881](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1881)
* **docs:** migrate documentation site to Astro + Starlight ([#1872](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1872)) ([3c35109](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3c351099559332fddb67708def18ace2895c6751))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))

## [1.0.8](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.7...docs-v1.0.8) (2026-09-09)


### Bug Fixes

* **docs:** restore dual-host routing ([#1860](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1860)) ([4abb0cf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4abb0cfdb6e044da3aa1578a4cce390e8f46cbd5))

## [1.0.7](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.6...docs-v1.0.7) (2026-08-28)


### Bug Fixes

* **build:** stabilize app bundler paths ([31f0082](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/31f0082d2e0f0601f8fb6da675c37ba0517471c6))
* **docs:** dedupe docusaurus client contexts ([6a8bd89](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6a8bd89a2ee6fe3e5ca2ae9d07aaf2c15d74569b))


### Performance

* **docs:** use native external social links ([2ab43c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2ab43c67043e24c42bbe02bb5f18d0e1af77af3a))

## [1.0.6](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.5...docs-v1.0.6) (2026-08-23)


### Maintenance

* **deps:** prune unused build dependencies ([#1059](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1059)) ([219bf27](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/219bf271ff0bdfc083108a9003f6090fe950fcdc))

## [1.0.5](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.4...docs-v1.0.5) (2026-08-23)


### Performance

* **docs:** defer below-fold homepage images ([#1028](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1028)) ([8de57ed](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8de57ed42219840ac9e961b859b9a320ffde3bce))

## [1.0.4](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.3...docs-v1.0.4) (2026-08-22)


### Bug Fixes

* **ci:** control hosted feature branch spend and staging realignment ([27de2c1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/27de2c1b035b68ce2e9767532f02c04452fbe1e5))


### Performance

* **docs:** optimize mint animation asset ([#540](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/540)) ([d049352](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d0493524582c7a8d3075163b706db8fa908a8133))
* **docs:** share lazy media primitives ([fe1e7ba](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fe1e7ba2b56bb534ec2598d4698c0f5c4bcef0d8))


### Maintenance

* promote staging to main ([cc77798](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cc77798c50da9641287aae69f5c73564e0be07cd))
* promote staging to main for GLTF NFTL hotfix ([b66c5f9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b66c5f9af80715e267f7925b3fd5793721bccbc1))
* promote staging to main for release ([887a71b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/887a71b0383d763925a9065cf6af548bb7e11211))
* sync original staging content to main ([#901](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/901)) ([17415b6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17415b6e4913a4c60c435b33cbfb69eb67d6fd20))

## [1.0.3](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.2...docs-v1.0.3) (2026-08-09)


### Bug Fixes

* sync-local-commits-to-staging ([#371](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/371)) ([37d95fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37d95fba2daf7c0972eec715fea7ee32e1ea0c0e))


### Maintenance

* extract shared degens page logic and remove dead console output ([#379](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/379)) ([92ec323](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92ec323cef0b9054015f9e2214407beabb91ebb1))

## [1.0.2](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.1...docs-v1.0.2) (2026-08-07)


### Maintenance

* drop-mui-support ([#360](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/360)) ([cf09198](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cf0919857ea50424d4dc70f721238aa209abd46b))

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.0...docs-v1.0.1) (2026-08-02)


### Bug Fixes

* add @mdx-js/react to apps/docs deps (build resolution) ([670098f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/670098f01903926e1af4df40ca5beaf8d6e64ef0))
* bump react to 19.2.8 to match react-dom (docs Docusaurus build) ([a92d4ee](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a92d4eebcb9795bd9533a52ee2574c5538a3f881))
* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* strip broken --project-placeholder filters from all test scripts; run bun test directly ([5de1d6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5de1d6fec320a361606630138106f0b82dff4023))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))
* use env for algolia quick update access ([01d7c98](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/01d7c989d050cfea3431fe188c6f86bd2718dcd5))


### Documentation

* add Vercel env connect/sync instructions to README ([4f34954](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4f34954365497fed42f06e279f33a29fe3e75eba))


### Tests

* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* fix 6 failing tests + run CI with --isolate ([11c1c42](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/11c1c42c1abb1fa6476a0af7a47dc5f3072a923a))
* fix happy-dom double-registration + window access ordering ([a876c94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a876c94185d2f9b41e8566fd798b65235f34e2b7))
* purge @testing-library/jest-dom — all assertions now bun-native ([a20778f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a20778f170c84e29286a7fca678c7534104a746a))
* scope mock.module + dynamic imports (batch 2) ([5aba023](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5aba023d5380feb21471b73e09f4178d11f25be5))
* standardize monorepo testing and CI ([dad0659](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dad0659a1dd5d940de7d6c8455479f4f756e175f))
* standardize monorepo testing and CI ([4aea8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4aea8f6fd7a253603155f8a4e12bb53a39ec6998))
* standardize workspace runners on bun ([47db8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/47db8f6164cbf4fa8ac5e7f8baa2e746dcd301a5))


### CI

* mise-based 2-job CI (quality + test) ([514e489](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/514e489593ac5bec64dd176d70743bbcc561e777))
* trigger re-run after lint + describe-import fixes ([75810c4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/75810c43a802c855bf7371b680b91f23b5d40cae))


### Maintenance

* align repository with shared template ([1722262](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17222629d80b1bb2c68a6968fcfb4665ff363b16))
* daily code improvements — lint fixes, dep alignment, dead code removal ([2f66e33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f66e33f072412d7cf6095e04d562b7e2828f306))
* **deps:** bump react-dom from 19.2.7 to 19.2.8 ([#288](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/288)) ([ab97194](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ab971942565d8e8835bd0b36372ea8bb83d16689))
* **deps:** merge auto dependency bump to main + fix 26 test failures ([3650d19](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3650d19462fcd17c941470432786657e482bb72b))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* migrate to bun — CI, husky, turbo, symlinks fix, 7 verbs ([2b7fb74](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2b7fb746afdd260648d844ca5b04bcf57c027b7c))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))
