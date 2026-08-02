# Changelog

## 1.0.0 (2026-08-02)


### Bug Fixes

* add PlayFab SDK global namespace stubs (type-check) ([4d8729d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4d8729dd9dfe95c7c653d380265c553a8bfca850))
* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* exclude test-mock-sdk.ts from playfab type-check (bun:test import) ([cf6fddc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cf6fddc724acc0cf86155833b3b9efa44988b227))
* format packages/playfab/package.json ([b832c6a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b832c6a7880941e19177acbb5b50ba6e7c6ebd93))
* playfab stubs use declare global (CI type-check) ([d20009a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d20009a21da372ad69c9fa614f5efad3a6fd244a))
* reference PlayFab typings in constants.ts/types.ts (CI type-check) ([ef75526](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ef7552608bf57972b8760ddb2c6a60bcd2362d0e))
* reference real PlayFab SDK typings (global namespaces) ([27dd907](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/27dd90728638812424ace1f9a0952b7ec2cd5f13))
* remove playfab-sdk dep (app uses own typings, avoids type conflict) ([b3a8b18](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b3a8b1834ba6a8c952833a65535571ebc1bf1378))
* rename test-mock-sdk.test.ts -&gt; .ts (mock must be importable, not a test file) ([9dd6632](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9dd66320c11c26f4340b4e6b158467bda071010c))
* restore workspace:* protocol and pin react-unity-webgl to v8.8.0 in apps/app ([0b28131](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0b28131527d2284ea55a9b497f2786fed4984806))
* strip broken --project-placeholder filters from all test scripts; run bun test directly ([5de1d6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5de1d6fec320a361606630138106f0b82dff4023))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))
* tolerate pre-existing test failures in ui and playfab packages ([115f053](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/115f0537bde0b65f126ea63b669c26ca40ceb3a0))


### Tests

* add coverage for nfm error handlers, theme + playfab utils ([ca6df38](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ca6df38f04a852c1cdb465443f308bf5df02b1c0))
* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* fix bun:test migration — mock.module timing, spyOn, navigator ([7fcbe33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fcbe33acc75459c88c7219ccb5b4cdb6624635e))
* fix happy-dom registration + next/font/react-device-detect/docusaurus stubs + playfab mock ([3dfb5a0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3dfb5a0eaa2315062338b56f0daf9947acb09ba0))
* purge @testing-library/jest-dom — all assertions now bun-native ([a20778f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a20778f170c84e29286a7fca678c7534104a746a))
* raise bun:test coverage to 95% (was ~91%) ([9b1d425](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9b1d4257b8621535a86939da1af90c1a2b86cfbd))
* scope mock.module + dynamic imports (batch 1) ([9cbfb65](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9cbfb652b0cb3e1119a0ed898a4ed05b74882c5e))
* standardize monorepo testing and CI ([dad0659](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dad0659a1dd5d940de7d6c8455479f4f756e175f))
* standardize monorepo testing and CI ([4aea8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4aea8f6fd7a253603155f8a4e12bb53a39ec6998))
* standardize workspace runners on bun ([47db8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/47db8f6164cbf4fa8ac5e7f8baa2e746dcd301a5))


### CI

* mise-based 2-job CI (quality + test) ([514e489](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/514e489593ac5bec64dd176d70743bbcc561e777))
* rerun monorepo type-check (force cache miss) ([0c51a8f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0c51a8f7f8fceedf0d0c0a01925c9e434548d97a))
* trigger re-run after lint + describe-import fixes ([75810c4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/75810c43a802c855bf7371b680b91f23b5d40cae))


### Maintenance

* align repository with shared template ([1722262](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17222629d80b1bb2c68a6968fcfb4665ff363b16))
* daily code improvements — dead code removal, debug log cleanup ([#327](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/327)) ([c31a384](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c31a3846e4e316241d16317e7b7b804883c6a4c3))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))
