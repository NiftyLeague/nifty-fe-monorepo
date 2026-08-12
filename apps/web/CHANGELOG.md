# Changelog

## [1.0.5](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/web-v1.0.4...web-v1.0.5) (2026-08-12)


### Performance

* **app:** slim public route shell ([#513](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/513)) ([12eced5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/12eced5750ac202ac0d080dd21f653c80b56539e))
* defer console game client boundary ([#485](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/485)) ([9754bba](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9754bba581b67a8398c9a3acb1af2b6ee5dd2fbc))
* defer marketing sections below the fold ([#491](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/491)) ([bcc90a8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bcc90a87b0b41c3918423e7a0c43e2d7908b5bf9))
* defer shared analytics loading ([#484](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/484)) ([15f84af](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/15f84afa2aa243d243374887631e21f6f77044db))
* defer shared media and client boundaries ([#463](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/463)) ([89a5922](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/89a5922d80ef719f91dbaf851866581052e0c98f))
* defer shared Sentry client SDK ([#474](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/474)) ([974021c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/974021cfe5ea63396ca24ac4a22b9bb32aa148c8))
* defer wallet network and public carousel code ([#477](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/477)) ([9373219](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/93732194ede6a6ed1200308df9fb5d93dd673693))
* keep marketing pages server-rendered ([#510](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/510)) ([49e1ae9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/49e1ae927afa67e333b3679069c1153d987c6564))
* keep web navbar config server-rendered ([#509](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/509)) ([2222ec0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2222ec00263a7a19f67584dd6f3537ec4ad0b7b7))
* reduce homepage hero preload contention ([#500](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/500)) ([70fda3f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/70fda3f5940b4934ee8a580a80cc9e402cdf36ee))
* reduce shared app and website runtime cost ([#462](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/462)) ([f311471](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f311471139733ba4ca20b1e95aa6d999cd800884))
* **web:** defer GLTF viewer until selected ([4bfa927](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4bfa9270f08ad10c345ff1a0d456d58626b5a93c))


### Maintenance

* **ci:** defer hosted builds until ready ([#511](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/511)) ([c745938](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c745938146c7f7ca57d3df11da904e5d9cc81105))
* promote staging tree to main ([4860b22](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4860b2210eecc5af2b5c31fffc08546bcf0175c1))

## [1.0.4](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/web-v1.0.3...web-v1.0.4) (2026-08-10)


### Maintenance

* promote tested staging tree to main ([5b82877](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5b8287785a21b2892241a67420ab13ca283dfb87))

## [1.0.3](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/web-v1.0.2...web-v1.0.3) (2026-08-09)


### Bug Fixes

* sync-local-commits-to-staging ([#371](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/371)) ([37d95fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37d95fba2daf7c0972eec715fea7ee32e1ea0c0e))


### Maintenance

* extract shared degens page logic and remove dead console output ([#379](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/379)) ([92ec323](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92ec323cef0b9054015f9e2214407beabb91ebb1))

## [1.0.2](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/web-v1.0.1...web-v1.0.2) (2026-08-07)


### Maintenance

* drop-mui-support ([#360](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/360)) ([cf09198](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cf0919857ea50424d4dc70f721238aa209abd46b))

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/web-v1.0.0...web-v1.0.1) (2026-08-02)


### Bug Fixes

* bump all react/playfab/theme/ui react-dom to 19.2.8 (resolve docs test version mismatch) ([45e37a2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/45e37a206771e0a32ea180dddec51a7a85576f06))
* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* restore workspace:* protocol and pin react-unity-webgl to v8.8.0 in apps/app ([0b28131](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0b28131527d2284ea55a9b497f2786fed4984806))
* strip broken --project-placeholder filters from all test scripts; run bun test directly ([5de1d6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5de1d6fec320a361606630138106f0b82dff4023))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))


### Documentation

* add Vercel env connect/sync instructions to README ([4f34954](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4f34954365497fed42f06e279f33a29fe3e75eba))


### Tests

* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* standardize monorepo testing and CI ([dad0659](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dad0659a1dd5d940de7d6c8455479f4f756e175f))
* standardize monorepo testing and CI ([4aea8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4aea8f6fd7a253603155f8a4e12bb53a39ec6998))
* standardize workspace runners on bun ([47db8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/47db8f6164cbf4fa8ac5e7f8baa2e746dcd301a5))


### CI

* mise-based 2-job CI (quality + test) ([514e489](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/514e489593ac5bec64dd176d70743bbcc561e777))
* trigger re-run after lint + describe-import fixes ([75810c4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/75810c43a802c855bf7371b680b91f23b5d40cae))


### Maintenance

* align repository with shared template ([1722262](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17222629d80b1bb2c68a6968fcfb4665ff363b16))
* daily code improvements — dead code removal, debug log cleanup ([#327](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/327)) ([c31a384](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c31a3846e4e316241d16317e7b7b804883c6a4c3))
* daily code improvements — dead code removal, debug log cleanup ([#331](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/331)) ([9a9abb3](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9a9abb39f18c967e21093aa2a3f527609680dac8))
* **deps:** bump next from 16.2.10 to 16.2.11 ([#289](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/289)) ([e72b4a1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e72b4a183fc4cb286f28234481e2e2aada8d0697))
* **deps:** bump react-dom from 19.2.7 to 19.2.8 ([#288](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/288)) ([ab97194](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ab971942565d8e8835bd0b36372ea8bb83d16689))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* **deps:** weekly update ([0889db6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0889db6360837a66b3188677e93f762e5b5a9c2d))
* migrate to bun — CI, husky, turbo, symlinks fix, 7 verbs ([2b7fb74](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2b7fb746afdd260648d844ca5b04bcf57c027b7c))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade 5 medium-risk deps (three, uuid, axelar, cow-sdk, react-intl) ([bd6b90d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd6b90d9e2f908a62f921be9f0d138663c168112))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))
