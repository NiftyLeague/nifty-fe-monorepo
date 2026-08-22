# Changelog

## [1.0.5](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/smashers-v1.0.4...smashers-v1.0.5) (2026-08-22)


### Bug Fixes

* **ci:** control hosted feature branch spend and staging realignment ([27de2c1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/27de2c1b035b68ce2e9767532f02c04452fbe1e5))


### Performance

* **app:** remove private icon registry callers ([#577](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/577)) ([3282114](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3282114c0952dc134931eab4e9bee7beaf641f50))
* **app:** slim public route shell ([#513](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/513)) ([12eced5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/12eced5750ac202ac0d080dd21f653c80b56539e))
* defer console game client boundary ([#485](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/485)) ([9754bba](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9754bba581b67a8398c9a3acb1af2b6ee5dd2fbc))
* defer marketing sections below the fold ([#491](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/491)) ([bcc90a8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bcc90a87b0b41c3918423e7a0c43e2d7908b5bf9))
* defer shared analytics loading ([#484](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/484)) ([15f84af](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/15f84afa2aa243d243374887631e21f6f77044db))
* defer shared Sentry client SDK ([#474](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/474)) ([974021c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/974021cfe5ea63396ca24ac4a22b9bb32aa148c8))
* defer shared Sentry initialization and route loading ([21203df](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/21203dfdfc659868bd8355e0ac529b57171d41df))
* enable incremental marketing app builds ([9eecdea](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9eecdeaad1aebc95516e368ee19e4d4970fa7996))
* narrow production sentry source maps ([14987a2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/14987a224703313685632eb71a4b45ac2d251a5e))
* reduce initial media and route payloads ([#911](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/911)) ([f74a41b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f74a41b419f797a5a8170fa78adeebfd8d9d6602))
* reduce shared app and website runtime cost ([#462](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/462)) ([f311471](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f311471139733ba4ca20b1e95aa6d999cd800884))
* share Smashers video asset ([#558](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/558)) ([2c3f6ce](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2c3f6cedb4d50ca445ed95636d5ead88b76eac4b))
* slim Smashers public shell ([cc7c07c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cc7c07c928d365dce2cafa3d4249021057e6bf45))
* **smashers:** code split login route ([#518](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/518)) ([2fb4060](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2fb40605f056568e81181e5b4356ecca9688ca66))
* **smashers:** code split profile route ([#517](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/517)) ([05a5a61](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05a5a6141ee4ba8618047a1a7756032b71414043))
* **smashers:** defer auth providers until route load ([60f34b4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/60f34b45e8ede1c96bf0990b354800cb636f518a))
* **smashers:** defer homepage modal bundles ([#525](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/525)) ([fa9f5da](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fa9f5dad1fde7cfe986caedb10d0128ff305fa36))
* **smashers:** defer PlayFab auth form ([37523b6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37523b67eaa8f32839c3d06238a8f76c719175cb))
* **smashers:** serve animated WebP assets with GIF fallbacks ([#538](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/538)) ([aba288d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aba288dfe3ca7a6f308eb12d52ce1e5a5e11682c))
* **smashers:** server-render static sections and defer media ([#464](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/464)) ([294c08e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/294c08e7750d1005e417f495ec90c797d6f4011e))
* **smashers:** slim deferred marketing sections ([#549](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/549)) ([c12849e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c12849e5fdac3872d59f0e705f422c5d24460e96))
* **smashers:** slim shared back icon graph ([#575](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/575)) ([6de6f59](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6de6f59401e40e27e915472ce2505a65666fd9e6))
* **ui:** scope font preloads by app theme ([#533](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/533)) ([265b2b1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/265b2b123ae0eddeba7faae16b23ff8ad2cc3c33))


### Maintenance

* promote staging Next build optimization to main ([6037f6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6037f6da52e7ce13b18d34a63d796e55a45e967b))
* promote staging to main ([e0bbf03](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e0bbf03b70e80750b523a0da964b27d6a8ea6e8f))
* promote staging to main ([3569fbc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3569fbc6b83bd1aa419a5d61be2d61d79b587c8f))
* promote staging to main ([c183e71](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c183e714e695628c9c9fe9fe65ed2b9b827a35fb))
* promote staging to main ([99c3dc1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/99c3dc1853c41ca147a1ba198e761172b5516260))
* promote staging to main ([9e3cef2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9e3cef2ca40bcb76fe54e9f24d582bd122ce5d4f))
* promote staging to main for GLTF NFTL hotfix ([b66c5f9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b66c5f9af80715e267f7925b3fd5793721bccbc1))
* promote staging to main for release ([887a71b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/887a71b0383d763925a9065cf6af548bb7e11211))
* re-align staging with main ([#544](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/544)) ([22b607b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/22b607b28fa18684ef5da15e3b24bfb6acec5549))
* **smashers:** reuse shared action button ([#603](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/603)) ([ead0f02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ead0f02955b9c57cd7e84bdd91e355ca5a56cfcd))
* sync original staging content to main ([#901](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/901)) ([17415b6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17415b6e4913a4c60c435b33cbfb69eb67d6fd20))
* **ui:** reuse shared retry button ([#602](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/602)) ([048fcb1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/048fcb18d25c6a8f714377cedb402d30b6ce5979))

## [1.0.4](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/smashers-v1.0.3...smashers-v1.0.4) (2026-08-10)


### Maintenance

* promote tested staging tree to main ([5b82877](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5b8287785a21b2892241a67420ab13ca283dfb87))

## [1.0.3](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/smashers-v1.0.2...smashers-v1.0.3) (2026-08-09)


### Bug Fixes

* sync-local-commits-to-staging ([#371](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/371)) ([37d95fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37d95fba2daf7c0972eec715fea7ee32e1ea0c0e))


### Maintenance

* extract shared degens page logic and remove dead console output ([#379](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/379)) ([92ec323](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92ec323cef0b9054015f9e2214407beabb91ebb1))

## [1.0.2](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/smashers-v1.0.1...smashers-v1.0.2) (2026-08-07)


### Maintenance

* drop-mui-support ([#360](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/360)) ([cf09198](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cf0919857ea50424d4dc70f721238aa209abd46b))

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/smashers-v1.0.0...smashers-v1.0.1) (2026-08-02)


### Bug Fixes

* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* harden CI for clean checkouts ([a78ae3d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a78ae3dabd57ca62f78c18a9ed523c029b6822ae))
* restore workspace:* protocol and pin react-unity-webgl to v8.8.0 in apps/app ([0b28131](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0b28131527d2284ea55a9b497f2786fed4984806))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))


### Documentation

* add Vercel env connect/sync instructions to README ([4f34954](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4f34954365497fed42f06e279f33a29fe3e75eba))


### Tests

* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* fix 6 failing tests + run CI with --isolate ([11c1c42](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/11c1c42c1abb1fa6476a0af7a47dc5f3072a923a))
* fix bun:test migration — mock.module timing, spyOn, navigator ([7fcbe33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fcbe33acc75459c88c7219ccb5b4cdb6624635e))
* fix happy-dom double-registration + window access ordering ([a876c94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a876c94185d2f9b41e8566fd798b65235f34e2b7))
* purge @testing-library/jest-dom — all assertions now bun-native ([a20778f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a20778f170c84e29286a7fca678c7534104a746a))
* split and expand coverage ([#335](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/335)) ([238d76b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/238d76b62da7e1e1089e51e5ce7beca2bbd6e04a))
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
* daily code improvements — dead code removal, debug log cleanup, bug fix ([#324](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/324)) ([7e2fa94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7e2fa94de12c9827e040a1c483bce41b95daa03e))
* **deps:** merge auto dependency bump to main + fix 26 test failures ([3650d19](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3650d19462fcd17c941470432786657e482bb72b))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* **deps:** weekly update ([0889db6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0889db6360837a66b3188677e93f762e5b5a9c2d))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))
