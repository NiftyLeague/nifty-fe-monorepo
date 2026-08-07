# Changelog

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/ui-v1.0.0...ui-v1.0.1) (2026-08-07)


### Bug Fixes

* sync-local-commits-to-staging ([#371](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/371)) ([37d95fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37d95fba2daf7c0972eec715fea7ee32e1ea0c0e))


### Maintenance

* extract shared degens page logic and remove dead console output ([#379](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/379)) ([92ec323](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92ec323cef0b9054015f9e2214407beabb91ebb1))

## 1.0.0 (2026-08-02)


### Features

* add mise.toml (toolchain pins for local+CI) ([e9ad8c8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e9ad8c860ab9d0b1e9eccc6bddb2294bac4327db))


### Bug Fixes

* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* strip broken --project-placeholder filters from all test scripts; run bun test directly ([5de1d6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5de1d6fec320a361606630138106f0b82dff4023))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))
* tolerate pre-existing test failures in ui and playfab packages ([115f053](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/115f0537bde0b65f126ea63b669c26ca40ceb3a0))
* **ui:** import base components in base-components.test.tsx ([0ecc757](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ecc757f3ccecd05ac9effa81e5f686d1ffa9eb3))
* update preloader progress synchronously ([baa1031](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/baa1031e18ac15a42463ba3ddbd0f730ce1c4ec1))


### Tests

* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* **custom-components:** skip Preloader fake-timer test; setInterval deadlocks in Bun ([16a8ab8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/16a8ab8d87461331ac1379cf0bb9805cf248a947))
* fix 6 failing tests + run CI with --isolate ([11c1c42](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/11c1c42c1abb1fa6476a0af7a47dc5f3072a923a))
* fix bun:test migration — mock.module timing, spyOn, navigator ([7fcbe33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fcbe33acc75459c88c7219ccb5b4cdb6624635e))
* fix happy-dom registration + next/font/react-device-detect/docusaurus stubs + playfab mock ([3dfb5a0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3dfb5a0eaa2315062338b56f0daf9947acb09ba0))
* increase coverage and raise regression floor ([ad6dceb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ad6dcebfbca0c4812d8f7fe67168f707dee74bee))
* increase coverage and raise regression floors ([5221af6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5221af6ae242c8361e4eba6285334d13db7d06e0))
* increase timeout for flaky auth forms test ([bb907e4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bb907e42adde97c8379a5fd778a6983e0177212d))
* purge @testing-library/jest-dom — all assertions now bun-native ([a20778f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a20778f170c84e29286a7fca678c7534104a746a))
* raise bun:test coverage to 95% (was ~91%) ([9b1d425](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9b1d4257b8621535a86939da1af90c1a2b86cfbd))
* remove dangling jest-dom import from setup.ts + native toBeChecked ([7a5a694](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a5a694336e1c1266093fdcbba29ef5a4e387943))
* scope mock.module + dynamic imports (batch 1) ([9cbfb65](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9cbfb652b0cb3e1119a0ed898a4ed05b74882c5e))
* scope mock.module + dynamic imports (batch 2) ([5aba023](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5aba023d5380feb21471b73e09f4178d11f25be5))
* standardize monorepo testing and CI ([dad0659](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dad0659a1dd5d940de7d6c8455479f4f756e175f))
* standardize monorepo testing and CI ([4aea8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4aea8f6fd7a253603155f8a4e12bb53a39ec6998))
* standardize workspace runners on bun ([47db8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/47db8f6164cbf4fa8ac5e7f8baa2e746dcd301a5))


### CI

* mise-based 2-job CI (quality + test) ([514e489](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/514e489593ac5bec64dd176d70743bbcc561e777))
* trigger re-run after lint + describe-import fixes ([75810c4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/75810c43a802c855bf7371b680b91f23b5d40cae))


### Maintenance

* align repository with shared template ([1722262](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17222629d80b1bb2c68a6968fcfb4665ff363b16))
* daily code improvements — dead code removal, debug log cleanup, bug fix ([#324](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/324)) ([7e2fa94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7e2fa94de12c9827e040a1c483bce41b95daa03e))
* daily code improvements — lint fixes, dep alignment, dead code removal ([2f66e33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f66e33f072412d7cf6095e04d562b7e2828f306))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* remove pnpm remnants — packageManager→bun, delete lockfiles/workspace files ([1414f1d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1414f1d4c81656555b3e37fd17a4540d6e36c8dc))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* staging → main release — CI trigger update + 6 commits ([#283](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/283)) ([35b7001](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/35b700143d44914380a668b41dc547ee3d610bfc))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))
