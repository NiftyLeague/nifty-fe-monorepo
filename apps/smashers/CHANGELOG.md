# Changelog

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
